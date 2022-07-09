import React from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { PageData } from "./components/AppPageWrapper"
import NavigationBar from "./components/NavigationBar"
import { ForecastSummaryProvider } from "./contexts/useForecastSummary"
import { ForecastApiProvider } from "./contexts/useForecasts"
import { NostrProvider } from "./contexts/useNostr"
import { AppStyleProvider } from "./contexts/useStyle"
import { UserProvider } from "./contexts/useUser"
import { RoutePath } from "./models/modelsApp"
import ForecastPage from "./pages/ForecastPage"
import SettingsPage from "./pages/SettingsPage"
import SpotsPage from "./pages/SpotsPage"

// For PWA use this script "dev": "parcel index.html --no-hmr" (in package.json)
export default function App() {
    return (
        <NostrProvider>
            <React.StrictMode>
                <UserProvider>
                    {/* <PwaProvider> */}
                    <ForecastApiProvider>
                        <ForecastSummaryProvider>
                            <BrowserRouter>
                                <AppStyleProvider>
                                    <AmySurfApp />
                                </AppStyleProvider>
                            </BrowserRouter>
                        </ForecastSummaryProvider>
                    </ForecastApiProvider>
                    {/* </PwaProvider> */}
                </UserProvider>
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

function AppRoutes(): React.JSX.Element {
    return (
        <Routes>
            <Route path={RoutePath["/"]} element={<ForecastPage />} />

            <Route path={RoutePath.Forecasts}>
                <Route path={RoutePath["Forecasts"]} element={<ForecastPage />} />
            </Route>

            <Route path={RoutePath.Settings}>
                <Route path={RoutePath["Settings"]} element={<SettingsPage />} />
            </Route>

            <Route path={RoutePath.Spots}>
                <Route path={RoutePath["Spots"]} element={<SpotsPage />} />
            </Route>

            <Route path={RoutePath["*"]}>
                <Route path={RoutePath["*"]} element={<Navigate to={RoutePath["/"]} />} />
            </Route>

        </Routes>
    )
}