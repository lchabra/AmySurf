using AmySurf.Models;
using AmySurf.Models.Helpers;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Globalization;

namespace AmySurf.Providers;

internal sealed class ForecastProviderApiClient : IForecastProvider
{
    private readonly HttpClientHelper _httpClientHelper;
    private readonly string _forecastApiAddress;
    private readonly string _spotApiAddress;
    //http://localhost:5000/api/Forecast/surf?spotId=Canggu_Batu_Bolong&startTime=2021-01-28T00:00:00&endTime=2021-01-29T12:00:00

    public ForecastProviderApiClient(HttpClientHelper httpClientHelper, IOptions<ForecastProviderApiClientOptions> options)
    {
        _httpClientHelper = httpClientHelper;
        _forecastApiAddress = options.Value.Server + "/api/Forecast/{0}?spotId={1}&startTime={2}&endTime={3}";
        _spotApiAddress = options.Value.Server + "/api/Forecast/Spots";
    }

    public async Task<Spot[]> GetSpotsAsync()
    {
        Uri? apiUrl = new Uri(string.Format(CultureInfo.CurrentCulture, _spotApiAddress));
        HttpResponseMessage response = await _httpClientHelper.GetResponseMessageAsync(apiUrl).ConfigureAwait(true);

        if (!response.IsSuccessStatusCode)
        {
            // Console.WriteLine("ERROR: Can't fetch spot");
            return new Spot[0];
        }

        string? responseJson = await response.Content.ReadAsStringAsync().ConfigureAwait(true);
        Spot[]? spots = JsonConvert.DeserializeObject<Spot[]>(responseJson);

        return spots ?? (new Spot[0]);
    }

    public async Task<GetSurfForecastResponse> GetSurfForecastAsync(GetForecastRequest request)
    {
        Uri apiUrl = new Uri(string.Format(CultureInfo.InvariantCulture, _forecastApiAddress, "surf", request.SpotId, request.StartTime.ToString("s"), request.EndTime.ToString("s")));

        HttpResponseMessage response = await _httpClientHelper.GetResponseMessageAsync(apiUrl).ConfigureAwait(true);

        string responseJson = await response.Content.ReadAsStringAsync().ConfigureAwait(true);
        GetSurfForecastResponse? forecast = JsonConvert.DeserializeObject<GetSurfForecastResponse>(responseJson);

        return forecast ?? throw new InvalidOperationException("Error while Deserializing SurfForecastResponse");
    }

    public async Task<GetWeatherForecastResponse> GetWeatherForecastAsync(GetForecastRequest request)
    {
        Uri apiUrl = new Uri(string.Format(CultureInfo.CurrentCulture, _forecastApiAddress, "weather", request.SpotId, request.StartTime.ToString("s"), request.EndTime.ToString("s")));
        HttpResponseMessage response = await _httpClientHelper.GetResponseMessageAsync(apiUrl).ConfigureAwait(true);

        string? responseJson = await response.Content.ReadAsStringAsync().ConfigureAwait(true);
        GetWeatherForecastResponse? forecast = JsonConvert.DeserializeObject<GetWeatherForecastResponse>(responseJson);

        return forecast ?? throw new InvalidOperationException("Error while Deserializing WeatherForecastResponse");
    }

    public async Task<GetEnergyForecastResponse> GetEnergyForecastAsync(GetForecastRequest request)
    {
        Uri apiUrl = new Uri(string.Format(CultureInfo.CurrentCulture, _forecastApiAddress, "energy", request.SpotId, request.StartTime.ToString("s"), request.EndTime.ToString("s")));
        HttpResponseMessage response = await _httpClientHelper.GetResponseMessageAsync(apiUrl).ConfigureAwait(true);

        string? responseJson = await response.Content.ReadAsStringAsync().ConfigureAwait(true);
        GetEnergyForecastResponse? forecast = JsonConvert.DeserializeObject<GetEnergyForecastResponse>(responseJson);

        return forecast ?? throw new InvalidOperationException("Error while Deserializing EnergyForecastResponse");
    }
}

public sealed class ForecastProviderApiClientOptions
{
    public string Server { get; set; } = string.Empty;
}
