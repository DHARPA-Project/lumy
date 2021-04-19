import React, { useState } from 'react'

import { ProjectType } from '../context/projectContext'
import useStyles from './NetworkAnalysisProject.styles'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import BackupIcon from '@material-ui/icons/Backup'
import VisibilityIcon from '@material-ui/icons/Visibility'

import NAGraphContainer from './network-analysis/NAGraphContainer'
import NAParameters from './network-analysis/NAParameters'
import DialogModal from './common/DialogModal'
import NADataUpload from './network-analysis/NADataUploadForm'

type NAProjectProps = {
  project: ProjectType
}

const NetworkAnalysisProject = ({ project }: NAProjectProps): JSX.Element => {
  const classes = useStyles()

  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false)

  return (
    <div className={classes.root}>
      <NAGraphContainer />

      <div>
        <Paper className={classes.summary} square>
          <Typography
            className={classes.title}
            component="h2"
            variant="h6"
            color="primary"
            align="center"
            gutterBottom
          >
            {project.name}
          </Typography>
          <Typography component="p" variant="body1" align="center" gutterBottom>
            {new Date(project.date).toUTCString()}
          </Typography>
        </Paper>

        <Paper className={classes.dataControls} square>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<BackupIcon />}
            onClick={() => setIsUploadModalOpen(true)}
            size="small"
          >
            Data
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<VisibilityIcon />}
            onClick={() => setIsPreviewModalOpen(true)}
            size="small"
          >
            Data
          </Button>
        </Paper>

        <NAParameters />
      </div>

      <DialogModal
        title="Select Data Source"
        isModalOpen={isUploadModalOpen}
        setIsModalOpen={setIsUploadModalOpen}
      >
        <NADataUpload closeModal={() => setIsUploadModalOpen(false)} />
      </DialogModal>

      <DialogModal
        title="Data Preview"
        isModalOpen={isPreviewModalOpen}
        setIsModalOpen={setIsPreviewModalOpen}
      >
        <p>data preview</p>
      </DialogModal>
    </div>
  )
}

export default NetworkAnalysisProject
