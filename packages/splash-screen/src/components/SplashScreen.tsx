import React from 'react'

import { Grid, Typography, CircularProgress, Avatar } from '@material-ui/core'

import useStyles from './SplashScreen.styles'
import { useFinishMessage } from '../context'

import { LogContainer } from './LogContainer'

export interface SplashScreenProps {
  title: string
  subtitle?: string
}

export const SplashScreen = ({ title, subtitle }: SplashScreenProps): JSX.Element => {
  const classes = useStyles()

  const finishMessage = useFinishMessage()

  return (
    <Grid container direction="row" className={classes.container}>
      {/* left */}
      <Grid
        item
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        wrap="nowrap"
        xs={12}
        md={6}
        className={classes.leftColumn}
      >
        <Grid item>
          <Avatar
            className={classes.avatar}
            alt="Mechanical Turk"
            variant="circular"
            src="https://dharpa.org/img/story/mechTurk_color.jpg"
          />
        </Grid>

        <Grid item>
          <Typography variant="caption" component="h1" className={classes.header}>
            {title}
          </Typography>
        </Grid>

        <Grid item>
          {subtitle != null && (
            <Typography variant="caption" component="h2" className={classes.subheader}>
              {subtitle}
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* right */}
      <Grid
        item
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        wrap="nowrap"
        xs={12}
        md={6}
        className={classes.rightColumn}
      >
        <Grid item className={classes.appLoadStatus}>
          {finishMessage == null ? (
            <CircularProgress color="primary" />
          ) : (
            <Typography
              align="center"
              variant="caption"
              color={finishMessage?.type === 'ok' ? 'textPrimary' : 'error'}
            >
              {finishMessage?.text}
            </Typography>
          )}
        </Grid>

        <Grid item className={classes.logContainerWrapper}>
          <LogContainer hideWhenEmpty />
        </Grid>
      </Grid>
    </Grid>
  )
}
