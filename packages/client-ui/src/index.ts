import { App } from './components/App'
import DialogModal from './components/common/DialogModal'
import DocumentationPortal from './components/common/documentation/Documentation'
import DefaultModuleComponentPanel from './components/common/DefaultModuleComponentPanel'
import { WorkflowContext } from './state'

import { featureIds, featureList } from './const/features'

import { setUpDynamicModulesSupport } from './utils/dynamicModules'

export {
  App,
  DialogModal,
  DocumentationPortal,
  WorkflowContext,
  featureIds,
  featureList,
  setUpDynamicModulesSupport,
  DefaultModuleComponentPanel
}

import './@types/assets/index.d.ts'
