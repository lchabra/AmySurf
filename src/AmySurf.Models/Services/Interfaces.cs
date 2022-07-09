namespace AmySurf.Models;

/// <summary>
/// Provider High level
/// </summary>
public interface IForecastProvider
{
    Task<Spot[]> GetSpotsAsync();
    Task<GetSurfForecastResponse> GetSurfForecastAsync(GetForecastRequest request);
    Task<GetWeatherForecastResponse> GetWeatherForecastAsync(GetForecastRequest request);
    Task<GetEnergyForecastResponse> GetEnergyForecastAsync(GetForecastRequest request);
}

public interface IForecastStore : IForecastProvider
{
    void WriteForecast(GetSurfForecastResponse response);
    void WriteForecast(GetWeatherForecastResponse response);
    void WriteForecast(GetEnergyForecastResponse response);
}

public interface ISurfForecastProvider
{
    Task<GetSurfForecastResponse> GetForecastAsync(string spotId);
}

public interface IWeatherForecastsProvider
{
    Task<GetWeatherForecastResponse> GetForecastAsync(string spotId);
}

public interface IEnergyForecastsProvider
{
    Task<GetEnergyForecastResponse> GetForecastAsync(string spotId);
}

// TODO: rename to `IProviderSpotOptions` ?
// TODO: Delete?
public interface IDataProviderSpotOptions { }
