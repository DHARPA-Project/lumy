import React from 'react'

import useStyles from './DialogModal.styles'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Slide from '@material-ui/core/Slide'
import Button from '@material-ui/core/Button'

import CloseIcon from '@material-ui/icons/Close'

type DialogModalProps = {
  title: string
  children: React.ReactNode
  isModalOpen: boolean
  onCloseModalClick: React.Dispatch<React.SetStateAction<boolean>>
}

const DialogModal = ({ title, children, isModalOpen, onCloseModalClick }: DialogModalProps): JSX.Element => {
  const classes = useStyles()

  return (
    <Dialog
      open={isModalOpen}
      maxWidth="md"
      classes={{ paper: classes.dialogWrapper }}
      TransitionComponent={Slide}
      keepMounted
    >
      <Button
        color="secondary"
        size="small"
        classes={{ root: classes.closeButtonRoot, label: classes.closeButtonLabel }}
        onClick={() => {
          onCloseModalClick(false)
        }}
      >
        <CloseIcon />
      </Button>

      <DialogTitle className={classes.dialogTitle}>{title}</DialogTitle>

      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}

export default DialogModal
