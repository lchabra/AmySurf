import "../styles/style.scss"
// import "../styles/theme.scss"

import Accordion from 'react-bootstrap/Accordion'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import ToggleButton from 'react-bootstrap/ToggleButton'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Card from 'react-bootstrap/Card'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Popover from 'react-bootstrap/Popover'
import FormControl from 'react-bootstrap/FormControl'
import Table from 'react-bootstrap/Table'
import InputGroup from 'react-bootstrap/InputGroup'
import ThemeProvider from 'react-bootstrap/ThemeProvider'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Stack from 'react-bootstrap/Stack'
import Spinner from 'react-bootstrap/Spinner'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Tooltip from 'react-bootstrap/Tooltip'
import Overlay from 'react-bootstrap/Overlay'
import Carousel from 'react-bootstrap/Carousel'
import Form from 'react-bootstrap/Form'

export {
    Accordion,
    Alert,
    ButtonGroup,
    DropdownButton,
    Popover,
    Dropdown,
    Badge,
    ToggleButton,
    Button,
    Card,
    // StyledButton as Button,
    Navbar,
    Form,
    Carousel,
    FormControl,
    Container,
    Nav,
    NavDropdown,
    Stack,
    Table,
    OverlayTrigger,
    Row,
    Spinner,
    Col,
    ThemeProvider,
    Toast,
    ToastContainer,
    Tooltip,
    InputGroup,
    Overlay,
    Modal,
}

//Map
import { Map, Marker, Overlay as PigeonMapOverlay } from "pigeon-maps"
export {
    Map as PigeonMap,
    Marker as PigeonMapMarker,
    PigeonMapOverlay
}

/** Detects if device is on iOS */
export const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())

/** Detects if small screen */
export const isSmallDevice = window.screen.width <= 375