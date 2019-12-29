import { DateTime } from 'luxon';

export type TimestampInput = number | string | DateTime;

export function toTimestamp(dateTime: TimestampInput): number {
  switch (typeof dateTime) {
    case 'number':
      return dateTime;

    case 'string':
      return DateTime.fromISO(dateTime).toSeconds();

    default:
      return dateTime.toSeconds();
  }
}

export function isInRange(start: TimestampInput, end: TimestampInput, value: TimestampInput): boolean {
  const startTimestamp = toTimestamp(start);
  const endTimestamp = toTimestamp(end);
  const valueTimestamp = toTimestamp(value);

  return startTimestamp <= valueTimestamp && valueTimestamp < endTimestamp;
}
