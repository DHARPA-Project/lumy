import { generateUniqueId } from '@lumy/client-core'

const AppTopLevelDomElementId = `lumy-${generateUniqueId()}`

const getAppTopLevelElement = (): Element => document.getElementById(AppTopLevelDomElementId)

export { AppTopLevelDomElementId, getAppTopLevelElement }
