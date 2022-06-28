using AmySurf.Models;
using AmySurf.Models.Helpers;
using AmySurf.Providers.Helpers;
using Newtonsoft.Json;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace AmySurf.Providers
{
    public class CacheForecastProvider : IForecastsProvider
    {
        private GetSurfForecastResponse GetSurfForecastResponseCache { get; set; }
        private GetWeatherForecastResponse GetWeatherForecastResponseCache { get; set; }
        private GetEnergyForecastResponse GetEnergyForecastResponseCache { get; set; }

        private int GetSurfForecastRequestHashCache { get; set; }
        private int GetWeatherForecastRequestHashCache { get; set; }
        private int GetEnergyForecastRequestHashCache { get; set; }

        private readonly SpotProvider _spotProvider;
        private readonly IForecastsProvider _forecastsProvider;

        public CacheForecastProvider(SpotProvider spotProvider, IForecastsProvider forecastsProvider)
        {
            _spotProvider = spotProvider;
            _forecastsProvider = forecastsProvider;
            GetSurfForecastResponseCache = new GetSurfForecastResponse(SurfForecast.Empty, default);
            GetWeatherForecastResponseCache = new GetWeatherForecastResponse(WeatherForecast.Empty, default);
            GetEnergyForecastResponseCache = new GetEnergyForecastResponse(EnergyForecast.Empty, default);
        }

        public async Task<Spot[]> GetSpotsAsync()
        {
            await Task.CompletedTask;
            return _spotProvider.GetSpots();
        }

        public async Task<GetSurfForecastResponse> GetSurfForecastAsync(GetForecastRequest request)
        {
            int requestHash = JsonConvert.SerializeObject(request).GetHashCode();

            bool isCacheAvailable = requestHash == GetSurfForecastRequestHashCache
                && GetSurfForecastResponseCache.Forecast != SurfForecast.Empty
                && (DateTime.UtcNow - GetSurfForecastResponseCache.Timestamp) < ProviderHelper.MaxAgeOfFreshForecast;

            if (isCacheAvailable)
                return GetSurfForecastResponseCache;

            GetSurfForecastResponse response = await _forecastsProvider.GetSurfForecastAsync(request);

            GetSurfForecastRequestHashCache = requestHash;
            GetSurfForecastResponseCache = response;

            return response;
        }

        public async Task<GetWeatherForecastResponse> GetWeatherForecastAsync(GetForecastRequest request)
        {
            int requestHash = JsonConvert.SerializeObject(request).GetHashCode();

            bool isCacheAvailable = requestHash == GetWeatherForecastRequestHashCache
                && GetWeatherForecastResponseCache.Forecast != WeatherForecast.Empty
                && (DateTime.UtcNow - GetWeatherForecastResponseCache.Timestamp) < ProviderHelper.MaxAgeOfFreshForecast;

            if (isCacheAvailable)
                return GetWeatherForecastResponseCache;

            GetWeatherForecastResponse response = await _forecastsProvider.GetWeatherForecastAsync(request);

            GetWeatherForecastRequestHashCache = requestHash;
            GetWeatherForecastResponseCache = response;

            return response;
        }

        public async Task<GetEnergyForecastResponse> GetEnergyForecastAsync(GetForecastRequest request)
        {
            int requestHash = JsonConvert.SerializeObject(request).GetHashCode();

            bool isCacheAvailable = requestHash == GetEnergyForecastRequestHashCache
                && GetEnergyForecastResponseCache.Forecast != EnergyForecast.Empty
                && (DateTime.UtcNow - GetEnergyForecastResponseCache.TimeStamp) < ProviderHelper.MaxAgeOfFreshForecast;

            if (isCacheAvailable)
                return GetEnergyForecastResponseCache;

            var response = await _forecastsProvider.GetEnergyForecastAsync(request);

            GetEnergyForecastRequestHashCache = requestHash;
            GetEnergyForecastResponseCache = response;

            return response;
        }
    }
}
