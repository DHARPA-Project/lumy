import React from 'react'

import NavigationIcon from '@material-ui/icons/Navigation'

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
  const classes = useStyles(activeStep)

  return (
    <div className={classes.stepBarContainer}>
      <div className={classes.stepBarContent}>
        <NavigationIcon
          onClick={handleBack}
          className={
            classes.workflowNavArrow + ' ' + classes.previous + (activeStep === 0 ? ' disabled' : '')
          }
          color="primary"
          aria-label="previous-step"
        />

        <ul className={classes.indicators}>
          {steps.map((step, index) => {
            const isActiveStep = index === activeStep
            const isCompleted = index < activeStep

            return (
              <StepDetailTooltip
                key={index}
                step={step}
                status={isActiveStep ? 'current' : isCompleted ? 'completed' : 'coming up'}
              >
                <li
                  className={
                    classes.stepIndicator +
                    (isActiveStep ? ' active' : '') +
                    (isCompleted ? ' completed' : '')
                  }
                />
              </StepDetailTooltip>
            )
          })}
        </ul>

        <NavigationIcon
          onClick={handleNext}
          className={
            classes.workflowNavArrow +
            ' ' +
            classes.next +
            (activeStep === steps.length - 1 ? ' disabled' : '')
          }
          color="primary"
          aria-label="previous-step"
        />
      </div>
    </div>
  )
}

export default VerticalStepIndicator
