import React, { useContext, useRef, useState } from 'react'
import JoditEditor from 'jodit-react'

import { makeStyles } from '@material-ui/core/styles'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import SaveIcon from '@material-ui/icons/Save'

import { PageLayoutContext } from '../../context/pageLayoutContext'

const mockPath = ['workflows', 'workflow-type', 'step']

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
  textEditor: {
    margin: '1.5rem 0'
  },
  button: {
    marginTop: theme.spacing(3)
  }
}))

const NoteEditor = (): JSX.Element => {
  const classes = useStyles()

  const editor = useRef(null)

  const { setIsSideDrawerOpen } = useContext(PageLayoutContext)

  const [noteContent, setNoteContent] = useState('')

  return (
    <div className={classes.root}>
      <Typography className={classes.headline} variant="h5" component="h1">
        Add Notes
      </Typography>
      <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
        {mockPath.map((path, index) => (
          <Typography color="textPrimary" key={index}>
            {path}
          </Typography>
        ))}
      </Breadcrumbs>

      <JoditEditor
        className={classes.textEditor}
        ref={editor}
        value={noteContent}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        config={{
          readonly: false,
          style: {
            height: '350px',
            color: '#303030'
          }
        }}
        tabIndex={1}
        onBlur={value => setNoteContent(value)}
        onChange={(value: unknown) => console.log(`${value} typed`)}
      />
      <Button
        variant="contained"
        color="primary"
        size="medium"
        className={classes.button}
        startIcon={<SaveIcon />}
        onClick={() => setIsSideDrawerOpen(false)}
      >
        Save
      </Button>
    </div>
  )
}

export default NoteEditor
