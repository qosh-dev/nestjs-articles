import {
  ArgumentMetadata,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommonError } from 'src/libs/common/common.error';

export class IsHasAnyFieldsPipe<Model =any> implements PipeTransform {
  constructor(readonly oneOfRequiredFields: (keyof Model)[] = null) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const fields = new Set(
      Object.values<string>(value).filter((f) => Boolean(f)),
    );

    if (this.oneOfRequiredFields?.length) {
      const hasField = this.oneOfRequiredFields.some((field) =>
        fields.has(field as string),
      );

      if (!hasField) {
        throw new UnprocessableEntityException(
          CommonError.SET_AT_LEAST_ONE_KNOWN_FIELD,
        );
      }
    } else if (!fields.size) {
      throw new UnprocessableEntityException(
        CommonError.SET_AT_LEAST_ONE_KNOWN_FIELD,
      );
    }

    return value;
  }
}
