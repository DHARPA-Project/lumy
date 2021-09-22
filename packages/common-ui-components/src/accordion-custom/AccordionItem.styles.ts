import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  accordionRoot: {
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0
    },
    '& $accordionSummaryRoot': {
      borderBottomColor: 'transparent'
    },
    '&$accordionExpanded $accordionSummaryRoot': {
      borderBottomColor: theme.palette.divider
    },
    '&:before': {
      display: 'none'
    },
    '&$accordionExpanded': {
      margin: 'auto'
    }
  },
  accordionExpanded: {},
  accordionSummaryRoot: {
    backgroundColor: theme.palette.type === 'dark' ? 'rgba(255, 255, 255, .04)' : 'rgba(0, 0, 0, .02)',
    flexDirection: 'row-reverse',
    borderBottom: `1px solid ${theme.palette.divider}`,
    transition: theme.transitions.create('border-color', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard
    })
  },
  accordionSummaryContent: {
    '&$accordionSummaryExpanded': {
      margin: theme.spacing(1, 0)
    }
  },
  accordionSummaryExpanded: {
    '&$accordionSummaryExpandIcon': {
      transform: 'rotate(90deg)'
    }
  },
  accordionSummaryExpandIcon: {
    marginRight: 0,
    marginLeft: -theme.spacing(1.5)
  },
  accordionDetailRoot: {
    padding: theme.spacing(2)
  }
}))
