import React from 'react'

import NavigationIcon from '@material-ui/icons/Navigation'

import useStyles from './VerticalStepIndicator.styles'
import StepDetailTooltip from './StepDetailTooltip'

interface IStepData {
  name: string
}

type VerticalStepIndicatorProps = {
  steps: IStepData[]
  currentPageIndex: number
  handleNext: () => void
  handleBack: () => void
}

const VerticalStepIndicator = ({
  steps,
  currentPageIndex,
  handleNext,
  handleBack
}: VerticalStepIndicatorProps): JSX.Element => {
  const classes = useStyles(currentPageIndex)

  return (
    <div className={classes.stepBarContainer}>
      <div className={classes.stepBarContent}>
        <NavigationIcon
          onClick={handleBack}
          className={
            classes.workflowNavArrow + ' ' + classes.previous + (currentPageIndex === 0 ? ' disabled' : '')
          }
          color="primary"
          aria-label="previous-step"
        />

        <ul className={classes.indicators}>
          {steps.map((step, index) => {
            const isActiveStep = index === currentPageIndex
            const isCompleted = index < currentPageIndex

            /** TODO: No such notion as "step status" for workflow steps/pages. Consider removing. */
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
            (currentPageIndex === steps.length - 1 ? ' disabled' : '')
          }
          color="primary"
          aria-label="previous-step"
        />
      </div>
    </div>
  )
}

export default VerticalStepIndicator
