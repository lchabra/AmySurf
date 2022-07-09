import React, { useEffect, useMemo, useState } from "react"
import { getDateSpotNow, isSameHour, roundToNearestMinutes } from "../helpers/dt";
import useLocalStorage from "../hooks/useLocalStorage";
import { HourlyForecast, IForecastsSummary } from "../models/modelsApp";
import { Spot } from "../models/modelsForecasts";
import { useForecastsApi } from "./useForecasts";

const ForecastContext = React.createContext<IForecastsSummary | null>(null);

// Context Provider
export function ForecastSummaryProvider(props: { children: React.ReactNode }) {
    const forecastSummary = _useForecastSummary()
    return (<ForecastContext.Provider value={forecastSummary}>{props.children}</ForecastContext.Provider>)
}

// Migrate to useForecastsApi?
// Global function used to get the ForecastSummary
export function useForecastSummary(): IForecastsSummary {
    const value = React.useContext(ForecastContext)
    if (!value) throw new Error('ForecastSummary is not initialized')
    return value
}

function _useForecastSummary(): IForecastsSummary {
    const forecastsApi = useForecastsApi()

    const [visitedSpots, setVisitedSpots] = useLocalStorage<Spot[]>('visitedSpot', [])
    const [selectedForecast, setSelectedForecast] = useState<HourlyForecast | undefined>(undefined)

    // Update visitedSpots
    useEffect(() => {
        const selectedSpot = forecastsApi.data?.spotForecast?.spot
        if (selectedSpot === undefined) { return }

        const isNewVisitedSpot = visitedSpots.findIndex(s => s.id === selectedSpot.id) === -1

        if (isNewVisitedSpot) {
            const newVisitedSpots = visitedSpots.concat(selectedSpot)

            if (newVisitedSpots.length > 3) {
                newVisitedSpots.shift()
                setVisitedSpots([...newVisitedSpots].sort((a: Spot, b: Spot) => (a.name > b.name) ? 1 : -1))
            }
            else {
                setVisitedSpots([...newVisitedSpots].sort((a: Spot, b: Spot) => (a.name > b.name) ? 1 : -1))
            }
        }

    }, [forecastsApi.data?.spotForecast?.spot.name])

    // selectedForecast is set to spotNow when the spot changed
    useMemo(() => {
        if (forecastsApi.data?.spotForecast === undefined) {
            setSelectedForecast(undefined)
        }
        else {
            const spotNow = getDateSpotNow(forecastsApi.data?.spotForecast?.spot.utcOffset)
            const nearestRoundHourSpotNow = roundToNearestMinutes(spotNow, 30)
            const nowHourly: HourlyForecast | undefined = forecastsApi.data?.spotForecast?.data.find(f => isSameHour(f.dateTime, nearestRoundHourSpotNow))
            setSelectedForecast(nowHourly)
        }
    }, [forecastsApi.data?.spotForecast?.spot])

    return {
        selectedForecast: getSelectedForecast(selectedForecast),
        visitedSpots: visitedSpots,
        setSelectedForecast: (value: HourlyForecast) => {
            setSelectedForecast(prevValue => {
                if (prevValue?.dateTime !== value.dateTime) {
                    return { ...value };
                }
                return undefined;
            })
            return value
        },
        setVisitedSpots: (value: Spot[]) => {
            setVisitedSpots(value)
            return value
        },
    }
}

function getSelectedForecast(hf: HourlyForecast | undefined): HourlyForecast | undefined {
    if (hf === undefined) {
        return undefined
    }
    else {
        return {
            ...hf,
            dateTime: new Date(hf.dateTime.toString())
        }
    }
}

export function changeSelectedForecast(forecastSummary: IForecastsSummary, data: HourlyForecast): void {
    if (forecastSummary.selectedForecast?.dateTime !== undefined && isSameHour(forecastSummary.selectedForecast?.dateTime, data.dateTime)) { //the selected forecast is the one clicked
        forecastSummary.setSelectedForecast(undefined)
    } else {
        forecastSummary.setSelectedForecast(data)
    }
}