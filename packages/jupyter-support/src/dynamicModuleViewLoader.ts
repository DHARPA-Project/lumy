import {
  getLumyComponent,
  handlerAdapter,
  IBackEndContext,
  Messages,
  ModuleProps,
  ModuleViewProvider,
  PageComponentsCode,
  Target,
  WorkflowPageComponent
} from '@dharpa-vre/client-core'
import { DefaultModuleComponentPanel, setUpDynamicModulesSupport } from '@dharpa-vre/client-ui'
import React from 'react'

/**
 * Load current workflow module view code and return module panel component.
 */
export class DynamicModuleViewProviderWithLoader implements ModuleViewProvider {
  private context: IBackEndContext

  constructor(messageContext: IBackEndContext) {
    this.context = messageContext
    setUpDynamicModulesSupport()
  }

  private async loadCode(code: PageComponentsCode): Promise<void> {
    return new Promise(resolve => {
      const elementId = `page-code-${code.id}`
      if (document.getElementById(elementId) != null) return resolve()

      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.text = code.content
      script.id = elementId
      document.getElementsByTagName('head')[0].appendChild(script)
      resolve()
    })
  }

  async getModulePanel<T extends ModuleProps>(pageComponent: WorkflowPageComponent): Promise<React.FC<T>> {
    const panel = getLumyComponent(pageComponent.id)
    if (panel != null) return (panel as unknown) as React.FC<T>

    // if panel is not defined, try to load the code first.
    return new Promise(resolve => {
      const handler = handlerAdapter(Messages.Workflow.codec.PageComponentsCode.decode, msg => {
        Promise.all(msg.code.map(this.loadCode))
          .then(() => {
            this.context.unsubscribe(Target.Workflow, handler)
            const panel = getLumyComponent(pageComponent.id) ?? DefaultModuleComponentPanel
            resolve(panel)
          })
          .catch(e => {
            // TODO: shall we handle it better?
            console.error(e)
          })
      })
      this.context.subscribe(Target.Workflow, handler)
      this.context.sendMessage(Target.Workflow, Messages.Workflow.codec.GetPageComponentsCode.encode())
    })
  }
}
