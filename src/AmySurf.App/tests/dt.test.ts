import {
  formatPPP,
  formatEEEEd,
  formatToIsoLocalTime,
  formatToPattern,
  addMinutes,
  addHours,
  isDateEqual,
  isToday,
  isTomorrow,
  isSameDay,
  isSameMinute,
  isSameHour,
  isSameMonth,
  isSameYear,
  roundToNearestMinutes,
  differenceInMinutes,
  getSpotDateTime,
  getUtcNow,
  formatTimeLong,
  getDateSpotNow,
  getDateMidnight,
  getStartForecastISOString,
  getEndForecastISOString,
  delay,
  getMsBeforeRoundHour,
} from "../helpers/dt";

describe("dt.ts functions", () => {
  test("formatPPP should format date correctly", () => {
    const date = new Date(1453, 3, 29); // April 29th, 1453
    expect(formatPPP(date)).toBe("April 29th, 1453");
  });

  test("formatEEEEd should format date correctly", () => {
    const date = new Date(2023, 3, 29);
    expect(formatEEEEd(date)).toBe("Saturday 29");
  });

  test("formatToIsoLocalTime should format date to ISO local time", () => {
    const date = new Date(2023, 3, 29, 10, 20, 30);
    expect(formatToIsoLocalTime(date)).toBe("2023-04-29T10:20:30");
  });

  test("formatToPattern should format date to given pattern", () => {
    const date = new Date(2023, 3, 29);
    expect(formatToPattern(date, "yyyy-MM-dd")).toBe("2023-04-29");
  });

  test("addMinutes should add minutes correctly", () => {
    const date = new Date(2023, 3, 29, 10, 0);
    const newDate = addMinutes(date, 30);
    expect(newDate.getMinutes()).toBe(30);
  });

  test("addHours should add hours correctly", () => {
    const date = new Date(2023, 3, 29, 10, 0);
    const newDate = addHours(date, 2);
    expect(newDate.getHours()).toBe(12);
  });

  test("isDateEqual should return true for equal dates", () => {
    const date1 = new Date(2023, 3, 29);
    const date2 = new Date(2023, 3, 29);
    expect(isDateEqual(date1, date2)).toBe(true);
  });

  test("isToday should return true for today's date", () => {
    const date = new Date();
    expect(isToday(date)).toBe(true);
  });

  test("isTomorrow should return true for tomorrow's date", () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    expect(isTomorrow(date)).toBe(true);
  });

  test("isSameDay should return true for same day", () => {
    const date1 = new Date(2023, 3, 29);
    const date2 = new Date(2023, 3, 29);
    expect(isSameDay(date1, date2)).toBe(true);
  });

  test("isSameMinute should return true for same minute", () => {
    const date1 = new Date(2023, 3, 29, 10, 0);
    const date2 = new Date(2023, 3, 29, 10, 0);
    expect(isSameMinute(date1, date2)).toBe(true);
  });

  test("isSameHour should return true for same hour", () => {
    const date1 = new Date(2023, 3, 29, 10, 0);
    const date2 = new Date(2023, 3, 29, 10, 30);
    expect(isSameHour(date1, date2)).toBe(true);
  });

  test("isSameMonth should return true for same month", () => {
    const date1 = new Date(2023, 3, 29);
    const date2 = new Date(2023, 3, 1);
    expect(isSameMonth(date1, date2)).toBe(true);
  });

  test("isSameYear should return true for same year", () => {
    const date1 = new Date(2023, 3, 29);
    const date2 = new Date(2023, 0, 1);
    expect(isSameYear(date1, date2)).toBe(true);
  });

  test("roundToNearestMinutes should round to nearest minutes", () => {
    const date = new Date(2023, 3, 29, 10, 5);
    const roundedDate = roundToNearestMinutes(date, 10);
    expect(roundedDate.getMinutes()).toBe(10);
  });

  test("differenceInMinutes should return difference in minutes", () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 30);
    expect(differenceInMinutes(date)).toBe(30);
  });

  test("getSpotDateTime should return correct spot date time", () => {
    const utcDate = new Date(Date.UTC(2023, 3, 29, 10, 0, 0));
    const spotDate = getSpotDateTime(utcDate, 2);
    expect(spotDate.getHours()).toBe(12);
  });

  test("getUtcNow should return current UTC date", () => {
    const nowUtc = getUtcNow();
    expect(nowUtc.getUTCFullYear()).toBe(new Date().getUTCFullYear());
  });

  test("formatTimeLong should format time correctly", () => {
    const date = new Date(2023, 3, 29, 10, 0);
    expect(formatTimeLong(date)).toBe("10:00 AM");
  });

  test("getDateSpotNow should return correct spot date", () => {
    const dateSpotNow = getDateSpotNow(2);
    expect(dateSpotNow.getHours()).toBe(new Date().getUTCHours() + 2);
  });

  test("getDateMidnight should return midnight date", () => {
    const date = new Date(2023, 3, 29, 10, 0);
    const midnightDate = getDateMidnight(date);
    expect(midnightDate.getHours()).toBe(0);
    expect(midnightDate.getMinutes()).toBe(0);
  });

  test("getStartForecastISOString should return correct start forecast ISO string", () => {
    const startForecastISOString = getStartForecastISOString();

    const timezoneOffsetMinutes = new Date().getTimezoneOffset();
    const nowUtc = new Date(Date.now() + timezoneOffsetMinutes * 60 * 1000);
    const expectedDate = new Date(
      nowUtc.getFullYear(),
      nowUtc.getMonth(),
      nowUtc.getDate()
    );
    expectedDate.setDate(expectedDate.getDate() - 2);

    expect(startForecastISOString).toBe(expectedDate.toISOString());
  });

  test("getEndForecastISOString should return correct end forecast ISO string", () => {
    const endForecastISOString = getEndForecastISOString();

    const timezoneOffsetMinutes = new Date().getTimezoneOffset();
    const nowUtc = new Date(Date.now() + timezoneOffsetMinutes * 60 * 1000);
    const expectedDate = new Date(
      nowUtc.getFullYear(),
      nowUtc.getMonth(),
      nowUtc.getDate()
    );
    expectedDate.setDate(expectedDate.getDate() + 7);

    expect(endForecastISOString).toBe(expectedDate.toISOString());
  });

  test("delay should delay execution", async () => {
    const start = Date.now();
    await delay(100);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(100);
  });

  test("getMsBeforeRoundHour should return milliseconds before round hour", () => {
    const msBeforeRoundHour = getMsBeforeRoundHour();
    const minutes = new Date().getMinutes();
    expect(msBeforeRoundHour).toBe((60 - minutes) * 60000);
  });
});
