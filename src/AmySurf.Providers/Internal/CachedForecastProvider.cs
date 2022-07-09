using AmySurf.Models;
using Newtonsoft.Json;

namespace AmySurf.Providers;

internal sealed class CachedForecastProvider : IForecastProvider
{
    private GetSurfForecastResponse GetSurfForecastResponseCache { get; set; }
    private GetWeatherForecastResponse GetWeatherForecastResponseCache { get; set; }
    private GetEnergyForecastResponse GetEnergyForecastResponseCache { get; set; }

    private int GetSurfForecastRequestHashCache { get; set; }
    private int GetWeatherForecastRequestHashCache { get; set; }
    private int GetEnergyForecastRequestHashCache { get; set; }

    private readonly SpotProvider _spotProvider;
    private readonly IForecastProvider _forecastProvider;

    public CachedForecastProvider(SpotProvider spotProvider, IForecastProvider forecastsProvider)
    {
        _spotProvider = spotProvider;
        _forecastProvider = forecastsProvider;
        GetSurfForecastResponseCache = new GetSurfForecastResponse(SurfForecast.Empty, default);
        GetWeatherForecastResponseCache = new GetWeatherForecastResponse(WeatherForecast.Empty, default);
        GetEnergyForecastResponseCache = new GetEnergyForecastResponse(EnergyForecast.Empty, default);
    }

    public async Task<Spot[]> GetSpotsAsync()
    {
        await Task.CompletedTask;
        return _spotProvider.GetSpots();
    }

    public async Task<GetSurfForecastResponse> GetSurfForecastAsync(GetForecastRequest request)
    {
        int requestHash = JsonConvert.SerializeObject(request).GetHashCode();

        bool isCacheAvailable = requestHash == GetSurfForecastRequestHashCache
            && GetSurfForecastResponseCache.Forecast != SurfForecast.Empty
            && (DateTime.UtcNow - GetSurfForecastResponseCache.Timestamp) < ProviderHelper.MaxAgeOfFreshForecast;

        if (isCacheAvailable)
            return GetSurfForecastResponseCache;

        GetSurfForecastResponse response = await _forecastProvider.GetSurfForecastAsync(request);

        GetSurfForecastRequestHashCache = requestHash;
        GetSurfForecastResponseCache = response;

        return response;
    }

    public async Task<GetWeatherForecastResponse> GetWeatherForecastAsync(GetForecastRequest request)
    {
        int requestHash = JsonConvert.SerializeObject(request).GetHashCode();

        bool isCacheAvailable = requestHash == GetWeatherForecastRequestHashCache
            && GetWeatherForecastResponseCache.Forecast != WeatherForecast.Empty
            && (DateTime.UtcNow - GetWeatherForecastResponseCache.Timestamp) < ProviderHelper.MaxAgeOfFreshForecast;

        if (isCacheAvailable)
            return GetWeatherForecastResponseCache;

        GetWeatherForecastResponse response = await _forecastProvider.GetWeatherForecastAsync(request);

        GetWeatherForecastRequestHashCache = requestHash;
        GetWeatherForecastResponseCache = response;

        return response;
    }

    public async Task<GetEnergyForecastResponse> GetEnergyForecastAsync(GetForecastRequest request)
    {
        int requestHash = JsonConvert.SerializeObject(request).GetHashCode();

        bool isCacheAvailable = requestHash == GetEnergyForecastRequestHashCache
            && GetEnergyForecastResponseCache.Forecast != EnergyForecast.Empty
            && (DateTime.UtcNow - GetEnergyForecastResponseCache.TimeStamp) < ProviderHelper.MaxAgeOfFreshForecast;

        if (isCacheAvailable)
            return GetEnergyForecastResponseCache;

        var response = await _forecastProvider.GetEnergyForecastAsync(request);

        GetEnergyForecastRequestHashCache = requestHash;
        GetEnergyForecastResponseCache = response;

        return response;
    }
}
