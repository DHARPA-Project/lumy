import {
  DynamicModuleViewProvider,
  ModuleProps,
  ModuleViewProvider,
  WorkflowPageComponent
} from '@lumy/client-core'
import { DefaultModuleComponentPanel, setUpDynamicModulesSupport } from '@lumy/client-ui'

export class DynamicModuleViewProviderWithLoader implements ModuleViewProvider {
  private provider: DynamicModuleViewProvider
  private loadedUrls: string[] = []
  constructor() {
    this.provider = new DynamicModuleViewProvider(DefaultModuleComponentPanel)
    setUpDynamicModulesSupport()
  }

  private async injectComponentUrl(url: string): Promise<void> {
    return new Promise(resolve => {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = `/modules-package?url=${url}`
      script.onload = () => resolve()
      document.getElementsByTagName('head')[0].appendChild(script)
    })
  }

  async getModulePanel<T extends ModuleProps>(pageComponent: WorkflowPageComponent): Promise<React.FC<T>> {
    if (pageComponent.url != null && !this.loadedUrls.includes(pageComponent.url)) {
      await this.injectComponentUrl(pageComponent.url)
      this.loadedUrls.push(pageComponent.url)
    }
    return this.provider.getModulePanel(pageComponent)
  }
}
