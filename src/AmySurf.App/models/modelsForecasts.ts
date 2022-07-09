// #region API SurfForecast
export type GetSurfForecastResponse = {
    timestamp: string
    forecast: SurfForecast
}

export type SurfForecast = {
    spotId: string
    hourlyForecasts: HourlySurf[]
    sunriseTimes: string[]
    sunsetTimes: string[]
}

export type HourlySurf = {
    dateTime: string
    wavesSizeMin: number
    wavesSizeMax: number
    primarySwellPeriod: number
    primarySwellDirection: number
    secondarySwellPeriod: number
    secondarySwellDirection: number
    longestSwellPeriod: number
    longestSwellDirection: number
    windDirection: number
    windSpeed: number
    tideHeight: number
    tideHeightPercent: number
    tideType: number
    isTideRising: boolean
}
// #endregion

// #region API Weather
export type GetWeatherForecastResponse = {
    timestamp: string
    forecast: WeatherForecast
}

export type WeatherForecast = {
    spotId: string
    hourlyForecasts: HourlyWeather[]
}

export type HourlyWeather = {
    dateTime: string
    weatherDescriptionId: number
    rainMm: number
    temperature: number
    cloudCoverage: number
    description: number
}
// #endregion

// #region API Energy
export type GetEnergyForecastResponse = {
    timeStamp: string
    forecast: EnergyForecast
}

export type EnergyForecast = {
    spotId: string
    hourlyForecasts: HourlyEnergy[]
}

export type HourlyEnergy = {
    dateTime: string
    energy: number
}
// #endregion

// #region API Spots
export type Spots = {
    spots: Spot[]
}

export type Spot = {
    id: string
    name: string
    gpsCoordinate: GpsCoordinate
    coastOrientation: number
    utcOffset: number
    spotBreakAreas: SpotBreakArea[]
}

export type GpsCoordinate = {
    latitude: number
    longitude: number
}

export type SpotBreakArea = {
    geopath: GpsCoordinate[]
}
// #endregion
