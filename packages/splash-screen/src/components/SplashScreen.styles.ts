import { makeStyles } from '@material-ui/core/styles'
import '@fontsource/roboto'
import '@fontsource/roboto/100.css'
import '@fontsource/roboto/300.css'

export default makeStyles(theme => ({
  root: {
    background: `linear-gradient(45deg, #e6e6e6 30%, #d2d2d2 60%)`,
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    padding: theme.spacing(2)
  },
  container: {
    maxWidth: theme.breakpoints.width('md'),
    margin: '0 auto',
    alignSelf: 'flex-start'
  },
  mainSection: {
    maxHeight: '96vh'
  },
  header: {
    fontSize: '3rem',
    textAlign: 'center',
    fontWeight: 100
  },
  subheader: {
    fontSize: '1rem',
    textAlign: 'center',
    fontWeight: 300
  },
  spinnerContainer: {
    textAlign: 'center',
    marginTop: theme.spacing(2)
  },
  logContainerWrapper: {
    display: 'flex',
    flex: '0 1 auto',
    overflowY: 'hidden'
  },
  logContainer: {
    overflowY: 'scroll',
    width: '100%'
  },
  accordion: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'none',
    backgroundColor: 'inherit',
    '& .MuiCollapse-container': {
      display: 'flex'
    },
    '& .MuiCollapse-wrapperInner': {
      display: 'flex',
      ' & > div': {
        display: 'flex'
      }
    },
    '& .MuiAccordionDetails-root': {
      padding: 0
    },
    '& .MuiAccordionSummary-root': {
      padding: 0,
      height: theme.spacing(6)
    },
    '& .MuiAccordionSummary-root.Mui-expanded': {
      minHeight: theme.spacing(6)
    }
  },
  avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20)
  },
  leftColumn: {
    flex: '0 1 34%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: theme.spacing(4)
  },
  rightColumn: {
    flex: '0 1 66%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  accordionSummary: {
    '& .MuiTypography-button': {
      fontSize: '.75rem'
    },
    '& .MuiSvgIcon-root': {
      fontSize: '.75rem'
    }
  }
}))
