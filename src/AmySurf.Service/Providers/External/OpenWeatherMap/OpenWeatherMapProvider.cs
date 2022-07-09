using AmySurf.Helpers;
using AmySurf.Models;
using Newtonsoft.Json;
using System.Globalization;

namespace AmySurf.Providers.External;

internal sealed class OpenWeatherMapProvider : IWeatherForecastsProvider
{
    public OpenWeatherMapProvider(SpotProvider spotProvider, HttpClientHelper httpClientHelper)
    {
        _spotProvider = spotProvider;
        _httpClientHelper = httpClientHelper;
    }

    //TODO: Come from EnvVars
    private const string ApiKey = "929452d64e8910c426c40b268e9fc365";
    private const string ApiUrlPast = "https://api.openweathermap.org/data/2.5/onecall/timemachine?lat={0}&lon={1}&dt={2}&appid={3}";
    //private const string ApiUrlFutureById = "https://api.openweathermap.org/data/2.5/forecast?id={0}&appid={1}";
    private const string ApiUrlFutureByCoordinate = "https://api.openweathermap.org/data/2.5/forecast?lat={0}&lon={1}&appid={2}";

    private readonly SpotProvider _spotProvider;
    private readonly HttpClientHelper _httpClientHelper;

    public async Task<GetWeatherForecastResponse> GetForecastAsync(string spotId)
    {
        long timeStampUtcNow = DateTimeHelper.TimestampUTCNow;
        long timeStampUtcYersteday = timeStampUtcNow - 86400;
        OpenWeatherMapForecastPastRaw? yerstedayForecastRaw;
        OpenWeatherMapForecastPastRaw? todayForecastRaw;
        OpenWeatherMapForecastFutureRaw? futureForecastRaw;

        yerstedayForecastRaw = await GetForecastRawPast(spotId, timeStampUtcYersteday).ConfigureAwait(false);
        todayForecastRaw = await GetForecastRawPast(spotId, timeStampUtcNow).ConfigureAwait(false);
        //var futureForecastRaw2 = await GetWeatherForecastFutureById(spot);
        futureForecastRaw = await GetWeatherForecastFutureByCoordinate(spotId).ConfigureAwait(false);

        return OpenWeatherMapAdapter.NormalizeForecast(spotId, yerstedayForecastRaw, todayForecastRaw, futureForecastRaw);
    }

    private async Task<OpenWeatherMapForecastFutureRaw?> GetWeatherForecastFutureByCoordinate(string spotId)
    {
        Spot? spot = _spotProvider.GetSpot(spotId);
        OpenWeatherProviderSpotOptions? providerSpotOptions = (OpenWeatherProviderSpotOptions)spot.ProvidersOptions.First(p => p.GetType() == typeof(OpenWeatherProviderSpotOptions));

        Uri? apiUrl = new Uri(string.Format(
            CultureInfo.CurrentCulture,
            ApiUrlFutureByCoordinate,
            providerSpotOptions.Latitude,
            providerSpotOptions.Longitude,
            ApiKey));

        HttpResponseMessage response = await _httpClientHelper.GetResponseMessageAsync(apiUrl).ConfigureAwait(true);

        if (!response.IsSuccessStatusCode)
        {
            //Console.WriteLine("ERROR: Can't fetch Weather");
            return null;
        }
        string? responseJson = await response.Content.ReadAsStringAsync().ConfigureAwait(true);
        OpenWeatherMapForecastFutureRaw? forecastsRaw = JsonConvert.DeserializeObject<OpenWeatherMapForecastFutureRaw>(responseJson);
        return forecastsRaw;
    }

    private async Task<OpenWeatherMapForecastPastRaw?> GetForecastRawPast(string spotId, long TimeStamp)
    {
        Spot? spot = _spotProvider.GetSpot(spotId);
        OpenWeatherProviderSpotOptions? providerSpotOptions = (OpenWeatherProviderSpotOptions)spot.ProvidersOptions.First(p => p.GetType() == typeof(OpenWeatherProviderSpotOptions));

        Uri? apiUrl = new Uri(string.Format(
            CultureInfo.CurrentCulture,
            ApiUrlPast,
            providerSpotOptions.Latitude,
            providerSpotOptions.Longitude,
            TimeStamp,
            ApiKey));

        HttpResponseMessage response = await _httpClientHelper.GetResponseMessageAsync(apiUrl).ConfigureAwait(true);
        if (!response.IsSuccessStatusCode)
        {
            //Console.WriteLine("ERROR: Can't fetch Weather");
            return null;
        }
        string? responseJson = await response.Content.ReadAsStringAsync().ConfigureAwait(true);
        OpenWeatherMapForecastPastRaw? forecastsRaw = JsonConvert.DeserializeObject<OpenWeatherMapForecastPastRaw>(responseJson);
        return forecastsRaw;
    }
}

public sealed record OpenWeatherProviderSpotOptions(string SpotId, double Latitude,double Longitude) : IDataProviderSpotOptions;

public sealed class OpenWeatherMapForecastPastRaw
{
    public OpenWeatherMapForecastPastRaw(PastForecastRaw current, List<PastForecastRaw> hourly)
    {
        Current = current;
        Hourly = hourly;
    }
    public int Timezone_offset { get; set; }
    public PastForecastRaw Current { get; set; }
    public List<PastForecastRaw> Hourly { get; set; }
}

public sealed class PastForecastRaw
{
    public PastForecastRaw(List<OpenWeatherRaw> weather, Rain rain)
    {
        Weather = weather;
        Rain = rain;
    }
    public int Dt { get; set; }
    public int Clouds { get; set; }
    public double Temp { get; set; }
    public List<OpenWeatherRaw> Weather { get; set; }

    public Rain Rain { get; set; }
}

public sealed class OpenWeatherMapForecastFutureRaw
{
    public OpenWeatherMapForecastFutureRaw(List<OpenWeatherForecast> list, City city)
    {
        List = list;
        City = city;
    }
    public List<OpenWeatherForecast> List { get; set; }
    public City City { get; set; }
}
public sealed class OpenWeatherForecast
{
    public OpenWeatherForecast(Rain rain, Clouds clouds, Main main, List<OpenWeatherRaw> weather)
    {
        Rain = rain;
        Clouds = clouds;
        Main = main;
        Weather = weather;
    }

    public int Dt { get; set; }
    public List<OpenWeatherRaw> Weather { get; set; }
    public Main Main { get; set; }
    public Clouds Clouds { get; set; }
    public Rain Rain { get; set; }
}
public sealed class Main
{
    public double Temp { get; set; }
    public int Pressure { get; set; }
    public int Humidity { get; set; }
}
public sealed class Clouds
{
    public int All { get; set; }
}
public sealed class Rain
{
    [JsonProperty(PropertyName = "3h")]
    public double RainMm { get; set; }
}

public sealed class OpenWeatherRaw
{
    public OpenWeatherRaw(string main, string description, string icon)
    {
        Main = main;
        Description = description;
        Icon = icon;
    }
    public int Id { get; set; }
    public string Main { get; set; }
    public string Description { get; set; }
    public string Icon { get; set; }
}
public sealed class City
{
    public City(string name)
    {
        Name = name;
    }
    public int Id { get; set; }
    public string Name { get; set; }
    public int Timezone { get; set; }
}

