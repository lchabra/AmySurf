using AmySurf.Models;

namespace AmySurf.Providers;

internal sealed class AggregateForecastProvider : IForecastProvider
{
    private readonly IForecastProvider[] _forecastsProviders;
    private readonly SpotProvider _spotProvider;

    public AggregateForecastProvider(SpotProvider spotProvider, params IForecastProvider[] forecastsProviders)
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

        foreach (IForecastProvider provider in _forecastsProviders)
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

        foreach (IForecastProvider provider in _forecastsProviders)
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

        foreach (IForecastProvider provider in _forecastsProviders)
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
