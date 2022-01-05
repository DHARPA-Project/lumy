import React from 'react'
import { render } from 'react-dom'
import { App } from './App'

export function sandbox(): void {
  let sandboxRootElement = document.getElementById('sandbox')

  if (sandboxRootElement == null) {
    sandboxRootElement = document.createElement('div')
    sandboxRootElement.setAttribute('id', 'sandbox')
    document.querySelector('body').appendChild(sandboxRootElement)
  }
  render(<App />, sandboxRootElement)
}
