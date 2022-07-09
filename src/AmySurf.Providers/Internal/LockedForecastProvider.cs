using AmySurf.Models;

namespace AmySurf.Providers;

internal sealed class LockedForecastProvider : IForecastProvider
{
    private readonly IForecastProvider _innerProvider;

    public LockedForecastProvider(IForecastProvider innerProvider) => _innerProvider = innerProvider;

    public async Task<Spot[]> GetSpotsAsync()
    {
        await Task.CompletedTask;
        lock (_innerProvider)
            return _innerProvider.GetSpotsAsync().GetAwaiter().GetResult();
    }

    // TODO: convert that lock to use a semaphore
    public async Task<GetSurfForecastResponse> GetSurfForecastAsync(GetForecastRequest request)
    {
        await Task.CompletedTask;
        lock (_innerProvider)
            return _innerProvider.GetSurfForecastAsync(request).GetAwaiter().GetResult();
    }

    // TODO: convert that lock to use a semaphore
    public async Task<GetWeatherForecastResponse> GetWeatherForecastAsync(GetForecastRequest request)
    {
        await Task.CompletedTask;
        lock (_innerProvider)
            return _innerProvider.GetWeatherForecastAsync(request).GetAwaiter().GetResult();
    }

    // TODO: convert that lock to use a semaphore
    public async Task<GetEnergyForecastResponse> GetEnergyForecastAsync(GetForecastRequest request)
    {
        await Task.CompletedTask;
        lock (_innerProvider)
            return _innerProvider.GetEnergyForecastAsync(request).GetAwaiter().GetResult();
    }
}
