export function isEqualStringArray(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const set1 = new Set(arr1);
  return arr2.every((uuid) => set1.has(uuid));
}
