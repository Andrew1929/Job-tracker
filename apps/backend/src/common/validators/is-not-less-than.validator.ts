import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNotLessThanProperty', async: false })
class IsNotLessThanPropertyConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const [otherProperty] = args.constraints as [string];
    const other = (args.object as Record<string, unknown>)[otherProperty];

    // A partial update may carry only one bound, and either side may be
    // optional; the pair is only comparable when both numbers are present.
    if (typeof value !== 'number' || typeof other !== 'number') {
      return true;
    }

    return value >= other;
  }

  defaultMessage(args: ValidationArguments): string {
    const [otherProperty] = args.constraints as [string];
    return `${args.property} must not be less than ${otherProperty}`;
  }
}

/** Guards an upper bound against the lower bound sent in the same payload. */
export function IsNotLessThanProperty(
  property: string,
  options?: ValidationOptions,
) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [property],
      validator: IsNotLessThanPropertyConstraint,
    });
  };
}
