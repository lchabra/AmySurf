using AmySurf.Models;
using AmySurf.Models.Helpers;
using AmySurf.Providers;

namespace AmySurf.Providers.External;

internal static class OpenWeatherMapAdapter
{
    public static GetWeatherForecastResponse NormalizeForecast(
        string spotId,
        OpenWeatherMapForecastPastRaw? yerstedayForecastRaw,
        OpenWeatherMapForecastPastRaw? todayForecastRaw,
        OpenWeatherMapForecastFutureRaw? futureForecastRaw)
    {
        ConvertToAppMesurementUnits(yerstedayForecastRaw, todayForecastRaw, futureForecastRaw);

        List<HourlyWeather> hourlyForecastRaw = GetHourlyWeather(yerstedayForecastRaw, todayForecastRaw, futureForecastRaw);

        List<HourlyWeather> fullHourlyForecast = GetCompleteHourlyWeather(hourlyForecastRaw);

        //var utcOffset = futureForecastRaw.City.Timezone / 3600;
        WeatherForecast? weatherForecast = new WeatherForecast(fullHourlyForecast, spotId);
        return new GetWeatherForecastResponse(weatherForecast, DateTime.UtcNow);
    }

    private static List<HourlyWeather> GetHourlyWeather(
        OpenWeatherMapForecastPastRaw? yerstedayForecastRaw,
        OpenWeatherMapForecastPastRaw? todayForecastRaw,
        OpenWeatherMapForecastFutureRaw? futureForecastRaw)
    {
        List<HourlyWeather> hourlyForecastRaw = new List<HourlyWeather>();
        if (!(yerstedayForecastRaw is null))
        {
            List<HourlyWeather>? past = GetHourlyForecasts(yerstedayForecastRaw);
            hourlyForecastRaw.AddRange(past);
        }

        if (!(todayForecastRaw is null))
        {
            List<HourlyWeather> now = GetHourlyForecasts(todayForecastRaw);
            hourlyForecastRaw.AddRange(now);
        }

        if (!(futureForecastRaw is null))
        {
            List<HourlyWeather> future = GetHourlyForecasts(futureForecastRaw);
            hourlyForecastRaw.AddRange(future);
        }

        if (hourlyForecastRaw.Count == 0)
        {
            throw new InvalidOperationException("Raw Forecast missing");
        }

        return hourlyForecastRaw;
    }

    private static void ConvertToAppMesurementUnits(
        OpenWeatherMapForecastPastRaw? yerstedayForecastRaw,
        OpenWeatherMapForecastPastRaw? todayForecastRaw,
        OpenWeatherMapForecastFutureRaw? futureForecastRaw)
    {
        if (!(yerstedayForecastRaw is null))
        {
            yerstedayForecastRaw.Current.Temp += SystemUnitHelper.ZeroKelvinInC;
            foreach (PastForecastRaw? f in yerstedayForecastRaw.Hourly)
            {
                f.Temp += SystemUnitHelper.ZeroKelvinInC;
            }
        }

        if (!(todayForecastRaw is null))
        {
            foreach (PastForecastRaw? f in todayForecastRaw.Hourly)
            {
                f.Temp += SystemUnitHelper.ZeroKelvinInC;
            }

            todayForecastRaw.Current.Temp += SystemUnitHelper.ZeroKelvinInC;
        }

        if (!(futureForecastRaw is null))
        {
            foreach (OpenWeatherForecast? f in futureForecastRaw.List)
            {
                f.Main.Temp += SystemUnitHelper.ZeroKelvinInC;
            }
        }
    }

    private static List<HourlyWeather> GetHourlyForecasts(OpenWeatherMapForecastFutureRaw futuresForecastsRaw)
    {
        if (futuresForecastsRaw.List is null)
        {
            return new List<HourlyWeather>();
        }
        //f.weather[0].description
        return futuresForecastsRaw.List.ConvertAll(f => new HourlyWeather(
                                    DateTimeHelper.GetDateTimeUTCFromUnixTimeSeconds(f.Dt),
                                    f.Weather[0].Id,
                                    f.Rain?.RainMm ?? 0,
                                    f.Main.Temp,
                                    f.Clouds.All,
                                    GetWeatherDescription(f.Weather[0].Id)));
    }

    private static List<HourlyWeather> GetHourlyForecasts(OpenWeatherMapForecastPastRaw pastForecastsRaw)
    {
        return pastForecastsRaw.Hourly is null
            ? new List<HourlyWeather>()
            : pastForecastsRaw.Hourly.ConvertAll(f => new HourlyWeather(
                        DateTimeHelper.GetDateTimeUTCFromUnixTimeSeconds(f.Dt),
                        f.Weather[0].Id,
                        f.Rain?.RainMm ?? 0,
                        f.Temp,
                        f.Clouds,
                        GetWeatherDescription(f.Weather[0].Id)));
    }

    private static WeatherDescription GetWeatherDescription(int id) => id switch
    {
        int n when (n >= 200 && n <= 232) => WeatherDescription.ThunderStorm,
        int n when ((n >= 300 && n <= 321) || (n >= 520 && n <= 531)) => WeatherDescription.ShowerRain,
        int n when (n >= 500 && n <= 504) => WeatherDescription.Rain,
        int n when ((n >= 600 && n <= 622) || (n == 511)) => WeatherDescription.Snow,
        int n when (n >= 700 && n <= 781) => WeatherDescription.Mist,
        int n when (n == 800) => WeatherDescription.ClearSky,
        int n when (n == 801) => WeatherDescription.FewClouds,
        int n when (n == 802) => WeatherDescription.ScatteredClouds,
        int n when (n == 803) => WeatherDescription.BrokenClouds,
        int n when (n == 804) => WeatherDescription.BrokenClouds,
        _ => WeatherDescription.Unknown,
    };

    //  Raw interval is 3h, return 1h interval
    private static List<HourlyWeather> GetCompleteHourlyWeather(List<HourlyWeather> hourlyWeathers)
    {
        hourlyWeathers.Sort((x, y) => x.DateTime.CompareTo(y.DateTime));

        const int intervalWantedS = 3600;

        List<HourlyWeather>? fullHourlyForecast = new List<HourlyWeather>(hourlyWeathers);

        for (int i = 0; i < hourlyWeathers.Count - 1; i++)
        {
            HourlyWeather? f1 = hourlyWeathers[i];
            HourlyWeather? f2 = hourlyWeathers[i + 1];
            TimeSpan deltaT = f2.DateTime - f1.DateTime;
            double intervalActual = deltaT.TotalSeconds;

            if (intervalActual > intervalWantedS)
            {
                int interval = (int)(intervalActual / intervalWantedS);
                int missingForecastCount = interval - 1;

                for (int u = 1; u <= missingForecastCount; u++)
                {
                    double coefCorr = (double)u / (double)interval;

                    DateTime newDateTime = f1.DateTime + (coefCorr * deltaT);
                    double newRainm = f1.RainMm + ((f2.RainMm - f1.RainMm) * coefCorr);
                    double newTemperature = f1.Temperature + ((f2.Temperature - f1.Temperature) * coefCorr);
                    int newCloudCoverage = f1.CloudCoverage + (int)((f2.CloudCoverage - f1.CloudCoverage) * coefCorr);

                    bool isF1 = (int)coefCorr == 0;

                    int newId = isF1 ? f1.WeatherDescriptionId : f2.WeatherDescriptionId;
                    WeatherDescription newDescription = isF1 ? f1.Description : f2.Description;

                    HourlyWeather? newWeather = new HourlyWeather(newDateTime, newId, newRainm, newTemperature, newCloudCoverage, newDescription);
                    fullHourlyForecast.Add(newWeather);
                }
            }
        }
        fullHourlyForecast.Sort((x, y) => x.DateTime.CompareTo(y.DateTime));
        return fullHourlyForecast;
    }
}