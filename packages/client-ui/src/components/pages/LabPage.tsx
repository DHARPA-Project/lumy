import React, { useState } from 'react'
import { Int32, Utf8 } from 'apache-arrow'

import { makeStyles } from '@material-ui/core/styles'

import { ModuleViewFactory, useCurrentWorkflow } from '@dharpa-vre/client-core'

import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'

import { StepDesc } from '@dharpa-vre/client-core/src/common/types/kiaraGenerated'

import VerticalStepIndicator from '../common/VerticalStepIndicator'

export type EdgesStructure = {
  srcId: Utf8
  tgtId: Utf8
  weight: Int32
}

export type NodesStructure = {
  id: Utf8
  label: Utf8
  group: Utf8
}

const useStyles = makeStyles(theme => ({
  container: {
    minHeight: `calc(100vh - ${theme.spacing(3) * 2}px)`,
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: 'auto fit-content(5%)',
    paddingTop: theme.spacing(2),
    paddingRight: 0,
    paddingBottom: theme.spacing(2)
  },
  stepContainer: {
    minHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    overflow: 'auto',
    textAlign: 'center'
  }
}))

const LabPage = (): JSX.Element => {
  const classes = useStyles()

  const [currentWorkflow] = useCurrentWorkflow()

  const [activeStep, setActiveStep] = useState(0)

  if (currentWorkflow == null) return <p>loading workflow...</p>
  if (currentWorkflow?.steps == null) return <p>workflow steps missing...</p>

  const projectSteps: StepDesc[] = Object.values(currentWorkflow?.steps || {}) || []

  const handleNext = () => {
    setActiveStep(prevActiveStep => {
      const nextStep = prevActiveStep + 1
      if (nextStep >= projectSteps.length) return prevActiveStep
      return nextStep
    })
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => (prevActiveStep - 1 >= 0 ? prevActiveStep - 1 : prevActiveStep))
  }

  return (
    <Container maxWidth="xl" className={classes.container}>
      <Paper className={classes.stepContainer} elevation={0} variant="outlined">
        <ModuleViewFactory
          step={projectSteps[activeStep]?.step}
          inputConnections={projectSteps[activeStep]?.inputConnections}
          outputConnections={projectSteps[activeStep]?.outputConnections}
        />
      </Paper>

      <VerticalStepIndicator
        steps={projectSteps.map(projectStep => ({
          name: projectStep.step.moduleType
        }))}
        activeStep={activeStep}
        handleNext={handleNext}
        handleBack={handleBack}
      />
    </Container>
  )
}

export default LabPage
