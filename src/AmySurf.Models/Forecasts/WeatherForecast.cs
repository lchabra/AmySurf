namespace AmySurf.Models;

public sealed class WeatherForecast
{
    public WeatherForecast(List<HourlyWeather> hourlyForecasts, string spotId)
    {
        SpotId = spotId;
        HourlyForecasts = hourlyForecasts;
    }
    public static WeatherForecast Empty { get; } = new WeatherForecast(new List<HourlyWeather>(), string.Empty);
    public List<HourlyWeather> HourlyForecasts { get; set; }
    public string SpotId { get; set; }
}

public sealed class GetWeatherForecastResponse
{
    public GetWeatherForecastResponse(WeatherForecast forecast, DateTime timestamp)
    {
        Forecast = forecast;
        Timestamp = timestamp;
    }

    public DateTime Timestamp { get; set; }
    public WeatherForecast Forecast { get; set; }
}

public sealed class HourlyWeather
{
    public HourlyWeather() { }

    public HourlyWeather(DateTime dateTime, int id, double rainMm, double temperature, int cloudCoverage, WeatherDescription description)
    {
        DateTime = dateTime;
        WeatherDescriptionId = id;
        RainMm = rainMm;
        CloudCoverage = cloudCoverage;
        Description = description;
        Temperature = temperature;
    }
    public static HourlyWeather Empty { get; } = new HourlyWeather(DateTime.UnixEpoch, -1, -1, double.NaN, -1, WeatherDescription.Unknown);

    /// <summary>
    /// TODO: would it be better to have `Hour` instead? And the hour would
    /// be expressed in local time.
    /// </summary>
    public DateTime DateTime { get; set; }

    /// <summary>
    /// TODO: explain this id.
    /// </summary>
    public int WeatherDescriptionId { get; set; }

    /// <summary>
    /// Millimeters.
    /// TODO: remove 'Mn' suffix
    /// </summary>
    public double RainMm { get; set; }
    
    /// <summary>
    /// Celsius?
    /// </summary>
    public double Temperature { get; set; }

    /// <summary>
    /// TODO: document
    /// </summary>
    /// <value></value>
    public int CloudCoverage { get; set; }
    public WeatherDescription Description { get; set; }
}

//ImageSource? source = ImageSource.FromResource($"AmySurf.Assets.Images.WeatherIcons.{weatherDescription}.png", typeof(HourlyVM).GetTypeInfo().Assembly);
public enum WeatherDescription
{
    Unknown,
    BrokenClouds,
    ClearSky,
    FewClouds,
    Mist,
    Rain,
    ScatteredClouds,
    ShowerRain,
    Snow,
    ThunderStorm
}
