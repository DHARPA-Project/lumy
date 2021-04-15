import React from 'react'

import useStyles from './NADataUploadForm.styles'

import Button from '@material-ui/core/Button'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

import SaveIcon from '@material-ui/icons/Save'

import NADataUploadRow from './NADataUploadRow'

const mockFileList = [
  {
    name: 'file A',
    columns: ['column A', 'column B', 'column C']
  },
  {
    name: 'file B',
    columns: ['column A', 'column B', 'column C', 'column D', 'column E', 'column F']
  },
  {
    name: 'file C',
    columns: ['column A', 'column B', 'column C', 'column D']
  },
  {
    name: 'file D',
    columns: ['column A', 'column B', 'column C', 'column D', 'column E', 'column F', 'column G', 'column H']
  }
]

type NADataUploadProps = {
  closeModal: () => void
}

const NADataUpload = ({ closeModal }: NADataUploadProps): JSX.Element => {
  const classes = useStyles()

  return (
    <form className={classes.root}>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>File</TableCell>
              <TableCell>Nodes</TableCell>
              <TableCell>Edges</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={classes.tableBody}>
            {mockFileList.map(file => (
              <NADataUploadRow key={file.name} file={file} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="primary"
        size="medium"
        className={classes.button}
        startIcon={<SaveIcon />}
        onClick={closeModal}
      >
        Save
      </Button>
    </form>
  )
}

export default NADataUpload
