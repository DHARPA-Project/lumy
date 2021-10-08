import React, { useContext, useState } from 'react'

import { DividerContext } from '../context'

import './PaneDivider.css'

export type ColorPalette = {
  idle: string
  hovered: string
  valid: string
  invalid: string
}

type DividerProps = {
  index: number
  maxSpaceBefore: number
  maxSpaceAfter: number
}

const PaneDivider: React.FunctionComponent<DividerProps> = ({
  index,
  maxSpaceBefore,
  maxSpaceAfter
}: DividerProps) => {
  const {
    orientation,
    dividerPalette,
    indexSelectedPane,
    initialDividerPosition,
    currentDividerPosition,
    handleDragStart,
    handleDragEnd
  } = useContext(DividerContext)

  const [isHovered, setIsHovered] = useState(false)

  const isSelected = indexSelectedPane === index
  const displacement = currentDividerPosition - initialDividerPosition

  const getDividerStatus = () => {
    const isOutsideBoundaries = displacement < -maxSpaceBefore || displacement > maxSpaceAfter
    if (isSelected) return isOutsideBoundaries ? 'invalid' : 'valid'
    if (isHovered) return 'hovered'
    return 'idle'
  }

  const className = `divider ${orientation === 'row' ? 'vertical' : 'horizontal'}`

  const style = {
    left: isSelected && orientation === 'row' ? displacement : 0,
    top: isSelected && orientation === 'column' ? displacement : 0,
    display: index > 0 ? 'block' : 'none',
    width: orientation === 'row' ? '0.25rem' : '100%',
    height: orientation === 'column' ? '0.25rem' : 'inherit',
    backgroundColor: dividerPalette[getDividerStatus()]
  }

  return (
    <div
      onMouseDown={event => {
        const position = orientation === 'column' ? event.clientY : event.clientX

        // ignore event if anything other than the left button is pressed
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
        if (event.button > 0 || event.buttons > 1) return

        handleDragStart({
          indexSelectedPane: index,
          initialDividerPosition: position,
          currentDividerPosition: position,
          maxSpaceBefore,
          maxSpaceAfter
        })
      }}
      onMouseUp={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={style}
      className={className}
    />
  )
}

export default PaneDivider
