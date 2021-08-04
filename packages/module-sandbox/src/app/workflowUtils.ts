import { LumyWorkflow } from '@dharpa-vre/client-core'

export const buildPlaygroundWorkflow = (moduleId: string | undefined): LumyWorkflow => {
  return {
    processing: {
      workflow: {
        name: 'playground workflow'
      }
    },
    ui: {
      pages:
        moduleId != null
          ? [
              {
                id: moduleId,
                component: {
                  id: moduleId
                },
                meta: {
                  label: 'playground page'
                }
              }
            ]
          : []
    },
    meta: {
      label: 'playground workflow'
    }
  }
}
