import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Skeleton from '@material-ui/lab/Skeleton'

import useStyles from './NetworkAnalysisPage.styles'

import SampleNetworkGraph from '../../assets/svgs/SampleNetworkGraph'
import ForceDirectedNetworkGraph from '../../assets/svgs/DirectedNetworkGraph'
import MultiGraphNetworkGraph from '../../assets/svgs/MultiGraphNetworkGraph'
import OptionCard from '../common/OptionCard'

const NetworkAnalysisPage: React.FC = () => {
  const classes = useStyles()

  // are all nodes homogeneous (e.g. only people, only books) or heterogeneous (e.g. soldiers and their units, professors and universities)
  const [nodeHomogeneity, setNodeHomogeneity] = useState<'one-mode' | 'multi-mode'>(null)
  // does the direction of the node connection matter (e.g. sending or receiving, following and being followed) or not
  const [connectionDirection, setConnectionDirection] = useState<'directed' | 'undirected'>(null)

  const homogeneityOptions = (
    <>
      <OptionCard
        title="One-mode Network"
        subtitle="A network consiting of only homogeneous nodes (e.g. only people or only books)."
        image={<SampleNetworkGraph />}
        clickHandler={() => setNodeHomogeneity('one-mode')}
      />

      <OptionCard
        title="Multi-mode Network"
        subtitle="A network consisting of heterogeneous nodes (e.g. connections among soldiers and their units or among students, professors, and their universities."
        image={<MultiGraphNetworkGraph />}
        clickHandler={() => setNodeHomogeneity('multi-mode')}
      />
    </>
  )

  const directionOptions = (
    <>
      <OptionCard
        title="Directed"
        subtitle="Visualize directed network graphs assembled from raw data."
        image={<ForceDirectedNetworkGraph />}
        clickHandler={() => setConnectionDirection('directed')}
      />

      <OptionCard
        title="Undirected"
        subtitle="Visualize undirected network graphs assembled from raw data."
        image={<SampleNetworkGraph />}
        clickHandler={() => setConnectionDirection('undirected')}
      />
    </>
  )

  return (
    <div className={classes.naPageContainer}>
      <Typography component="h1" variant="h5" className={classes.headline}>
        Network Analysis
      </Typography>

      <Container className={classes.content}>
        <Paper className={`${classes.block} ${classes.description}`}>
          <div>
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton animation={false} key={index} />
            ))}
          </div>
          <div>
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton animation={false} key={index} />
            ))}
          </div>
        </Paper>
      </Container>

      <div className={classes.workflowTypes}>
        {nodeHomogeneity === 'one-mode' && connectionDirection === 'directed' ? (
          <Redirect to="/workflows/network-analysis/directed" />
        ) : nodeHomogeneity === 'one-mode' && connectionDirection !== 'directed' ? (
          directionOptions
        ) : (
          homogeneityOptions
        )}
      </div>
    </div>
  )
}

export default NetworkAnalysisPage
