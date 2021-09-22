import React from 'react'
/**
 * https://www.npmjs.com/package/react-syntax-highlighter
 */
import ReactSyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import { LoadingIndicator } from '..'

import useStyles from './SyntaxHighlighter.styles'

type SHProps = {
  codeString: Record<string, unknown> | string
  language: string
  style?: Record<string, string | number>
}

export const SyntaxHighlighter = ({ codeString, language, style }: SHProps): JSX.Element => {
  const classes = useStyles()

  return (
    <div className={classes.syntaxHighlighter} style={style}>
      {codeString ? (
        <ReactSyntaxHighlighter language={language} style={docco}>
          {codeString}
        </ReactSyntaxHighlighter>
      ) : (
        <LoadingIndicator />
      )}
    </div>
  )
}
