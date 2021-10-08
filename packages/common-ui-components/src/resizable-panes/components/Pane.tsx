import React from 'react'

import { OrientationType } from '../context'
import './Pane.css'

type PaneProps = {
  size: number
  orientation: OrientationType
  child: React.ReactNode
}

const Pane: React.FunctionComponent<PaneProps> = ({ size, orientation, child }: PaneProps) => {
  const style: React.CSSProperties = {
    width: orientation === 'row' ? `${size}px` : '100%',
    height: orientation === 'row' ? 'auto' : `${size}px`,
    flexDirection: orientation === 'column' ? 'column' : 'row'
  }

  return (
    <div className="resizable-pane" style={style}>
      {child}
    </div>
  )
}

export default Pane
