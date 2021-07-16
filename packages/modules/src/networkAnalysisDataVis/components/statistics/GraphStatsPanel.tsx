import React, { useState } from 'react'

import { TableCell as MuiTableCell, TableCellProps } from '@material-ui/core'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import Divider from '@material-ui/core/Divider'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { GraphStats } from '../../structure'
import useStyles from './GraphStatsPanel.styles'

export interface GraphStatsPanelProps {
  graphStats: Partial<GraphStats>
}

const TableCell = ({ children }: TableCellProps): JSX.Element => {
  const classes = useStyles()
  return <MuiTableCell classes={{ root: classes.tableCellRoot }}>{children}</MuiTableCell>
}

export const GraphStatsPanel = ({ graphStats }: GraphStatsPanelProps): JSX.Element => {
  const classes = useStyles()

  const [expanded, setExpanded] = useState<boolean>(true)

  return (
    <div className={classes.statContainer}>
      <Accordion expanded={expanded} onChange={() => setExpanded(prevStatus => !prevStatus)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1d-content">
          <Typography>Graph Statistics</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Divider />
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Number of nodes:</TableCell>
                <TableCell>{graphStats?.nodesCount?.toFixed(0)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Number of edges:</TableCell>
                <TableCell>{graphStats?.edgesCount?.toFixed(0)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Density:</TableCell>
                <TableCell>{graphStats?.density?.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Avg. in degree:</TableCell>
                <TableCell>{graphStats?.averageInDegree?.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Avg. out degree:</TableCell>
                <TableCell>{graphStats?.averageOutDegree?.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Avg. shortest path length:</TableCell>
                <TableCell>{graphStats?.averageShortestPathLength?.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
