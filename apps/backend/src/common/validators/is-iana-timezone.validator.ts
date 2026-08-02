import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidTimeZone } from '../utils/timezone.util';

@ValidatorConstraint({ name: 'isIanaTimeZone', async: false })
class IsIanaTimeZoneConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && isValidTimeZone(value);
  }

  defaultMessage(): string {
    return 'timezone must be a valid IANA timezone identifier';
  }
}

/** Rejects timezone values the runtime cannot resolve, never trusting the client. */
export function IsIanaTimeZone(options?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [],
      validator: IsIanaTimeZoneConstraint,
    });
  };
}
