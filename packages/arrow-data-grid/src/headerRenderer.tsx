import React from 'react'
import { Grid, SvgIcon } from '@material-ui/core'
import { GridColumnHeaderParams } from '@material-ui/data-grid'
import { DataType, Type } from 'apache-arrow'
import TextIcon from '@material-ui/icons/TextFields'
import ListIcon from '@material-ui/icons/List'
import StructIcon from '@material-ui/icons/Description'
import DateIcon from '@material-ui/icons/DateRange'
import TimeIcon from '@material-ui/icons/AccessTime'

type Renderer = (params: GridColumnHeaderParams) => React.ReactElement
type IconType = typeof SvgIcon

export function getHeaderRenderer(type: DataType): Renderer {
  const icon = getIcon(type)
  return (params: GridColumnHeaderParams) => headerRenderer({ ...params, icon })
}

type HeaderRendererProps = GridColumnHeaderParams & { icon: IconType }
const headerRenderer = (props: HeaderRendererProps): JSX.Element => {
  if (props.icon == null) return undefined
  const Icon = props.icon
  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid item>
        <Icon style={{ verticalAlign: 'middle' }} fontSize="small" />
      </Grid>
      <Grid item>{props.colDef.headerName}</Grid>
    </Grid>
  )
}

const getIcon = (type: DataType): typeof SvgIcon => {
  switch (type.typeId) {
    case Type.Utf8:
      return TextIcon
    case Type.List:
    case Type.FixedSizeList:
      return ListIcon
    case Type.Struct:
    case Type.Map:
      return StructIcon
    case Type.Time:
      return TimeIcon
    case Type.Date:
      return DateIcon
    default:
      return undefined
  }
}
