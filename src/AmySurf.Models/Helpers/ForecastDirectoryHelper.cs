using System;
using System.IO;

namespace AmySurf.Models.Helpers
{
    public enum ForecastType
    {
        SurfForecast,
        WeatherForecast,
        EnergyForecast,
    }

    public class FetchTimes
    {
        public DateTime SurfForecast { get; set; }
        public DateTime WeatherForecast { get; set; }
        public DateTime EnergyForecast { get; set; }
    }

    public static class ForecastDirectoryHelper
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
    }
}
