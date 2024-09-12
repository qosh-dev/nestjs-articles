import { Injectable } from '@nestjs/common';
import {
  Validate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { validate as isValidUUID } from 'uuid';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUuidArrayValidator implements ValidatorConstraintInterface {
  validate(value: string[], args: ValidationArguments): boolean {
    return Array.isArray(value) && value.every((v) => isValidUUID(v));
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be an array of UUIDs`;
  }
}

export const IsUuidArray = (validationOptions?: ValidationOptions) =>
  Validate(IsUuidArrayValidator, validationOptions);
