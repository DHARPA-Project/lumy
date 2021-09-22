import React, { useContext, useEffect, useRef, useState } from 'react'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import CloudDownloadIcon from '@material-ui/icons/CloudDownload'

import { AccordionContainer, AccordionItem, SyntaxHighlighter } from '@lumy/common-ui-components'

import useStyles from './CodeView.styles'
import { WorkflowContext } from '../../../state'
import { FormattedMessage } from '@lumy/i18n'

const CodeView = (): JSX.Element => {
  const classes = useStyles()

  const urlRef = useRef<string>(null)

  const { currentPageDetails, samplePythonCodeSnippet, workflowCode } = useContext(WorkflowContext)

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
      <div className={classes.stickyTop}>
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

      <Typography gutterBottom component="h2" variant="h6" color="textPrimary">
        {currentPageDetails?.meta?.label}
      </Typography>

      <AccordionContainer>
        <AccordionItem
          label={<Typography>Description</Typography>}
          content={
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit
              amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
            </Typography>
          }
        />
        <AccordionItem
          label={<Typography>Input</Typography>}
          content={
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit
              amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
            </Typography>
          }
        />
        <AccordionItem
          label={<Typography>Code</Typography>}
          content={<SyntaxHighlighter codeString={samplePythonCodeSnippet} language="python" />}
          startExpanded
        />
        <AccordionItem
          label={<Typography>Output</Typography>}
          content={
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit
              amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
            </Typography>
          }
        />
      </AccordionContainer>
    </div>
  )
}

export default CodeView
