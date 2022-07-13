import React from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import NavigationBar from "./components/NavigationBar"
import { UserProvider } from "./contexts/useUser"
import { RoutePath } from "./models/modelsApp"
import ForecastPage from "./pages/ForecastPage"
import SettingsPage from "./pages/SettingsPage"
import { ForecastSummaryProvider } from "./contexts/useForecastSummary"
import { ForecastApiProvider } from "./contexts/useForecasts"
import SpotsPage from "./pages/SpotsPage"
import { AppStyleProvider } from "./contexts/useStyle"
import { PageData } from "./components/AppPageWrapper"
import { PwaProvider } from "./hooks/usePwa"
import { NostrProvider } from "./contexts/useNostr"

// For PWA use this script "dev": "parcel index.html --no-hmr" (in package.json)
export default function App() {
    return (
        <NostrProvider>
            <React.StrictMode>
                <PwaProvider>
                    <UserProvider>
                        <ForecastApiProvider>
                            <ForecastSummaryProvider>
                                <BrowserRouter>
                                    <AppStyleProvider>
                                        <AmySurfApp />
                                    </AppStyleProvider>
                                </BrowserRouter>
                            </ForecastSummaryProvider>
                        </ForecastApiProvider>
                    </UserProvider>
                </PwaProvider>
            </React.StrictMode>
        </NostrProvider>
    )
}

function AmySurfApp() {
    return (
        <PageData>
            <AppRoutes />
            <NavigationBar />
        </PageData>
    )
}

function AppRoutes(): JSX.Element {
    return (
        <Routes>
            <Route
                path={RoutePath["/"]}
                element={<Navigate to={RoutePath.Forecasts} />} />
            <Route
                path={RoutePath.Forecasts}
                element={<ForecastPage />} />
            <Route
                path={RoutePath.Settings}
                element={<SettingsPage />}
            />
            <Route
                path={RoutePath.Spots}
                element={<SpotsPage />}
            />
            <Route path={RoutePath["*"]} element={<Navigate to={RoutePath["/"]} />} />
        </Routes>
    )
}

// function getAppForecast(): SpotForecasts {
//     let forecast = getMockForecast()
//     return forecast
// }