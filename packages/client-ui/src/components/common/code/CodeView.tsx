import React, { useContext, useEffect, useRef, useState } from 'react'
import JupyterViewer from 'react-jupyter-notebook'

import Button from '@material-ui/core/Button'

import CloudDownloadIcon from '@material-ui/icons/CloudDownload'

import { WorkflowContext } from '../../../context/workflowContext'
import useStyles from './CodeView.styles'

import LoadingIndicator from '../LoadingIndicator'

const CodeView = (): JSX.Element => {
  const classes = useStyles()

  const urlRef = useRef<string>(null)

  const { workflowCode } = useContext(WorkflowContext)

  const [downloadUrl, setDownloadUrl] = useState<string>(urlRef.current)

  useEffect(() => {
    if (!urlRef.current) {
      const jsonContent = JSON.stringify(workflowCode)
      const blobContent = new Blob([jsonContent])
      const url = URL.createObjectURL(blobContent)
      setDownloadUrl(url)
    }

    return () => URL.revokeObjectURL(urlRef.current)
  }, [])

  return (
    <div className={classes.codeViewContainer}>
      <div className={classes.top}>
        <Button
          href={downloadUrl}
          download={'sampleNotebook.ipynb'}
          disabled={!downloadUrl}
          variant="contained"
          color="default"
          size="small"
          startIcon={<CloudDownloadIcon />}
        >
          Download
        </Button>
      </div>

      {workflowCode ? (
        <JupyterViewer rawIpynb={workflowCode} mediaAlign="left" displaySource="auto" displayOutput="auto" />
      ) : (
        <LoadingIndicator />
      )}
    </div>
  )
}

export default CodeView
