import React from 'react'
import { Redirect, useHistory, useLocation } from 'react-router-dom'
import URLSearchParams from '@ungap/url-search-params'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'

import Skeleton from '@material-ui/lab/Skeleton'

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace'

import useStyles from './NetworkAnalysisPage.styles'

import SampleNetworkGraph from '../../assets/svgs/SampleNetworkGraph'

import OneModeNetworkGraph from '../../assets/svgs/OneModeNetworkGraph.svg'
import MultiModeNetworkGraph from '../../assets/svgs/MultiModeNetworkGraph.svg'
import BipartiteNetworkGraph from '../../assets/svgs/BipartiteNetworkGraph.svg'
import DirectedNetworkGraph from '../../assets/svgs/DirectedNetworkGraph.svg'

import OptionCard from '../common/OptionCard'

// are all nodes homogeneous (e.g. only people, only books) or heterogeneous (e.g. soldiers and their units, professors and universities)
type NodeHomogeneityType = 'one-mode' | 'multi-mode'
// does the direction of the node connection matter (e.g. sending or receiving, following and being followed) or not
type NodeDirectionType = 'directed' | 'undirected'
// multi-mode options: bipartite / more than two
// type NodeModeNumberType = 'bipartite' | 'more-than-two'

const NetworkAnalysisPage: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const { pathname, search } = useLocation()
  const queryParamObj = new URLSearchParams(search)
  const nodeHomogeneity = queryParamObj.get('nodeHomogeneity') as NodeHomogeneityType
  const connectionDirection = queryParamObj.get('connectionDirection') as NodeDirectionType
  // const numberModes = queryParamObj.get('numberModes') as NodeModeNumberType

  const setQueryParam = (key: string, value: string): void => {
    queryParamObj.set(key, value)
    history.push({ pathname, search: queryParamObj.toString() })
  }

  const homogeneityOptionCards = (
    <>
      <OptionCard
        title="One-mode Network"
        subtitle="A network consiting of only homogeneous nodes (e.g. only people or only books)."
        backgroundImage={OneModeNetworkGraph}
        clickHandler={() => setQueryParam('nodeHomogeneity', 'one-mode')}
      />

      <OptionCard
        title="Multi-mode Network"
        subtitle="A network consisting of heterogeneous nodes (e.g. connections among soldiers and their units or among students, professors, and their universities."
        backgroundImage={MultiModeNetworkGraph}
        clickHandler={() => setQueryParam('nodeHomogeneity', 'multi-mode')}
      />
    </>
  )

  const directionOptionCards = (
    <>
      <OptionCard
        title="Directed"
        subtitle="Visualize directed network graphs assembled from raw data."
        backgroundImage={DirectedNetworkGraph}
        clickHandler={() => setQueryParam('connectionDirection', 'directed')}
      />

      <OptionCard
        title="Undirected"
        subtitle="Visualize undirected network graphs assembled from raw data."
        image={<SampleNetworkGraph />}
        clickHandler={() => setQueryParam('connectionDirection', 'undirected')}
      />
    </>
  )

  const multimodeOptionCards = (
    <>
      <OptionCard
        title="Bipartite"
        subtitle="Two modes"
        backgroundImage={BipartiteNetworkGraph}
        clickHandler={() => setQueryParam('numberModes', 'bipartite')}
      />

      <OptionCard
        title="More than two"
        subtitle="More than two modes"
        backgroundImage={MultiModeNetworkGraph}
        clickHandler={() => setQueryParam('numberModes', 'more-than-two')}
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
        {connectionDirection === 'directed' ? (
          <Redirect to={`${pathname}/directed`} />
        ) : nodeHomogeneity === 'one-mode' ? (
          directionOptionCards
        ) : nodeHomogeneity === 'multi-mode' ? (
          multimodeOptionCards
        ) : (
          homogeneityOptionCards
        )}
      </div>

      {nodeHomogeneity && (
        <div className={classes.buttons}>
          <Button
            variant="contained"
            startIcon={<KeyboardBackspaceIcon />}
            onClick={() => history.push(pathname)}
            size="small"
          >
            Back
          </Button>
        </div>
      )}
    </div>
  )
}

export default NetworkAnalysisPage
