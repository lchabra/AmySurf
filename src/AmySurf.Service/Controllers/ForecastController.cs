using AmySurf.Models;
using AmySurf.Logging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AmySurf.Service.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public sealed class ForecastController : ApiControllerBase
{
    private readonly SpotProvider _spotProvider;
    private readonly IForecastProvider _forecastProvider;
    private readonly ILogger _logger;

    public ForecastController(IForecastProvider forecastProvider, SpotProvider spotProvider, ILogger<ForecastController> logger)
    {
        _forecastProvider = forecastProvider;
        _spotProvider = spotProvider;
        _logger = logger;
    }

    [HttpGet]
    [ActionName("Surf")]
    public async Task<GetSurfForecastResponse> GetSurf([FromQuery] GetForecastRequest request)
    {
        Log.ApiControllerForecastRequest(_logger, request.SpotId, nameof(SurfForecast));
        return await _forecastProvider.GetSurfForecastAsync(request).ConfigureAwait(false);
    }

    [HttpGet]
    [ActionName("Weather")]
    public async Task<GetWeatherForecastResponse> GetWeather([FromQuery] GetForecastRequest request)
    {
        Log.ApiControllerForecastRequest(_logger, request.SpotId, nameof(WeatherForecast));
        return await _forecastProvider.GetWeatherForecastAsync(request).ConfigureAwait(false);
    }

    [HttpGet]
    [ActionName("Energy")]
    public async Task<GetEnergyForecastResponse> GetEnergy([FromQuery] GetForecastRequest request)
    {
        Log.ApiControllerForecastRequest(_logger, request.SpotId, nameof(EnergyForecast));
        return await _forecastProvider.GetEnergyForecastAsync(request).ConfigureAwait(false);
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
