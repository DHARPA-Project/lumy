import { ISessionContext, sessionContextDialogs } from '@jupyterlab/apputils'
import { ServiceManager } from '@jupyterlab/services'
import { ITranslator, nullTranslator, TranslationBundle } from '@jupyterlab/translation'
import { LabIcon } from '@jupyterlab/ui-components'
import { Message } from '@lumino/messaging'
import { StackedPanel } from '@lumino/widgets'
import { KernelView, KernelModuleContext } from '@dharpa-vre/jupyter-support'

import AppIconSvg from './icon.svg'

/**
 * Container panel
 */
export class WrapperPanel extends StackedPanel {
  constructor(
    id: string,
    label: string,
    sessionContext: ISessionContext,
    serviceManager: ServiceManager.IManager,
    translator?: ITranslator
  ) {
    super()

    const actualTranslator = translator || nullTranslator
    this._trans = actualTranslator.load('jupyterlab')

    this.id = id
    this.title.label = this._trans.__(label)
    this.title.icon = new LabIcon({ name: `${label} icon`, svgstr: AppIconSvg })
    this.title.closable = true
    this._sessionContext = sessionContext

    void this._sessionContext
      .initialize()
      .then(async shouldSelectKernel => {
        if (shouldSelectKernel) {
          await sessionContextDialogs.selectKernel(this._sessionContext)
        }
        this._context = new KernelModuleContext(this._sessionContext, serviceManager)
        this._widget = new KernelView(this._context)
        this.addWidget(this._widget)
      })
      .catch(reason => {
        console.error(`Failed to initialize the session in ExamplePanel.\n${reason}`)
      })
  }

  get session(): ISessionContext {
    return this._sessionContext
  }

  dispose(): void {
    this._sessionContext.shutdown().then(() => {
      this._sessionContext.dispose()
      super.dispose()
    })
  }

  protected onCloseRequest(msg: Message): void {
    super.onCloseRequest(msg)
    this.dispose()
  }

  private _context: KernelModuleContext
  private _sessionContext: ISessionContext
  private _widget: KernelView

  private _trans: TranslationBundle
}
