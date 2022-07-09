using AmySurf.Models;

namespace AmySurf.Providers.External;

internal static class SurfForecastDotComAdapter
{
    internal static void GetAllEnergy(EnergyForecast energy)
    {
        int intervalWantedS = 3600;

        List<HourlyEnergy>? energyFull = new List<HourlyEnergy>(energy.HourlyForecasts);

        for (int i = 0; i < energy.HourlyForecasts.Count - 1; i++)
        {
            HourlyEnergy? e1 = energy.HourlyForecasts[i];
            HourlyEnergy? e2 = energy.HourlyForecasts[i + 1];
            System.TimeSpan deltaT = e2.DateTime - e1.DateTime;
            double intervalActual = deltaT.TotalSeconds;

            if (intervalActual > intervalWantedS)
            {
                int interval = (int)(intervalActual / intervalWantedS);
                int missingForecastCount = interval - 1;

                for (int u = 1; u <= missingForecastCount; u++)
                {
                    double coefCorr = (double)u / (double)interval;

                    System.DateTime newDateTime = e1.DateTime + (coefCorr * deltaT);
                    double newEnergy = e1.Energy + ((e2.Energy - e1.Energy) * coefCorr);

                    HourlyEnergy? hourlyEnergy = new HourlyEnergy(newDateTime, (int)newEnergy);
                    energyFull.Add(hourlyEnergy);
                }
            }
        }

        energyFull.Sort((x, y) => x.DateTime.CompareTo(y.DateTime));

        energy.HourlyForecasts = energyFull;
    }
}
