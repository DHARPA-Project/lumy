import { FC } from 'react'
import { WorkflowPageComponent, WorkflowPageDetails } from './types'

export interface ModuleProps {
  pageDetails: WorkflowPageDetails
}

export interface ModuleViewProvider {
  getModulePanel<T extends ModuleProps>(pageComponent: WorkflowPageComponent): FC<T>
}

export class SimpleModuleViewProvider implements ModuleViewProvider {
  private _modules: Record<string, FC<ModuleProps>>
  private _defaultView: FC<ModuleProps>

  constructor(modules: Record<string, FC<ModuleProps>>, defaultView: FC<ModuleProps>) {
    this._modules = modules
    this._defaultView = defaultView
  }
  getModulePanel<T extends ModuleProps>(pageComponent: WorkflowPageComponent): FC<T> {
    const module = this._modules[pageComponent.id] ?? this._defaultView
    return (module as unknown) as FC<T>
  }
}
