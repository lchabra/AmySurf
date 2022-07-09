namespace AmySurf.Providers;

public enum ForecastType
{
    SurfForecast,
    WeatherForecast,
    EnergyForecast,
}

public sealed class FetchTimes
{
    public DateTime SurfForecast { get; set; }
    public DateTime WeatherForecast { get; set; }
    public DateTime EnergyForecast { get; set; }
}

internal static class ForecastStoreHelper
{
    public static string GetDayForecastFolderPath(string spotFolderPath, DateTime hourlyForecastDateTime, ForecastType forecastType) =>
        Path.Combine(spotFolderPath,
                     hourlyForecastDateTime.Year.ToString(),
                     hourlyForecastDateTime.Month.ToString(),
                     hourlyForecastDateTime.Day.ToString(),
                     forecastType.ToString());
    public static string GetDayInfosFolderPath(string spotFolderPath, DateTime hourlyForecastDateTime) =>
        Path.Combine(spotFolderPath,
                hourlyForecastDateTime.Year.ToString(),
                hourlyForecastDateTime.Month.ToString(),
                hourlyForecastDateTime.Day.ToString());

    public static string GetHourlyFilePath(string dayFolderPath, DateTime hourlyForecastDateTime) =>
        Path.Combine(dayFolderPath, $"{hourlyForecastDateTime.Hour}.json");
    public static string GetDayInfosFilePath(string folderPath) =>
        Path.Combine(folderPath, "dayInfos.json");
    public static string GetFetchTimeFilePath(string folderPath) =>
        Path.Combine(folderPath, "fetchTimes.json");

    public static void EnsureFolder(string folderPath)
    {
        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);
    }

    public static string GetDataDirectory(FileSystemForecastStoreOptions options)
    {
        var value = options.BaseDataDirectory;
        if (string.IsNullOrEmpty(value))
        {
            var personalPath = Environment.GetFolderPath(Environment.SpecialFolder.Personal);
            value = Path.Combine(personalPath, ".amysurf", "data");
            if (!Directory.Exists(value))
            {
                var legacyPath = Path.Combine(personalPath, "amysurf", "forecastdata");
                if (Directory.Exists(legacyPath))
                {
                    Directory.CreateDirectory(Path.Combine(personalPath, ".amysurf"));
                    Directory.Move(legacyPath, value);
                }
                else
                {
                    Directory.CreateDirectory(value);
                }
            }
        }
        else
        {
            ForecastStoreHelper.EnsureFolder(value);
        }

        return value;
    }
}
