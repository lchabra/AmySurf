namespace AmySurf.Models
{
    // SurfLine
    public sealed class SurflineSpotOptions : IDataProviderSpotOptions
    {
        public string SpotId { get; }
        public SurflineSpotOptions(string spotId)
        {
            SpotId = spotId;
        }
    }

    // OpenWeather
    public sealed class OpenWeatherProviderSpotOptions : IDataProviderSpotOptions
    {
        public string SpotId { get; }
        public double Latitude { get; }
        public double Longitude { get; }

        public OpenWeatherProviderSpotOptions(string spotId, double latitude, double longitude)
        {
            SpotId = spotId;
            Latitude = latitude;
            Longitude = longitude;
        }
    }

    // SurfForecastDotCom
    public sealed class SurfForecastDotComSpotOptions : IDataProviderSpotOptions
    {
        public string SpotId { get; }
        public SurfForecastDotComSpotOptions(string spotId)
        {
            SpotId = spotId;
        }
    }
}
