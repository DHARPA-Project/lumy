import React, { useState } from 'react'

import useStyles from './NADataUploadRow.styles'

import Box from '@material-ui/core/Box'
import Grow from '@material-ui/core/Grow'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Checkbox from '@material-ui/core/Checkbox'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Collapse from '@material-ui/core/Collapse'

type FileType = {
  name: string
  columns: string[]
}

type NADataUploadRowProps = {
  file: FileType
}

const NADataUploadRow = ({ file }: NADataUploadRowProps): JSX.Element => {
  const classes = useStyles()

  const [isNodeSource, setIsNodeSource] = useState<boolean>(false)
  const [isEdgeSource, setIsEdgeSource] = useState<boolean>(false)
  const [nodeIdColumn, setNodeIdColumn] = useState<string>('')
  const [nodeLabelColumn, setNodeLabelColumn] = useState<string>('')
  const [sourceNodeColumn, setSourceNodeColumn] = useState<string>('')
  const [targetNodeColumn, setTargetNodeColumn] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleIsNodeSourceCheck = () => {
    setErrorMessage('')
    setIsNodeSource(prevStatus => {
      if (prevStatus === true) {
        setNodeIdColumn('')
        setNodeLabelColumn('')
      }
      return !prevStatus
    })
  }

  const handleIsEdgeSourceCheck = () => {
    setErrorMessage('')
    setIsEdgeSource(prevStatus => {
      if (prevStatus === true) {
        setSourceNodeColumn('')
        setTargetNodeColumn('')
      }
      return !prevStatus
    })
  }

  const handleNodeIdChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
    const newNodeIdColumn = event.target.value as string

    if (nodeLabelColumn && nodeLabelColumn === newNodeIdColumn) {
      setErrorMessage(`column "${newNodeIdColumn}" already marked as source of node labels`)
      setNodeIdColumn('')
      return
    }

    if (sourceNodeColumn && sourceNodeColumn === newNodeIdColumn) {
      setErrorMessage(`column "${newNodeIdColumn}" already marked as source nodes for edge detection`)
      setNodeIdColumn('')
      return
    }

    if (targetNodeColumn && targetNodeColumn === newNodeIdColumn) {
      setErrorMessage(`column "${newNodeIdColumn}" already marked as target nodes for edge detection`)
      setNodeIdColumn('')
      return
    }

    setErrorMessage('')
    setNodeIdColumn(newNodeIdColumn)
  }

  const handleNodeLabelChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
    const newNodeLabelColumn = event.target.value as string

    if (nodeIdColumn && nodeIdColumn === newNodeLabelColumn) {
      setErrorMessage(`column "${newNodeLabelColumn}" already marked as source of node IDs`)
      setNodeLabelColumn('')
      return
    }

    if (sourceNodeColumn && sourceNodeColumn === newNodeLabelColumn) {
      setErrorMessage(`column "${newNodeLabelColumn}" already marked as source nodes for edge detection`)
      setNodeLabelColumn('')
      return
    }

    if (targetNodeColumn && targetNodeColumn === newNodeLabelColumn) {
      setErrorMessage(`column "${newNodeLabelColumn}" already marked as target nodes for edge detection`)
      setNodeLabelColumn('')
      return
    }

    setErrorMessage('')
    setNodeLabelColumn(newNodeLabelColumn)
  }

  const handleSourceNodeColumnChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
    const newSourceNodeColumn = event.target.value as string

    if (nodeIdColumn && nodeIdColumn === newSourceNodeColumn) {
      setErrorMessage(`column "${newSourceNodeColumn}" already marked as source of node IDs`)
      setSourceNodeColumn('')
      return
    }

    if (nodeLabelColumn && nodeLabelColumn === newSourceNodeColumn) {
      setErrorMessage(`column "${newSourceNodeColumn}" already marked as source of node labels`)
      setSourceNodeColumn('')
      return
    }

    if (targetNodeColumn && targetNodeColumn === newSourceNodeColumn) {
      setErrorMessage(`column "${newSourceNodeColumn}" already marked as target nodes for edge detection`)
      setSourceNodeColumn('')
      return
    }

    setErrorMessage('')
    setSourceNodeColumn(newSourceNodeColumn)
  }

  const handleTargetNodeColumnChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
    const newTargetNodeColumn = event.target.value as string

    if (nodeIdColumn && nodeIdColumn === newTargetNodeColumn) {
      setErrorMessage(`column "${newTargetNodeColumn}" already marked as source of node IDs`)
      setTargetNodeColumn('')
      return
    }

    if (nodeLabelColumn && nodeLabelColumn === newTargetNodeColumn) {
      setErrorMessage(`column "${newTargetNodeColumn}" already marked as source of node labels`)
      setTargetNodeColumn('')
      return
    }

    if (sourceNodeColumn && sourceNodeColumn === newTargetNodeColumn) {
      setErrorMessage(`column "${newTargetNodeColumn}" already marked as source nodes for edge detection`)
      setTargetNodeColumn('')
      return
    }

    setErrorMessage('')
    setTargetNodeColumn(newTargetNodeColumn)
  }

  return (
    <>
      <TableRow className={classes.row}>
        <TableCell className={classes.borderless}>{file.name}</TableCell>

        <TableCell className={classes.borderless}>
          <div className={classes.cellContainer}>
            <Checkbox
              className={classes.checkbox}
              color="default"
              checked={isNodeSource}
              onChange={handleIsNodeSourceCheck}
            />

            <Grow
              in={isNodeSource}
              style={{ transformOrigin: '0 0 0' }}
              {...(isNodeSource ? { timeout: 1000 } : { timeout: 0 })}
            >
              <Box>
                <FormControl className={classes.formControl} variant="outlined" size="small" error={!!''}>
                  <InputLabel>ID</InputLabel>
                  <Select
                    name={`${file.name}-id-column`}
                    label="ID"
                    // autoWidth={true}
                    value={nodeIdColumn}
                    onChange={handleNodeIdChange}
                  >
                    <MenuItem key={-1} value="">
                      none
                    </MenuItem>
                    {file.columns.map((column, index) => (
                      <MenuItem key={index} value={column}>
                        {column}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl className={classes.formControl} variant="outlined" size="small">
                  <InputLabel>label</InputLabel>
                  <Select
                    name={`${file.name}-label-column`}
                    label="label"
                    value={nodeLabelColumn}
                    onChange={handleNodeLabelChange}
                  >
                    <MenuItem key={-1} value="">
                      none
                    </MenuItem>
                    {file.columns.map((column, index) => (
                      <MenuItem key={index} value={column}>
                        {column}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grow>
          </div>
        </TableCell>

        <TableCell className={classes.borderless}>
          <div className={classes.cellContainer}>
            <Checkbox
              className={classes.checkbox}
              color="default"
              checked={isEdgeSource}
              onChange={handleIsEdgeSourceCheck}
            />

            <Grow
              in={isEdgeSource}
              style={{ transformOrigin: '0 0 0' }}
              {...(isEdgeSource ? { timeout: 1000 } : { timeout: 0 })}
            >
              <Box>
                <FormControl className={classes.formControl} variant="outlined" size="small">
                  <InputLabel>source</InputLabel>
                  <Select
                    name={`${file.name}-source-column`}
                    label="source"
                    value={sourceNodeColumn}
                    onChange={handleSourceNodeColumnChange}
                  >
                    <MenuItem key={-1} value="">
                      none
                    </MenuItem>
                    {file.columns.map((column, index) => (
                      <MenuItem key={index} value={column}>
                        {column}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl className={classes.formControl} variant="outlined" size="small">
                  <InputLabel>target</InputLabel>
                  <Select
                    name={`${file.name}-target-column`}
                    label="target"
                    value={targetNodeColumn}
                    onChange={handleTargetNodeColumnChange}
                  >
                    <MenuItem key={-1} value="">
                      none
                    </MenuItem>
                    {file.columns.map((column, index) => (
                      <MenuItem key={index} value={column}>
                        {column}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grow>
          </div>
        </TableCell>
      </TableRow>

      <TableRow className={classes.row}>
        <TableCell className={classes.errorCell} colSpan={3}>
          <Collapse in={!!errorMessage} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <FormHelperText className={classes.errorMessage}>{errorMessage}</FormHelperText>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default NADataUploadRow
