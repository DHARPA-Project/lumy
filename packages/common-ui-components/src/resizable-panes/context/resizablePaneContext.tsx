import React, { createContext, useCallback, useMemo, useReducer } from 'react'

import paneReducer, { initialState } from '../reducers/paneReducer'
import { ColorPalette as DividerPalette } from '../components/PaneDivider'

export type OrientationType = 'row' | 'column'

export type PaneContextType = {
  orientation: OrientationType
  minPaneSize: number
  paneSizes: number[]
  updateSizes: (newPaneSizes: number[]) => void
  handleDragEnd: () => void
  updateDividerPosition: (event: React.MouseEvent) => void
}

export type DividerContextType = {
  orientation: OrientationType
  dividerPalette: DividerPalette
  indexSelectedPane: number
  initialDividerPosition: number
  currentDividerPosition: number
  handleDragStart: ({
    indexSelectedPane,
    initialDividerPosition,
    currentDividerPosition,
    maxSpaceBefore,
    maxSpaceAfter
  }: {
    indexSelectedPane: number
    initialDividerPosition: number
    currentDividerPosition: number
    maxSpaceBefore: number
    maxSpaceAfter: number
  }) => void
  handleDragEnd: () => void
}

type ResizablePaneProviderProps = {
  orientation: OrientationType
  minPaneSize: number
  dividerPalette: DividerPalette
  children: React.ReactNode
}

export const DividerContext = createContext<DividerContextType>(null)
export const PaneContext = createContext<PaneContextType>(null)

export const MainProvider: React.FunctionComponent<ResizablePaneProviderProps> = ({
  orientation,
  minPaneSize,
  dividerPalette,
  children
}: ResizablePaneProviderProps) => {
  const [state, dispatch] = useReducer(paneReducer, initialState)
  const { indexSelectedPane, initialDividerPosition, currentDividerPosition, paneSizes } = state

  const handleDragStart = useCallback(
    ({
      indexSelectedPane,
      initialDividerPosition,
      currentDividerPosition,
      maxSpaceBefore,
      maxSpaceAfter
    }) => {
      dispatch({
        type: 'startDrag',
        payload: {
          indexSelectedPane,
          initialDividerPosition,
          currentDividerPosition,
          maxSpaceBefore,
          maxSpaceAfter
        }
      })
    },
    [dispatch]
  )

  const handleDragEnd = useCallback(() => {
    dispatch({ type: 'endDrag' })
  }, [dispatch, indexSelectedPane])

  const updateDividerPosition = useCallback(
    event => {
      if (indexSelectedPane == null) return
      dispatch({
        type: 'updateDividerPosition',
        payload: { currentDividerPosition: orientation === 'column' ? event.clientY : event.clientX }
      })
    },
    [orientation, dispatch, indexSelectedPane]
  )

  const updateSizes = useCallback(
    newPaneSizes => {
      dispatch({
        type: 'updatePaneSizes',
        payload: { paneSizes: newPaneSizes }
      })
    },
    [dispatch]
  )

  const paneContext = useMemo(
    () => ({
      orientation,
      minPaneSize,
      paneSizes,
      updateSizes,
      handleDragEnd,
      updateDividerPosition
    }),
    [orientation, minPaneSize, paneSizes, updateSizes, handleDragEnd, updateDividerPosition]
  )

  const dividerContext = useMemo(
    () => ({
      orientation,
      dividerPalette,
      indexSelectedPane,
      initialDividerPosition,
      currentDividerPosition,
      handleDragStart,
      handleDragEnd
    }),
    [
      orientation,
      dividerPalette,
      indexSelectedPane,
      initialDividerPosition,
      currentDividerPosition,
      handleDragStart
    ]
  )

  return (
    <PaneContext.Provider value={paneContext}>
      <DividerContext.Provider value={dividerContext}>{children}</DividerContext.Provider>
    </PaneContext.Provider>
  )
}
