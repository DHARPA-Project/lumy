import React from 'react'
import { IoMetadata } from '../types'

export interface LumyAutoUiComponentProps {
  metadata: IoMetadata
}

export type ElementKind = 'input' | 'output'
export type LumyAutoUiComponent = React.ComponentType<LumyAutoUiComponentProps>

interface IElementsRegistry {
  register<T extends LumyAutoUiComponent>(type: string, kind: ElementKind, element: T): void
  registerDefault<T extends LumyAutoUiComponent>(kind: ElementKind, element: T): void
  getElement<T extends LumyAutoUiComponent>(type: string, kind: ElementKind): T
}

class ElementsRegistry implements IElementsRegistry {
  inputs: { [elementId: string]: LumyAutoUiComponent[] } = {}
  outputs: { [elementId: string]: LumyAutoUiComponent[] } = {}
  defaultInput: LumyAutoUiComponent
  defaultOutput: LumyAutoUiComponent

  register<T extends LumyAutoUiComponent>(name: string, kind: ElementKind, element: T): void {
    if (kind === 'input') {
      const elements = this.inputs[name] ?? []
      this.inputs[name] = elements.concat(element)
    } else {
      const elements = this.outputs[name] ?? []
      this.outputs[name] = elements.concat(element)
    }
  }

  registerDefault<T extends LumyAutoUiComponent>(kind: ElementKind, element: T): void {
    if (kind === 'input') this.defaultInput = element
    else this.defaultOutput = element
  }

  getElement<T extends LumyAutoUiComponent>(type: string, kind: ElementKind): T {
    const elements = kind === 'input' ? this.inputs[type] : this.outputs[type]
    if (elements?.length > 0) return elements[0] as T
    return kind === 'input' ? (this.defaultInput as T) : (this.defaultOutput as T)
  }
}

declare global {
  interface Window {
    __lumy_autouiElementsRegistry?: IElementsRegistry
  }
}

const getRegistry = (): IElementsRegistry => {
  if (window.__lumy_autouiElementsRegistry == null) {
    window.__lumy_autouiElementsRegistry = new ElementsRegistry()
  }
  return window.__lumy_autouiElementsRegistry
}

export const lumyAutoUiElement = <T extends LumyAutoUiComponent>(type: string, kind: ElementKind) => {
  return (component: T): T => {
    getRegistry().register(type, kind, component)
    return component
  }
}

export const lumyDefaultAutoUiElement = <T extends LumyAutoUiComponent>(kind: ElementKind) => {
  return (component: T): T => {
    getRegistry().registerDefault(kind, component)
    return component
  }
}

export const getElement = (type: string, kind: ElementKind): LumyAutoUiComponent => {
  return getRegistry().getElement(type, kind)
}
