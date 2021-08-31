import React, { useState, createContext } from 'react'

import { generateUniqueId } from '@lumy/client-core'

interface IWorkflowCategory {
  name: string
  route: string
  steps: number
}

export const workflowCategories: {
  [key: string]: IWorkflowCategory
} = {
  networkAnalysis: {
    name: 'network analysis',
    route: '/workflows/network-analysis',
    steps: 6
  },
  topicModelling: {
    name: 'topic modelling',
    route: '/workflows/topic-modelling',
    steps: 10
  },
  geolocation: {
    name: 'geolocation',
    route: '/workflows/geolocation',
    steps: 7
  }
}

const localStorageProjectKey = '__lumy-projects'

export type ProjectType = {
  id: string
  type: string
  date: number
  name: string
  totalSteps: number
  currentStep: number
}

export type ProjectContextType = {
  projectList: ProjectType[]
  createProject: (name: string, type: string) => void
  removeProject: (idProjectToDelete: string) => void
}

type ProjectProviderProps = {
  children?: React.ReactNode
}

export const ProjectContext = createContext<ProjectContextType>(null)

const sampleProjects = [
  {
    id: generateUniqueId(),
    type: workflowCategories.networkAnalysis.name,
    date: new Date('2021.04.01').getTime(),
    name: 'Trump tweet network',
    totalSteps: workflowCategories.networkAnalysis.steps,
    currentStep: 5
  },
  {
    id: generateUniqueId(),
    type: workflowCategories.geolocation.name,
    date: new Date('2021.04.01').getTime(),
    name: 'Trump tweet locations',
    totalSteps: workflowCategories.geolocation.steps,
    currentStep: 3
  },
  {
    id: generateUniqueId(),
    type: workflowCategories.topicModelling.name,
    date: new Date('2021.04.01').getTime(),
    name: 'Trump tweet topics hilarious',
    totalSteps: workflowCategories.topicModelling.steps,
    currentStep: 10
  }
]

const getProjectsFromLocalStorage = () => {
  const valueInLocalStorage = localStorage.getItem(localStorageProjectKey)
  return valueInLocalStorage ? JSON.parse(valueInLocalStorage) : sampleProjects
}

export const ProjectProvider = ({ children }: ProjectProviderProps): JSX.Element => {
  const [projectList, setProjectList] = useState<ProjectType[]>(getProjectsFromLocalStorage)

  const createProject = (name: string, type: string): string => {
    const newProjectId = generateUniqueId()

    setProjectList(previousProjectList => {
      const newProjectList = [
        ...previousProjectList,
        {
          id: newProjectId,
          date: Date.now(),
          type: type,
          name: name,
          totalSteps: Object.values(workflowCategories).find(workflow => workflow.name === type).steps,
          currentStep: 1
        }
      ]
      localStorage.setItem(localStorageProjectKey, JSON.stringify(newProjectList))
      return newProjectList
    })

    return newProjectId
  }

  const removeProject = (idProjectToDelete: string): void => {
    setProjectList(previousProjectList => {
      const newProjectList = previousProjectList.filter(project => project.id !== idProjectToDelete)
      localStorage.setItem(localStorageProjectKey, JSON.stringify(newProjectList))
      return newProjectList
    })
  }

  return (
    <ProjectContext.Provider value={{ projectList, createProject, removeProject }}>
      {children}
    </ProjectContext.Provider>
  )
}
