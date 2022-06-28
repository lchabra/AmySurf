using AmySurf.Models;
using AmySurf.Providers;
using AmySurf.Providers.Helpers;
using AmySurf.Service.Logging;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AmySurf.Service
{
    public class ForecastWorkerBackgroundService : BackgroundService
    {
        private readonly ILogger _logger;
        private readonly ForecastRWHelper _forecastRW;
        private readonly SpotProvider _spotProvider;
        private readonly IForecastsProvider _provider;
        private readonly IOptions<ForecastWorkerBackgroundServiceOptions> _forecastWorkerBackgroundServiceOptions;

        public ForecastWorkerBackgroundService(
            ILogger<ForecastWorkerBackgroundService> logger,
            SpotProvider spotProvider,
            ForecastRWHelper forecastReader,
            IForecastsProvider provider,
            IOptions<ForecastWorkerBackgroundServiceOptions> options)
        {
            _logger = logger;
            _spotProvider = spotProvider;
            _forecastRW = forecastReader;
            _provider = provider;
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
                        GetSurfForecastResponse response = await _provider.GetSurfForecastAsync(new GetForecastRequest { SpotId = spot.Id }).ConfigureAwait(false);
                        lock (_forecastRW)
                            _forecastRW.WriteForecast(response);

                        Log.ForecastTypeUpdateFinish(_logger, spot.Id, nameof(SurfForecast));
                    }
                    catch (Exception e)
                    {
                        Log.ForecastTypeUpdateFail(_logger, spot.Id, nameof(SurfForecast), e);
                    }

                    try
                    {
                        GetWeatherForecastResponse response = await _provider.GetWeatherForecastAsync(new GetForecastRequest { SpotId = spot.Id }).ConfigureAwait(false);
                        lock (_forecastRW)
                            _forecastRW.WriteForecast(response);
                        Log.ForecastTypeUpdateFinish(_logger, spot.Id, nameof(WeatherForecast));
                    }
                    catch (Exception e)
                    {
                        Log.ForecastTypeUpdateFail(_logger, spot.Id, nameof(WeatherForecast), e);
                    }

                    try
                    {
                        GetEnergyForecastResponse response = await _provider.GetEnergyForecastAsync(new GetForecastRequest { SpotId = spot.Id }).ConfigureAwait(false);
                        lock (_forecastRW)
                            _forecastRW.WriteForecast(response);

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

    public class ForecastWorkerBackgroundServiceOptions
    {
        public double BackgroundPullingInterval { get; set; }
    }
}
