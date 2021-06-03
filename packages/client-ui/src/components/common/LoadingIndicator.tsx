import React from 'react'

import useStyles from './LoadingIndicator.styles'

type LoadingIndicatorProps = {
  color?: string
  size?: string
}

const LoadingIndicator = ({ color, size }: LoadingIndicatorProps): JSX.Element => {
  const classes = useStyles({ color, size } as Record<string, string>)

  return (
    <div className={classes.loadingIndicator} style={size ? { width: size } : null}>
      <div className={classes.indicatorSquare}>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  )
}

export default LoadingIndicator
