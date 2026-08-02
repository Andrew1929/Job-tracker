import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { App } from 'supertest/types';
import {
  NotificationPriority,
  NotificationType,
} from '../generated/prisma/client';
import { AppConfigModule } from './../src/config/config.module';
import { AuthModule } from './../src/modules/auth/auth.module';
import { NotificationPreferencesController } from './../src/modules/notification/controllers/notification-preferences.controller';
import { NotificationsController } from './../src/modules/notification/controllers/notifications.controller';
import { NotificationPreferencesService } from './../src/modules/notification/services/notification-preferences.service';
import { NotificationScheduler } from './../src/modules/notification/services/notification-scheduler';
import { NotificationsService } from './../src/modules/notification/services/notifications.service';
import { PrismaModule } from './../src/modules/prisma/prisma.module';
import { PrismaService } from './../src/modules/prisma/prisma.service';
import { RedisModule } from './../src/modules/redis/redis.module';
import { UsersModule } from './../src/modules/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './../src/modules/auth/guards/jwt-auth.guard';

interface AuthRegisterResponse {
  user: { id: string };
  accessToken: string;
}

interface NotificationListItem {
  id: string;
}

interface PaginatedNotificationsResponse {
  items: NotificationListItem[];
  meta: { total: number };
}

interface UnreadCountResponse {
  count: number;
}

interface NotificationPreferencesResponse {
  inAppEnabled: boolean;
  interviewRemindersEnabled: boolean;
  timezone: string;
  nextActionReminderLeadMinutes: number;
}

interface SeededUser {
  id: string;
  token: string;
  unreadNotificationId: string;
}

/**
 * API authorization/persistence e2e without BullMQ.
 *
 * BullMQ requires Redis >= 5; the local Redis used by this environment may be
 * older. Queue/worker behavior is covered by unit tests; this suite covers the
 * authenticated HTTP surface only.
 */
describe('Notifications (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const suffix = Date.now();
  let userA: SeededUser;
  let userB: SeededUser;

  const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

  const mockScheduler = {
    resyncUserReminders: jest.fn().mockResolvedValue(undefined),
  };

  async function registerUser(
    label: string,
  ): Promise<{ id: string; token: string }> {
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: `notif-${label}-${suffix}@example.com`,
        password: 'password123',
        name: `Notif ${label}`,
      })
      .expect(201);

    const body = response.body as AuthRegisterResponse;
    return { id: body.user.id, token: body.accessToken };
  }

  async function seedNotification(
    userId: string,
    overrides: Partial<{ title: string; read: boolean }> = {},
  ): Promise<string> {
    const created = await prisma.notification.create({
      data: {
        userId,
        type: NotificationType.SYSTEM,
        priority: NotificationPriority.NORMAL,
        title: overrides.title ?? 'Seeded notification',
        message: 'Body',
        read: overrides.read ?? false,
      },
      select: { id: true },
    });
    return created.id;
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppConfigModule,
        PrismaModule,
        RedisModule,
        UsersModule,
        AuthModule,
      ],
      controllers: [NotificationsController, NotificationPreferencesController],
      providers: [
        NotificationsService,
        NotificationPreferencesService,
        {
          provide: NotificationScheduler,
          useValue: mockScheduler,
        },
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.setGlobalPrefix('api');
    await app.init();

    prisma = app.get(PrismaService);

    const [a, b] = await Promise.all([registerUser('a'), registerUser('b')]);

    const unreadId = await seedNotification(a.id, { read: false });
    await seedNotification(a.id, { read: true, title: 'Already read' });
    await seedNotification(b.id, { read: false });

    userA = { ...a, unreadNotificationId: unreadId };
    userB = { ...b, unreadNotificationId: '' };
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { id: { in: [userA.id, userB.id] } },
    });
    await app.close();
  });

  it('rejects unauthenticated access', async () => {
    await request(app.getHttpServer()).get('/api/notifications').expect(401);
  });

  it('returns only the authenticated user notifications', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/notifications')
      .set(auth(userA.token))
      .expect(200);

    const body = response.body as PaginatedNotificationsResponse;
    expect(body.meta.total).toBe(2);
    const owners = new Set(body.items.map((item) => item.id));
    expect(owners.size).toBe(2);
    expect(body.items[0]).not.toHaveProperty('dedupeKey');
  });

  it('reports an efficient unread count', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/notifications/unread-count')
      .set(auth(userA.token))
      .expect(200);

    expect((response.body as UnreadCountResponse).count).toBe(1);
  });

  it('marks a single notification as read idempotently', async () => {
    await request(app.getHttpServer())
      .patch(`/api/notifications/${userA.unreadNotificationId}/read`)
      .set(auth(userA.token))
      .expect(204);

    await request(app.getHttpServer())
      .patch(`/api/notifications/${userA.unreadNotificationId}/read`)
      .set(auth(userA.token))
      .expect(204);

    const response = await request(app.getHttpServer())
      .get('/api/notifications/unread-count')
      .set(auth(userA.token))
      .expect(200);
    expect((response.body as UnreadCountResponse).count).toBe(0);
  });

  it('does not allow deleting another user notification', async () => {
    const otherId = await seedNotification(userB.id);

    await request(app.getHttpServer())
      .delete(`/api/notifications/${otherId}`)
      .set(auth(userA.token))
      .expect(404);
  });

  it('marks all notifications as read', async () => {
    await seedNotification(userA.id, { read: false });

    await request(app.getHttpServer())
      .post('/api/notifications/read-all')
      .set(auth(userA.token))
      .expect(204);

    const response = await request(app.getHttpServer())
      .get('/api/notifications/unread-count')
      .set(auth(userA.token))
      .expect(200);
    expect((response.body as UnreadCountResponse).count).toBe(0);
  });

  it('lazily returns default preferences', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/notification-preferences')
      .set(auth(userA.token))
      .expect(200);

    expect(response.body as NotificationPreferencesResponse).toMatchObject({
      inAppEnabled: true,
      timezone: 'UTC',
      nextActionReminderLeadMinutes: 1440,
    });
  });

  it('updates preferences and validates the timezone', async () => {
    const response = await request(app.getHttpServer())
      .patch('/api/notification-preferences')
      .set(auth(userA.token))
      .send({ interviewRemindersEnabled: false, timezone: 'Europe/Warsaw' })
      .expect(200);

    const body = response.body as NotificationPreferencesResponse;
    expect(body.interviewRemindersEnabled).toBe(false);
    expect(body.timezone).toBe('Europe/Warsaw');

    await request(app.getHttpServer())
      .patch('/api/notification-preferences')
      .set(auth(userA.token))
      .send({ timezone: 'Mars/Phobos' })
      .expect(400);
  });
});
