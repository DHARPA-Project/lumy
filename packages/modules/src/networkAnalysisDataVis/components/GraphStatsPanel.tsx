import React from 'react'
import {
  Card,
  CardContent,
  TableHead,
  Table,
  TableBody,
  TableRow,
  TableCell as MuiTableCell,
  TableCellProps
} from '@material-ui/core'
import { OutputValues } from '../structure'
import useStyles from './GraphStatsPanel.styles'

export interface GraphStatsPanelProps {
  graphStats: OutputValues['graphStats']
}

const TableCell = ({ children }: TableCellProps): JSX.Element => {
  const classes = useStyles()
  return <MuiTableCell classes={{ root: classes.tableCellRoot }}>{children}</MuiTableCell>
}

export const GraphStatsPanel = ({ graphStats }: GraphStatsPanelProps): JSX.Element => {
  const classes = useStyles()

  return (
    <Card classes={{ root: classes.cardRoot }}>
      <CardContent classes={{ root: classes.cardContentRoot }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <MuiTableCell>Graph statistics</MuiTableCell>
              <MuiTableCell></MuiTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Number of nodes:</TableCell>
              <TableCell>{graphStats?.nodesCount.toFixed(0)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Number of edges:</TableCell>
              <TableCell>{graphStats?.edgesCount.toFixed(0)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Density:</TableCell>
              <TableCell>{graphStats?.density.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Avg. in degree:</TableCell>
              <TableCell>{graphStats?.averageInDegree.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Avg. out degree:</TableCell>
              <TableCell>{graphStats?.averageOutDegree.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Avg. shortest path length:</TableCell>
              <TableCell>{graphStats?.averageShortestPathLength.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
