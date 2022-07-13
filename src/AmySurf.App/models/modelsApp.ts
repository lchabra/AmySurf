import { RatingGroup } from "../contexts/useNostr"
import { getForecastsTypeStyle } from "../contexts/useStyle"
import { ThemeColor } from "../styles/theme"
import { Spot } from "./modelsForecasts"

export enum RoutePath {
    '/' = '/',
    '*' = '*',
    Forecasts = '/forecasts',
    Settings = '/settings',
    Spots = '/spots',
}

export type AppForecastsData = {
    date: Date
    errors: string[]
    spots: Spot[] | undefined
    spotForecasts: SpotForecasts | undefined
}

export type SpotForecasts = {
    updateTime: Date
    spot: Spot
    sunriseTimes: Date[]
    sunsetTimes: Date[]
    data: HourlyForecast[]
}

export type HourlyForecast = {
    dateTime: Date
    //Surf
    wavesSizeMin: number
    wavesSizeMax: number
    wavesSizeAverage: number
    primarySwellPeriod: number
    primarySwellDirection: number
    secondarySwellPeriod: number
    secondarySwellDirection: number
    windDirection: number
    windDirectionCardinal: string
    windSpeed: number
    tideHeight: number
    tideHeightPerOne: number
    //EnergyS    
    energy: number
    //Weather
    weatherDescriptionId: number
    rainMm: number
    temperature: number
    cloudCoverage: number
    description: number
    ratings?: RatingGroup[]
}

export enum ForecastType {
    // DailySummary = 'DailySummary',
    Hours = '1',
    WaveSize = '2',
    SwellEnergy = '3',
    SwellPeriodDirectionPrimary = '4',
    SwellPeriodDirectionSecondary = '5',
    TideChart = '6',
    WindSpeedDirection = '7',
    WeatherConditionTemperature = '8',
    RainMm = '9',
    CloudCoverage = '10',
    Ratings = '11',
}

export enum MapSize {
    Disable = 'Disable',
    Small = 'Small',
    Medium = 'Medium',
    Fullscreen = 'Fullscreen'
}

export type UserSettings = {
    readonly theme: ThemeColor
    readonly denseLabel: boolean
    readonly endHours: number
    readonly forecastInterval: number
    readonly forecastDurationDays: number
    readonly refreshIntervalMinutes: number
    readonly language: string
    readonly spotName: string
    readonly mapSize: MapSize
    readonly startHours: number
    readonly favoriteSpots: Spot[]
    readonly visiblesForecastsTypes: ForecastType[]
    readonly serverUrl: string
    readonly fontSizePercent: number
}

export const DefaultUserSettings: UserSettings = {
    theme: ThemeColor.dark,
    fontSizePercent: 100,
    language: 'en',
    forecastInterval: 1,
    forecastDurationDays: 3,
    startHours: 5,
    endHours: 20,
    refreshIntervalMinutes: 180,
    denseLabel: false,
    spotName: '',
    favoriteSpots: [],
    mapSize: MapSize.Small,
    serverUrl: (process.env.AMYSURF_SERVICE_URL || process.env.AMYSURF_BASEURL) ?? "",
    visiblesForecastsTypes:
        [
            ForecastType.Hours,
            ForecastType.WaveSize,
            ForecastType.SwellEnergy,
            ForecastType.SwellPeriodDirectionPrimary,
            ForecastType.SwellPeriodDirectionSecondary,
            ForecastType.TideChart,
            ForecastType.WindSpeedDirection,
            ForecastType.WeatherConditionTemperature,
        ],
}

export type ForecastsSummary = {
    selectedForecast: HourlyForecast | undefined
    visitedSpots: Spot[]
}

export interface IForecastsSummary extends ForecastsSummary {
    setSelectedForecast(hourlyForecast: HourlyForecast | undefined): HourlyForecast
    setVisitedSpots(value: Spot[]): Spot[]
}

export type User = {
    readonly id: string
    readonly userSettings: UserSettings
}

export const DefaultUser: User = {
    id: 'id-0',
    userSettings: DefaultUserSettings,
}

export interface IUser extends User {
    saveAppSettings(settings: UserSettings): UserSettings
}

export interface IForecastApi {
    refreshData(): void
    data: AppForecastsData | undefined
    // nowForecast: SpotForecasts | undefined
    isSurfLoading: boolean
    isSpotsLoading: boolean
}
export const defaultIForecastApi: IForecastApi = {
    refreshData: () => { },
    data: undefined,
    // nowForecast: undefined,
    isSurfLoading: false,
    isSpotsLoading: false,
}

export type AppWindowDimensions = {
    width: number,
    height: number
}

export type AppStyle = {
    theme: ThemeColor
    readonly forecastTypeStyles: [ForecastType, React.CSSProperties][]
}

export const DefaultAppStyle: AppStyle = {
    theme: ThemeColor.dark, // TODO: use it instead of useUser
    forecastTypeStyles: getForecastsTypeStyle()
}

export interface IAppStyle extends AppStyle {
    saveAppStyle(style: AppStyle): AppStyle
    getForecastTypeWrapperStyle(ft: ForecastType): React.CSSProperties
}