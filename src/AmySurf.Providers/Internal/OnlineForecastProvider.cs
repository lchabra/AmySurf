using AmySurf.Models;

namespace AmySurf.Providers;

internal sealed class OnlineForecastProvider : IForecastProvider
{
    private readonly ISurfForecastProvider[] _surfForecastProviders;
    private readonly IWeatherForecastsProvider[] _weatherForecastProviders;
    private readonly IEnergyForecastsProvider[] _energyForecastProviders;
    private readonly SpotProvider _spotProvider;

    public OnlineForecastProvider(IEnumerable<ISurfForecastProvider> surfForecastProviders,
                                  IEnumerable<IWeatherForecastsProvider> weatherForecastProviders,
                                  IEnumerable<IEnergyForecastsProvider> energyForecastProviders,
                                  SpotProvider spotProvider)
    {
        _surfForecastProviders = surfForecastProviders.ToArray();
        _weatherForecastProviders = weatherForecastProviders.ToArray();
        _energyForecastProviders = energyForecastProviders.ToArray();
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
