import {
  add,
  addMinutes as addMinutes_,
  compareAsc,
  differenceInMinutes as differenceInMinutes_,
  format,
  getDayOfYear,
  isSameDay as isSameDay_,
  isSameHour as isSameHour_,
  isSameMinute as isSameMinute_,
  isSameMonth as isSameMonth_,
  isSameYear as isSameYear_,
  isToday as isToday_,
  isTomorrow as isTomorrow_,
  Locale,
  roundToNearestMinutes as roundToNearestMinutes_,
} from "date-fns";

import { enUS, fr, id, ru } from "date-fns/locale";

// Fix bug with date-fns and parcel
// @ts-ignore: Unused variables
// const FORCE_BUNDLE = [formatters, longFormatters];

export { getDayOfYear };

// April 29th, 1453
export function formatPPP(dateTime: Date): string {
  return format(dateTime, "PPP");
}

// Monday, Tuesday, ..., Sunday 1, 2, ..., 31
export function formatEEEEd(dateTime: Date): string {
  return format(dateTime, "EEEE d");
}

export function formatToIsoLocalTime(dateTime: Date): string {
  return format(dateTime, "yyyy-MM-dd'T'HH:mm:ss");
}

export function formatToPattern(
  dateTime: Date,
  pattern: string,
  language?: string
): string {
  return format(dateTime, pattern, { locale: getLocale(language) });
}

export function addMinutes(date: Date, minutes: number): Date {
  return addMinutes_(date, minutes);
}
export function addHours(date: Date, hours: number): Date {
  return add(date, { hours: hours });
}

export function isDateEqual(left: Date, right: Date): boolean {
  return compareAsc(left, right) == 0;
}

export function isToday(date: Date | number): boolean {
  return isToday_(date);
}

export function isTomorrow(date: Date | number): boolean {
  return isTomorrow_(date);
}

export function isSameDay(date: Date, date2: Date): boolean {
  return isSameDay_(date, date2);
}

export function isSameMinute(date: Date, date2: Date): boolean {
  return isSameMinute_(date, date2);
}

export function isSameHour(date: Date, date2: Date): boolean {
  return isSameHour_(date, date2);
}

export function isSameMonth(date: Date, date2: Date): boolean {
  return isSameMonth_(date, date2);
}

export function isSameYear(date: Date, date2: Date): boolean {
  return isSameYear_(date, date2);
}

export function roundToNearestMinutes(
  date: Date,
  nearestMinutes: number
): Date {
  return roundToNearestMinutes_(date, { nearestTo: nearestMinutes });
}

export function differenceInMinutes(date: Date): number {
  return differenceInMinutes_(new Date(), date);
}

export function getSpotDateTime(utcDate: Date, offsetHours: number): Date {
  const spotDate = addHours(
    addMinutes_(utcDate, utcDate.getTimezoneOffset()),
    offsetHours
  );
  return spotDate;
}

export function getUtcNow(): Date {
  const timezoneOffsetMinutes = new Date().getTimezoneOffset();
  const nowUtc = new Date(Date.now() + timezoneOffsetMinutes * 60 * 1000);
  return nowUtc;
}

export function formatTimeLong(dateTime: Date, language?: string): string {
  return format(dateTime, "p", { locale: getLocale(language) });
}

function getLocale(language?: string): Locale {
  switch (language) {
    case "fr":
      return fr;
    case "en":
      return enUS;
    case "id":
      return id;
    case "ru":
      return ru;
    default:
      return enUS;
  }
}

export function getDateSpotNow(utcOffset: number) {
  const dateUtc = getUtcNow();
  const datespot = addHours(dateUtc, utcOffset);
  return datespot;
}

export function getDateMidnight(date: Date): Date {
  const midnight = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  return midnight;
}

export function getStartForecastISOString(): string {
  const date = getDateMidnight(getUtcNow());
  date.setDate(date.getDate() - 2);
  return date.toISOString();
}

export function getEndForecastISOString(): string {
  const date = getDateMidnight(getUtcNow());
  date.setDate(date.getDate() + 7);
  return date.toISOString();
}

export function delay(delay: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
export function getMsBeforeRoundHour(): number {
  return (60 - new Date().getMinutes()) * 60000;
}
