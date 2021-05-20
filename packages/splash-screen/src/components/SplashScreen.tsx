import React from 'react'
import {
  Grid,
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { LogContainer } from './LogContainer'
import useStyles from './SplashScreen.styles'
import { useFinishMessage } from '../context'

export interface SplashScreenProps {
  title: string
  subtitle?: string
  onLogToggle?: (isExpanded: boolean) => void
}

export const SplashScreen = ({ title, subtitle, onLogToggle }: SplashScreenProps): JSX.Element => {
  const [isLogExpanded, setLogExpanded] = React.useState(false)
  const classes = useStyles()
  const finishMessage = useFinishMessage()

  React.useEffect(() => onLogToggle?.(isLogExpanded), [isLogExpanded])

  return (
    <div className={classes.root}>
      <Grid container direction="row" wrap="nowrap" className={classes.container}>
        {/* left */}
        <Grid item className={classes.leftColumn}>
          <Avatar
            className={classes.avatar}
            alt="Mechanical Turk"
            variant="circular"
            src="https://dharpa.org/img/story/mechTurk_color.jpg"
          />
        </Grid>
        {/* right */}
        <Grid item className={classes.rightColumn}>
          <Grid
            container
            direction="column"
            justify="center"
            alignContent="center"
            spacing={2}
            wrap="nowrap"
            className={classes.mainSection}
          >
            <Grid item>
              <Typography variant="caption" component="h1" className={classes.header}>
                {title}
              </Typography>
            </Grid>
            <Grid item>
              {subtitle != null ? (
                <Typography variant="caption" component="h2" className={classes.subheader}>
                  {subtitle}
                </Typography>
              ) : (
                ''
              )}
            </Grid>
            <Grid item className={classes.spinnerContainer}>
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
              <Accordion
                square
                className={classes.accordion}
                onChange={(_, isExpanded) => setLogExpanded(isExpanded)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} className={classes.accordionSummary}>
                  <Typography variant="button">{isLogExpanded ? 'Hide log' : 'Show log'}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <LogContainer className={classes.logContainer} hideWhenEmpty />
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
