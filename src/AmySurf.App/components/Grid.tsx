import React, { CSSProperties } from "react"
import { forecastDaySummaryHeightEm, labelDenseWitdhEm, labelExpandHeightRem, labelWitdhEm, useAppStyle } from "../contexts/useStyle"
import { useUser } from '../contexts/useUser'
import { ExpandLessIcon, ExpandMoreIcon } from "../core-ui/icons"
import { Stack } from "../core-ui/ui"
import { ThemeColor } from "../models/modelsApp"

export function Grid<TData, TCellData>({ options, data, selectedKey }: {
  options: GridOptions<TData, TCellData>
  data: TData
  selectedKey?: number
}): React.JSX.Element {

  const style: CSSProperties = {
    minWidth: options.dense ? labelDenseWitdhEm + 'rem' : labelWitdhEm + 'rem',
    maxWidth: options.dense ? labelDenseWitdhEm + 'rem' : labelWitdhEm + 'rem',
    overflowX: 'scroll',
    overflowY: 'hidden'
  }
  const groups = React.useMemo(() => options.groupProvider(data), [data]);

  return (
    <Stack direction='horizontal' className="h-100 d-flex justify-content-center">

      <Stack style={style} className='h-100'>
        {/* TODO: integration this and remove inside hooks */}
        <LabelsStyleChanger options={options} />
        <GridHeader options={options} />
      </Stack>

      <div className='h-100' style={{ overflowX: 'scroll' }}>
        <Stack direction='horizontal' className='h-100 '>
          {groups.map((data, index) => <GridPage key={index} options={options} data={data} selectedKey={selectedKey} />)}
        </Stack>
      </div>

    </Stack>
  )
}

function LabelsStyleChanger<TData, TCellData>({ options }: {
  options: GridOptions<TData, TCellData>
}) {
  const appStyle = useAppStyle()

  const style = {
    minHeight: forecastDaySummaryHeightEm + 'rem',
    height: forecastDaySummaryHeightEm + 'rem'
  }

  const className = `d-flex justify-content-center align-items-center`

  return (
    <div className={className} style={style} onClick={options.onHeaderClick}>
      {options.dense && <ExpandMoreIcon height={labelExpandHeightRem + 'rem'} width={labelExpandHeightRem + 'rem'} fill={appStyle.colorValues.themeConstrast} />}
      {!options.dense && <ExpandLessIcon height={labelExpandHeightRem + 'rem'} width={labelExpandHeightRem + 'rem'} fill={appStyle.colorValues.themeConstrast} />}
    </div>
  )
}

function GridHeader<TData, TCellData>({ options }: {
  options: GridOptions<TData, TCellData>
}) {
  const user = useUser() // TODO Remove and get info from schema

  const className = `h-100 d-flex justify-content-center`
  const context: GridHeaderFactoryContext = { style: options.style }

  return (
    <div className={`h-100 d-flex justify-content-center border-end border-${options.style.customAppStyle.classNames.fadedColor}`}>
      <Stack className={className} onClick={options.onHeaderClick}>
        {options.rows.map((row, _) => {
          const className = `h-100 d-flex border-bottom border-opacity-25 border-${options.style.customAppStyle.classNames.fadedColor} align-items-center justify-content-center`

          const height = options.style.baseHeight * row.height(context)
          const minHeight = height + 'em'
          const maxHeight = getMaxHeight(row.id, height)

          const headerStyle = row.headerStyle ? row.headerStyle(context) : undefined
          const style: CSSProperties = { ...headerStyle, minHeight, maxHeight }

          return (
            // <div key={row.name} className={className} style={style} >
            <div key={row.name} className={className} style={style} >
              {user.userSettings.denseLabel && row.icon(context)}
              {!user.userSettings.denseLabel && row.label(context)}
            </div>
          )
        })}
      </Stack>
    </div>
  )
}

function GridPage<TData, TCellData>({ options, data, selectedKey }: {
  options: GridOptions<TData, TCellData>
  data: TData
  selectedKey?: number
}): React.JSX.Element {
  // TODO: cleanup
  const appStyle = useAppStyle()
  const style = {
    minHeight: forecastDaySummaryHeightEm + 'rem',
    height: forecastDaySummaryHeightEm + 'rem'
  }
  const items = React.useMemo(() => options.cellDataProvider(data), [data])

  return (
    <Stack direction='vertical' className={`border-end border-${appStyle.classNames.fadedColor}`}>
      <div style={style}>
        {options.groupElementFactory(data)}
      </div>

      <Stack direction='horizontal' className='h-100'>
        {items.map((data, index) =>
          <GridColumn key={index} options={options} data={data} selected={options.keyProvider(data) === selectedKey} />
        )}
      </Stack>
    </Stack>
  )
}

function GridColumn<TData, TCellData>({ options, data, selected }: {
  options: GridOptions<TData, TCellData>
  data: TCellData
  selected: boolean
}): React.JSX.Element {

  const columnClassName = options.columnClassNameProvider({ style: options.style, data })
  // const backgroundColor = selected ? `bg-${options.style.selectedColorClassName}` : undefined;
  // const selectedIndicator = selected ? `text-bg-${options.style.toneColorClassName} border-start border-end border-2 border-${options.style.contrastedColor}` : undefined;
  const selectedIndicator = selected ? ` border-start opacity-75 border-end border-2 border-${options.style.toneColorClassName}` : undefined;

  const collectionClassName = `h-100 d-flex justify-content-center ${selectedIndicator} ${columnClassName}`

  const collectionStyle = {
    width: options.style.baseWidth + 'rem',
  }

  const onclick = React.useCallback(() => { options.onClick && options.onClick(data) }, [options, data])

  return (
    <Stack direction='vertical' className={collectionClassName} style={collectionStyle} onClick={onclick}>
      {
        options.rows.map((row) =>
          <GridCell key={row.name} row={row} options={options} data={data} />
        )
      }
    </Stack>
  )
}

function GridCell<TData, TCellData>({ options, data, row }: {
  options: GridOptions<TData, TCellData>
  data: TCellData
  row: GridRowDefinition<TCellData>
}): React.JSX.Element {

  const context: GridCellFactoryContext<TCellData> = { style: options.style, data }
  const className = `h-100 d-flex text-center align-items-center justify-content-center`

  const height = options.style.baseHeight * row.height(context)
  const minHeight = height + 'em'
  const maxHeight = getMaxHeight(row.id, height)
  const cellStyle = row.contentStyle ? row.contentStyle(context) : undefined

  const style: CSSProperties = { ...cellStyle, minHeight, maxHeight }
  const contentClassName = row.contentClassName ? row.contentClassName(context) : undefined

  return <div className={className + ' ' + contentClassName} style={style}>{row.content(context)}</div>
}

// Can be a more complex function and use row number and available space to calculate height
function getMaxHeight(_: string, height: number) {
  return height * 2.5 + 'em'
  // switch (rowId) {
  // case "hours":
  //   return height * 2.5 + 'em'
  // default:
  //   return height * 2.5 + 'em'
}

export type GridOptions<TData, TCellData> = {
  dense?: boolean

  /**
   * Definitions of the different rows and how they will render
   */
  rows: GridRowDefinition<TCellData>[]

  /**
   * Function which take data and make into multiple group or pages
   */
  groupProvider: (data: TData) => TData[]

  /**
   * Function to return an element for a group header
   */
  groupElementFactory: (data: TData) => React.JSX.Element

  /**
   * Function to return cell data
   */
  cellDataProvider: (data: TData) => TCellData[]

  /**
   * Function to get a data key to match selectedKey
   */
  keyProvider: (data: TCellData) => number

  columnClassNameProvider: GridColumnClassNameFactory<TCellData>

  style: GridStyle

  onClick?: (data: TCellData) => void
  onHeaderClick?: () => void
}

export type GridLabelFactory = ((context: GridHeaderFactoryContext) => React.JSX.Element)
export type GridHeightProvider = ((context: GridHeaderFactoryContext) => number)
export type GridHeaderStyleFactory = ((context: GridHeaderFactoryContext) => CSSProperties)
export type GridColumnClassNameFactory<T> = ((context: GridCellFactoryContext<T>) => string | undefined)

export type GridCellFactory<T> = ((context: GridCellFactoryContext<T>) => React.JSX.Element)
export type GridCellStyleFactory<T> = ((context: GridCellFactoryContext<T>) => CSSProperties)
export type GridCellClassNameFactory<T> = ((context: GridCellFactoryContext<T>) => string | undefined)

export type GridRowDefinition<TCellData> = {
  name: string
  id: string
  height: GridHeightProvider
  label: GridLabelFactory
  icon: GridLabelFactory
  content: GridCellFactory<TCellData>
  headerStyle?: GridHeaderStyleFactory
  contentStyle?: GridCellStyleFactory<TCellData>
  contentClassName?: GridCellClassNameFactory<TCellData>
}

export type GridStyle = {
  themeColor: ThemeColor
  toneColorClassName: string
  baseWidth: number
  selectedColorClassName: string
  /**
   * height in rem
   * legacy forecastTypeIconHeightRem
   */
  iconHeight: number

  /**
   * height multiplier
   * legacy heightEmPerForecastUnit
   */
  baseHeight: number

  /**
   * Optionl fill color
   */
  contrastedColor?: string

  customAppStyle?: any
}

export type GridHeaderFactoryContext = {
  style: GridStyle
}

export type GridCellFactoryContext<T> = {
  style: GridStyle
  data: T
}