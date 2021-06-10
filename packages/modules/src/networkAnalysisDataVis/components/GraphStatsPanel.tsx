import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  TableHead,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core'
import { OutputValues } from '../structure'
import useStyles from './GraphStatsPanel.styles'

export interface GraphStatsPanelProps {
  graphStats: OutputValues['graphStats']
}

export const GraphStatsPanel = ({ graphStats }: GraphStatsPanelProps): JSX.Element => {
  //const classes = useStyles()

  // don't know how to map object entries with typescript
  // styles need to be defined properly in style file

  return (
    <Card>
      <CardContent style={{ padding: '0px', marginBottom: '12px' }}>
        <Typography></Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Graph statistics</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell style={{ borderBottom: 'none', paddingBottom: '2px' }}>Number of nodes:</TableCell>
              <TableCell style={{ borderBottom: 'none', paddingBottom: '2px' }}>
                {graphStats?.nodesCount.toFixed(0)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ borderBottom: 'none', paddingBottom: '2px' }}>Number of edges:</TableCell>
              <TableCell style={{ borderBottom: 'none', paddingBottom: '2px' }}>
                {graphStats?.edgesCount.toFixed(0)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ borderBottom: 'none', paddingBottom: '2px' }}>Density:</TableCell>
              <TableCell style={{ borderBottom: 'none', paddingBottom: '2px' }}>
                {graphStats?.density.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ borderBottom: 'none', paddingBottom: '2px' }}>Avg. in degree:</TableCell>
              <TableCell style={{ borderBottom: 'none', paddingBottom: '2px' }}>
                {graphStats?.averageInDegree.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ borderBottom: 'none', paddingBottom: '2px' }}>Avg. out degree:</TableCell>
              <TableCell style={{ borderBottom: 'none', paddingBottom: '2px' }}>
                {graphStats?.averageOutDegree.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ borderBottom: 'none', paddingBottom: '2px' }}>
                Avg. shortest path length:
              </TableCell>
              <TableCell style={{ borderBottom: 'none', paddingBottom: '2px' }}>
                {graphStats?.averageShortestPathLength.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
