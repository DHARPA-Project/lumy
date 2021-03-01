import { ISessionContext, sessionContextDialogs } from '@jupyterlab/apputils'
import { ITranslator, nullTranslator, TranslationBundle } from '@jupyterlab/translation'
import { LabIcon } from '@jupyterlab/ui-components'
import { Message } from '@lumino/messaging'
import { StackedPanel } from '@lumino/widgets'
import { KernelView } from './widget'
import { KernelModuleContext } from './kernelContext'

import AppIconSvg from './icon.svg'

/**
 * Container panel
 */
export class WrapperPanel extends StackedPanel {
  constructor(id: string, label: string, sessionContext: ISessionContext, translator?: ITranslator) {
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
        this._context = new KernelModuleContext(this._sessionContext)
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
    // uncomment to destroy kernel on exit
    // this._sessionContext.dispose()
    super.dispose()
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
