using AmySurf.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AmySurf.Providers
{
    public class OnlineForecastProvider : IForecastsProvider
    {
        private readonly List<ISurfForecastProvider> _surfForecastProviders;
        private readonly List<IWeatherForecastsProvider> _weatherForecastProviders;
        private readonly List<IEnergyForecastsProvider> _energyForecastProviders;
        private readonly SpotProvider _spotProvider;

        public OnlineForecastProvider(IEnumerable<ISurfForecastProvider> surfForcastProviders,
                                      IEnumerable<IWeatherForecastsProvider> weatherForecastProviders,
                                      IEnumerable<IEnergyForecastsProvider> energyForecastProviders, SpotProvider spotProvider)
        {
            _surfForecastProviders = surfForcastProviders.ToList();
            _weatherForecastProviders = weatherForecastProviders.ToList();
            _energyForecastProviders = energyForecastProviders.ToList();
            _spotProvider = spotProvider;
        }

        public async Task<Spot[]> GetSpotsAsync()
        {
            await Task.CompletedTask.ConfigureAwait(false);
            return _spotProvider.GetSpots();
        }

        public async Task<GetSurfForecastResponse> GetSurfForecastAsync(GetForecastRequest request)
        {
            List<Exception> exceptions = new List<Exception>();
            foreach (ISurfForecastProvider provider in _surfForecastProviders)
            {
                //Console.WriteLine($"INFORMATION: Surf Provider is {provider.GetType()}");
                try
                {
                    return await provider.GetForecastAsync(request.SpotId).ConfigureAwait(false);
                }
                catch (Exception e)
                {
                    exceptions.Add(e);
                }
            }

            throw new AggregateException(exceptions);
        }

        public async Task<GetWeatherForecastResponse> GetWeatherForecastAsync(GetForecastRequest request)
        {
            List<Exception> exceptions = new List<Exception>();
            foreach (IWeatherForecastsProvider provider in _weatherForecastProviders)
            {
                //Console.WriteLine($"INFORMATION: Weather Provider is {provider.GetType()}");
                try
                {
                    return await provider.GetForecastAsync(request.SpotId).ConfigureAwait(false);
                }
                catch (Exception e)
                {
                    exceptions.Add(e);
                }
            }
            throw new AggregateException(exceptions);
        }

        public async Task<GetEnergyForecastResponse> GetEnergyForecastAsync(GetForecastRequest request)
        {
            List<Exception> exceptions = new List<Exception>();
            foreach (IEnergyForecastsProvider provider in _energyForecastProviders)
            {
                //Console.WriteLine($"INFORMATION: Energy Provider is {provider.GetType()}");
                try
                {
                    return await provider.GetForecastAsync(request.SpotId).ConfigureAwait(false);
                }
                catch (Exception e)
                {
                    exceptions.Add(e);
                    throw;
                }
            }
            throw new AggregateException(exceptions);
        }
    }
}
