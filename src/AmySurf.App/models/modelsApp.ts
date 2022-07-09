import { RatingGroup } from "../contexts/useNostr";
import { isBasicForecastRow } from "../helpers/forecastHelper";
import { allRows } from "./forecast-grid";
import { Spot } from "./modelsForecasts";

export enum RoutePath {
  "/" = "/",
  "*" = "*",
  Forecasts = "/forecasts",
  Settings = "/settings",
  Spots = "/spots",
}

export enum ThemeColor {
  dark = "dark",
  light = "light",
}

export type AppForecastsData = {
  date: Date;
  errors: string[];
  spots: Spot[] | undefined;
  spotForecast: SpotForecast | undefined;
};

export type SpotForecast = {
  updateTime: Date;
  spot: Spot;
  sunriseTimes: Date[];
  sunsetTimes: Date[];
  data: HourlyForecast[];
  allData: HourlyForecast[];
};

export type HourlyForecast = {
  dateTime: Date;
  //Surf
  wavesSizeMin: number;
  wavesSizeMax: number;
  wavesSizeAverage: number;
  primarySwellPeriod: number;
  primarySwellDirection: number;
  secondarySwellPeriod: number;
  secondarySwellDirection: number;
  longestSwellPeriod: number;
  longestSwellDirection: number;
  windDirection: number;
  windDirectionCardinal: string;
  windSpeed: number;
  isTideRising: boolean;
  tideHeight: number;
  tideHeightPerOne: number;
  // Energy
  energy: number;
  // Weather
  weatherDescriptionId: number;
  rainMm: number;
  temperature: number;
  cloudCoverage: number;
  description: number;
  ratings?: RatingGroup[];
};

// TODO:  const = x | y | z
export enum MapSize {
  Disable = "Disable",
  Small = "Small",
  Medium = "Medium",
  Fullscreen = "Fullscreen",
}

export type UserSettings = {
  readonly denseLabel: boolean;
  readonly endHours: number;
  readonly forecastInterval: number;
  readonly forecastDurationDays: number;
  readonly refreshIntervalMinutes: number;
  readonly language: string;
  readonly spotName: string;
  readonly mapSize: MapSize;
  readonly startHours: number;
  readonly favoriteSpots: Spot[];
  readonly rowVisibility: RowVisibility[];
  readonly serverUrl: string;
  readonly fontSizePercent: number;
  readonly themeColor: ThemeColor;
  readonly wavesSizePrefered: number;
};

export type RowVisibility = { id: string; isVisible: boolean };
export const defaultRowsVisibility: RowVisibility[] = allRows.map((x) => ({
  id: x.id,
  isVisible: isBasicForecastRow(x.id),
}));

export const DefaultUserSettings: UserSettings = {
  fontSizePercent: 100,
  language: "en",
  forecastInterval: 1,
  forecastDurationDays: 3,
  startHours: 5,
  endHours: 20,
  refreshIntervalMinutes: 180,
  denseLabel: false,
  spotName: "",
  favoriteSpots: [],
  mapSize: MapSize.Small,
  serverUrl: process.env.AMYSURF_SERVICE_URL ?? "",
  rowVisibility: defaultRowsVisibility,
  themeColor: ThemeColor.light,
  wavesSizePrefered: 6,
};

export type ForecastsSummary = {
  selectedForecast: HourlyForecast | undefined;
  visitedSpots: Spot[];
};

export interface IForecastsSummary extends ForecastsSummary {
  setSelectedForecast(
    hourlyForecast: HourlyForecast | undefined
  ): HourlyForecast;
  setVisitedSpots(value: Spot[]): Spot[];
}

export type User = {
  readonly id: string;
  readonly userSettings: UserSettings;
};

export const DefaultUser: User = {
  id: "id-0",
  userSettings: DefaultUserSettings,
};

export interface IUser extends User {
  saveAppSettings(settings: UserSettings): UserSettings;
}

export interface IForecastApi {
  refreshData(): void;
  data: AppForecastsData | undefined;
  mockData: AppForecastsData | undefined;
  // nowForecast: SpotForecasts | undefined
  isSurfLoading: boolean;
  isSpotsLoading: boolean;
}
export const defaultIForecastApi: IForecastApi = {
  refreshData: () => {},
  data: undefined,
  mockData: undefined,
  // nowForecast: undefined,
  isSurfLoading: false,
  isSpotsLoading: false,
};

export type AppWindowDimensions = {
  width: number;
  height: number;
};

export type AppStyle = {
  // TODO: Move to classNames
  colorValues: ColorsValues;
  classNames: ClasseNames;
};

export type ColorsValues = {
  themeConstrast: string;
  themeTone: string; // (selected text, icon...)
  // mapPin: string
  // mapPinSelected: string
  // mapPinFavorite: string
};

export type ClasseNames = {
  mainColor: string; // (background...)
  mainContrastColor: string; // (text...)
  toneColor: string; // (selected text, icon...)
  toneContrastColor: string; // (selected text, icon...)
  fadedColor: string; // (border, separator...)
  selectedColor: string; // (clicked hourly data...)
};
