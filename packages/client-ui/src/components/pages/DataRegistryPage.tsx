import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination'
import InputAdornment from '@material-ui/core/InputAdornment'

import AddIcon from '@material-ui/icons/Add'
import Search from '@material-ui/icons/Search'

import { DataRepositoryItemsFilter, useDataRepository } from '@dharpa-vre/client-core'

import useStyles from './DataRegistryPage.styles'

import DataRegistryRow from '../common/registry/DataRegistryRow'

const defaultNumberRowsPerPage = 5

const DataRegistryPage: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()

  const [pageNumber, setPageNumber] = useState(0)
  const [repositoryItemFilter, setRepositoryItemFilter] = useState<DataRepositoryItemsFilter>({
    pageSize: defaultNumberRowsPerPage,
    types: ['table']
  })
  const [numRowsPerPage, setNumRowsPerPage] = useState(
    repositoryItemFilter?.pageSize ?? defaultNumberRowsPerPage
  )
  const [repositoryItemsBatch, repositoryStats] = useDataRepository(repositoryItemFilter)
  const updateRepositoryItemsFilter = (filter: DataRepositoryItemsFilter) =>
    setRepositoryItemFilter({ pageSize: defaultNumberRowsPerPage, ...filter, types: ['table'] })

  const handlePageNumberChange = (event: unknown, newPageNumber: number) => {
    setPageNumber(newPageNumber)
    updateRepositoryItemsFilter?.({
      pageSize: numRowsPerPage,
      offset: newPageNumber * numRowsPerPage
    })
  }

  const handleNumRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumRowsPerPage(+event.target.value)
    setPageNumber(0)
    updateRepositoryItemsFilter?.({
      pageSize: +event.target.value,
      offset: 0
    })
  }

  return (
    <Container className={classes.dataRegistryContainer}>
      <Paper className={classes.dataRegistryContent}>
        <Typography component="h1" variant="h5" className={classes.headline}>
          Data Registry
        </Typography>

        <div className={classes.toolbar}>
          <TextField
            // onChange={handleSearch}
            // {...(error && { error: true, helperText: error })}
            // name={name}
            // value={value}
            className={classes.search}
            variant="outlined"
            label="search data sources"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />

          <Button
            onClick={() => history.push('/dataregistry/add')}
            className={classes.addItemButton}
            startIcon={<AddIcon />}
            variant="contained"
            color="default"
            size="small"
          >
            New Data Source
          </Button>
        </div>

        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} stickyHeader aria-label="table sticky">
            <TableHead>
              <TableRow>
                <TableCell align="center" className={classes.tableHeadCell}>
                  name
                </TableCell>
                <TableCell align="center" className={classes.tableHeadCell}>
                  type
                </TableCell>
                <TableCell align="center" className={classes.tableHeadCell}>
                  tags
                </TableCell>
                <TableCell align="center" className={classes.tableHeadCell}>
                  notes
                </TableCell>
                <TableCell align="center" className={classes.tableHeadCell} />
              </TableRow>
            </TableHead>

            <TableBody className={classes.tableBody}>
              {[...(repositoryItemsBatch ?? [])].map((row, rowIndex) => (
                <DataRegistryRow repositoryItem={row} key={rowIndex} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={repositoryStats?.rowsCount ?? 0}
          page={pageNumber}
          rowsPerPage={numRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, { label: 'all', value: -1 }]}
          onChangePage={handlePageNumberChange}
          onChangeRowsPerPage={handleNumRowsPerPageChange}
        />
      </Paper>
    </Container>
  )
}

export default DataRegistryPage
