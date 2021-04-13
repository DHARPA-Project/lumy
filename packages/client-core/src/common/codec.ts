import { Table, RecordBatchWriter } from 'apache-arrow'
import { DataValueContainer, TableStats, DataType } from './types'

export type DataValueType =
  | DataValueContainer
  | { [key: string]: unknown }
  | string
  | boolean
  | number
  | string[]
  | boolean[]
  | number[]

const isDataValueContainer = (v: unknown): v is DataValueContainer =>
  (v as DataValueContainer).dataType != null

export function serializeTable(table: Table): DataValueContainer {
  const stats: TableStats = {
    rowsCount: table.count()
  }

  return {
    dataType: DataType.Table,
    stats: (stats as unknown) as Record<string, unknown>
  }
}

export function serialize(value: Table | unknown): DataValueContainer | unknown {
  if (value instanceof Table) return serializeTable(value)
  return value
}

export function serializeFilteredTable(filteredTable: Table, fullTable: Table): DataValueContainer {
  const wr = new RecordBatchWriter()

  const arr = wr.writeAll(filteredTable).finish().toUint8Array(true)
  const value = btoa(String.fromCharCode.apply(null, [...arr]))

  return {
    ...serializeTable(fullTable),
    value
  }
}

export function deserializeValue<S, V>(container: unknown): [S | undefined, V | undefined] {
  if (isDataValueContainer(container)) {
    if (container.dataType === DataType.Table) {
      const stats = (container.stats as unknown) as S
      const value =
        container.value == null
          ? undefined
          : Table.from([Uint8Array.from(atob(container.value), c => c.charCodeAt(0))])
      return [stats, (value as unknown) as V]
    } else {
      throw new Error(`Unknown data type: ${container.dataType}`)
    }
  } else {
    return [undefined, (container as unknown) as V]
  }
}

export function deserialize<S = unknown>(container: unknown): S {
  const [stats, value] = deserializeValue(container)
  return (value == null ? stats : value) as S
}
