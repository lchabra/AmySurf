using AmySurf.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AmySurf.Tests.Providers
{
    // TODO: implement
    public class TestForecastProvider : IForecastsProvider
    {
        public async Task<Spot[]> GetSpotsAsync()
        {
            await Task.CompletedTask;
            return new Spot[] { new Spot("IdTest", "SpotTest", 270, 8, new GpsCoordinate(0, 0), Array.Empty<SpotBreakArea>()) };
        }

        public async Task<GetEnergyForecastResponse> GetEnergyForecastAsync(GetForecastRequest request)
        {
            await Task.CompletedTask;
            return new GetEnergyForecastResponse(new EnergyForecast("IdTest", new List<HourlyEnergy>() { new HourlyEnergy(DateTime.UtcNow.Date, 270) }), DateTime.UtcNow.Date);
        }

        public async Task<GetSurfForecastResponse> GetSurfForecastAsync(GetForecastRequest request)
        {
            await Task.CompletedTask;

            return new GetSurfForecastResponse(
                new SurfForecast("IdTest", new List<HourlySurf>() { new HourlySurf()
                {
                    PrimarySwellDirection = 250,
                    WavesSizeMax = 15,
                    DateTime = DateTime.UtcNow.Date,
                    TideType= TideType.NORMAL
                } }, new List<DateTime>() { DateTime.UtcNow.Date }, new List<DateTime>() { DateTime.UtcNow.Date }),
                DateTime.UtcNow);
        }

        public async Task<GetWeatherForecastResponse> GetWeatherForecastAsync(GetForecastRequest request)
        {
            await Task.CompletedTask;
            return new GetWeatherForecastResponse(new WeatherForecast(new List<HourlyWeather>() { new HourlyWeather() { DateTime = DateTime.UtcNow.Date } }, "IdTest"), DateTime.UtcNow.Date);
        }
    }
}
