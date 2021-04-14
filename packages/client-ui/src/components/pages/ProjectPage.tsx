import React, { useContext } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'

import { ProjectContext } from '../../context/projectContext'

import Button from '@material-ui/core/Button'

import DeleteIcon from '@material-ui/icons/Delete'

const ProjectPage = (): JSX.Element => {
  const match = useRouteMatch()
  const history = useHistory()

  const { projectList, removeProject } = useContext(ProjectContext)

  const currentProjectId = (match.params as { id: string })?.id
  const currentProject = projectList.find(project => project.id === currentProjectId)

  const handleRemoveProject = () => {
    removeProject(currentProjectId)
    history.push('/')
  }

  return (
    <div className="project-page">
      <h1>{currentProject.name}</h1>
      <p>ID: {currentProject.id}</p>
      <p>category: {currentProject.type}</p>
      <p>date: {new Date(currentProject.date).toUTCString()}</p>

      <Button
        type="submit"
        variant="contained"
        color="secondary"
        startIcon={<DeleteIcon />}
        onClick={handleRemoveProject}
        size="small"
      >
        Remove Project
      </Button>
    </div>
  )
}

export default ProjectPage
