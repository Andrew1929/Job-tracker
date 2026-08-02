import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { UpdateNotificationPreferencesDto } from './update-notification-preferences.dto';

function validate(payload: Record<string, unknown>): string[] {
  const instance = plainToInstance(UpdateNotificationPreferencesDto, payload, {
    enableImplicitConversion: true,
  });
  return validateSync(instance).map((error) => error.property);
}

describe('UpdateNotificationPreferencesDto', () => {
  it('accepts a valid partial update', () => {
    expect(
      validate({
        interviewRemindersEnabled: false,
        timezone: 'Europe/Warsaw',
        nextActionReminderLeadMinutes: 1440,
        interviewReminderLeadMinutes: [1440, 120],
      }),
    ).toEqual([]);
  });

  it('rejects an invalid timezone', () => {
    expect(validate({ timezone: 'Mars/Phobos' })).toContain('timezone');
  });

  it('rejects a negative lead offset', () => {
    expect(validate({ nextActionReminderLeadMinutes: -1 })).toContain(
      'nextActionReminderLeadMinutes',
    );
  });

  it('rejects a stale threshold below one day', () => {
    expect(validate({ staleApplicationThresholdDays: 0 })).toContain(
      'staleApplicationThresholdDays',
    );
  });

  it('rejects non-integer interview lead entries', () => {
    expect(validate({ interviewReminderLeadMinutes: [1440, 12.5] })).toContain(
      'interviewReminderLeadMinutes',
    );
  });
});
