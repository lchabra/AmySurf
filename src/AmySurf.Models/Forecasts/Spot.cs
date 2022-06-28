using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace AmySurf.Models
{
    public sealed class Spot
    {
        public Spot(string id, string name, int coastOrientation, int utcOffset, GpsCoordinate gpsCoordinate, SpotBreakArea[] spotBreakAreas)
        {
            Id = id;
            Name = name;
            CoastOrientation = coastOrientation;
            UtcOffset = utcOffset;
            GpsCoordinate = gpsCoordinate;
            SpotBreakAreas = spotBreakAreas;
        }
        public string Id { get; set; }
        public string Name { get; set; }
        public GpsCoordinate GpsCoordinate { get; set; }
        public int CoastOrientation { get; set; }
        public int UtcOffset { get; set; }
        public SpotBreakArea[] SpotBreakAreas { get; set; }

        [JsonIgnore]
        // TODO: discuss that. This hackish.
        public List<IDataProviderSpotOptions> ProvidersOptions { get; } = new List<IDataProviderSpotOptions>();
    }

    public sealed class GpsCoordinate
    {
        public double Latitude { get; }
        public double Longitude { get; }

        public GpsCoordinate(double latitude, double longitude)
        {
            Latitude = latitude;
            Longitude = longitude;
        }
    }

    public sealed class SpotBreakArea
    {
        /// <summary>
        /// Color value must be Hexadecimal value.
        /// </summary>
        /// <param name="strokeWidth"></param>
        /// <param name="strokeColor"></param>
        /// <param name="fillColor"></param>
        /// <param name="geopath"></param>
        public SpotBreakArea(int strokeWidth, string strokeColor, string fillColor, GpsCoordinate[] geopath)
        {
            StrokeWidth = strokeWidth;
            StrokeColor = strokeColor;
            FillColor = fillColor;
            Geopath = geopath;
        }

        public int StrokeWidth { get; set; }

        /// <summary>
        /// Hexadecimal color value.
        /// </summary>
        /// <value></value>
        public string StrokeColor { get; set; }
        /// <summary>
        /// Hexadecimal color value.
        /// </summary>
        /// <value></value>
        public string FillColor { get; set; }
        public GpsCoordinate[] Geopath { get; set; }
    }

    public class SpotProvider
    {
        public Spot[] GetSpots() => _spots.ToArray();
        public Spot GetSpot(string spotId) => _spots.First(s => s.Id == spotId);
        private readonly List<Spot> _spots = Spots.GetSpots();
    }
}
