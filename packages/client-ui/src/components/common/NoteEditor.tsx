import React, { useContext, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import { makeStyles } from '@material-ui/core/styles'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import SaveIcon from '@material-ui/icons/Save'

import { PageLayoutContext } from '../../context/pageLayoutContext'

const mockPath = ['workflows', 'workflow-type', 'step']

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 2)
  },
  headline: {
    margin: theme.spacing(2, 0)
  },
  breadcrumbs: {
    marginBottom: theme.spacing(3)
  },
  textEditor: {
    margin: theme.spacing(3, 0),
    '& .ql-container': {
      minHeight: theme.spacing(20)
    }
  },
  button: {
    marginTop: theme.spacing(3)
  }
}))

const NoteEditor = (): JSX.Element => {
  const classes = useStyles()

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

      <ReactQuill
        className={classes.textEditor}
        theme="snow"
        onChange={contentHTML => setNoteContent(contentHTML)}
        value={noteContent}
        modules={NoteEditor.modules}
        formats={NoteEditor.formats}
        placeholder="type your notes here..."
      />

      <Button
        variant="contained"
        color="primary"
        size="medium"
        className={classes.button}
        startIcon={<SaveIcon />}
        onClick={() => {
          console.log('saving notes')
          setIsSideDrawerOpen(false)
        }}
      >
        Save
      </Button>
    </div>
  )
}

/*
 * React-Quill configuration modules
 * See https://quilljs.com/docs/modules/ for complete options
 */
NoteEditor.modules = {
  toolbar: [
    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'super' }, { script: 'sub' }],
    ['blockquote', 'code-block', 'link'],
    [{ align: [] }],
    ['image', 'video'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    // [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: true
  }
}

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
NoteEditor.formats = [
  'align',
  'background',
  'bold',
  'blockquote',
  'bullet',
  'color',
  'code',
  'code-block',
  'clean',
  'direction',
  'font',
  'header',
  'italic',
  'indent',
  'image',
  'list',
  'link',
  'size',
  'strike',
  'script',
  'underline',
  'video'
]

export default NoteEditor
