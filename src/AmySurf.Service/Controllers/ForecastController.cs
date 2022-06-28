using AmySurf.Models;
using AmySurf.Service.Logging;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace AmySurf.Service.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ForecastController : ApiControllerBase
    {
        private readonly SpotProvider _spotProvider;
        private readonly IForecastsProvider _forecastsProvider;
        private readonly ILogger _logger;

        public ForecastController(IForecastsProvider forecastsProvider, SpotProvider spotProvider, ILogger<ForecastController> logger)
        {
            _forecastsProvider = forecastsProvider;
            _spotProvider = spotProvider;
            _logger = logger;
        }

        [HttpGet]
        [ActionName("Surf")]
        public async Task<GetSurfForecastResponse> GetSurf([FromQuery] GetForecastRequest request)
        {
            Log.ApiControllerForecastRequest(_logger, request.SpotId, nameof(SurfForecast));
            return await _forecastsProvider.GetSurfForecastAsync(request).ConfigureAwait(false);
        }

        [HttpGet]
        [ActionName("Weather")]
        public async Task<GetWeatherForecastResponse> GetWeather([FromQuery] GetForecastRequest request)
        {
            Log.ApiControllerForecastRequest(_logger, request.SpotId, nameof(WeatherForecast));
            return await _forecastsProvider.GetWeatherForecastAsync(request).ConfigureAwait(false);
        }

        [HttpGet]
        [ActionName("Energy")]
        public async Task<GetEnergyForecastResponse> GetEnergy([FromQuery] GetForecastRequest request)
        {
            Log.ApiControllerForecastRequest(_logger, request.SpotId, nameof(EnergyForecast));
            return await _forecastsProvider.GetEnergyForecastAsync(request).ConfigureAwait(false);
        }

        [HttpGet]
        [ActionName("Spots")]
        public async Task<Spot[]> GetSpots()
        {
            Log.ApiControllerSpotsRequest(_logger);

            await Task.CompletedTask.ConfigureAwait(false);
            return _spotProvider.GetSpots();
        }
    }
}
