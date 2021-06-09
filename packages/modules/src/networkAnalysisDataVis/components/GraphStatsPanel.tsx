import React from 'react'
import { OutputValues } from '../structure'
import useStyles from './GraphStatsPanel.styles'

export interface GraphStatsPanelProps {
  graphStats: OutputValues['graphStats']
}

export const GraphStatsPanel = ({ graphStats }: GraphStatsPanelProps): JSX.Element => {
  const classes = useStyles()
  return <pre className={classes.root}>{graphStats == null ? '' : JSON.stringify(graphStats, null, 2)}</pre>
}
