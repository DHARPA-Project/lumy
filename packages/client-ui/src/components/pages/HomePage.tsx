import React from 'react'
import { useHistory } from 'react-router-dom'

import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import useStyles from './HomePage.styles'

import UndirectedNetworkGraph from '../../assets/svgs/UndirectedNetworkGraph'
import TopicModellingIcon from '../../assets/svgs/TopicModellingIcon'
import GeolocationIcon from '../../assets/svgs/GeolocationIcon'

/** TODO: to be replaced with dynamically constructed structure of available workflows. */
const HomePage: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()

  return (
    <div className={classes.pageContainer}>
      <Card className={classes.cardWrapper}>
        <CardActionArea onClick={() => history.push('/workflow-categories/network-analysis')}>
          <CardContent>
            <Typography gutterBottom variant="h6" component="h2" align="center">
              Network Analysis
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" align="center">
              Visualize network graphs assembled from raw data.
            </Typography>
          </CardContent>
          <div className={classes.cardImage}>
            <UndirectedNetworkGraph />
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
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h6" component="h2" align="center">
              Topic Modelling
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" align="center">
              Discover patterns in large collections of unstructured text.
            </Typography>
          </CardContent>
          <div className={classes.cardImage}>
            <TopicModellingIcon />
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
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h6" component="h2" align="center">
              Geolocation
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" align="center">
              Standardize, enrich, explore, and visualize geographic data.
            </Typography>
          </CardContent>
          <div className={classes.cardImage}>
            <GeolocationIcon />
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
  )
}

export default HomePage
