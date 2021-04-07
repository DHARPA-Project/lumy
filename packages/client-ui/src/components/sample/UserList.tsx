import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { getCurrentDate } from '../../utils/date'

import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

const mockUserStats = [
  {
    date: getCurrentDate(),
    name: 'Cindy Parkins',
    field: 'history',
    workflow: 'topic modelling'
  },
  {
    date: getCurrentDate(),
    name: 'Hillary Cliffson',
    field: 'sociology',
    workflow: 'network analysis'
  },
  {
    date: getCurrentDate(),
    name: 'Mary Crawford',
    field: 'natural language processing',
    workflow: 'topic modelling'
  },
  {
    date: getCurrentDate(),
    name: 'Robert Brown',
    field: 'geography',
    workflow: 'geolocation'
  },
  {
    date: getCurrentDate(),
    name: 'Megan Dawson',
    field: 'history',
    workflow: 'network analysis'
  }
]

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3)
  }
}))

const UserList: React.FC = () => {
  const classes = useStyles()

  const handleLinkClick = (event: React.MouseEvent): void => {
    event.preventDefault()
  }

  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Recent Activity
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Field</TableCell>
            <TableCell>Workflow Used</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockUserStats.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{user.date}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.field}</TableCell>
              <TableCell>{user.workflow}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Link className={classes.seeMore} color="primary" href="#" onClick={handleLinkClick}>
        detailed activity statistics
      </Link>
    </>
  )
}

export default UserList
