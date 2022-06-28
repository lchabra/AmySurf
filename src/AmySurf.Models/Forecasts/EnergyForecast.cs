using System;
using System.Collections.Generic;

namespace AmySurf.Models
{
    public sealed class EnergyForecast
    {
        public EnergyForecast(string spotId, List<HourlyEnergy> energies)
        {
            HourlyForecasts = energies;
            SpotId = spotId;
        }
        public static EnergyForecast Empty { get; } = new EnergyForecast(string.Empty, new List<HourlyEnergy>());
        public string SpotId { get; set; }
        public List<HourlyEnergy> HourlyForecasts { get; set; }
    }

    public sealed class HourlyEnergy
    {
        public HourlyEnergy(DateTime dateTime, int energy)
        {
            DateTime = dateTime;
            Energy = energy;
        }
        public static HourlyEnergy Empty { get; } = new HourlyEnergy(DateTime.UnixEpoch, -1);

        /// <summary>
        /// Local time?. Maybe only the hour is important and we can switch to
        /// int call `Hour`?
        /// This keeps data small an easy.
        public DateTime DateTime { get; set; }

        public int Energy { get; set; }
    }

    public class GetEnergyForecastResponse
    {
        public GetEnergyForecastResponse(EnergyForecast forecast, DateTime timestamp)
        {
            Forecast = forecast;
            TimeStamp = timestamp;
        }
      
        public DateTime TimeStamp { get; set; }
        public EnergyForecast Forecast { get; set; }
    }
}
