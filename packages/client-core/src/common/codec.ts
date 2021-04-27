import { Table, RecordBatchWriter } from 'apache-arrow'
import { TableStats, DataType, DataValueContainer } from './types'

export type DataValueType =
  | { [key: string]: unknown }
  | string
  | boolean
  | number
  | string[]
  | boolean[]
  | number[]

function serializeTable(table: Table): string {
  const wr = new RecordBatchWriter()

  const arr = wr.writeAll(table).finish().toUint8Array(true)
  return btoa(String.fromCharCode.apply(null, [...arr]))
}

export function serialize(value: Table | unknown): DataValueType {
  if (value instanceof Table) return serializeTable(value)
  return value as DataValueType
}

export function serializeToDataValue(value: Table | unknown): DataValueContainer {
  if (value instanceof Table) return { dataType: DataType.Table, value: serializeTable(value) }
  return { dataType: DataType.Simple, value }
}

function deserializeTable(valueContainer: unknown, statsContainer: unknown): [Table, TableStats] {
  return [
    valueContainer == null
      ? undefined
      : Table.from([Uint8Array.from(atob(valueContainer as string), c => c.charCodeAt(0))]),
    statsContainer as TableStats
  ]
}

export function deserialize<T, S>(
  serializedValue: unknown,
  serializedStats: unknown,
  valueType: string
): [T, S] {
  switch (valueType) {
    case DataType.Table:
      return (deserializeTable(serializedValue, serializedStats) as unknown) as [T, S]
    default:
      return [serializedValue, serializedStats] as [T, S]
  }
}

export function deserializeDataValue<T = unknown>(container: DataValueContainer): T {
  switch (container.dataType) {
    case DataType.Table:
      return (deserializeTable(container.value, undefined)[0] as unknown) as T
    default:
      return container.value as T
  }
}
