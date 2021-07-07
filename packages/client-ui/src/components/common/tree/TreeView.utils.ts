import { ITreeItem } from './TreeView.types'

/**
 * Recursive function that finds all the selected nodes in the tree object
 * @param tree Object describing the node tree
 * @returns List of node IDs
 */
export const getListSelectedNodes = (tree: ITreeItem[]): string[] => {
  const output: string[] = []
  tree.forEach(node => {
    if (node.selected) output.push(node.id)
    if (Array.isArray(node.children)) output.push(...getListSelectedNodes(node.children))
  })
  return output
}

/**
 * Recursive function that returns a list of the IDs of ALL the nodes in the tree object
 * @param tree Object describing the node tree
 * @returns List of the IDs of ALL nodes
 */
export const getListAllNodes = (tree: ITreeItem[]): string[] => {
  const output: string[] = []
  tree.forEach(node => {
    output.push(node.id)
    if (Array.isArray(node.children)) output.push(...getListAllNodes(node.children))
  })
  return output
}
