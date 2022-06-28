using AmySurf.Adapters;
using AmySurf.Models;
using AmySurf.Models.Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace AmySurf.Providers
{
    public class SurflineProvider : ISurfForecastProvider
    {
        // The the server does not respect DaysForecats and IntervalHours
        private const int daysForecast = 6;
        private const int intervalHours = 1;
        private const string SurflineApiForecast = "https://services.surfline.com/kbyg/spots/forecasts/?spotId={0}&days={1}&intervalHours={2}&maxHeights=false";

        private readonly SpotProvider _spotProvider;
        private readonly HttpClientHelper _httpClientHelper;

        public SurflineProvider(SpotProvider spotProvider, HttpClientHelper httpClientHelper)
        {
            _spotProvider = spotProvider;
            _httpClientHelper = httpClientHelper;
        }

        public async Task<GetSurfForecastResponse> GetForecastAsync(string spotId)
        {
            SurflineRaw raw = await GetForecastRaw(spotId).ConfigureAwait(false);

            SurfForecast forecast = SurflineAdapter.FormatToSurfForecasts(spotId, raw);
            return new GetSurfForecastResponse(forecast, DateTime.UtcNow);
        }

        private async Task<SurflineRaw> GetForecastRaw(string spotId)
        {
            Spot spot = _spotProvider.GetSpot(spotId);
            SurflineSpotOptions providerSpotOptions = (SurflineSpotOptions)spot.ProvidersOptions.First(p => p.GetType() == typeof(SurflineSpotOptions));
            string apiSpotId = providerSpotOptions.SpotId;

            Uri apiUrl = new Uri(string.Format(CultureInfo.CurrentCulture, SurflineApiForecast, apiSpotId, daysForecast, intervalHours));

            HttpResponseMessage response = await _httpClientHelper.GetResponseMessageAsync(apiUrl).ConfigureAwait(true);
            response.EnsureSuccessStatusCode();

            string responseJson = await response.Content.ReadAsStringAsync().ConfigureAwait(true);
            SurflineRaw? forecastsRaw = JsonConvert.DeserializeObject<SurflineRaw>(responseJson);
            if (forecastsRaw is null)
            {
                throw new InvalidOperationException("Problem while Deserializing Surf Forecast");
            }
            return forecastsRaw;
        }
    }

    public class SurflineRaw
    {
        public SurflineRaw(UnitsRaw units, DataRaw data)
        {
            Units = units;
            Data = data;
        }

        public UnitsRaw Units { get; set; }
        public int UtcOffset { get; set; }
        public DataRaw Data { get; set; }
    }
    public class ForecastRaw
    {
        public ForecastRaw(long timestamp, SurflineWeatherRaw weather, WindRaw wind, SurfRaw surf, IList<SwellRaw> swells)
        {
            Timestamp = timestamp;
            Weather = weather;
            Wind = wind;
            Surf = surf;
            Swells = swells;
        }

        public long Timestamp { get; set; }
        public SurflineWeatherRaw Weather { get; set; }
        public WindRaw Wind { get; set; }
        public SurfRaw Surf { get; set; }
        public IList<SwellRaw> Swells { get; set; }
    }
    public class DataRaw
    {
        public DataRaw(IList<SunriseSunsetTimeRaw> sunriseSunsetTimes, TideLocationRaw tideLocation, List<ForecastRaw> forecasts, IList<TideRaw> tides)
        {
            SunriseSunsetTimes = sunriseSunsetTimes;
            TideLocation = tideLocation;
            Forecasts = forecasts;
            Tides = tides;
        }

        public IList<SunriseSunsetTimeRaw> SunriseSunsetTimes { get; set; }
        public TideLocationRaw TideLocation { get; set; }
        public List<ForecastRaw> Forecasts { get; set; }
        public IList<TideRaw> Tides { get; set; }
    }
    public class UnitsRaw
    {
        public UnitsRaw(string temperature, string tideHeight, string swellHeight, string waveHeight, string windSpeed)
        {
            Temperature = temperature;
            TideHeight = tideHeight;
            SwellHeight = swellHeight;
            WaveHeight = waveHeight;
            WindSpeed = windSpeed;
        }

        public string Temperature { get; set; }
        public string TideHeight { get; set; }
        public string SwellHeight { get; set; }
        public string WaveHeight { get; set; }
        public string WindSpeed { get; set; }
    }
    public class SunriseSunsetTimeRaw
    {
        public int Midnight { get; set; }
        public int Sunrise { get; set; }
        public int Sunset { get; set; }
    }
    public class TideLocationRaw
    {
        public TideLocationRaw(string name)
        {
            Name = name;
        }

        public string Name { get; set; }
        public double Min { get; set; }
        public double Max { get; set; }
        public double Lon { get; set; }
        public double Lat { get; set; }
        public double Mean { get; set; }
    }
    public class SurflineWeatherRaw
    {
        public SurflineWeatherRaw(string condition)
        {
            Condition = condition;
        }

        public int Temperature { get; set; }
        public string Condition { get; set; }
    }
    public class WindRaw
    {
        public double Speed { get; set; }
        public double Direction { get; set; }
    }
    public class SurfRaw
    {
        public double Min { get; set; }
        public double Max { get; set; }
    }
    public class SwellRaw
    {
        public double Height { get; set; }
        public double Direction { get; set; }
        public double DirectionMin { get; set; }
        public int Period { get; set; }
    }
    public class TideRaw
    {
        public TideRaw(string type)
        {
            Type = type;
        }
        public int Timestamp { get; set; }
        public string Type { get; set; }
        public double Height { get; set; }
    }
}