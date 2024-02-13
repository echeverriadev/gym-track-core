import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsArrayOfSize(
  size: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isArrayOfSize',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [size],
      options: validationOptions,
      validator: {
        validate(value: any[], args: ValidationArguments) {
          return value && value.length === args.constraints[0];
        },
        defaultMessage(args: ValidationArguments) {
          return `Array at property ${args.property} must contain exactly ${args.constraints[0]} elements`;
        },
      },
    });
  };
}
