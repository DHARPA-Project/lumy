import React, { useContext } from 'react'

import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { makeStyles } from '@material-ui/core/styles'

import SaveIcon from '@material-ui/icons/Save'

import { WorkflowContext } from '../../context/workflowContext'

const useStyles = makeStyles(theme => ({
  root: {
    padding: '0.5rem 1rem'
  },
  headline: {
    margin: '1rem 0'
  },
  breadcrumbs: {
    marginBottom: '1.5rem'
  },
  container: {
    margin: '0',
    padding: '0'
  },
  codeContainer: {
    width: '100%',
    backgroundColor: theme.palette.divider,
    fontFamily: 'monospace, monospace',
    fontSize: '1rem',
    overflow: 'auto'
  },
  codeBlock: {
    display: 'block',
    padding: '1rem',
    wordWrap: 'normal'
  }
}))

const CodeView = (): JSX.Element => {
  const classes = useStyles()

  const mockPath = ['workflows', 'current-workflow', 'current-step']

  const { setIsSideDrawerOpen } = useContext(WorkflowContext)

  return (
    <div className={classes.root}>
      <Typography className={classes.headline} variant="h5" component="h1">
        Module Code
      </Typography>

      <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
        {mockPath.map((path, index) => (
          <Typography color="textPrimary" key={index}>
            {path}
          </Typography>
        ))}
      </Breadcrumbs>

      <figure className={classes.container}>
        <pre className={classes.codeContainer}>
          {/* <code contentEditable spellCheck="false" className={classes.codeBlock}> */}
          <code spellCheck="false" className={classes.codeBlock}>
            {`const sum = (...args) => args.reduce((sum, n) => sum + n, 0)\n\n`}
            {`const memFib = (num, memo = { 0: 0, 1: 1 }) => {
            if (!memo.hasOwnProperty(num)) {
              memo[num] = memFib(num - 1, memo) + memFib(num - 2, memo)
            }
            return memo[num]
          }`}
          </code>
        </pre>
      </figure>

      <Button
        onClick={() => setIsSideDrawerOpen(false)}
        variant="contained"
        color="primary"
        size="medium"
        startIcon={<SaveIcon />}
      >
        Save
      </Button>
    </div>
  )
}

export default CodeView
