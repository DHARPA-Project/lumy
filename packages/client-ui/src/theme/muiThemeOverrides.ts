import defaultTheme from './muiDefaultTheme'

export default {
  MuiCssBaseline: {
    '@global': {
      '*': {
        'scrollbar-width': 'thin',
        'scrollbar-color': 'rgba(0,0,0,0.1) transparent' // 'thumb track'
      },
      '*::-webkit-scrollbar': {
        width: defaultTheme?.layout?.scrollBarWidth,
        height: defaultTheme?.layout?.scrollBarWidth
      },
      '*::-webkit-scrollbar-track': {
        backgroundColor: 'transparent'
      },
      '*::-webkit-scrollbar-thumb': {
        borderRadius: defaultTheme?.layout?.scrollBarWidth,
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
  MuiAccordionDetails: {
    root: {
      paddingTop: 0,
      paddingRight: defaultTheme.spacing(1),
      paddingBottom: defaultTheme.spacing(1),
      paddingLeft: defaultTheme.spacing(1)
    }
  },
  MuiAccordionSummary: {
    root: {
      minHeight: defaultTheme.spacing(4),
      '&.Mui-expanded': {
        minHeight: defaultTheme.spacing(4)
      }
    },
    content: {
      margin: defaultTheme.spacing(1, 0),
      '&.Mui-expanded': {
        margin: defaultTheme.spacing(1, 0)
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
  MuiChip: {
    root: {
      height: 'auto'
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
  MuiListItem: {
    root: {
      paddingTop: defaultTheme.spacing(0),
      paddingBottom: defaultTheme.spacing(0)
    }
  },
  MuiListItemIcon: {
    root: {
      minWidth: defaultTheme.spacing(4)
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
  },
  PrivateSwitchBase: {
    root: {
      padding: defaultTheme.spacing(1)
    }
  }
}
