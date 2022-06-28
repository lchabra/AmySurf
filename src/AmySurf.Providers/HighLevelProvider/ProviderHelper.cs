using System;
using System.Collections.Generic;
using System.Text;

namespace AmySurf.Providers
{
    public static class ProviderHelper
    {
        internal static readonly TimeSpan MaxAgeOfFreshForecast = TimeSpan.FromHours(3);
    }
}
