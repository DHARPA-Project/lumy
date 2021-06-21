import React from 'react'

import useStyles from './TextPill.styles'

export interface TextPillProps {
  text: string
}

const TextPill = ({ text }: TextPillProps): JSX.Element => {
  const classes = useStyles()

  return (
    <div className={classes.pillContainer}>
      <div className={classes.pillContent}>{text}</div>
    </div>
  )
}

export default TextPill
