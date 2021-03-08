import { FC } from 'react'
import { WorkflowStep } from './types'

export type ParametersBase = Record<string, unknown>

export interface ModuleProps<P extends ParametersBase> {
  step: WorkflowStep
  parameters?: P
}

export interface ModuleViewProvider {
  getModulePanel<P extends ParametersBase, T extends ModuleProps<P>>(moduleId: string): FC<T>
}

export class SimpleModuleViewProvider implements ModuleViewProvider {
  private _modules: Record<string, FC<ModuleProps<ParametersBase>>>
  private _defaultView: FC<ModuleProps<ParametersBase>>

  constructor(
    modules: Record<string, FC<ModuleProps<ParametersBase>>>,
    defaultView: FC<ModuleProps<ParametersBase>>
  ) {
    this._modules = modules
    this._defaultView = defaultView
  }
  getModulePanel<P extends ParametersBase, T extends ModuleProps<P>>(moduleId: string): FC<T> {
    const module = this._modules[moduleId] ?? this._defaultView
    return (module as unknown) as FC<T>
  }
}
