import React, { useEffect, useState } from 'react'

import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import { BsArrowsExpand, BsArrowsCollapse } from 'react-icons/bs'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

import useStyles from './TreeView.styles'
import { ITreeItem, ITreeViewProps } from './TreeView.types'
import { sampleTreeStructure } from './TreeView.data'
import { getListSelectedNodes, getListAllNodes } from './TreeView.utils'

/**
 * Recursively render a JSX tree view based on the provided tree data structure
 * @param treeNode Object describing the tree item/node
 * @returns JSX representation of tree view
 */
const renderTree = (treeNode: ITreeItem): JSX.Element => {
  const classes = useStyles()

  return (
    <TreeItem
      key={treeNode.id}
      nodeId={treeNode.id}
      label={treeNode.name}
      classes={{ root: classes.treeItemSelected, label: classes.treeItemLabel }}
    >
      {treeNode.details && (
        <div className={classes.treeItemDescription}>
          <Typography variant="body2" component="p" className={classes.descriptionText}>
            {treeNode.details}
          </Typography>
        </div>
      )}
      {Array.isArray(treeNode.children) ? treeNode.children.map(childNode => renderTree(childNode)) : null}
    </TreeItem>
  )
}

const CustomTreeView = ({
  treeStructure = sampleTreeStructure,
  selectedItem
}: ITreeViewProps): JSX.Element => {
  const classes = useStyles()

  const [expanded, setExpanded] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    if (selectedItem !== selected[0]) setSelected([selectedItem])
    setExpanded(prevExpanded => {
      const newExpanded: string[] = []
      if (!prevExpanded.includes(selectedItem)) newExpanded.push(selectedItem)
      getListSelectedNodes(treeStructure).forEach(nodeId => {
        if (!prevExpanded.includes(nodeId)) newExpanded.push(nodeId)
      })
      return newExpanded.length ? [...prevExpanded, ...newExpanded] : prevExpanded
    })
  }, [selectedItem, treeStructure])

  const handleToggle = (event: React.ChangeEvent<Record<string, unknown>>, nodeIds: string[]) => {
    setExpanded(nodeIds)
  }

  const handleSelect = (event: React.ChangeEvent<Record<string, unknown>>, nodeIds: string[]) => {
    setSelected(nodeIds)
  }

  const expandTree = () => {
    setExpanded(getListAllNodes(treeStructure))
  }

  const collapseTree = () => {
    setExpanded([])
  }

  return (
    <>
      <div className={classes.top}>
        <Tooltip arrow title="expand all">
          <IconButton
            onClick={expandTree}
            className={classes.popoverButton}
            color="primary"
            size="small"
            aria-label="expand"
          >
            <BsArrowsExpand />
          </IconButton>
        </Tooltip>

        <Tooltip arrow title="collapse all">
          <IconButton
            onClick={collapseTree}
            className={classes.popoverButton}
            color="primary"
            size="small"
            aria-label="collapse"
          >
            <BsArrowsCollapse />
          </IconButton>
        </Tooltip>
      </div>

      <TreeView
        className={classes.treeContainer}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
      >
        {treeStructure.map(treeNode => renderTree(treeNode))}
      </TreeView>
    </>
  )
}

export default CustomTreeView
