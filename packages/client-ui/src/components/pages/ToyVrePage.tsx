import React from 'react'
import { App as ToyVREApp } from '@dharpa-vre/toy-vre'
import useStyles from './ToyVrePage.styles'

const ToyVrePage = (): JSX.Element => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <ToyVREApp />
    </div>
  )
}

export default ToyVrePage
