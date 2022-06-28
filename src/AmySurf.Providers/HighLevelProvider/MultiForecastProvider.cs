using AmySurf.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AmySurf.Providers
{
    public class MultiForecastProvider : IForecastsProvider
    {
        private readonly IForecastsProvider[] _forecastsProviders;
        private readonly SpotProvider _spotProvider;

        public MultiForecastProvider(SpotProvider spotProvider, params IForecastsProvider[] forecastsProviders)
        {
            _spotProvider = spotProvider;
            _forecastsProviders = forecastsProviders;
        }

        public async Task<Spot[]> GetSpotsAsync()
        {
            await Task.CompletedTask.ConfigureAwait(false);
            return _spotProvider.GetSpots();
        }

        public async Task<GetSurfForecastResponse> GetSurfForecastAsync(GetForecastRequest request)
        {
            List<GetSurfForecastResponse> forecastResponses = new List<GetSurfForecastResponse>(_forecastsProviders.Length);
            List<Exception> exceptions = new List<Exception>();

            foreach (IForecastsProvider provider in _forecastsProviders)
            {
                //Console.WriteLine($"INFORMATION: Surf Provider is {provider.GetType()}");

                GetSurfForecastResponse response;
                try
                {
                    response = await provider.GetSurfForecastAsync(request).ConfigureAwait(false);
                }
                catch (Exception e)
                {
                    exceptions.Add(e);
                    continue;
                }

                if (IsForecastFresh(response.Timestamp))
                    return response;

                forecastResponses.Add(response);
            }

            if (forecastResponses.Count == 0)
                throw new AggregateException(exceptions);

            forecastResponses.Sort((x, y) => x.Timestamp.CompareTo(y.Timestamp));

            return forecastResponses[^1];
        }

        public async Task<GetWeatherForecastResponse> GetWeatherForecastAsync(GetForecastRequest request)
        {
            List<GetWeatherForecastResponse> forecastResponses = new List<GetWeatherForecastResponse>(_forecastsProviders.Length);
            List<Exception> exceptions = new List<Exception>();

            foreach (IForecastsProvider provider in _forecastsProviders)
            {
                //Console.WriteLine($"INFORMATION: Weather Provider is {provider.GetType()}");

                GetWeatherForecastResponse response;
                try
                {
                    response = await provider.GetWeatherForecastAsync(request).ConfigureAwait(false);
                }
                catch (Exception e)
                {
                    exceptions.Add(e);
                    continue;
                }

                if (IsForecastFresh(response.Timestamp))
                    return response;

                forecastResponses.Add(response);
            }

            if (forecastResponses.Count == 0)
                throw new AggregateException(exceptions);

            forecastResponses.Sort((x, y) => x.Timestamp.CompareTo(y.Timestamp));

            return forecastResponses[^1];
        }

        public async Task<GetEnergyForecastResponse> GetEnergyForecastAsync(GetForecastRequest request)
        {
            List<GetEnergyForecastResponse> forecastResponses = new List<GetEnergyForecastResponse>(_forecastsProviders.Length);
            List<Exception> exceptions = new List<Exception>();

            foreach (IForecastsProvider provider in _forecastsProviders)
            {
                //Console.WriteLine($"INFORMATION: Energy Provider is {provider.GetType()}");

                GetEnergyForecastResponse response;
                try
                {
                    response = await provider.GetEnergyForecastAsync(request).ConfigureAwait(false);
                }
                catch (Exception e)
                {
                    exceptions.Add(e);
                    continue;
                }

                if (IsForecastFresh(response.TimeStamp))
                    return response;

                forecastResponses.Add(response);
            }

            if (forecastResponses.Count == 0)
                throw new AggregateException(exceptions);

            forecastResponses.Sort((x, y) => x.TimeStamp.CompareTo(y.TimeStamp));

            return forecastResponses[^1];
        }

        private bool IsForecastFresh(DateTime updateTime) => DateTime.UtcNow - updateTime < ProviderHelper.MaxAgeOfFreshForecast;
    }
}
