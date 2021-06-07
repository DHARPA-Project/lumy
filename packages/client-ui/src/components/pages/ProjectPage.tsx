import React, { useContext } from 'react'
import { Redirect, useRouteMatch } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'

import { ProjectContext } from '../../context/projectContext'

const ProjectPage = (): JSX.Element => {
  const match = useRouteMatch()

  const { projectList, removeProject } = useContext(ProjectContext)

  const currentProjectId = (match.params as { id: string })?.id
  const currentProject = projectList.find(project => project.id === currentProjectId)

  const handleRemoveProject = () => {
    removeProject(currentProjectId)
    return <Redirect to="/" />
  }

  if (!currentProject?.name) {
    return <Redirect to="/" />
  }

  return (
    <div className="project-page" style={{ overflow: 'hidden' }}>
      <h1>{currentProject?.name}</h1>
      <p>ID: {currentProject?.id}</p>
      <p>category: {currentProject?.type}</p>
      <p>date: {new Date(currentProject?.date).toUTCString()}</p>

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
