import React from 'react'

import Fab from '@material-ui/core/Fab'

import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'

import useStyles from './VerticalStepIndicator.styles'
import StepDetailTooltip from './StepDetailTooltip'

interface IStepData {
  name: string
}

type VerticalStepIndicatorProps = {
  steps: IStepData[]
  activeStep: number
  handleNext: () => void
  handleBack: () => void
}

const VerticalStepIndicator = ({
  steps,
  activeStep,
  handleNext,
  handleBack
}: VerticalStepIndicatorProps): JSX.Element => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <Fab
        variant="extended"
        size="small"
        color="primary"
        aria-label="toggle"
        className={classes.previous}
        onClick={handleBack}
        disabled={activeStep === 0}
      >
        <KeyboardArrowUpIcon />
      </Fab>

      <ul className={classes.indicators}>
        {steps.map((step, index) => {
          const isActiveStep = index === activeStep
          const isCompleted = index < activeStep

          return (
            <StepDetailTooltip
              key={index}
              step={step}
              status={isActiveStep ? 'ongoing' : isCompleted ? 'completed' : 'coming up'}
            >
              <li
                className={
                  classes.stepIndicator + (isActiveStep ? ' active' : '') + (isCompleted ? ' completed' : '')
                }
              />
            </StepDetailTooltip>
          )
        })}
      </ul>

      <Fab
        variant="extended"
        size="small"
        color="primary"
        aria-label="toggle"
        className={classes.next}
        onClick={handleNext}
        disabled={activeStep === steps.length - 1}
      >
        <KeyboardArrowDownIcon />
      </Fab>
    </div>
  )
}

export default VerticalStepIndicator
