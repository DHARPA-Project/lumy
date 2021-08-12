export interface ITreeItem {
  id: string
  name: string
  details?: string
  children?: ITreeItem[]
  selected?: boolean
}

export interface ITreeViewProps {
  treeStructure: ITreeItem[]
  selectedItem?: string
}
