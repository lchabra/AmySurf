import React from 'react'

import Home from '../assets/images/dashboard.svg'
import Settings from '../assets/images/settings.svg'
import Search from '../assets/images/search.svg'

import ExpandLess from '../assets/images/expand_less.svg'
import ExpandMore from '../assets/images/expand_more.svg'
import Remove from '../assets/images/remove.svg'
import XCircle from '../assets/images/x-circle.svg'

import Star from '../assets/images/star.svg'
import StarFill from '../assets/images/star-fill.svg'
import Bookmark from '../assets/images/bookmark.svg'
import BookmarkAdded from '../assets/images/bookmark-added.svg'

import Error from '../assets/images/error.svg'
import ReportProblem from '../assets/images/report-problem.svg'

import Swell from '../assets/images/Swell.png'
import Wind from '../assets/images/Wind.png'
import BrokenClouds from '../assets/images/weather/BrokenClouds.png'
import ClearSky from '../assets/images/weather/ClearSky.png'
import FewClouds from '../assets/images/weather/FewClouds.png'
import Mist from '../assets/images/weather/Mist.png'
import Rain from '../assets/images/weather/Rain.png'
import ScatteredClouds from '../assets/images/weather/ScatteredClouds.png'
import ShowerRain from '../assets/images/weather/ShowerRain.png'
import Snow from '../assets/images/weather/Snow.png'
import Thunderstorm from '../assets/images/weather/Thunderstorm.png'

import WindArrowDirection from '../assets/images/Wind.png'
import SwellArrowDirection from '../assets/images/Swell.png'
import Sunrise from '../assets/images/Sunrise.png'
import Sunset from '../assets/images/Sunset.png'

import Air from '../assets/images/forecastType/air.svg'
import Bolt from '../assets/images/forecastType/bolt.svg'
import Clock from '../assets/images/forecastType/clock.svg'
import Cloudy from '../assets/images/forecastType/cloudy.svg'
import Height from '../assets/images/forecastType/height.svg'
import Hourglass from '../assets/images/forecastType/hourglass.svg'
import HourglassEmpty from '../assets/images/forecastType/hourglass_empty.svg'
import Lines from '../assets/images/forecastType/lines.svg'
import Swap from '../assets/images/forecastType/swap.svg'
import Thermostat from '../assets/images/forecastType/thermostat.svg'
import Timer from '../assets/images/forecastType/timer.svg'
import Water from '../assets/images/forecastType/water.svg'
import Waves from '../assets/images/forecastType/waves.svg'
import Explore from '../assets/images/forecastType/explore.svg'

export type IconProps = React.SVGProps<SVGSVGElement>
export type ImagesProps = React.CSSProperties

export const SwellIcon = (props: ImagesProps) => <img src={Swell} style={props} />
export const WindIcon = (props: ImagesProps) => <img src={Wind} style={props} />
export const BrokenCloudsIcon = (props: ImagesProps) => <img src={BrokenClouds} style={props} />
export const ClearSkyIcon = (props: ImagesProps) => <img src={ClearSky} style={props} />
export const FewCloudsIcon = (props: ImagesProps) => <img src={FewClouds} style={props} />
export const MistIcon = (props: ImagesProps) => <img src={Mist} style={props} />
export const RainIcon = (props: ImagesProps) => <img src={Rain} style={props} />
export const ScatteredCloudsIcon = (props: ImagesProps) => <img src={ScatteredClouds} style={props} />
export const ShowerRainIcon = (props: ImagesProps) => <img src={ShowerRain} style={props} />
export const SnowIcon = (props: ImagesProps) => <img src={Snow} style={props} />
export const ThunderstormIcon = (props: ImagesProps) => <img src={Thunderstorm} style={props} />

export const WindDirectionArrow = (props: ImagesProps) => <img src={WindArrowDirection} style={props} />
export const SwellDirectionArrow = (props: ImagesProps) => <img src={SwellArrowDirection} style={props} />
export const SunriseIcon = (props: ImagesProps) => <img src={Sunrise} style={props} />
export const SunsetIcon = (props: ImagesProps) => <img src={Sunset} style={props} />

export const HomeIcon = (props: ImagesProps) => <Home style={props} />
export const SettingsIcon = (props: ImagesProps) => <Settings style={props} />
export const SearchIcon = (props: ImagesProps) => <Search style={props} />

export const ExpandLessIcon = (props: ImagesProps) => <ExpandLess style={props} />
export const ExpandMoreIcon = (props: ImagesProps) => <ExpandMore style={props} />
export const RemoveIcon = (props: ImagesProps) => <Remove style={props} />
export const XCircleIcon = (props: ImagesProps) => <XCircle style={props} />

export const StarIcon = (props: ImagesProps) => <Star style={props} />
export const StarFillIcon = (props: ImagesProps) => <StarFill style={props} />
export const BookmarkIcon = (props: ImagesProps) => <Bookmark style={props} />
export const BookmarkAddedIcon = (props: ImagesProps) => <BookmarkAdded style={props} />

export const ErrorIcon = (props: ImagesProps) => <Error style={props} />
export const ReportProblemIcon = (props: ImagesProps) => <ReportProblem style={props} />

export const AirIcon = (props: IconProps) => <Air style={props} />
export const BoltIcon = (props: IconProps) => <Bolt style={props} />
export const ClockIcon = (props: IconProps) => <Clock style={props} />
export const CloudyIcon = (props: IconProps) => <Cloudy style={props} />
export const ExploreIcon = (props: IconProps) => <Explore style={props} />
export const HeightIcon = (props: IconProps) => <Height style={props} />
export const HourglassIcon = (props: IconProps) => <Hourglass style={props} />
export const HourglassEmptyIcon = (props: IconProps) => <HourglassEmpty style={props} />
export const LinesIcon = (props: IconProps) => <Lines style={props} />
export const SwapIcon = (props: IconProps) => <Swap style={props} />
export const ThermostatIcon = (props: IconProps) => <Thermostat style={props} />
export const TimerIcon = (props: IconProps) => <Timer style={props} />
export const WaterIcon = (props: IconProps) => <Water style={props} />
export const WavesIcon = (props: IconProps) => <Waves style={props} />