using AmySurf.Models;
using AmySurf.Models.Helpers;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AmySurf.Providers.Helpers
{
    public class ForecastRWHelper
    {
        /// <summary>
        /// Something like ~/AmySurfData/ or C:/Users/USERNAME/Documents/AmySurf/ForecastsData/"
        /// </summary>
        private readonly string _baseDataDirectory;

        public ForecastRWHelper(IOptions<ForecastRWOptions> options)
        {
            _baseDataDirectory = GetBaseDataDirectory(options);
        }

        #region Reader

        private string GetBaseDataDirectory(IOptions<ForecastRWOptions> options)
        {
            string value = options.Value.BaseDataDirectory;
            if (string.IsNullOrEmpty(value))
            {
                value = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Personal), "amysurf", "forecastdata");
            }

            return value;
        }

        public async Task<GetSurfForecastResponse> GetSurfForecast(GetForecastRequest request)
        {
            await Task.CompletedTask.ConfigureAwait(false);

            // <_baseDataDirectory>/Canggu_Batu_Bolong"
            string spotFolderPath = Path.Combine(_baseDataDirectory, request.SpotId);

            if (!Directory.Exists(spotFolderPath))
                throw new InvalidOperationException("Forecast directory not found");

            List<HourlySurf>? hourlyForecasts = await GetHourlySurfForecasts(spotFolderPath, request).ConfigureAwait(false);
            List<DayData>? daysInfos = await GetDaysInfos(spotFolderPath, request).ConfigureAwait(false);

            if (hourlyForecasts is null || daysInfos is null)
                throw new InvalidOperationException("Forecast missing");

            // Create Each Info
            List<DateTime> sunriseTimes = new List<DateTime>();
            List<DateTime> sunsetTimes = new List<DateTime>();
            foreach (DayData? day in daysInfos)
            {
                if (day?.SunriseTime != null)
                    sunriseTimes.Add((DateTime)day.SunriseTime);
                if (day?.SunsetTime != null)
                    sunsetTimes.Add((DateTime)day.SunsetTime);
            }

            DateTime updateTime = GetFetchTimes(spotFolderPath)?.SurfForecast ?? default;

            return new GetSurfForecastResponse(
                new SurfForecast(
                    request.SpotId,
                    hourlyForecasts,
                    sunriseTimes,
                    sunsetTimes),
                    updateTime);
        }

        public async Task<GetWeatherForecastResponse> GetWeatherForecast(GetForecastRequest request)
        {
            await Task.CompletedTask.ConfigureAwait(false);

            // \Assets\Canggu_Batu_Bolong\
            string spotFolderPath = Path.Combine(_baseDataDirectory, request.SpotId);

            if (!Directory.Exists(spotFolderPath))
                throw new InvalidOperationException("Forecast directory not found");

            // Hourly info
            List<HourlyWeather>? hourlyForecasts = await GetHourlyWeatherForecasts(spotFolderPath, request).ConfigureAwait(false);

            if (hourlyForecasts is null)
                throw new InvalidOperationException("Forecast missing");
            DateTime updateTime = GetFetchTimes(spotFolderPath)?.WeatherForecast ?? default;

            return new GetWeatherForecastResponse(
                new WeatherForecast(hourlyForecasts, request.SpotId),
                updateTime);
        }

        public async Task<GetEnergyForecastResponse> GetEnergyForecast(GetForecastRequest request)
        {
            await Task.CompletedTask.ConfigureAwait(false);

            // \Assets\Canggu_Batu_Bolong\
            string spotFolderPath = Path.Combine(_baseDataDirectory, request.SpotId);
            if (!Directory.Exists(spotFolderPath))
                throw new InvalidOperationException("Forecast directory not found");

            // Hourly info
            List<HourlyEnergy>? hourlyForecasts = await GetHourlyEnergyForecasts(spotFolderPath, request).ConfigureAwait(false);

            if (hourlyForecasts is null)
                throw new InvalidOperationException("Forecast missing");

            DateTime updateTime = GetFetchTimes(spotFolderPath)?.EnergyForecast ?? default;

            return new GetEnergyForecastResponse(
                new EnergyForecast(request.SpotId, hourlyForecasts),
                updateTime);
        }

        private async Task<List<HourlySurf>?> GetHourlySurfForecasts(string spotFolder, GetForecastRequest request)
        {
            await Task.CompletedTask.ConfigureAwait(false);

            List<HourlySurf>? hourlyForecasts = new List<HourlySurf>();
            List<DateTime> hourlysRequest = DateTimeHelper.GetAllHourlyBetweenDates(request.StartTime, request.EndTime);

            foreach (DateTime hourlyDateTimeRequest in hourlysRequest)
            {
                string folderPath = ForecastDirectoryHelper.GetDayForecastFolderPath(spotFolder, hourlyDateTimeRequest, ForecastType.SurfForecast);
                string filePath = ForecastDirectoryHelper.GetHourlyFilePath(folderPath, hourlyDateTimeRequest);

                if (!File.Exists(filePath))
                    continue;

                string hourlySurfString;
                using (StreamReader file = new StreamReader(filePath))
                    hourlySurfString = file.ReadToEnd();

                HourlySurf? hourlyForecast = JsonConvert.DeserializeObject<HourlySurf>(hourlySurfString);

                if (hourlyForecast is null)
                    continue;

                hourlyForecasts.Add(hourlyForecast);
            }

            return hourlyForecasts.Count == 0 ? null : hourlyForecasts;
        }

        private async Task<List<HourlyWeather>?> GetHourlyWeatherForecasts(string spotFolder, GetForecastRequest request)
        {
            await Task.CompletedTask.ConfigureAwait(false);

            List<HourlyWeather>? hourlyForecasts = new List<HourlyWeather>();
            List<DateTime> hourlysRequest = DateTimeHelper.GetAllHourlyBetweenDates(request.StartTime, request.EndTime);

            foreach (DateTime hourlyDateTimeRequest in hourlysRequest)
            {
                string folderPath = ForecastDirectoryHelper.GetDayForecastFolderPath(spotFolder, hourlyDateTimeRequest, ForecastType.WeatherForecast);
                string filePath = ForecastDirectoryHelper.GetHourlyFilePath(folderPath, hourlyDateTimeRequest);

                if (!File.Exists(filePath))
                    continue;

                string hourlySurfString;
                using (StreamReader file = new StreamReader(filePath))
                    hourlySurfString = file.ReadToEnd();

                HourlyWeather? hourlyForecast = JsonConvert.DeserializeObject<HourlyWeather>(hourlySurfString);
                if (hourlyForecast is null)
                    continue;

                hourlyForecasts.Add(hourlyForecast);
            }

            return hourlyForecasts.Count == 0 ? null : hourlyForecasts;
        }

        private async Task<List<HourlyEnergy>?> GetHourlyEnergyForecasts(string spotFolder, GetForecastRequest request)
        {
            await Task.CompletedTask.ConfigureAwait(false);

            List<HourlyEnergy>? hourlyForecasts = new List<HourlyEnergy>();
            List<DateTime> hourlysRequest = DateTimeHelper.GetAllHourlyBetweenDates(request.StartTime, request.EndTime);

            foreach (DateTime hourlyDateTimeRequest in hourlysRequest)
            {
                string folderPath = ForecastDirectoryHelper.GetDayForecastFolderPath(spotFolder, hourlyDateTimeRequest, ForecastType.EnergyForecast);
                string filePath = ForecastDirectoryHelper.GetHourlyFilePath(folderPath, hourlyDateTimeRequest);

                if (!File.Exists(filePath))
                    continue;

                string hourlySurfString;
                using (StreamReader file = new StreamReader(filePath))
                    hourlySurfString = file.ReadToEnd();

                HourlyEnergy? hourlyForecast = JsonConvert.DeserializeObject<HourlyEnergy>(hourlySurfString);
                if (hourlyForecast is null)
                    continue;

                hourlyForecasts.Add(hourlyForecast);
            }

            return hourlyForecasts.Count == 0 ? null : hourlyForecasts;
        }

        private async Task<List<DayData>?> GetDaysInfos(string spotFolder, GetForecastRequest request)
        {
            await Task.CompletedTask.ConfigureAwait(false);

            List<DayData>? daysInformations = new List<DayData>();

            // Create list of Requested Days
            // We take one day earlier and one day later to be sure to capture all data requested
            List<DateTime> hourlysRequest = DateTimeHelper.GetAllHourlyBetweenDates(request.StartTime, request.EndTime);
            List<DateTime>? dayDates = hourlysRequest.Select(f => f.Date).Distinct().ToList();
            dayDates.Add(dayDates[0] - TimeSpan.FromDays(1));
            dayDates.Add(dayDates[^2] + TimeSpan.FromDays(1));
            dayDates.Sort((x, y) => x.CompareTo(y));

            foreach (DateTime dayDate in dayDates)
            {
                // /Assets/Canggu_Batu_Bolong/2021/01/15/
                string dayFolder = ForecastDirectoryHelper.GetDayInfosFolderPath(spotFolder, dayDate);

                // /Assets/Canggu_Batu_Bolong/2021/01/15/dayInfos.json
                string filePath = ForecastDirectoryHelper.GetDayInfosFilePath(dayFolder);

                if (File.Exists(filePath))
                {
                    string daysInfosString = string.Empty;

                    using (StreamReader reader = new StreamReader(filePath))
                        daysInfosString = reader.ReadToEnd();

                    DayData? dayInfos = JsonConvert.DeserializeObject<DayData>(daysInfosString);
                    if (dayInfos != null)
                        daysInformations.Add(dayInfos);
                }
            }

            return daysInformations.Count == 0 ? null : daysInformations;
        }

        private FetchTimes? GetFetchTimes(string spotFolder)
        {
            string filePath = ForecastDirectoryHelper.GetFetchTimeFilePath(spotFolder);

            if (File.Exists(filePath))
            {
                string fetchTimesString = string.Empty;

                using (StreamReader reader = new StreamReader(filePath))
                    fetchTimesString = reader.ReadToEnd();

                FetchTimes? fetchTimes = JsonConvert.DeserializeObject<FetchTimes>(fetchTimesString);
                return fetchTimes;
            }
            return default;
        }

        #endregion

        #region Writer
        public void WriteForecast(GetSurfForecastResponse response)
        {
            if (response.Forecast is null)
            {
                //Console.WriteLine("ERROR: Cannot write null forecast");
                return;
            }

            // <_baseDataDirectory>/Canggu_Batu_Bolong"
            string? spotFolder = Path.Combine(_baseDataDirectory, response.Forecast.SpotId);
            EnsureFolder(spotFolder);

            WriteHourlyForecasts(response.Forecast, spotFolder);
            WriteDaysInfos(response.Forecast, spotFolder);
            WriteFetchTime(spotFolder, response.Timestamp, ForecastType.SurfForecast);
        }
        public void WriteForecast(GetWeatherForecastResponse response)
        {
            if (response.Forecast is null)
            {
                //Console.WriteLine("ERROR: Cannot write null forecast");
                return;
            }

            // <_baseDataDirectory>/Canggu_Batu_Bolong"
            string? spotFolder = Path.Combine(_baseDataDirectory, response.Forecast.SpotId);
            EnsureFolder(spotFolder);

            WriteHourlyForecasts(response.Forecast, spotFolder);
            WriteFetchTime(spotFolder, response.Timestamp, ForecastType.WeatherForecast);
        }
        public void WriteForecast(GetEnergyForecastResponse response)
        {
            if (response.Forecast is null)
            {
                //Console.WriteLine("ERROR: Cannot write null forecast");
                return;
            }

            // <_baseDataDirectory>/Canggu_Batu_Bolong"
            string? spotFolder = Path.Combine(_baseDataDirectory, response.Forecast.SpotId);
            EnsureFolder(spotFolder);

            WriteHourlyForecasts(response.Forecast, spotFolder);
            WriteFetchTime(spotFolder, response.TimeStamp, ForecastType.EnergyForecast);
        }
        private void WriteFetchTime(string spotFolder, DateTime updateTime, ForecastType forecastType)
        {
            EnsureFolder(spotFolder);

            // <_baseDataDirectory>/Canggu_Batu_Bolong/fetchTimes.json"
            string filePath = ForecastDirectoryHelper.GetFetchTimeFilePath(spotFolder);

            FetchTimes? fetchTimes = GetFetchTimes(spotFolder) ?? new FetchTimes();

            switch (forecastType)
            {
                case ForecastType.SurfForecast:
                    fetchTimes!.SurfForecast = updateTime;
                    break;
                case ForecastType.WeatherForecast:
                    fetchTimes!.WeatherForecast = updateTime;
                    break;
                case ForecastType.EnergyForecast:
                    fetchTimes!.EnergyForecast = updateTime;
                    break;
                default:
                    break;
            }

            string? fetchTimesString = JsonConvert.SerializeObject(fetchTimes);

            using StreamWriter file = new StreamWriter(filePath, false);
            file.WriteLine(fetchTimesString);
        }

        private void WriteHourlyForecasts(SurfForecast forecast, string spotFolder)
        {
            foreach (HourlySurf? hourlyForecast in forecast.HourlyForecasts)
            {
                // /Assets/Canggu_Batu_Bolong/2021/01/15/forecastType/
                string folderPath = ForecastDirectoryHelper.GetDayForecastFolderPath(spotFolder, hourlyForecast.DateTime, ForecastType.SurfForecast);
                EnsureFolder(folderPath);

                // /Assets/Canggu_Batu_Bolong/2021/01/15/forecastType/17.json
                string filePath = ForecastDirectoryHelper.GetHourlyFilePath(folderPath, hourlyForecast.DateTime);
                string? hourlyForecastString = JsonConvert.SerializeObject(hourlyForecast);

                using StreamWriter file = new StreamWriter(filePath, false);
                file.WriteLine(hourlyForecastString);
            }
        }

        private void WriteHourlyForecasts(WeatherForecast forecast, string spotFolder)
        {
            foreach (HourlyWeather? hourlyForecast in forecast.HourlyForecasts)
            {
                // /Assets/Canggu_Batu_Bolong/2021/01/15/forecastType/
                string folderPath = ForecastDirectoryHelper.GetDayForecastFolderPath(spotFolder, hourlyForecast.DateTime, ForecastType.WeatherForecast);
                EnsureFolder(folderPath);

                // /Assets/Canggu_Batu_Bolong/2021/01/15/forecastType/17.json
                string filePath = ForecastDirectoryHelper.GetHourlyFilePath(folderPath, hourlyForecast.DateTime);
                string? hourlyForecastString = JsonConvert.SerializeObject(hourlyForecast);

                using StreamWriter file = new StreamWriter(filePath, false);
                file.WriteLine(hourlyForecastString);
            }
        }

        private void WriteHourlyForecasts(EnergyForecast forecast, string spotFolder)
        {
            foreach (HourlyEnergy? hourlyForecast in forecast.HourlyForecasts)
            {
                // /Assets/Canggu_Batu_Bolong/2021/01/15/forecastType/
                string folderPath = ForecastDirectoryHelper.GetDayForecastFolderPath(spotFolder, hourlyForecast.DateTime, ForecastType.EnergyForecast);
                EnsureFolder(folderPath);

                // /Assets/Canggu_Batu_Bolong/2021/01/15/forecastType/17.json
                string filePath = ForecastDirectoryHelper.GetHourlyFilePath(folderPath, hourlyForecast.DateTime);
                string? hourlyForecastString = JsonConvert.SerializeObject(hourlyForecast);

                using StreamWriter file = new StreamWriter(filePath, false);
                file.WriteLine(hourlyForecastString);
            }
        }

        private void WriteDaysInfos(SurfForecast forecast, string spotFolder)
        {
            // Get all dates concerned
            List<DateTime>? sunriseDates = forecast.SunriseTimes.Select(f => f.Date).Distinct().ToList();
            List<DateTime>? sunsetDates = forecast.SunsetTimes.Select(f => f.Date).Distinct().ToList();

            // Create list of Days where some info are availables
            List<DateTime>? uniqueDates = sunriseDates.Concat(sunsetDates).Distinct().ToList();
            uniqueDates.Sort((x, y) => x.CompareTo(y));

            foreach (DateTime date in uniqueDates)
            {
                // /Assets/Canggu_Batu_Bolong/2021/01/15/
                string dayFolderPath = ForecastDirectoryHelper.GetDayInfosFolderPath(spotFolder, date);
                EnsureFolder(dayFolderPath);

                // /Assets/Canggu_Batu_Bolong/2021/01/15/dayInfos.json
                string filePath = ForecastDirectoryHelper.GetDayInfosFilePath(dayFolderPath);

                DayData dayInfos;

                if (File.Exists(filePath))
                {
                    string daysInfosString = string.Empty;
                    using (StreamReader reader = new StreamReader(filePath))
                        daysInfosString = reader.ReadToEnd();

                    dayInfos = JsonConvert.DeserializeObject<DayData>(daysInfosString) ?? new DayData();
                }
                else
                {
                    dayInfos = new DayData();
                }

                // Create DayInfos

                DateTime sunriseTime = forecast.SunriseTimes.Find(d => d.Date == date);
                DateTime sunsetTime = forecast.SunsetTimes.Find(d => d.Date == date);

                if (sunriseTime != default)
                    dayInfos.SunriseTime = sunriseTime;
                //else if (dayInfos.SunriseTime == null)
                //    dayInfos.SunriseTime = default;

                if (sunsetTime != default)
                    dayInfos.SunsetTime = sunsetTime;
                //else if (dayInfos.SunsetTime == null)
                //    dayInfos.SunsetTime = default;

                string dayInfosString = JsonConvert.SerializeObject(dayInfos);
                using StreamWriter file = new StreamWriter(filePath, false);
                file.WriteLine(dayInfosString);
            }
        }

        #endregion
        private void EnsureFolder(string folderPath)
        {
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);
        }
    }

    public class ForecastRWOptions
    {
        public string BaseDataDirectory { get; set; } = string.Empty;
    }
}