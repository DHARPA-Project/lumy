import React from 'react'
import { createPortal } from 'react-dom'

import { makeStyles } from '@material-ui/core/styles'

import { featureIds } from '../../../const/features'

type DocumentationProps = {
  children: React.ReactNode
}

const useStyles = makeStyles(theme => ({
  documentationContainer: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.paper
  }
}))

const Documentation = ({ children }: DocumentationProps): JSX.Element => {
  const classes = useStyles()

  return createPortal(
    <div className={classes.documentationContainer}>{children}</div>,
    document.getElementById(featureIds.documentation)
  )
}

export default Documentation
