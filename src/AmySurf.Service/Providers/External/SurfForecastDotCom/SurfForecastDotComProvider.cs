using AmySurf.Helpers;
using AmySurf.Models;
using HtmlAgilityPack;
using System.Globalization;

namespace AmySurf.Providers.External;

internal sealed class SurfForecastDotComProvider : IEnergyForecastsProvider
{
    private readonly SpotProvider _spotProvider;
    private readonly HttpClientHelper _httpClientHelper;
    private const string apiUri = "https://www.surf-forecast.com/breaks/{0}/forecasts/latest";

    public SurfForecastDotComProvider(SpotProvider spotProvider, HttpClientHelper httpClientProvider)
    {
        _spotProvider = spotProvider;
        _httpClientHelper = httpClientProvider;
    }

    public async Task<GetEnergyForecastResponse> GetForecastAsync(string spotId)
    {
        EnergyForecast raw = await GetEnergyCoreAsync(spotId).ConfigureAwait(false);

        if (raw.HourlyForecasts.Count == 0)
            return new GetEnergyForecastResponse(new EnergyForecast(spotId, new List<HourlyEnergy>()), default);

        SurfForecastDotComAdapter.GetAllEnergy(raw);

        return new GetEnergyForecastResponse(raw, DateTime.UtcNow);
    }

    private async Task<EnergyForecast> GetEnergyCoreAsync(string spotId)
    {
        Spot? spot = _spotProvider.GetSpot(spotId);
        SurfForecastDotComSpotOptions? providerSpotOptions = (SurfForecastDotComSpotOptions)spot.ProvidersOptions.First(p => p.GetType() == typeof(SurfForecastDotComSpotOptions));
        string? apiSpotId = providerSpotOptions.SpotId;

        Uri? uri = new Uri(string.Format(CultureInfo.CurrentCulture, apiUri, apiSpotId));

        HttpResponseMessage response = await _httpClientHelper.GetResponseMessageAsync(uri).ConfigureAwait(false);

        if (!response.IsSuccessStatusCode)
        {
            //Console.WriteLine("ERROR: Can't fetch Energy");
            return new EnergyForecast(spotId, new List<HourlyEnergy>());
        }
        string? responseString = await response.Content.ReadAsStringAsync().ConfigureAwait(true);

        HtmlDocument? htmlDoc = new HtmlDocument();
        htmlDoc.LoadHtml(responseString);

        HtmlNodeCollection energiesNodes = htmlDoc.DocumentNode.SelectNodes("//tr[@data-row-name = 'energy']/td");
        HtmlNodeCollection timeNodes = htmlDoc.DocumentNode.SelectNodes("//tr[@data-row-name = 'time']/td");

        // Debug energy
        HtmlNodeCollection dateNodes1 = htmlDoc.DocumentNode.SelectNodes("//tr[@data-row-name = 'wave-height']/td");
        List<int> daysList = GetDaysList(dateNodes1);

        EnergyForecast energyForecast = new EnergyForecast(spotId, new List<HourlyEnergy>());

        for (int i = 0; i < energiesNodes.Count; i++)
        {
            string? energy = energiesNodes[i].InnerText;

            string? time = timeNodes[i].FirstChild.InnerText;
            string? ampm = timeNodes[i].InnerText.Split(';')[1];
            string? timeFull = string.Concat(time, ampm);

            int time24h;
            if (ampm == "PM")
                time24h = int.Parse(time) + 12;
            else
                time24h = int.Parse(time);

            int utcOffset = _spotProvider.GetSpots().First(s => s.Id == spotId).UtcOffset;
            int dayNumber = daysList[i];

            // Detect Month
            DateTime forecastUtcDate = GetForecastUtcTime(utcOffset, time24h, dayNumber);

            HourlyEnergy? hourlyenergy = new HourlyEnergy(forecastUtcDate, int.Parse(energy));
            energyForecast.HourlyForecasts.Add(hourlyenergy);
        }

        return energyForecast;
    }

    private static List<int> GetDaysList(HtmlNodeCollection dateNodes1)
    {
        List<int> listDaysNumber = new List<int>();
        foreach (var item in dateNodes1)
        {
            var outerHtml = item.OuterHtml;
            var index = outerHtml.IndexOf("data-date");

            var dateRaw = Between(outerHtml, "data-date", "data-swell");
            var day = Between(dateRaw, " ", " ");
            listDaysNumber.Add(int.Parse(day));
            //  "=\"Thursday 27 5AM\" "
        }

        static string Between(string str, string firstString, string lastString)
        {
            int pos1 = str.IndexOf(firstString) + firstString.Length;
            int pos2 = str[pos1..].IndexOf(lastString);
            return str.Substring(pos1, pos2);
        }

        return listDaysNumber;
    }

    private static DateTime GetForecastUtcTime(int locationUtcOffset, int forecastHourTime, int dayNumber)
    {
        List<DateTime> twoWeeksDates = DateTimeHelper.GetAllDaysBetweenDates(
            DateTime.UtcNow.Date - new TimeSpan(12, 0, 0, 0),
            DateTime.UtcNow.Date + new TimeSpan(12, 0, 0, 0));

        DateTime dateForecast = twoWeeksDates.First(d => d.Day == dayNumber);

        return dateForecast + new TimeSpan(forecastHourTime, 0, 0) - new TimeSpan(locationUtcOffset, 0, 0);
    }
}

public sealed record SurfForecastDotComSpotOptions(string SpotId) : IDataProviderSpotOptions;
