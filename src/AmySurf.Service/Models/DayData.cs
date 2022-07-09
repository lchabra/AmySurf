namespace AmySurf.Models;

/// <summary>
/// Contain Data about the day like sunset time, moon percent, daylight time ...
/// </summary>
public sealed class DayData
{
    public DayData() { }
    public DayData(DateTime sunriseTime, DateTime sunsetTime)
    {
        SunriseTime = sunriseTime;
        SunsetTime = sunsetTime;
    }

    /// <summary>
    /// Local time
    /// </summary>
    public DateTime SunriseTime { get; set; }

    /// <summary>
    /// Local time
    /// </summary>
    public DateTime SunsetTime { get; set; }
}
