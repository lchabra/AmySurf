using AmySurf.Helpers;
using AmySurf.Models;

namespace AmySurf.Providers.External;

internal static class SurflineAdapter
{
    internal static SurfForecast FormatToSurfForecasts(string spotId, SurflineRaw forecastsRaw)
    {
        ConvertToAppMesurementUnits(forecastsRaw);

        SurfForecast surfForecasts = new SurfForecast(spotId, new List<HourlySurf>(), new List<DateTime>(), new List<DateTime>());

        forecastsRaw.Data.Forecasts = GetFullForecastDataRaw(forecastsRaw.Data.Forecasts);
        forecastsRaw.Data.Tides = GetFullTidesDataRaw(forecastsRaw.Data.Tides);

        int hourlyForecastCount = forecastsRaw.Data.Forecasts.Count;
        if (hourlyForecastCount < 2)
            return surfForecasts;

        for (int i = 0; i < hourlyForecastCount; i++)
        {
            ForecastRaw? singleForecastRaw = forecastsRaw.Data.Forecasts[i];
            TideRaw? hourlyTide = forecastsRaw.Data.Tides.FirstOrDefault(t => t?.Timestamp == singleForecastRaw.Timestamp, null);

            //Shift tide 1 hour earlier
            const int tideTsCorrection = 0;
            // const int tideTsCorrection = 60 * 60;

            var longestSwell = singleForecastRaw.Swells.OrderByDescending(s => s.Period).FirstOrDefault();
            var longestSwellPeriod = longestSwell?.Period;
            var longestSwellDirection = longestSwell?.Direction;

            var isTideRising = IsTideRising(forecastsRaw, hourlyForecastCount, i, hourlyTide);

            HourlySurf? hourlyForecastData = new HourlySurf()
            {
                DateTime = DateTimeHelper.GetUniversalDateTimeFromUnixTimeSeconds(singleForecastRaw.Timestamp - tideTsCorrection),

                WavesSizeMin = singleForecastRaw.Surf.Min,
                WavesSizeMax = singleForecastRaw.Surf.Max,
                PrimarySwellPeriod = (int)singleForecastRaw.Swells[0].Period,
                PrimarySwellDirection = (int)singleForecastRaw.Swells[0].Direction,
                SecondarySwellPeriod = (int)singleForecastRaw.Swells[1].Period,
                SecondarySwellDirection = (int)singleForecastRaw.Swells[1].Direction,
                LongestSwellDirection = (int)(longestSwellDirection ?? -1),
                LongestSwellPeriod = (int)(longestSwellPeriod ?? -1),
                WindDirection = singleForecastRaw.Wind.Direction,
                WindSpeed = singleForecastRaw.Wind.Speed,
                TideHeight = hourlyTide?.Height ?? -1,
                TideType = GetTideType(hourlyTide?.Type),
                IsTideRising = isTideRising
            };
            double tMin = forecastsRaw.Data.TideLocation.Min;
            double tMax = forecastsRaw.Data.TideLocation.Max;
            double tDelta = tMax - tMin;
            double tPercent = hourlyTide == null ? 0 : (hourlyTide.Height - tMin) / tDelta;
            hourlyForecastData.TideHeightPercent = Math.Round(tPercent, 2);
            //hourlyForecastData.TideType = hourlyTide.Type;

            surfForecasts.HourlyForecasts.Add(hourlyForecastData);
        }

        // Sunset Sunrise
        IList<SunriseSunsetTimeRaw>? ssRawList = forecastsRaw.Data.SunriseSunsetTimes;
        for (int i = 0; i < ssRawList.Count; i++)
        {
            surfForecasts.SunriseTimes.Add(DateTimeHelper.GetUniversalDateTimeFromUnixTimeSeconds(ssRawList[i].Sunrise));
            surfForecasts.SunsetTimes.Add(DateTimeHelper.GetUniversalDateTimeFromUnixTimeSeconds(ssRawList[i].Sunset));
        }

        return surfForecasts;
    }

    private static bool IsTideRising(SurflineRaw forecastsRaw, int hourlyForecastCount, int i, TideRaw? hourlyTide)
    {
        bool isTideRising;
        if (i == hourlyForecastCount - 1)
        {
            var prevHeight = forecastsRaw.Data.Tides.FirstOrDefault(t => t?.Timestamp == forecastsRaw.Data.Forecasts[i - 1].Timestamp, null)?.Height;
            isTideRising = (hourlyTide?.Height - prevHeight) > 0;
        }
        else
        {
            var nextHeight = forecastsRaw.Data.Tides.FirstOrDefault(t => t?.Timestamp == forecastsRaw.Data.Forecasts[i + 1].Timestamp, null)?.Height;
            isTideRising = (nextHeight - hourlyTide?.Height) > 0;
        }

        return isTideRising;
    }

    private static TideType GetTideType(string? type)
    {
        switch (type)
        {
            case "LOW":
                return TideType.LOW;
            case "NORMAL":
                return TideType.NORMAL;
            case "HIGH":
                return TideType.HIGH;
            default:
                // TODO: LOG ERROR Tide Type is incorect
                return TideType.NORMAL;
        }
    }

    private static List<TideRaw> GetFullTidesDataRaw(IList<TideRaw> forecasts)
    {
        List<TideRaw> listNewForecast = new List<TideRaw>();
        for (int i = 0; i < forecasts.Count - 1; i++)
        {
            TideRaw f1 = forecasts[i];
            TideRaw f2 = forecasts[i + 1];

            long intervalHours = (f2.Timestamp - f1.Timestamp) / 3600;

            for (int u = 0; u < intervalHours - 1; u++)
            {
                double coefCorr = (double)intervalHours / ((double)u + (double)1);
                int timestamp = (int)(f1.Timestamp + ((f2.Timestamp - f1.Timestamp) / coefCorr));

                double height = (f1.Height + ((f2.Height - f1.Height) / coefCorr));

                TideRaw newForecast = new TideRaw(string.Empty)
                {
                    Timestamp = timestamp,
                    Height = height,
                };
                listNewForecast.Add(newForecast);
            }
        }

        return listNewForecast.Concat(forecasts).OrderBy(f => f.Timestamp).ToList();
    }

    private static void ConvertToAppMesurementUnits(SurflineRaw forecastsRaw)
    {
        // TideHeight M to Ft
        // WindSpeed KPH to knt
        forecastsRaw.Units.WaveHeight = "FT";
        forecastsRaw.Units.WindSpeed = "KTS";

        foreach (ForecastRaw? f in forecastsRaw.Data.Forecasts)
        {
            f.Surf.Min *= SystemUnitHelper.MeterToFoot;
            f.Surf.Max *= SystemUnitHelper.MeterToFoot;
            f.Wind.Speed *= SystemUnitHelper.KmhToKnot;

            foreach (SwellRaw? s in f.Swells)
            {
                s.Height *= SystemUnitHelper.MeterToFoot;
            }
        }
    }

    private static List<ForecastRaw> GetFullForecastDataRaw(IList<ForecastRaw> forecasts)
    {
        long intervalHours = (forecasts[1].Timestamp - forecasts[0].Timestamp) / (60 * 60);

        List<ForecastRaw> listNewForecast = new List<ForecastRaw>();

        for (int i = 0; i < forecasts.Count - 1; i++)
        {
            ForecastRaw? f1 = forecasts[i];
            ForecastRaw? f2 = forecasts[i + 1];

            // Will Iterate x Time between the 2 forecast 
            for (int u = 0; u < intervalHours - 1; u++)
            {
                double coefCorr = (double)intervalHours / ((double)u + (double)1);

                SurflineWeatherRaw? weather = new SurflineWeatherRaw(f1.Weather.Condition);

                SurfRaw? surf = new SurfRaw()
                {
                    Max = f1.Surf.Max + ((f2.Surf.Max - f1.Surf.Max) / coefCorr),
                    Min = f1.Surf.Min + ((f2.Surf.Min - f1.Surf.Min) / coefCorr)
                };
                List<SwellRaw>? swells = new List<SwellRaw>();

                WindRaw? wind = new WindRaw()
                {
                    Direction = f1.Wind.Direction + ((f2.Wind.Direction - f1.Wind.Direction) / coefCorr),
                    Speed = f1.Wind.Speed + ((f2.Wind.Speed - f1.Wind.Speed) / coefCorr)
                };

                int swellCountMin = Math.Min(f1.Swells.Count, f2.Swells.Count);
                for (int s = 0; s < swellCountMin; s++)
                {
                    SwellRaw? newSwell = new SwellRaw()
                    {
                        Period = (int)(f1.Swells[s].Period + ((f2.Swells[s].Period - f1.Swells[s].Period) / coefCorr)),
                        Direction = f1.Swells[s].Direction + ((f2.Swells[s].Direction - f1.Swells[s].Direction) / coefCorr)
                    };
                    swells.Add(newSwell);
                }

                long timestamp = (long)(f1.Timestamp + ((f2.Timestamp - f1.Timestamp) / coefCorr));
                ForecastRaw? newForecast = new ForecastRaw(timestamp, weather, wind, surf, swells);

                listNewForecast.Add(newForecast);
            }
        }
        return listNewForecast.Concat(forecasts).OrderBy(f => f.Timestamp).ToList();
    }
}
