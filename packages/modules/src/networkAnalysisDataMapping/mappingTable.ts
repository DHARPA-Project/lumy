import { Field, Struct, Utf8, Table, Vector } from 'apache-arrow'

namespace Table {
  export type MappingItem = {
    id: Utf8
    column: Utf8
  }

  export type MappingTable = {
    [key: string]: Struct<MappingItem>
  }
}

const MappingItemStruct = new Struct<Table.MappingItem>([
  Field.new({ name: 'id', type: new Utf8(), nullable: false }),
  Field.new({ name: 'column', type: new Utf8(), nullable: false })
])

type MappingTableObjectItem = Record<keyof Table.MappingItem, string>
type MappingTableObject = {
  [key: string]: MappingTableObjectItem[]
}

export const toObject = (table: Table<Table.MappingTable>): MappingTableObject =>
  (table?.schema?.fields ?? []).reduce<MappingTableObject>(
    (acc, field) => ({
      ...acc,
      [field.name]: [...table.getColumn(field.name)]
    }),
    {}
  )

export const fromObject = (s: MappingTableObject): Table<Table.MappingTable> => {
  const columnNames = Object.keys(s)
  const columnValues = Object.values(s).map(i =>
    Vector.from({
      values: i,
      type: MappingItemStruct
    })
  )

  return Table.new(columnValues, columnNames)
}

export type MappingTableStructure = Table.MappingTable
