using System.Threading.Tasks;

namespace AmySurf.Models
{
    /// <summary>
    /// Provider High level
    /// </summary>
    public interface IForecastsProvider
    {
        Task<Spot[]> GetSpotsAsync();
        // TODO: remove 'public' keyword from all interfaces (general rule,
        // interface method are public)
        Task<GetSurfForecastResponse> GetSurfForecastAsync(GetForecastRequest request);
        Task<GetWeatherForecastResponse> GetWeatherForecastAsync(GetForecastRequest request);
        Task<GetEnergyForecastResponse> GetEnergyForecastAsync(GetForecastRequest request);
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
}
