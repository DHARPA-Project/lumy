import React, { useContext, useState } from 'react'

import { ThemeProvider } from '@material-ui/core/styles'

import { useCurrentWorkflow } from '@dharpa-vre/client-core'
import { StepDesc } from '@dharpa-vre/client-core/src/common/types/kiaraGenerated'

import { ThemeContext } from '../../context/themeContext'
import { PageLayoutContext } from '../../context/pageLayoutContext'
import useStyles from './WorkflowContainer.styles'

import RightSideBarContainer from './toolbar/RightSideBarContainer'
import RightSideBarContent from './toolbar/RightSideBarContent'
import SideDrawer from './SideDrawer'
import FeatureTabs from './FeatureTabs'
import VerticalStepIndicator from './VerticalStepIndicator'
import WorkflowStep from './WorkflowStep'
import LoadingIndicator from './LoadingIndicator'

const WorkflowContainer = (): JSX.Element => {
  const classes = useStyles()

  const { sidebarTheme } = useContext(ThemeContext)
  const { isRightSideBarVisible, isSideDrawerOpen } = useContext(PageLayoutContext)

  /**
   * TODO: add condition to determine when tool bar should be rendered
   * (e.g. only on workflow project routes or certain workflow steps)
   */
  const toolBarRenderCondition = true

  const [currentWorkflow] = useCurrentWorkflow()

  const [[activeStep, direction], setActiveStep] = useState([0, 0])

  const projectSteps: StepDesc[] = Object.values(currentWorkflow?.steps || {}) || []

  const handleNext = () => {
    setActiveStep(([prevActiveStep, prevDirection]) => {
      const nextStep = prevActiveStep + 1
      if (nextStep >= projectSteps.length) return [prevActiveStep, prevDirection]
      return [nextStep, 1]
    })
  }

  const handleBack = () => {
    setActiveStep(([prevActiveStep, prevDirection]) => {
      const nextStep = prevActiveStep - 1
      if (nextStep < 0) return [prevActiveStep, prevDirection]
      return [nextStep, -1]
    })
  }

  if (currentWorkflow?.steps == null) return <LoadingIndicator />

  return (
    <div className={classes.workflowContainer}>
      <VerticalStepIndicator
        steps={projectSteps.map(projectStep => ({
          name: projectStep.step.moduleType
        }))}
        activeStep={activeStep}
        handleNext={handleNext}
        handleBack={handleBack}
      />

      <div
        className={
          classes.stepContainer +
          (isSideDrawerOpen ? ' right-squeeze' : isRightSideBarVisible ? ' right-pinch' : '')
        }
      >
        <WorkflowStep projectSteps={projectSteps} activeStep={activeStep} direction={direction} />
      </div>

      <SideDrawer anchor="right">
        <FeatureTabs />
      </SideDrawer>

      <ThemeProvider theme={sidebarTheme}>
        {toolBarRenderCondition && (
          <RightSideBarContainer>
            <RightSideBarContent />
          </RightSideBarContainer>
        )}
      </ThemeProvider>
    </div>
  )
}

export default WorkflowContainer
