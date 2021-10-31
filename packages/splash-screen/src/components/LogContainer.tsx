import React from 'react'

import useStyles from './LogContainer.styles'
import { StreamMessage, useStream } from '../context'

const AutoScroller = (): JSX.Element => {
  const elementRef = React.useRef(null)
  React.useEffect(() => elementRef?.current?.scrollIntoView())
  return <div ref={elementRef} />
}

export interface LogContainerProps {
  hideWhenEmpty?: boolean
}

export const LogContainer = ({
  hideWhenEmpty = false,
  ...props
}: LogContainerProps &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => {
  const classes = useStyles()
  const stream = useStream()

  if (hideWhenEmpty && stream?.length < 1) return <></>

  const getStyleClass = (type: StreamMessage['type']) => {
    switch (type) {
      case 'error':
        return classes.styleError
      case 'warn':
        return classes.styleWarn
      default:
        return classes.styleDefault
    }
  }

  return (
    <div className={classes.logContainer} {...props}>
      {stream.map((message, idx) => (
        <p key={idx} className={getStyleClass(message.type)}>
          {message.text}
        </p>
      ))}

      <AutoScroller />
    </div>
  )
}
