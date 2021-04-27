import { FC } from 'react'
import { StepDesc } from './types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ModuleProps<Input, Output> {
  step: StepDesc['step']
  inputConnections: StepDesc['inputConnections']
  outputConnections: StepDesc['outputConnections']
}

export interface ModuleViewProvider {
  getModulePanel<I, O, T extends ModuleProps<I, O>>(moduleId: string): FC<T>
}

export class SimpleModuleViewProvider implements ModuleViewProvider {
  private _modules: Record<string, FC<ModuleProps<unknown, unknown>>>
  private _defaultView: FC<ModuleProps<unknown, unknown>>

  constructor(
    modules: Record<string, FC<ModuleProps<unknown, unknown>>>,
    defaultView: FC<ModuleProps<unknown, unknown>>
  ) {
    this._modules = modules
    this._defaultView = defaultView
  }
  getModulePanel<T extends ModuleProps<unknown, unknown>>(moduleId: string): FC<T> {
    const module = this._modules[moduleId] ?? this._defaultView
    return (module as unknown) as FC<T>
  }
}
