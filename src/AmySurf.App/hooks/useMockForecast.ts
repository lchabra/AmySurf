import getSurfForecastResponse from "../mock/getSurfForecastResponse.json";
import getEnergyForecastResponse from "../mock/getEnergyForecastResponse.json";
import getWeatherForecastResponse from "../mock/getWeatherForecastResponse.json";
import getSpotsResponse from "../mock/getSpotsResponse.json";
import { formatSpotForecast } from "../helpers/forecastHelper";
import { SpotForecast } from "../models/modelsApp";
import { GetSurfForecastResponse, GetEnergyForecastResponse, GetWeatherForecastResponse, Spot } from "../models/modelsForecasts";

export function getMockForecast(): SpotForecast {
    let surfForecastResponse: GetSurfForecastResponse = getSurfForecastResponse
    let energyForecastResponse: GetEnergyForecastResponse = getEnergyForecastResponse
    let weatherForecastResponse: GetWeatherForecastResponse = getWeatherForecastResponse
    let spots: Spot[] = getSpotsResponse

    let spot = spots.find(s => s.id === surfForecastResponse.forecast.spotId)
    if (spot == undefined) throw new Error("spot not found")

    let appForecast: SpotForecast = formatSpotForecast(spot, surfForecastResponse, weatherForecastResponse, energyForecastResponse)
    return appForecast
}