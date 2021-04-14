import React, { useContext } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { ProjectContext } from '../../context/projectContext'

const ProjectPage = (): JSX.Element => {
  const match = useRouteMatch()

  const { projectList } = useContext(ProjectContext)

  const currentProjectId = (match.params as { id: string })?.id
  const currentProject = projectList.find(project => project.id === currentProjectId)

  console.log('date: ', new Date(currentProject.date).toUTCString())

  return (
    <div className="project-page">
      <h1>{currentProject.name}</h1>
      <p>ID: {currentProject.id}</p>
      <p>category: {currentProject.type}</p>
      <p>date: {new Date(currentProject.date).toUTCString()}</p>
    </div>
  )
}

export default ProjectPage
