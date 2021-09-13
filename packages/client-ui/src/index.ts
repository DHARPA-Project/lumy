import { App } from './components/App'
import DialogModal from './components/common/DialogModal'
import DocumentationPortal from './components/common/documentation/Documentation'
import DefaultModuleComponentPanel from './components/common/DefaultModuleComponentPanel'
import { WorkflowContext } from './state'

import { featureIds } from './const/features'

import { setUpDynamicModulesSupport } from './utils/dynamicModules'

export {
  App,
  DialogModal,
  DocumentationPortal,
  WorkflowContext,
  featureIds,
  setUpDynamicModulesSupport,
  DefaultModuleComponentPanel
}

import './@types/assets/index.d.ts'
