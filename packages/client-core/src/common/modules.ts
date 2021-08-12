import { FC } from 'react'
import { WorkflowPageComponent, WorkflowPageDetails } from './types'
import { getLumyComponent } from './dynamicModules'

export interface ModuleProps {
  pageDetails: WorkflowPageDetails
}

export interface ModuleViewProvider {
  getModulePanel<T extends ModuleProps>(pageComponent: WorkflowPageComponent): Promise<FC<T>>
}

export class SimpleModuleViewProvider implements ModuleViewProvider {
  private _modules: Record<string, FC<ModuleProps>>
  private _defaultView: FC<ModuleProps>

  constructor(modules: Record<string, FC<ModuleProps>>, defaultView: FC<ModuleProps>) {
    this._modules = modules
    this._defaultView = defaultView
  }
  async getModulePanel<T extends ModuleProps>(pageComponent: WorkflowPageComponent): Promise<FC<T>> {
    const module = this._modules[pageComponent.id] ?? this._defaultView
    return (module as unknown) as FC<T>
  }
}

export class DynamicModuleViewProvider implements ModuleViewProvider {
  private _defaultView: FC<ModuleProps>
  constructor(defaultView: FC<ModuleProps>) {
    this._defaultView = defaultView
  }

  async getModulePanel<T extends ModuleProps>(pageComponent: WorkflowPageComponent): Promise<FC<T>> {
    return (getLumyComponent(pageComponent.id) ?? this._defaultView) as FC<T>
  }
}
