using Microsoft.Extensions.Logging;

namespace AmySurf.Service.Logging;

public static partial class Log
{
    #region BackGround Service

    [LoggerMessage(
        EventId = 100,
        Level = LogLevel.Information,
        Message = "Forecasts update start")]
    public static partial void ForecastsUpdateStart(
        ILogger logger);

    [LoggerMessage(
       EventId = 101,
       Level = LogLevel.Information,
       Message = "Forecasts update finish")]
    public static partial void ForecastsUpdateFinish(
        ILogger logger);

    [LoggerMessage(
        EventId = 102,
        Level = LogLevel.Information,
        Message = "{Spot} Forecasts update start")]
    public static partial void SpotForecastsUpdateStart(
        ILogger logger,
        string spot);

    [LoggerMessage(
       EventId = 103,
       Level = LogLevel.Information,
       Message = "{Spot} Forecasts update finish")]
    public static partial void SpotForecastsUpdateFinish(
        ILogger logger,
        string spot);

    [LoggerMessage(
        EventId = 104,
        Level = LogLevel.Information,
        Message = "{Spot} {ForecastType} update finish")]
    public static partial void ForecastTypeUpdateFinish(
        ILogger logger,
        string spot,
        string forecastType);

    [LoggerMessage(
        EventId = 109,
        Level = LogLevel.Error,
        Message = "{Spot} {ForecastType} update fail")]
    public static partial void ForecastTypeUpdateFail(
        ILogger logger,
        string spot,
        string forecastType,
        Exception exception);

    #endregion

    #region ApiController

    [LoggerMessage(
        EventId = 209,
        Level = LogLevel.Warning,
        Message = "Api Controller Error : {Message}")]
    public static partial void ApiControllerError(
        ILogger logger,
        string message);

    [LoggerMessage(
        EventId = 200,
        Level = LogLevel.Information,
        Message = "Api Controller: {spot} {TypeOfForecastRequested} request")]
    public static partial void ApiControllerForecastRequest(
        ILogger logger,
        string spot,
        string typeOfForecastRequested);

    [LoggerMessage(
        EventId = 201,
        Level = LogLevel.Information,
        Message = "Api Controller: spots request")]
    public static partial void ApiControllerSpotsRequest(
        ILogger logger);
 
    #endregion
}
