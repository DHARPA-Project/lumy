import { DataType, List, Struct } from 'apache-arrow'
import { GridCellParams } from '@material-ui/data-grid'

import { DefaultRenderer } from './DefaultRenderer'
import { ListCellRenderer } from './ListRenderer'
import { StructRenderer } from './StructRenderer'

export function getCellRenderer(type: DataType): (params: GridCellParams) => React.ReactElement {
  if (type instanceof List) {
    return (params: GridCellParams) =>
      ListCellRenderer({ ...params, itemRenderer: getCellRenderer(type.valueType) })
  } else if (type instanceof Struct) {
    return StructRenderer
  }
  return DefaultRenderer
}
