import React from 'react'
import ReactSyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import { LoadingIndicator } from '..'

import useStyles from './SyntaxHighlighter.styles'

type SHProps = {
  codeString: Record<string, unknown>
}

export const SyntaxHighlighter = ({ codeString }: SHProps): JSX.Element => {
  const classes = useStyles()

  return (
    <div className={classes.syntaxHighlighter}>
      {codeString ? (
        <ReactSyntaxHighlighter language="javascript" style={docco}>
          {codeString}
        </ReactSyntaxHighlighter>
      ) : (
        <LoadingIndicator />
      )}
    </div>
  )
}
