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
    private readonly SpotProvider _spotProvider;
    private readonly IForecastProvider _forecastProvider;
    private readonly IOptions<ForecastWorkerBackgroundServiceOptions> _forecastWorkerBackgroundServiceOptions;

    public ForecastBackgroundService(
        ILogger<ForecastBackgroundService> logger,
        SpotProvider spotProvider,
        IForecastStore forecastStore,
        IForecastProvider forecaseProvider,
        IOptions<ForecastWorkerBackgroundServiceOptions> options)
    {
        _logger = logger;
        _spotProvider = spotProvider;
        _forecastStore = forecastStore;
        _forecastProvider = forecaseProvider;
        _forecastWorkerBackgroundServiceOptions = options;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {

        while (!stoppingToken.IsCancellationRequested)
        {
            Log.ForecastsUpdateStart(_logger);

            foreach (Spot spot in _spotProvider.GetSpots())
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

            TimeSpan delaySec = TimeSpan.FromSeconds(_forecastWorkerBackgroundServiceOptions.Value.BackgroundPullingInterval);

            Log.ForecastsUpdateFinish(_logger);
            await Task.Delay(delaySec, stoppingToken).ConfigureAwait(false);
        }
    }
}

public sealed class ForecastWorkerBackgroundServiceOptions
{
    public double BackgroundPullingInterval { get; set; }
}
