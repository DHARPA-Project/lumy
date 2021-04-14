import React, { useState, createContext } from 'react'

import { v4 as uuidv4 } from 'uuid'

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

type ProjectContextProviderProps = {
  children?: React.ReactNode
}

export const ProjectContext = createContext<ProjectContextType>(null)

const sampleProjects = [
  {
    id: uuidv4(),
    type: workflowCategories.networkAnalysis.name,
    date: new Date('2021.04.01').getTime(),
    name: 'Trump tweet network',
    totalSteps: workflowCategories.networkAnalysis.steps,
    currentStep: 5
  },
  {
    id: uuidv4(),
    type: workflowCategories.geolocation.name,
    date: new Date('2021.04.01').getTime(),
    name: 'Trump tweet locations',
    totalSteps: workflowCategories.geolocation.steps,
    currentStep: 3
  },
  {
    id: uuidv4(),
    type: workflowCategories.topicModelling.name,
    date: new Date('2021.04.01').getTime(),
    name: 'Trump tweet topics hilarious',
    totalSteps: workflowCategories.topicModelling.steps,
    currentStep: 10
  }
]

const getProjectsFromLocalStorage = () => {
  const valueInLocalStorage = localStorage.getItem('dharpaProjects')
  return valueInLocalStorage ? JSON.parse(valueInLocalStorage) : sampleProjects
}

const ProjectContextProvider = ({ children }: ProjectContextProviderProps): JSX.Element => {
  const [projectList, setProjectList] = useState<ProjectType[]>(getProjectsFromLocalStorage)

  const createProject = (name: string, type: string): string => {
    const newProjectId = uuidv4()

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
      localStorage.setItem('dharpaProjects', JSON.stringify(newProjectList))
      return newProjectList
    })

    return newProjectId
  }

  const removeProject = (idProjectToDelete: string): void => {
    setProjectList(previousProjectList => {
      const newProjectList = previousProjectList.filter(project => project.id !== idProjectToDelete)
      localStorage.setItem('dharpaProjects', JSON.stringify(newProjectList))
      return newProjectList
    })
  }

  return (
    <ProjectContext.Provider value={{ projectList, createProject, removeProject }}>
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectContextProvider
