import React from 'react'

import useStyles from './StepDetailTooltip.styles'

import Tooltip from '@material-ui/core/Tooltip'

import Typography from '@material-ui/core/Typography'

interface IStepData {
  name: string
}

type StepDetailTooltipProps = {
  step: IStepData
  status: string
  children: React.ReactElement<unknown>
}

const StepDetailTooltip = ({ step, status, children }: StepDetailTooltipProps): JSX.Element => {
  const classes = useStyles()

  return (
    <Tooltip
      classes={{ tooltip: classes.tooltip }}
      placement="left"
      arrow
      TransitionProps={{ timeout: 500 }}
      title={
        <>
          <Typography color="inherit" align="center">
            {step.name}
          </Typography>
          <p>status: {status}</p>
          <p>details: ...</p>
        </>
      }
    >
      {children}
    </Tooltip>
  )
}

export default StepDetailTooltip
