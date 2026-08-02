import { PrismaService } from '../../prisma/prisma.service';
import { NotificationPreferencesService } from './notification-preferences.service';
import { NotificationSchedulerService } from './notification-scheduler.service';

const USER_ID = 'user-1';

describe('NotificationPreferencesService', () => {
  let service: NotificationPreferencesService;
  let upsert: jest.Mock;
  let findUnique: jest.Mock;
  let resyncUserReminders: jest.Mock;

  beforeEach(() => {
    upsert = jest.fn().mockResolvedValue({ userId: USER_ID });
    findUnique = jest.fn().mockResolvedValue({
      interviewReminderLeadMinutes: [1440, 120],
    });
    resyncUserReminders = jest.fn().mockResolvedValue(undefined);

    service = new NotificationPreferencesService(
      {
        notificationPreferences: { upsert, findUnique },
      } as unknown as PrismaService,
      { resyncUserReminders } as unknown as NotificationSchedulerService,
    );
  });

  it('lazily materializes preferences with schema defaults on first read', async () => {
    await service.getOrCreate(USER_ID);

    expect(upsert).toHaveBeenCalledWith({
      where: { userId: USER_ID },
      create: { userId: USER_ID },
      update: {},
    });
  });

  it('upserts the provided fields on update', async () => {
    await service.update(USER_ID, { inAppEnabled: false });

    expect(upsert).toHaveBeenCalledWith({
      where: { userId: USER_ID },
      create: { userId: USER_ID, inAppEnabled: false },
      update: { inAppEnabled: false },
    });
    expect(resyncUserReminders).not.toHaveBeenCalled();
  });

  it('reschedules open reminders when a scheduling preference changes', async () => {
    await service.update(USER_ID, { interviewReminderLeadMinutes: [720] });

    expect(resyncUserReminders).toHaveBeenCalledWith(USER_ID, [1440, 120]);
  });
});
