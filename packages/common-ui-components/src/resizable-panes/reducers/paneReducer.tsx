interface IStartDragPayload {
  indexSelectedPane: number
  initialDividerPosition: number
  currentDividerPosition: number
  maxSpaceBefore: number
  maxSpaceAfter: number
}

interface IPaneResizeState {
  indexSelectedPane: number
  initialDividerPosition: number
  currentDividerPosition: number
  maxSpaceBefore: number
  maxSpaceAfter: number
  paneSizes: number[]
}

export type PaneResizeAction =
  | { type: 'startDrag'; payload: IStartDragPayload }
  | { type: 'endDrag' }
  | { type: 'updatePaneSizes'; payload: { paneSizes: number[] } }
  | { type: 'updateDividerPosition'; payload: { currentDividerPosition: number } }

export const initialState: IPaneResizeState = {
  indexSelectedPane: null,
  initialDividerPosition: null,
  currentDividerPosition: 0,
  maxSpaceBefore: 0,
  maxSpaceAfter: 0,
  paneSizes: []
}

const paneReducer = (state: IPaneResizeState, action: PaneResizeAction): IPaneResizeState => {
  switch (action.type) {
    case 'startDrag': {
      const {
        indexSelectedPane,
        initialDividerPosition,
        currentDividerPosition,
        maxSpaceBefore,
        maxSpaceAfter
      } = action.payload
      const newState = {
        ...state,
        indexSelectedPane,
        initialDividerPosition,
        currentDividerPosition,
        maxSpaceBefore,
        maxSpaceAfter
      }
      return newState
    }

    case 'endDrag': {
      const {
        indexSelectedPane,
        initialDividerPosition,
        currentDividerPosition,
        maxSpaceBefore,
        maxSpaceAfter,
        paneSizes
      } = state

      const displacement = currentDividerPosition - initialDividerPosition

      // if not in valid dragging process, return the same state
      if (indexSelectedPane == null || initialDividerPosition == null) return state

      // if divider not moved or outside allowed boundaries, clear all values except pane sizes
      if (
        currentDividerPosition === initialDividerPosition ||
        displacement < -maxSpaceBefore ||
        displacement > maxSpaceAfter
      )
        return { ...initialState, paneSizes }

      // otherwise, update pane sizes according to divider position and clear all other values
      const newSizes = [...paneSizes]
      newSizes[indexSelectedPane] = paneSizes[indexSelectedPane] - displacement
      newSizes[indexSelectedPane - 1] = paneSizes[indexSelectedPane - 1] + displacement

      return { ...initialState, paneSizes: newSizes }
    }

    case 'updatePaneSizes': {
      const { paneSizes } = action.payload
      return { ...state, paneSizes }
    }

    case 'updateDividerPosition': {
      const { currentDividerPosition } = action.payload
      return { ...state, currentDividerPosition }
    }

    default:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.error('unkown action type: ', action?.type)
      return state
  }
}

export default paneReducer
