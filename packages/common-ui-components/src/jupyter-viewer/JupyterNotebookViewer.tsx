import React from 'react'
import JupyterViewer from 'react-jupyter-notebook'

import { LoadingIndicator } from '..'

import useStyles from './JupyterNotebookViewer.styles'

type JNVProps = {
  code: Record<string, unknown>
}

export const JupyterNotebookViewer = ({ code }: JNVProps): JSX.Element => {
  const classes = useStyles()

  return (
    <div className={classes.jupyterViewer}>
      {code ? (
        <JupyterViewer rawIpynb={code} mediaAlign="left" displaySource="auto" displayOutput="auto" />
      ) : (
        <LoadingIndicator />
      )}
    </div>
  )
}
