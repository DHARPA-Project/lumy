import { Int32, Utf8 } from 'apache-arrow'

export type EdgesStructure = {
  srcId: Utf8
  tgtId: Utf8
  weight: Int32
}

export type NodesStructure = {
  id: Utf8
  label: Utf8
  group: Utf8
}
