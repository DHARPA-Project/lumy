import { FC } from 'react'
import { WorkflowIOState, WorkflowStep } from './types'

interface TypedWorkflowStep<Input> extends WorkflowStep {
  inputs: { [key in keyof Input]: WorkflowIOState }
}

export interface ModuleProps<Input> {
  step: TypedWorkflowStep<Input>
}

export interface ModuleViewProvider {
  getModulePanel<I, T extends ModuleProps<I>>(moduleId: string): FC<T>
}

export class SimpleModuleViewProvider implements ModuleViewProvider {
  private _modules: Record<string, FC<ModuleProps<unknown>>>
  private _defaultView: FC<ModuleProps<unknown>>

  constructor(modules: Record<string, FC<ModuleProps<unknown>>>, defaultView: FC<ModuleProps<unknown>>) {
    this._modules = modules
    this._defaultView = defaultView
  }
  getModulePanel<T extends ModuleProps<unknown>>(moduleId: string): FC<T> {
    const module = this._modules[moduleId] ?? this._defaultView
    return (module as unknown) as FC<T>
  }
}
