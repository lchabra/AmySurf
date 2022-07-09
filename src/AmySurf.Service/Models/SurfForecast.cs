using AmySurf.Helpers;

namespace AmySurf.Models;

public sealed class SurfForecast
{
    public SurfForecast(string spotId, List<HourlySurf> hourlyForecasts, List<DateTime> sunriseTimes, List<DateTime> sunsetTimes)
    {
        SpotId = spotId;
        HourlyForecasts = hourlyForecasts;
        SunriseTimes = sunriseTimes;
        SunsetTimes = sunsetTimes;
    }
    public static SurfForecast Empty { get; } = new SurfForecast(string.Empty, new List<HourlySurf>(), new List<DateTime>(), new List<DateTime>());
    public string SpotId { get; set; }
    public List<HourlySurf> HourlyForecasts { get; set; }
    public List<DateTime> SunriseTimes { get; set; }
    public List<DateTime> SunsetTimes { get; set; }
}

public sealed class GetSurfForecastResponse
{
    public GetSurfForecastResponse(SurfForecast forecast, DateTime timestamp)
    {
        Forecast = forecast;
        Timestamp = timestamp;
    }

    public DateTime Timestamp { get; set; }
    public SurfForecast Forecast { get; set; }
}

public sealed class HourlySurf
{
    public HourlySurf()
    { }

    public static HourlySurf Empty { get; } = new HourlySurf()
    {
        DateTime = DateTimeHelper.EpochDateTime,
        WavesSizeMin = -1,
        WavesSizeMax = -1,
        PrimarySwellPeriod = -1,
        PrimarySwellDirection = -1,
        SecondarySwellPeriod = -1,
        SecondarySwellDirection = -1,
        WindDirection = -1,
        WindSpeed = -1,
        TideHeight = -1,
        TideHeightPercent = -1,
        TideType = TideType.NORMAL,
    };

    public DateTime DateTime { get; set; }
    public double WavesSizeMin { get; set; }
    public double WavesSizeMax { get; set; }
    public int PrimarySwellPeriod { get; set; }
    public int PrimarySwellDirection { get; set; }
    public int SecondarySwellPeriod { get; set; }
    public int SecondarySwellDirection { get; set; }
    //public int SwellEnergy { get; set; }
    public double WindDirection { get; set; }
    public double WindSpeed { get; set; }
    public double TideHeight { get; set; }
    public double TideHeightPercent { get; set; }
    public TideType TideType { get; set; }
}

public enum TideType
{
    LOW,
    NORMAL,
    HIGH,
}
