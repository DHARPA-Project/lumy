import React, { useState } from 'react'

import Button from '@material-ui/core/Button'

import WorkflowContextProvider from '../../context/workflowContext'

import WorkflowContainer from '../common/WorkflowContainer'

import useStyles from './WorkflowProjectPage.styles'

const WorkflowProjectPage = (): JSX.Element => {
  const classes = useStyles()

  const [dataSource, setDataSource] = useState<string>(null)

  if (dataSource === 'repository')
    return (
      <WorkflowContextProvider>
        <WorkflowContainer />
      </WorkflowContextProvider>
    )

  return (
    <div className={classes.dataSourceSelection}>
      <Button variant="outlined" fullWidth onClick={() => setDataSource('repository')}>
        Use repository data
      </Button>

      <p>or</p>

      <Button variant="outlined" fullWidth onClick={() => setDataSource('upload')}>
        Upload new data
      </Button>
    </div>
  )
}

export default WorkflowProjectPage
