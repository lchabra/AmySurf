import { ForecastData } from "../models/forecast-grid";
import {
  AppForecastsData,
  HourlyForecast,
  SpotForecast,
  UserSettings,
} from "../models/modelsApp";
import {
  EnergyForecast,
  GetEnergyForecastResponse,
  GetSurfForecastResponse,
  GetWeatherForecastResponse,
  Spot,
  SurfForecast,
  WeatherForecast,
} from "../models/modelsForecasts";
import {
  addHours,
  addMinutes,
  differenceInMinutes,
  getDateMidnight,
  getDateSpotNow,
  getSpotDateTime,
  isSameHour,
} from "./dt";

export function CapitalizeString(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function applyUserSettings(
  forecast: SpotForecast,
  settings: UserSettings
): void {
  applyDurationDaysSettings(forecast, settings.forecastDurationDays);
  applyVisibleTimesSettings(forecast, settings.startHours, settings.endHours);
  applyIntervalSettings(forecast, settings.forecastInterval);
}

function applyVisibleTimesSettings(
  forecast: SpotForecast,
  startHour: number,
  endHour: number
): void {
  if (startHour <= endHour) {
    forecast.data = forecast.data.filter((forecast) => {
      const hours = forecast.dateTime.getHours();
      return hours >= startHour && hours <= endHour;
    });
  } else {
    forecast.data = forecast.data.filter((forecast) => {
      const hours = forecast.dateTime.getHours();
      return hours >= startHour || hours <= endHour;
    });
  }
}
function applyIntervalSettings(forecast: SpotForecast, interval: number): void {
  forecast.data = forecast.data.filter((_, i) => i % interval === 0);
}

function applyDurationDaysSettings(
  forecast: SpotForecast,
  forecastDurationDays: number
) {
  const spotNow = getDateSpotNow(forecast.spot.utcOffset);
  const startTime = getDateMidnight(spotNow);
  const endTime = addHours(startTime, 24 * forecastDurationDays - 1);
  forecast.data = forecast.data.filter(
    (f) =>
      f.dateTime.valueOf() >= startTime.valueOf() &&
      f.dateTime.valueOf() <= endTime.valueOf()
  );
}

export function isForecastFresh(
  lastUpdateDate: Date,
  freshnessMinutes: number
): boolean {
  return differenceInMinutes(lastUpdateDate) <= freshnessMinutes;
}

export function getCardinalDirection(angle: number) {
  var directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  var index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
  return directions[index];
}

function getSpotSunDate(sunTimes: string, spotUtcOffset: number): Date {
  const utcSunDate = new Date(sunTimes);
  const localToUtcHours = utcSunDate.getTimezoneOffset() / 60;
  const localSunDate = addHours(utcSunDate, localToUtcHours);
  const spotSunDate = addHours(localSunDate, spotUtcOffset);
  return spotSunDate;
}

export function formatSpotForecast(
  spot: Spot,
  surf?: GetSurfForecastResponse,
  weather?: GetWeatherForecastResponse,
  energy?: GetEnergyForecastResponse
): SpotForecast {
  const data = getHourlyForecastsData(
    spot.utcOffset,
    surf?.forecast,
    energy?.forecast,
    weather?.forecast
  );

  return {
    updateTime: new Date(surf?.timestamp ?? 0),
    spot: spot,
    sunriseTimes:
      surf?.forecast?.sunriseTimes?.map((s: string) =>
        getSpotSunDate(s, spot.utcOffset)
      ) ?? [],
    sunsetTimes:
      surf?.forecast?.sunsetTimes?.map((s: string) =>
        getSpotSunDate(s, spot.utcOffset)
      ) ?? [],
    data: data,
    allData: data,
  };
}

export function interpolateNumber(
  percent: number,
  numberOne: number,
  numberTwo: number
) {
  return numberOne + ((numberTwo - numberOne) * percent) / 100;
}

export function interpolateHourlyForecast(
  percent: number,
  hourlyForecast: HourlyForecast,
  nextHourlyForecast: HourlyForecast
): HourlyForecast {
  const interpolatedHourlyForecast: HourlyForecast = {
    dateTime: addMinutes(new Date(hourlyForecast.dateTime), percent * 60),
    wavesSizeMin: interpolateNumber(
      percent,
      hourlyForecast.wavesSizeMin,
      nextHourlyForecast.wavesSizeMin
    ),
    wavesSizeMax: interpolateNumber(
      percent,
      hourlyForecast.wavesSizeMax,
      nextHourlyForecast.wavesSizeMax
    ),
    wavesSizeAverage: interpolateNumber(
      percent,
      hourlyForecast.wavesSizeAverage,
      nextHourlyForecast.wavesSizeAverage
    ),
    primarySwellPeriod: interpolateNumber(
      percent,
      hourlyForecast.primarySwellPeriod,
      nextHourlyForecast.primarySwellPeriod
    ),
    primarySwellDirection: interpolateNumber(
      percent,
      hourlyForecast.primarySwellDirection,
      nextHourlyForecast.primarySwellDirection
    ),
    secondarySwellPeriod: interpolateNumber(
      percent,
      hourlyForecast.secondarySwellPeriod,
      nextHourlyForecast.secondarySwellPeriod
    ),
    secondarySwellDirection: interpolateNumber(
      percent,
      hourlyForecast.secondarySwellDirection,
      nextHourlyForecast.secondarySwellDirection
    ),
    longestSwellPeriod: interpolateNumber(
      percent,
      hourlyForecast.longestSwellPeriod,
      nextHourlyForecast.longestSwellPeriod
    ),
    longestSwellDirection: interpolateNumber(
      percent,
      hourlyForecast.longestSwellDirection,
      nextHourlyForecast.longestSwellDirection
    ),
    windDirection: interpolateNumber(
      percent,
      hourlyForecast.windDirection,
      nextHourlyForecast.windDirection
    ),
    windDirectionCardinal:
      percent > 50
        ? hourlyForecast.windDirectionCardinal
        : nextHourlyForecast.windDirectionCardinal,
    windSpeed: interpolateNumber(
      percent,
      hourlyForecast.windSpeed,
      nextHourlyForecast.windSpeed
    ),
    isTideRising: hourlyForecast.tideHeight <= nextHourlyForecast.tideHeight,
    tideHeight: interpolateNumber(
      percent,
      hourlyForecast.tideHeight,
      nextHourlyForecast.tideHeight
    ),
    tideHeightPerOne: interpolateNumber(
      percent,
      hourlyForecast.tideHeightPerOne,
      nextHourlyForecast.tideHeightPerOne
    ),
    energy: interpolateNumber(
      percent,
      hourlyForecast.energy,
      nextHourlyForecast.energy
    ),
    weatherDescriptionId:
      percent > 50
        ? hourlyForecast.weatherDescriptionId
        : nextHourlyForecast.weatherDescriptionId,
    rainMm: interpolateNumber(
      percent,
      hourlyForecast.rainMm,
      nextHourlyForecast.rainMm
    ),
    temperature: interpolateNumber(
      percent,
      hourlyForecast.temperature,
      nextHourlyForecast.temperature
    ),
    cloudCoverage: interpolateNumber(
      percent,
      hourlyForecast.cloudCoverage,
      nextHourlyForecast.cloudCoverage
    ),
    description:
      percent > 50
        ? hourlyForecast.description
        : nextHourlyForecast.description,
  };

  return interpolatedHourlyForecast;
}

// surfForecast.hourly... is the timebase
export function getHourlyForecastsData(
  utcOffset: number,
  surfForecast?: SurfForecast,
  energyForecast?: EnergyForecast,
  weatherForecast?: WeatherForecast
): HourlyForecast[] {
  let hourlyForecast: HourlyForecast[] = [];
  surfForecast?.hourlyForecasts.forEach((hourlySurf) => {
    const hourlyEnergy = energyForecast?.hourlyForecasts.find(
      (e) => e.dateTime === hourlySurf.dateTime
    );
    const hourlyWeather = weatherForecast?.hourlyForecasts.find(
      (w) => w.dateTime === hourlySurf.dateTime
    );

    let data: HourlyForecast = {
      dateTime: getSpotDateTime(new Date(hourlySurf.dateTime), utcOffset),
      wavesSizeMin: hourlySurf.wavesSizeMin,
      wavesSizeMax: hourlySurf.wavesSizeMax,
      wavesSizeAverage: (hourlySurf.wavesSizeMin + hourlySurf.wavesSizeMax) / 2,
      primarySwellPeriod:
        hourlySurf.primarySwellPeriod <= 0
          ? NaN
          : hourlySurf.primarySwellPeriod,
      primarySwellDirection:
        hourlySurf.primarySwellPeriod <= 0
          ? NaN
          : hourlySurf.primarySwellDirection,
      secondarySwellPeriod:
        hourlySurf.secondarySwellPeriod <= 0
          ? NaN
          : hourlySurf.secondarySwellPeriod,
      secondarySwellDirection:
        hourlySurf.secondarySwellPeriod <= 0
          ? NaN
          : hourlySurf.secondarySwellDirection,
      longestSwellPeriod:
        hourlySurf.longestSwellPeriod <= 0
          ? NaN
          : hourlySurf.longestSwellPeriod,
      longestSwellDirection:
        hourlySurf.longestSwellPeriod <= 0
          ? NaN
          : hourlySurf.longestSwellDirection,
      windDirection:
        hourlySurf.windSpeed > 0 ? Math.round(hourlySurf.windDirection) : NaN,
      windDirectionCardinal: getCardinalDirection(hourlySurf.windDirection),
      windSpeed:
        hourlySurf.windSpeed > 0 ? Math.round(hourlySurf.windSpeed) : NaN,
      isTideRising: hourlySurf.isTideRising,
      tideHeight: hourlySurf.tideHeight,
      tideHeightPerOne: hourlySurf.tideHeightPercent,
      energy: hourlyEnergy?.energy ?? NaN,
      weatherDescriptionId: hourlyWeather?.weatherDescriptionId ?? NaN,
      rainMm: Math.round(hourlyWeather?.rainMm ?? NaN),
      temperature: Math.round(hourlyWeather?.temperature ?? NaN),
      cloudCoverage: Math.round(hourlyWeather?.cloudCoverage ?? NaN),
      description: hourlyWeather?.description ?? NaN,
    };

    hourlyForecast.push(data);
  });
  return hourlyForecast;
}

export function getAppForecastsData(
  settings: UserSettings,
  errors: string[],
  spot: Spot | undefined,
  spotsResponse: Spot[] | undefined,
  surfResponse: GetSurfForecastResponse | undefined,
  weatherResponse: GetWeatherForecastResponse | undefined,
  energyResponse: GetEnergyForecastResponse | undefined
): AppForecastsData {
  if (spot === undefined || surfResponse === undefined)
    return {
      date: new Date(0),
      errors: errors,
      spots: spotsResponse,
      spotForecast: undefined,
    };
  const updatedSpot = spotsResponse?.find((s) => spot.id === s.id) ?? spot;

  let spotForecast = formatSpotForecast(
    updatedSpot,
    surfResponse,
    weatherResponse,
    energyResponse
  );
  applyUserSettings(spotForecast, settings);

  const appForecastsData = {
    date: new Date(surfResponse.timestamp),
    errors: errors,
    spots: spotsResponse,
    spotForecast: spotForecast,
  };

  return appForecastsData;
}

export function getNowSpotForecast(spotForecasts: SpotForecast) {
  const datespot = getDateSpotNow(spotForecasts.spot.utcOffset);
  const closestHourlyforecast = spotForecasts?.allData.find((f) =>
    isSameHour(f.dateTime, datespot)
  );
  const hourlyForecastNextHour = spotForecasts?.allData.find((f) =>
    isSameHour(f.dateTime, addHours(datespot, 1))
  );

  let nowForecast: HourlyForecast | undefined = closestHourlyforecast;

  if (
    hourlyForecastNextHour !== undefined &&
    closestHourlyforecast !== undefined
  ) {
    const percent = (datespot.getMinutes() * 100) / 60;
    nowForecast = interpolateHourlyForecast(
      percent,
      closestHourlyforecast,
      hourlyForecastNextHour
    );
  }
  return nowForecast;
}

export function isTideRising(
  forecastData: ForecastData,
  valueProvider: (data: ForecastData) => number
): boolean | undefined {
  if (forecastData.spotForecast.data.length === 1) {
    return undefined;
  }

  const indexHourlyForecast = forecastData.spotForecast.data.indexOf(
    forecastData.hourlyForecast
  );
  const rowValue = valueProvider(forecastData);

  // First Forecast, we check with next forecast
  if (indexHourlyForecast === 0) {
    const nextRowValue = valueProvider({
      ...forecastData,
      hourlyForecast: forecastData.spotForecast.data[indexHourlyForecast + 1],
    });
    return rowValue < nextRowValue;
  } else {
    // Compare with previous forecast
    const prevRowValue = valueProvider({
      ...forecastData,
      hourlyForecast: forecastData.spotForecast.data[indexHourlyForecast - 1],
    });
    return prevRowValue < rowValue;
  }
}

// function getSwell(
//   primarySwellPeriod: number,
//   secondarySwellPeriod: number,
//   primarySwellDirection: number,
//   secondarySwellDirection: number
// ): { period: number; direction: number } {
//   let period: number;
//   let direction: number;

//   if (primarySwellPeriod >= secondarySwellPeriod) {
//     period = primarySwellPeriod >= 0 ? primarySwellPeriod : NaN;
//     direction = primarySwellDirection >= 0 ? primarySwellDirection : NaN;
//   } else {
//     period = secondarySwellPeriod >= 0 ? secondarySwellPeriod : NaN;
//     direction = secondarySwellDirection >= 0 ? secondarySwellDirection : NaN;
//   }

//   return { period, direction };
// }

export function isBasicForecastRow(id: string): boolean {
  if (
    id === "primarySwell" ||
    id === "secondarySwell" ||
    id === "weatherTemperature" ||
    id === "rain" ||
    id === "cloudCoverage" ||
    id === "rainMm"
  )
    return false;
  else return true;
}
