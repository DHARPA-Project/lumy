import React from 'react'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

import PopularityChart from '../sample/PopularityChart'
import UserList from '../sample/UserList'
import Summary from '../sample/Summary'

import useStyles from './IntroPage.styles'

/** TODO: not used. consider removing */
const IntroPage: React.FC = () => {
  const classes = useStyles()

  return (
    <div>
      <Typography component="h1" variant="h5" className={classes.headline}>
        DHARPA Data Science Tool
      </Typography>

      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Paper className={classes.fixedHeightPaper}>
              <UserList />
            </Paper>
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <Paper className={classes.fixedHeightPaper}>
              <Summary />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className={classes.fixedHeightPaper}>
              <PopularityChart />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default IntroPage
