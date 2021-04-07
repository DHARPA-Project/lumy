import { withStyles, Theme, createStyles } from '@material-ui/core/styles'

import LinearProgress from '@material-ui/core/LinearProgress'

const ProjectProgressBar = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 5,
      borderRadius: 3
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700]
    },
    bar: {
      borderRadius: 3
    }
  })
)(LinearProgress)

export default ProjectProgressBar
