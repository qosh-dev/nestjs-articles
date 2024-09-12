import { Injectable } from '@nestjs/common';
import {
  Validate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
class IsNotEmptyArrayValidator implements ValidatorConstraintInterface {
  validate(value: string[], args: ValidationArguments): boolean {
    return Array.isArray(value) && value.length >= 1
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be at least one item`;
  }
}

export const IsNotEmptyArray = (validationOptions?: ValidationOptions) =>
  Validate(IsNotEmptyArrayValidator, validationOptions);
