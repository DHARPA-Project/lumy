import React, { useEffect, useRef } from 'react'

export const AutoScroller = (): JSX.Element => {
  const elementRef = useRef(null)

  useEffect(() => elementRef?.current?.scrollIntoView())

  return <div ref={elementRef} />
}
