using System;

namespace AmySurf.Models
{
    public sealed class GetForecastRequest
    {
        public GetForecastRequest()
        {
            SpotId = string.Empty;
        }

        public GetForecastRequest(string spotId, DateTime startTime, DateTime endTime)
        {
            SpotId = spotId;
            StartTime = startTime;
            EndTime = endTime;
        }

        public string SpotId { get; set; }

        /// <summary>
        /// Utc time
        /// </summary>
        /// <value></value>
        public DateTime StartTime { get; set; }
        
        /// <summary>
        /// Utc time
        /// </summary>
        /// <value></value>
        public DateTime EndTime { get; set; }
    }
}
