import { getStartForecastISOString, getEndForecastISOString } from "./dt";

export function getUrls(serverUrl: string, spotId: string | undefined) {
    const urlSpots: string = `${serverUrl}/api/forecast/spots`;
    let urlSurf: string = '';
    let urlWeather: string = '';
    let urlEnergy: string = '';

    if (spotId !== undefined) {
        const startTime = getStartForecastISOString()
        const endTime = getEndForecastISOString()

        urlSurf = `${serverUrl}/api/forecast/surf?spotid=${spotId}&StartTime=${startTime}&EndTime=${endTime}`
        urlWeather = `${serverUrl}/api/forecast/weather?spotid=${spotId}&StartTime=${startTime}&EndTime=${endTime}`
        urlEnergy = `${serverUrl}/api/forecast/energy?spotid=${spotId}&StartTime=${startTime}&EndTime=${endTime}`
    }

    return { urlSpots, urlSurf, urlWeather, urlEnergy };
}