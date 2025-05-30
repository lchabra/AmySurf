﻿namespace AmySurf.Helpers;

internal static class DateTimeHelper
{
    public static DateTime EpochDateTime { get; } = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);

    public static DateTime GetUniversalDateTimeFromUnixTimeSeconds(long timestamp) => EpochDateTime.AddTicks(TimeSpan.FromSeconds(timestamp).Ticks);

    public static DateTime GetGenericRequestStartTime(int utcOffset) =>
        (DateTime.UtcNow + TimeSpan.FromHours(utcOffset)).Date - TimeSpan.FromHours(utcOffset) + TimeSpan.FromHours(6);

    public static DateTime GetGenericRequestEndTime(DateTime startTime) => startTime + TimeSpan.FromHours(60);

    public static int DateTimeToUniversalTimestamp(this DateTime input) => (int)input.Subtract(new DateTime(1970, 1, 1)).TotalSeconds;

    public static long TimestampUTCNow => Convert.ToInt64(DateTime.UtcNow.Subtract(EpochDateTime).TotalSeconds);

    public static List<DateTime> GetAllHourlyBetweenDates(DateTime startDateTime, DateTime endDateTime)
    {
        List<DateTime> result = new List<DateTime>();
        for (DateTime date = startDateTime; date <= endDateTime; date = date.AddHours(1))
            result.Add(date);
        return result;
    }

    public static List<DateTime> GetAllDaysBetweenDates(DateTime startDateTime, DateTime endDateTime)
    {
        List<DateTime> result = new List<DateTime>();
        for (DateTime date = startDateTime; date <= endDateTime; date = date.AddDays(1))
            result.Add(date);
        return result;
    }

    public static bool IsSequencesDateTimeEquals(DateTime seqOneStart, DateTime seqOneEnd, DateTime seqTwoStart, DateTime seqTwoEnd)
       => GetAllHourlyBetweenDates(seqOneStart, seqOneEnd).SequenceEqual(GetAllHourlyBetweenDates(seqTwoStart, seqTwoEnd));
}
