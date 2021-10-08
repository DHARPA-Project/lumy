import React, { useEffect, useContext, useRef } from 'react'

import { getValidChildren } from '@lumy/client-core/src/common/utils/react'
import { useElementSize } from '@lumy/client-ui'

import './PaneContainer.css'
import { PaneContext } from '../context'

import Pane from './Pane'
import PaneDivider from './PaneDivider'
import { LoadingIndicator } from '../..'

type PaneContainerProps = {
  style?: React.CSSProperties
  children: React.ReactNode | React.ReactNode[]
}

const PaneContainer = ({ style = {}, children }: PaneContainerProps): JSX.Element => {
  const containerRef = useRef(null)

  const {
    orientation,
    minPaneSize,
    paneSizes,
    updateSizes,
    handleDragEnd,
    updateDividerPosition
  } = useContext(PaneContext)

  const renderableChildren = getValidChildren(children)
  const numChildren = renderableChildren?.length
  const relevantSize = orientation === 'row' ? 'width' : 'height'

  const containerSize = useElementSize(containerRef)

  const previousOrientationRef = useRef(orientation)
  const previousContainerSizeRef = useRef(containerSize)
  const previousNumChildrenRef = useRef(numChildren)

  // add event listeners
  useEffect(() => {
    const container = containerRef.current

    if (container) {
      container.addEventListener('mousemove', updateDividerPosition)
      container.addEventListener('mouseup', handleDragEnd)
      container.addEventListener('mouseleave', handleDragEnd)

      return () => {
        container.removeEventListener('mousemove', updateDividerPosition)
        container.removeEventListener('mouseup', handleDragEnd)
        container.removeEventListener('mouseleave', handleDragEnd)
      }
    }
  }, [containerRef, updateDividerPosition, handleDragEnd])

  useEffect(() => {
    const currentContainerSize = containerSize?.[relevantSize]
    if (!currentContainerSize) return

    const orientationHasChanged = previousOrientationRef.current !== orientation
    const previousContainerSize = previousContainerSizeRef.current?.[relevantSize]
    const containerSizeHasChanged =
      previousContainerSize != null && previousContainerSize !== currentContainerSize
    const numChildrenHasChanged = previousNumChildrenRef.current !== numChildren

    // divide container size into equal parts among all panes when first loading as well as whenever orientation or the number of children changes
    if (!paneSizes?.length || orientationHasChanged || numChildrenHasChanged) {
      const averageSize = Math.floor(currentContainerSize / numChildren)
      const newPaneSizes = Array(numChildren ?? 0).fill(averageSize)
      updateSizes(newPaneSizes)
      // adjust pane sizes whenever the container resizes
    } else if (containerSizeHasChanged && !orientationHasChanged) {
      const previousTotalWidth = paneSizes.reduce((acc, paneSize) => acc + paneSize, 0)
      const newPaneSizes = paneSizes.map(previousPaneSize =>
        Math.floor((currentContainerSize * previousPaneSize) / previousTotalWidth)
      )
      updateSizes(newPaneSizes)
    }

    if (orientationHasChanged) previousOrientationRef.current = orientation
    if (containerSizeHasChanged) previousContainerSizeRef.current = containerSize
    if (numChildrenHasChanged) previousNumChildrenRef.current = numChildren
  }, [orientation, containerSize, numChildren, updateSizes])

  return (
    <div
      className="splittable-container"
      ref={containerRef}
      style={{ ...style, display: 'flex', flexDirection: orientation === 'column' ? 'column' : 'row' }}
    >
      {!paneSizes?.length ? (
        <LoadingIndicator />
      ) : (
        renderableChildren.map((child, index) =>
          index > 0 ? (
            [
              <PaneDivider
                key={`divider-${index}`}
                index={index}
                maxSpaceBefore={paneSizes[index - 1] - minPaneSize}
                maxSpaceAfter={paneSizes[index] - minPaneSize}
              />,
              <Pane key={`pane-${index}`} size={paneSizes[index]} orientation={orientation} child={child} />
            ]
          ) : (
            <Pane key={`pane-${index}`} size={paneSizes[index]} orientation={orientation} child={child} />
          )
        )
      )}
    </div>
  )
}

export default PaneContainer
