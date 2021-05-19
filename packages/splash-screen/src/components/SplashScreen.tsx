import React from 'react'
import {
  Grid,
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core'
import { LogContainer } from './LogContainer'
import useStyles from './SplashScreen.styles'
import { useFinishMessage } from '../context'

export interface SplashScreenProps {
  title?: string
}

export const SplashScreen = ({ title }: SplashScreenProps): JSX.Element => {
  const [isLogExpanded, setLogExpanded] = React.useState(false)
  const classes = useStyles()
  const finishMessage = useFinishMessage()

  return (
    <div className={classes.root}>
      <Grid
        container
        direction="column"
        justify="center"
        alignContent="center"
        className={classes.container}
        spacing={2}
        wrap="nowrap"
      >
        {title != null ? (
          <Grid item>
            <Typography variant="caption" component="h1" className={classes.header}>
              {title}
            </Typography>
          </Grid>
        ) : (
          ''
        )}
        <Grid item className={classes.spinnerContainer}>
          {finishMessage == null ? (
            <CircularProgress color="secondary" />
          ) : (
            <Typography align="center" color={finishMessage?.type === 'ok' ? 'primary' : 'error'}>
              {finishMessage?.text}
            </Typography>
          )}
        </Grid>
        <Grid item className={classes.logContainerWrapper}>
          <Accordion
            square
            className={classes.accordion}
            onChange={(_, isExpanded) => setLogExpanded(isExpanded)}
          >
            <AccordionSummary>
              <Typography>{isLogExpanded ? 'Hide log' : 'Show log'}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <LogContainer className={classes.logContainer} hideWhenEmpty />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </div>
  )
}
