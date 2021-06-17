import defaultTheme from './muiDefaultTheme'

export default {
  MuiCssBaseline: {
    '@global': {
      '*': {
        'scrollbar-width': 'thin',
        'scrollbar-color': 'rgba(0,0,0,0.1) transparent' // 'thumb track'
      },
      '*::-webkit-scrollbar': {
        width: defaultTheme.spacing(0.5),
        height: defaultTheme.spacing(0.5)
      },
      '*::-webkit-scrollbar-track': {
        backgroundColor: 'transparent'
      },
      '*::-webkit-scrollbar-thumb': {
        borderRadius: defaultTheme.spacing(0.5),
        backgroundColor: 'rgba(0,0,0,0.1)',
        '&:hover': {
          backgroundColor: 'rgba(0,0,0,0.15)'
        },
        '&:active': {
          backgroundColor: 'rgba(0,0,0,0.2)'
        }
      }
    }
  },
  MuiAccordionSummary: {
    root: {
      minHeight: defaultTheme.spacing(4),
      '&.Mui-expanded': {
        minHeight: defaultTheme.spacing(6)
      }
    },
    content: {
      margin: defaultTheme.spacing(1, 0),
      '&.Mui-expanded': {
        margin: defaultTheme.spacing(2, 0)
      }
    }
  },
  MuiCheckbox: {
    colorPrimary: {
      '&:hover, &.Mui-checked:hover': {
        backgroundColor: 'transparent'
      }
    }
  },
  MuiFab: {
    root: {
      boxShadow: 'none'
    }
  },
  MuiIconButton: {
    root: {
      padding: defaultTheme.spacing(1)
    }
  },
  MuiOutlinedInput: {
    inputMarginDense: {
      paddingTop: defaultTheme.spacing(1),
      paddingBottom: defaultTheme.spacing(1)
    }
  },
  MuiTab: {
    root: {
      fontSize: '0.8125rem'
    },
    labelIcon: {
      minHeight: defaultTheme.spacing(5),
      paddingTop: '6px'
    }
  },
  MuiTabs: {
    root: {
      minHeight: defaultTheme.spacing(5)
    }
  },
  MuiTableCell: {
    root: {
      padding: defaultTheme.spacing(0.5)
    }
  },
  MuiTablePagination: {
    root: {
      fontSize: '0.75rem'
    },
    toolbar: {
      minHeight: 'auto'
    }
  }
}
