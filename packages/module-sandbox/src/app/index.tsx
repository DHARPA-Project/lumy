import React from 'react'
import { render } from 'react-dom'
import { App } from './App'

export function sandbox(): void {
  render(<App />, document.body)
}
