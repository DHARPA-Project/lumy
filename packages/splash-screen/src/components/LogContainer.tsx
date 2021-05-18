import React from 'react'
import clsx from 'clsx'
import useStyles from './LogContainer.styles'
import { useStream } from '../context'

const AlwaysScrollToBottom = (): JSX.Element => {
  const elementRef = React.useRef(null)
  React.useEffect(() => elementRef?.current?.scrollIntoView())
  return <div ref={elementRef} />
}

export interface LogContainerProps {
  streamType: 'default' | 'error'
  hideWhenEmpty?: boolean
}

export const LogContainer = ({
  streamType,
  hideWhenEmpty = false,
  className,
  ...props
}: LogContainerProps &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => {
  const classes = useStyles()
  const stream = useStream(streamType)

  if (hideWhenEmpty && stream?.length < 1) return <></>

  const styleClass = streamType === 'error' ? classes.styleError : classes.styleDefault

  return (
    <div className={clsx(classes.root, styleClass, className)} {...props}>
      {stream.map((text, idx) => (
        <p key={idx}>{text}</p>
      ))}
      <AlwaysScrollToBottom />
    </div>
  )
}
