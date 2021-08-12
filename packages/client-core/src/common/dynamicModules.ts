import React from 'react'
import * as LumyClientCore from '@dharpa-vre/client-core'
import * as apacheArrow from 'apache-arrow'

export class DynamicComponentsRegistry<T = unknown> {
  private registry: Record<string, React.FC<T>> = {}

  register(id: string, component: React.FC<T>): void {
    this.registry[id] = component
  }

  get(id: string): React.FC<T> | undefined {
    return this.registry[id]
  }

  get ids(): string[] {
    return Object.keys(this.registry)
  }
}

declare global {
  interface Window {
    __lumy_react: typeof React
    __lumy_clientCore: typeof LumyClientCore
    __lumy_apacheArrow: typeof apacheArrow
    __lumy_dynamicComponentsRegistry: DynamicComponentsRegistry
  }
}

if (window.__lumy_react == null) window.__lumy_react = React
if (window.__lumy_clientCore == null) window.__lumy_clientCore = LumyClientCore
if (window.__lumy_apacheArrow == null) window.__lumy_apacheArrow = apacheArrow
if (window.__lumy_dynamicComponentsRegistry == null)
  window.__lumy_dynamicComponentsRegistry = new DynamicComponentsRegistry()

export function registerLumyComponent<T>(id: string, component: React.FC<T>): void {
  window.__lumy_dynamicComponentsRegistry.register(id, component as React.FC<unknown>)
}

export function getLumyComponent(id: string): React.FC | undefined {
  return window.__lumy_dynamicComponentsRegistry.get(id)
}
