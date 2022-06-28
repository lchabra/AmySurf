using AmySurf.Providers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Providers
{
    public class ForecastProviderTests
    {
        [Fact]
        public async Task GetForecastTest()
        {
            #region Variables in use

            // Lenght of the Desired forecast
            // TODO: Try with somes Minutes and seconds
            TimeSpan forecastsDuration = new TimeSpan(24, 0, 0);

            // StartDate: Midnight on UTC day
            DateTime startDatetime = DateTime.UtcNow.Date;
            DateTime endDatetime = DateTime.UtcNow.Date + forecastsDuration;

            #endregion

            // Test Core
            // TODO: ASYNC
            ForecastProvider forecastProvider = new ForecastProvider();
            var forecasts = await forecastProvider.GetForecast(startDatetime, endDatetime);

            //Assert.AreEqual();
        }
    }
}
