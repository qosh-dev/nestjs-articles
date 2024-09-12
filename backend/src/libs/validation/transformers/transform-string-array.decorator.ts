import { Transform } from "class-transformer";

export function TransformStringArray() {
  return Transform(({ value }) => {
    let values = [];
    if (typeof value === 'string') {
      values.push(value);
    } else if (Array.isArray(value)) {
      values.push(...value);
    }
    return values;
  });
}
