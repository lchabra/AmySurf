using AmySurf.Models;
using AmySurf.Providers;
using AmySurf.Service.Logging;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AmySurf.Service.Services;

internal sealed class ForecastBackgroundService : BackgroundService
{
    private readonly ILogger _logger;
    private readonly IForecastStore _forecastStore;
    private readonly IForecastProvider _forecastProvider;
    private readonly ForecastBackgroundServiceOptions _options;

    public ForecastBackgroundService(
        ILogger<ForecastBackgroundService> logger,
        IForecastStore forecastStore,
        OnlineForecastProvider forecaseProvider,
        IOptions<ForecastBackgroundServiceOptions> options)
    {
        _logger = logger;
        _forecastStore = forecastStore;
        _forecastProvider = forecaseProvider;
        _options = options.Value;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var interval = _options.PollingInterval;
        while (!stoppingToken.IsCancellationRequested)
        {
            Log.ForecastsUpdateStart(_logger);

            foreach (Spot spot in await _forecastProvider.GetSpotsAsync())
            {
                Log.SpotForecastsUpdateStart(_logger, spot.Name);

                try
                {
                    GetSurfForecastResponse response = await _forecastProvider.GetSurfForecastAsync(new GetForecastRequest { SpotId = spot.Id }).ConfigureAwait(false);
                    lock (_forecastStore)
                        _forecastStore.WriteForecast(response);

                    Log.ForecastTypeUpdateFinish(_logger, spot.Id, nameof(SurfForecast));
                }
                catch (Exception e)
                {
                    Log.ForecastTypeUpdateFail(_logger, spot.Id, nameof(SurfForecast), e);
                }

                try
                {
                    GetWeatherForecastResponse response = await _forecastProvider.GetWeatherForecastAsync(new GetForecastRequest { SpotId = spot.Id }).ConfigureAwait(false);
                    lock (_forecastStore)
                        _forecastStore.WriteForecast(response);
                    Log.ForecastTypeUpdateFinish(_logger, spot.Id, nameof(WeatherForecast));
                }
                catch (Exception e)
                {
                    Log.ForecastTypeUpdateFail(_logger, spot.Id, nameof(WeatherForecast), e);
                }

                try
                {
                    GetEnergyForecastResponse response = await _forecastProvider.GetEnergyForecastAsync(new GetForecastRequest { SpotId = spot.Id }).ConfigureAwait(false);
                    lock (_forecastStore)
                        _forecastStore.WriteForecast(response);

                    Log.ForecastTypeUpdateFinish(_logger, spot.Id, nameof(EnergyForecast));
                }
                catch (Exception e)
                {
                    Log.ForecastTypeUpdateFail(_logger, spot.Id, nameof(EnergyForecast), e);
                }

                Log.SpotForecastsUpdateFinish(_logger, spot.Id);
            }

            Log.ForecastsUpdateFinish(_logger);
            await Task.Delay(interval, stoppingToken).ConfigureAwait(false);
        }
    }
}

public sealed class ForecastBackgroundServiceOptions
{
    public TimeSpan PollingInterval { get; set; } = TimeSpan.FromHours(1);
}
