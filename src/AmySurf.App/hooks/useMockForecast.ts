import getSurfForecastResponse from "../mock/getSurfForecastResponse.json";
import getEnergyForecastResponse from "../mock/getEnergyForecastResponse.json";
import getWeatherForecastResponse from "../mock/getWeatherForecastResponse.json";
import getSpotsResponse from "../mock/getSpotsResponse.json";
import { formatSpotForecasts } from "../helpers/forecastHelper";
import { SpotForecasts } from "../models/modelsApp";
import { GetSurfForecastResponse, GetEnergyForecastResponse, GetWeatherForecastResponse, Spot } from "../models/modelsForecasts";

export function getMockForecast(): SpotForecasts {
    let surfForecastResponse: GetSurfForecastResponse = getSurfForecastResponse
    let energyForecastResponse: GetEnergyForecastResponse = getEnergyForecastResponse
    let weatherForecastResponse: GetWeatherForecastResponse = getWeatherForecastResponse
    let spots: Spot[] = getSpotsResponse

    let spot = spots.find(s => s.id === surfForecastResponse.forecast.spotId)
    if (spot == undefined) throw new Error("spot not found")

    let appForecast: SpotForecasts = formatSpotForecasts(spot, surfForecastResponse, weatherForecastResponse, energyForecastResponse)
    return appForecast
}