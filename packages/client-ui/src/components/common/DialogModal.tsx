import React from 'react'

import useStyles from './DialogModal.styles'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import CloseIcon from '@material-ui/icons/Close'

type DialogModalProps = {
  title: string
  children: React.ReactNode
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DialogModal = ({ title, children, isModalOpen, setIsModalOpen }: DialogModalProps): JSX.Element => {
  const classes = useStyles()

  return (
    <Dialog open={isModalOpen} maxWidth="md" classes={{ paper: classes.dialogWrapper }}>
      <Button
        color="secondary"
        size="small"
        className={classes.closeButton}
        onClick={() => {
          setIsModalOpen(false)
        }}
      >
        <CloseIcon />
      </Button>

      <DialogTitle className={classes.dialogTitle}>
        <Typography variant="h6" component="h1">
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}

export default DialogModal
