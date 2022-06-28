using AmySurf.Models;
using AmySurf.Models.Helpers;
using AmySurf.Providers.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AmySurf.Providers
{
    public class AppForecastProvider : IForecastsProvider
    {
        private readonly ForecastRWHelper _forecastRW;
        private readonly SpotProvider _spotProvider;
        private readonly IForecastsProvider _forecastProvider;

        public AppForecastProvider(ForecastRWHelper forecastRW, SpotProvider spotProvider, IForecastsProvider forecastProvider)
        {
            _forecastRW = forecastRW;
            _spotProvider = spotProvider;
            _forecastProvider = forecastProvider;
        }

        public async Task<Spot[]> GetSpotsAsync()
        {
            await Task.CompletedTask.ConfigureAwait(false);
            return _spotProvider.GetSpots();
        }

        // TODO: Refactor
        public async Task<GetSurfForecastResponse> GetSurfForecastAsync(GetForecastRequest request)
        {
            List<Exception> exceptions = new List<Exception>();
            GetSurfForecastResponse cacheResponse = new GetSurfForecastResponse(SurfForecast.Empty, default);

            try
            {
                cacheResponse = await _forecastRW.GetSurfForecast(request).ConfigureAwait(false);
                if (IsForecastFresh(cacheResponse.Timestamp))
                    return cacheResponse;
            }
            catch (Exception e)
            {
                exceptions.Add(e);
            }

            GetSurfForecastResponse onlineForecast = new GetSurfForecastResponse(SurfForecast.Empty, default);
            try
            {
                onlineForecast = await _forecastProvider.GetSurfForecastAsync(request).ConfigureAwait(false);
            }
            catch (Exception e)
            {
                exceptions.Add(e);
            }

            if (cacheResponse.Forecast == SurfForecast.Empty && onlineForecast.Forecast == SurfForecast.Empty)
            {
                throw new AggregateException(exceptions);
            }

            if (onlineForecast.Timestamp > cacheResponse.Timestamp)
            {
                _forecastRW.WriteForecast(onlineForecast);
                return onlineForecast;
            }
            else
            {
                return cacheResponse.Forecast == SurfForecast.Empty ? onlineForecast : cacheResponse;
            }
        }

        public async Task<GetWeatherForecastResponse> GetWeatherForecastAsync(GetForecastRequest request)
        {
            List<Exception> exceptions = new List<Exception>();
            GetWeatherForecastResponse cacheResponse = new GetWeatherForecastResponse(WeatherForecast.Empty, default);

            try
            {
                cacheResponse = await _forecastRW.GetWeatherForecast(request).ConfigureAwait(false);

                if (IsForecastFresh(cacheResponse.Timestamp))
                    return cacheResponse;
            }
            catch (Exception e)
            {
                exceptions.Add(e);
            }

            GetWeatherForecastResponse onlineForecast = new GetWeatherForecastResponse(WeatherForecast.Empty, default);
            try
            {
                onlineForecast = await _forecastProvider.GetWeatherForecastAsync(request).ConfigureAwait(false);
            }
            catch (Exception e)
            {
                exceptions.Add(e);
            }

            if (cacheResponse.Forecast == WeatherForecast.Empty && onlineForecast.Forecast == WeatherForecast.Empty)
            {
                throw new AggregateException(exceptions);
            }

            if (onlineForecast.Timestamp > cacheResponse.Timestamp)
            {
                _forecastRW.WriteForecast(onlineForecast);
                return onlineForecast;
            }
            else
            {
                return cacheResponse.Forecast == WeatherForecast.Empty ? onlineForecast : cacheResponse;
            }
        }

        public async Task<GetEnergyForecastResponse> GetEnergyForecastAsync(GetForecastRequest request)
        {
            List<Exception> exceptions = new List<Exception>();
            GetEnergyForecastResponse cacheResponse = new GetEnergyForecastResponse(EnergyForecast.Empty, default);
            try
            {
                cacheResponse = await _forecastRW.GetEnergyForecast(request).ConfigureAwait(false);
                List<DateTime> requestedDatesTimes = DateTimeHelper.GetAllHourlyBetweenDates(request.StartTime, request.EndTime);

                if (cacheResponse.Forecast != EnergyForecast.Empty)
                {
                    // Check that forecast are complete

                    bool isSequencesEquals = requestedDatesTimes.SequenceEqual(DateTimeHelper.GetAllHourlyBetweenDates(
                        cacheResponse.Forecast.HourlyForecasts[0].DateTime,
                        cacheResponse.Forecast.HourlyForecasts[^1].DateTime));

                    if (isSequencesEquals && IsForecastFresh(cacheResponse.TimeStamp))
                        return cacheResponse;
                }
            }
            catch (Exception e)
            {
                exceptions.Add(e);
            }



            GetEnergyForecastResponse onlineForecast = new GetEnergyForecastResponse(EnergyForecast.Empty, default);
            try
            {
                onlineForecast = await _forecastProvider.GetEnergyForecastAsync(request).ConfigureAwait(false);
            }
            catch (Exception e)
            {
                exceptions.Add(e);
            }

            if (cacheResponse.Forecast == EnergyForecast.Empty && onlineForecast.Forecast == EnergyForecast.Empty)
            {
                throw new AggregateException(exceptions);
            }

            if (onlineForecast.TimeStamp > cacheResponse.TimeStamp)
            {
                TryUpdateMissingOnlineForecast(onlineForecast, cacheResponse);
                _forecastRW.WriteForecast(onlineForecast);
                return onlineForecast;
            }
            else
            {
                return cacheResponse.Forecast == EnergyForecast.Empty ? onlineForecast : cacheResponse;
            }
        }

        private void TryUpdateMissingOnlineForecast(GetEnergyForecastResponse onlineForecast, GetEnergyForecastResponse cacheForecast)
        {
            if (onlineForecast.Forecast == EnergyForecast.Empty)
                return;

            if (cacheForecast.Forecast == EnergyForecast.Empty)
                return;

            foreach (var onlineHourlyEnergy in onlineForecast.Forecast.HourlyForecasts)
            {
                if (onlineHourlyEnergy.Energy == -1)
                {
                    var offlineHourlyEnergy = cacheForecast.Forecast.HourlyForecasts.Find(offlineHoourlyEnergy => offlineHoourlyEnergy.DateTime == onlineHourlyEnergy.DateTime);

                    if (offlineHourlyEnergy != null && offlineHourlyEnergy.Energy != -1)
                        onlineHourlyEnergy.Energy = offlineHourlyEnergy.Energy;
                }
            }
        }

        private bool IsForecastFresh(DateTime updateTime) => DateTime.UtcNow - updateTime < ProviderHelper.MaxAgeOfFreshForecast;
    }
}
