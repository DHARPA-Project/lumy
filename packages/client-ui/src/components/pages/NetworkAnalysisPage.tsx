import React from 'react'
import { useHistory } from 'react-router-dom'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Skeleton from '@material-ui/lab/Skeleton'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Divider from '@material-ui/core/Divider'

import useStyles from './NetworkAnalysisPage.styles'

import SampleNetworkGraph from '../../assets/svgs/SampleNetworkGraph'
import ForceDirectedNetworkGraph from '../../assets/svgs/DirectedNetworkGraph'
import MultiGraphNetworkGraph from '../../assets/svgs/MultiGraphNetworkGraph'

const NetworkAnalysisPage: React.FC = () => {
  const classes = useStyles()

  const history = useHistory()

  return (
    <div className={classes.naPageContainer}>
      <Typography component="h1" variant="h5" className={classes.headline}>
        Network Analysis
      </Typography>

      <Container className={classes.content}>
        <Paper className={`${classes.block} ${classes.description}`}>
          <div className={classes.paragraphPlaceholder}>
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
          </div>
          <div className={classes.paragraphPlaceholder}>
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
          </div>
        </Paper>
      </Container>

      <div className={classes.workflowTypes}>
        <Card className={classes.cardWrapper}>
          {/* <CardActionArea onClick={() => history.push('/workflows/network-analysis/undirected')}> */}
          <CardActionArea onClick={() => console.log('navigate to undirected')}>
            <CardContent>
              <Typography gutterBottom variant="h6" component="h2" align="center">
                Undirected
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" align="center">
                Visualize undirected network graphs assembled from raw data.
              </Typography>
            </CardContent>
            <div className={classes.cardImage}>
              <SampleNetworkGraph />
            </div>
          </CardActionArea>

          <Divider />

          <CardActions className={classes.cardActions}>
            <Button size="small" color="primary">
              Learn More
            </Button>
          </CardActions>
        </Card>

        <Card className={classes.cardWrapper}>
          <CardActionArea onClick={() => history.push('/workflows/network-analysis/directed')}>
            <CardContent>
              <Typography gutterBottom variant="h6" component="h2" align="center">
                Directed
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" align="center">
                Visualize directed network graphs assembled from raw data.
              </Typography>
            </CardContent>
            <div className={classes.cardImage}>
              <ForceDirectedNetworkGraph />
            </div>
          </CardActionArea>

          <Divider />

          <CardActions className={classes.cardActions}>
            <Button size="small" color="primary">
              Learn More
            </Button>
          </CardActions>
        </Card>

        <Card className={classes.cardWrapper}>
          {/* <CardActionArea onClick={() => history.push('/workflows/network-analysis/multigraph')}> */}
          <CardActionArea onClick={() => console.log('navigate to multigraph')}>
            <CardContent>
              <Typography gutterBottom variant="h6" component="h2" align="center">
                Multi-graph
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" align="center">
                Visualize multi-graph network graphs assembled from raw data.
              </Typography>
            </CardContent>
            <div className={classes.cardImage}>
              <MultiGraphNetworkGraph />
            </div>
          </CardActionArea>

          <Divider />

          <CardActions className={classes.cardActions}>
            <Button size="small" color="primary">
              Learn More
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>
  )
}

export default NetworkAnalysisPage
