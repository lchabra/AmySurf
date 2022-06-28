using AmySurf.Models;
using AmySurf.Providers.Helpers;
using System.Threading.Tasks;

namespace AmySurf.Providers
{
    public class OfflineForecastProvider : IForecastsProvider
    {
        private readonly ForecastRWHelper _forecastReader;
        private readonly SpotProvider _spotProvider;

        public OfflineForecastProvider(ForecastRWHelper forecastReader, SpotProvider spotProvider)
        {
            _forecastReader = forecastReader;
            _spotProvider = spotProvider;
        }

        public async Task<Spot[]> GetSpotsAsync()
        {
            await Task.CompletedTask.ConfigureAwait(false);
            return _spotProvider.GetSpots();
        }

        public async Task<GetSurfForecastResponse> GetSurfForecastAsync(GetForecastRequest request)
        {
            await Task.CompletedTask;
            lock (_forecastReader)
                return _forecastReader.GetSurfForecast(request).GetAwaiter().GetResult();
        }

        public async Task<GetWeatherForecastResponse> GetWeatherForecastAsync(GetForecastRequest request)
        {
            await Task.CompletedTask;
            lock (_forecastReader)
                return _forecastReader.GetWeatherForecast(request).GetAwaiter().GetResult();
        }

        public async Task<GetEnergyForecastResponse> GetEnergyForecastAsync(GetForecastRequest request)
        {
            await Task.CompletedTask;
            lock (_forecastReader)
                return _forecastReader.GetEnergyForecast(request).GetAwaiter().GetResult();
        }
    }
}
