import React, { useContext, useEffect, useRef, useState } from 'react'

import Button from '@material-ui/core/Button'

import CloudDownloadIcon from '@material-ui/icons/CloudDownload'

import { JupyterNotebookViewer } from '@lumy/common-ui-components'

import useStyles from './CodeView.styles'
import { WorkflowContext } from '../../../state'
import { FormattedMessage } from '@lumy/i18n'

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
          <FormattedMessage id="panel.codeview.button.download" />
        </Button>
      </div>

      <JupyterNotebookViewer code={workflowCode} />
    </div>
  )
}

export default CodeView
