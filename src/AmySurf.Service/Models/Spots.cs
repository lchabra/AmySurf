using AmySurf.Providers.External;

namespace AmySurf.Models;

/// <summary>
/// Later on, spot should be in a JSON file
/// </summary>
public static class Spots
{
    public static List<Spot> GetSpots() => new List<Spot>() { GetCangguBatuBolong(), GetPererenan(), GetCangguBerawa(), GetPlayaHermosa(), GetSantaTeresa(), GetPlayaCarmen() };


    private static Spot GetCangguBerawa()
    {
        return new Spot(
                        "Bali_Canggu_Berawa",
                        "Berawa",
                        coastOrientation: 140,
                        utcOffset: 8,
                        gpsCoordinate: new GpsCoordinate(-8.663711789092678, 115.13594097831295),
                        spotBreakAreas: Array.Empty<SpotBreakArea>()
                    )
        {
            ProvidersOptions =
            {
                { new SurflineSpotOptions(SpotId: "6051139a7c51e500d72c538e")},
                { new OpenWeatherProviderSpotOptions(Latitude: -8.663711789092678, Longitude: 115.13594097831295)},
                { new SurfForecastDotComSpotOptions(SpotId: "Canggu")},
            }
        };
    }

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
                { new SurflineSpotOptions(SpotId: "6269dc2c491aa9ad66235f52")},
                { new OpenWeatherProviderSpotOptions(Latitude: -8.651931, Longitude: 115.121108)},
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
                        gpsCoordinate: new GpsCoordinate(-8.6588453139427, 115.13013573259046),
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
                {new SurflineSpotOptions(SpotId: "605112930a374f33cf5f8f05")},
                {new OpenWeatherProviderSpotOptions(Latitude:-8.6588453139427, Longitude:115.13013573259046)},
                {new SurfForecastDotComSpotOptions(SpotId:"Canggu")},
            }
        };
    }
    private static Spot GetPlayaHermosa()
    {
        return new Spot(
                        "Costa_Rica_Nicoya_Playa_Hermosa",
                        "Nicoya Hermosa",
                        coastOrientation: 140,
                        utcOffset: -6,
                        gpsCoordinate: new GpsCoordinate(9.665555696463986, -85.19181564484956),
                        spotBreakAreas: Array.Empty<SpotBreakArea>()
                    )
        {
            ProvidersOptions =
            {
                { new SurflineSpotOptions(SpotId: "645c2ffad729fd6b3b156571")},
                { new OpenWeatherProviderSpotOptions(Latitude: 9.665555696463986, Longitude: -85.19181564484956)},
                { new SurfForecastDotComSpotOptions(SpotId: "Mal-Pais-Santa-Teresa")},
            }
        };
    }

    private static Spot GetSantaTeresa()
    {
        return new Spot(
                        "Costa_Rica_Nicoya_Santa_Teresa",
                        "Nicoya Teresa",
                        coastOrientation: 140,
                        utcOffset: -6,
                        gpsCoordinate: new GpsCoordinate(9.641682390120561, -85.16902841232996),
                        spotBreakAreas: Array.Empty<SpotBreakArea>()
                    )
        {
            ProvidersOptions =
            {
                { new SurflineSpotOptions(SpotId: "5842041f4e65fad6a7708e31")},
                { new OpenWeatherProviderSpotOptions(Latitude: 9.641682390120561, Longitude: -85.16902841232996)},
                { new SurfForecastDotComSpotOptions(SpotId: "Playa-Santa-Teresa")},
            }
        };
    }

    private static Spot GetPlayaCarmen()
    {
        return new Spot(
                        "Costa_Rica_Nicoya_Playa_Carmen",
                        "Nicoya Carmen",
                        coastOrientation: 140,
                        utcOffset: -6,
                        gpsCoordinate: new GpsCoordinate(9.62768729404784, -85.15408391567247),
                        spotBreakAreas: Array.Empty<SpotBreakArea>()
                    )
        {
            ProvidersOptions =
            {
                { new SurflineSpotOptions(SpotId: "640a2d2899dd446363fe7bdc")},
                { new OpenWeatherProviderSpotOptions( Latitude: 9.62768729404784, Longitude: -85.15408391567247)},
                { new SurfForecastDotComSpotOptions(SpotId: "El-Carmen")},
            }
        };
    }
}