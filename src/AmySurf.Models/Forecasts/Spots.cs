namespace AmySurf.Models;

/// <summary>
/// Later on, spot should be in a JSON file
/// </summary>
public static class Spots
{
    public static List<Spot> GetSpots() => new List<Spot>() { GetCangguBatuBolong(), GetPererenan() };

    private static Spot GetPererenan()
    {
        return new Spot(
                        "Bali_Pererenan",
                        "Pererenan",
                        coastOrientation: 140,
                        utcOffset: 8,
                        gpsCoordinate: new GpsCoordinate(-8.651931751993413, 115.12110852956455),
                        spotBreakAreas: Array.Empty<SpotBreakArea>()
                    )
        {
            ProvidersOptions =
            {
                { new SurflineSpotOptions(SpotId: "5842041f4e65fad6a7708d40")},
                { new OpenWeatherProviderSpotOptions(SpotId: "7334510", Latitude: -8.651931, Longitude: 115.121108)},
                { new SurfForecastDotComSpotOptions(SpotId: "Pererenan")},
            }
        };
    }

    private static Spot GetCangguBatuBolong()
    {
        return new Spot(
                        "Bali_Canggu_Batu_Bolong",
                        "Batu Bolong",
                        coastOrientation: 140,
                        utcOffset: 8,
                        gpsCoordinate: new GpsCoordinate(-8.659473106203592, 115.13013523130488),
                        spotBreakAreas: new SpotBreakArea[3]
                            {
                    new SpotBreakArea(
                        4,
                        "#FFFFFF",
                        "#881BA1E2"
                        ,new GpsCoordinate[4]
                            {
                                new GpsCoordinate (-8.660509770667506, 115.12899493970825),
                                new GpsCoordinate (-8.660037274694549, 115.12869527560608),
                                new GpsCoordinate (-8.65891603187572, 115.12925287842909),
                                new GpsCoordinate (-8.660309604392049, 115.13065795771773)
                            }),
                    new SpotBreakArea(
                        4,
                        "#FFFFFF",
                        "#881BA1E2"
                        ,new GpsCoordinate[4]
                            {
                                new GpsCoordinate (-8.661691326249585, 115.1309473893718),
                                new GpsCoordinate (-8.661456517593242, 115.1306598768697),
                                new GpsCoordinate (-8.660426990632965, 115.13080335130158),
                                new GpsCoordinate (-8.66120126484653, 115.1317984508768)
                            }),
                    new SpotBreakArea(
                        2,
                        "#FFFFFF",
                        "#ff7f50"
                        ,new GpsCoordinate[4]
                            {
                                new GpsCoordinate (-8.660675189074007, 115.13134478480698),
                                new GpsCoordinate (-8.660490901091457, 115.13160630019208),
                                new GpsCoordinate (-8.660591662877255, 115.13177393825947),
                                new GpsCoordinate (-8.660834949446217, 115.13152650447202)
                            })
                            })
        {
            ProvidersOptions =
            {
                {new SurflineSpotOptions(SpotId: "5842041f4e65fad6a7708d40")},
                {new OpenWeatherProviderSpotOptions(SpotId:"7334510", Latitude:-8.661587, Longitude:115.130649)},
                {new SurfForecastDotComSpotOptions(SpotId:"Canggu")},
            }
        };
    }

}