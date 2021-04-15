import React from 'react'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'

import MobileStepper from '@material-ui/core/MobileStepper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Skeleton from '@material-ui/lab/Skeleton'

import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

const carouselSlides = [
  {
    index: '1',
    label: 'graph 1',
    imgPath: ''
  },
  {
    index: '2',
    label: 'graph 2',
    imgPath: ''
  },
  {
    index: '3',
    label: 'graph 3',
    imgPath: ''
  },
  {
    index: '4',
    label: 'graph 4',
    imgPath: ''
  },
  {
    index: '5',
    label: 'graph 5',
    imgPath: ''
  }
]

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.spacing(3)
  },
  visual: {
    maxWidth: '100%',
    flexGrow: 1,
    color: theme.palette.text.secondary
  },
  narrative: {
    maxWidth: '100%',
    flexGrow: 1
  },
  img: {
    height: 255,
    display: 'block',
    maxWidth: 400,
    overflow: 'hidden',
    width: '100%'
  },
  placeholderCard: {
    width: '100%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(12),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: `2px solid ${theme.palette.text.secondary}`,
    borderRadius: theme.spacing(1)
  }
}))

const WorkflowPreviewCarousel = (): JSX.Element => {
  const classes = useStyles()
  const theme = useTheme()
  const [activeStep, setActiveStep] = React.useState(0)
  const maxSteps = carouselSlides.length

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleStepChange = (step: number) => {
    setActiveStep(step)
  }

  return (
    <div className={classes.root}>
      <div className={classes.narrative}>
        <AutoPlaySwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {carouselSlides.map(step => (
            <div key={step.index}>
              <Typography variant="h5" align="center" color="primary">
                module {carouselSlides[activeStep].index}
              </Typography>
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
              <Skeleton animation={false} />
              <Skeleton animation={false} />
              <Skeleton animation={false} />
              <Skeleton animation={false} />
              <Skeleton animation={false} />
              <Skeleton animation={false} />
            </div>
          ))}
        </AutoPlaySwipeableViews>
      </div>

      <div className={classes.visual}>
        <AutoPlaySwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {carouselSlides.map((step, index) => (
            <div key={step.index}>
              {step.imgPath ? (
                Math.abs(activeStep - index) <= 2 ? (
                  <img className={classes.img} src={step.imgPath} alt={step.label} />
                ) : null
              ) : (
                <div className={classes.placeholderCard}>
                  <Typography variant="h5">visual {carouselSlides[activeStep].index}</Typography>
                </div>
              )}
            </div>
          ))}
        </AutoPlaySwipeableViews>

        <MobileStepper
          steps={maxSteps}
          position="static"
          variant="text"
          activeStep={activeStep}
          nextButton={
            <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
              Next
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
          }
        />
      </div>
    </div>
  )
}

export default WorkflowPreviewCarousel
