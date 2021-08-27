import React, { useEffect, useReducer } from 'react'

const getInitialState = <S>(storageKey: string, defaultState: S): S => {
  let state = defaultState
  try {
    const localStorageData = window.localStorage.getItem(storageKey)
    if (localStorageData != null) state = JSON.parse(localStorageData)
  } catch (error) {
    console.error(`failed to retrieve local storage values at key ${storageKey}: `, error)
  }
  return state
}

export const useStoredReducer = <S, A>(
  reducer: React.Reducer<S, A>,
  initialState: S,
  storageKey: string
): [S, React.Dispatch<A>] => {
  const [state, dispatch] = useReducer(reducer, getInitialState(storageKey, initialState))

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state))
    } catch (error) {
      console.error(`failed to save to local storage with key ${storageKey}`, error)
    }
  }, [state, storageKey])

  return [state, dispatch]
}
