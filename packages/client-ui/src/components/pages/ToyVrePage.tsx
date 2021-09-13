import React from 'react'
import { App as ToyVREApp } from '@lumy/toy-vre'
import useStyles from './ToyVrePage.styles'

/** TODO: not used, consider removing */
const ToyVrePage = (): JSX.Element => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <ToyVREApp />
    </div>
  )
}

export default ToyVrePage
