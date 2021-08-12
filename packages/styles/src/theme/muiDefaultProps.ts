import { ComponentsProps } from '@material-ui/core/styles/props'

export default {
  MuiButton: {
    disableElevation: true,
    color: 'default',
    size: 'small'
  },
  MuiCard: {
    variant: 'outlined'
  },
  MuiCardActionArea: {
    disableRipple: true
  },
  MuiCheckbox: {
    disableRipple: true
  },
  MuiList: {
    disablePadding: true
  },
  MuiNativeSelect: {
    disableUnderline: true
  },
  MuiPaper: {
    variant: 'outlined',
    elevation: 0
  },
  MuiSvgIcon: {
    fontSize: 'small'
  }
} as ComponentsProps
