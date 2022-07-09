namespace AmySurf.Models;

// SurfLine
public sealed record SurflineSpotOptions(string SpotId) : IDataProviderSpotOptions;

// OpenWeather
public sealed record OpenWeatherProviderSpotOptions(string SpotId, double Latitude,double Longitude) : IDataProviderSpotOptions;

// SurfForecastDotCom
public sealed record SurfForecastDotComSpotOptions(string SpotId) : IDataProviderSpotOptions;
