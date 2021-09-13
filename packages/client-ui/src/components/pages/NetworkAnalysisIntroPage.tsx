import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'

import AddIcon from '@material-ui/icons/Add'

import { ProjectContext, workflowCategories } from '../../state'
import useStyles from './NetworkAnalysisIntroPage.styles'

import NavProjectLink from '../common/navigation/NavProjectLink'
import WorkflowPreviewCarousel from '../sample/WorkflowPreviewCarousel'
import DialogModal from '../common/DialogModal'
import CreateProjectForm from '../common/CreateProjectForm'

/** TODO: not used, consider removing */
const NetworkAnalysisIntroPage: React.FC = () => {
  const classes = useStyles()

  const history = useHistory()

  const { projectList } = useContext(ProjectContext)

  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState<boolean>(false)

  const currentWorkflowCategory = (() => {
    const matchingCategory = Object.values(workflowCategories).find(
      category => category.route === history.location.pathname
    )

    return matchingCategory
      ? matchingCategory.name
      : workflowCategories[Object.keys(workflowCategories)[0]].name
  })()

  return (
    <div className={classes.root}>
      <Typography component="h1" variant="h5" className={classes.headline}>
        Network Analysis
      </Typography>

      <Container className={classes.content}>
        <Paper className={`${classes.block} ${classes.projects}`}>
          <Typography component="h2" variant="h6" align="center" gutterBottom>
            Current Projects
          </Typography>

          <List>
            {projectList.map(project => {
              if (project.type !== currentWorkflowCategory) return null
              return (
                <NavProjectLink
                  key={project.id}
                  label={project.name}
                  link={`/projects/${project.id}`}
                  totalSteps={project.totalSteps}
                  currentStep={project.currentStep}
                />
              )
            })}
          </List>

          <Button
            className={classes.createProjectButton}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateProjectModalOpen(true)}
            size="small"
          >
            New Project
          </Button>
        </Paper>

        <Paper className={`${classes.block} ${classes.preview}`}>
          <WorkflowPreviewCarousel />
        </Paper>
      </Container>

      <DialogModal
        title="New Workflow Project"
        isModalOpen={isCreateProjectModalOpen}
        onCloseModalClick={setIsCreateProjectModalOpen}
      >
        <CreateProjectForm
          workflowCategory={currentWorkflowCategory}
          closeModal={() => setIsCreateProjectModalOpen(false)}
        />
      </DialogModal>
    </div>
  )
}

export default NetworkAnalysisIntroPage
