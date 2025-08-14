export function isStringAnInteger(str: string): boolean {
  const parsedValue = parseInt(str, 10);
  return Number.isInteger(parsedValue) && String(parsedValue) === str;
}