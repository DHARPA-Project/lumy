import { LumyTheme as Theme } from './theme'

const getMuiThemeOverrides = (theme: Theme): unknown => ({
  MuiCssBaseline: {
    '@global': {
      '*': {
        'scrollbar-width': 'thin',
        'scrollbar-color': 'rgba(0,0,0,0.1) transparent' // 'thumb track'
      },
      '*::-webkit-scrollbar': {
        width: theme.layout.scrollBarWidth,
        height: theme.layout.scrollBarWidth
      },
      '*::-webkit-scrollbar-track': {
        backgroundColor: 'transparent'
      },
      '*::-webkit-scrollbar-thumb': {
        borderRadius: theme.layout.scrollBarWidth,
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
      paddingRight: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(1)
    }
  },
  MuiAccordionSummary: {
    root: {
      minHeight: theme.spacing(4),
      '&.Mui-expanded': {
        minHeight: theme.spacing(4)
      }
    },
    content: {
      margin: theme.spacing(1, 0),
      '&.Mui-expanded': {
        margin: theme.spacing(1, 0)
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
      padding: theme.spacing(1)
    }
  },
  MuiInputLabel: {
    outlined: {
      transform: `translate(${theme.spacing(1.75)}px, ${theme.spacing(1.25)}px) scale(1);`
    }
  },
  MuiListItem: {
    root: {
      paddingTop: theme.spacing(0),
      paddingBottom: theme.spacing(0)
    }
  },
  MuiListItemIcon: {
    root: {
      minWidth: theme.spacing(4)
    }
  },
  MuiNativeSelect: {
    root: {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: theme.palette.divider,
      borderRadius: theme.shape.borderRadius
    },
    select: {
      borderRadius: theme.shape.borderRadius,
      '&:focus': {
        borderRadius: theme.shape.borderRadius
      }
    }
  },
  MuiOutlinedInput: {
    input: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    },
    inputMarginDense: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    }
  },
  MuiTab: {
    root: {
      padding: theme.spacing(0, 1),
      backgroundColor: theme.palette.grey[100],
      fontSize: '0.8125rem',
      textTransform: 'none',
      '&:hover': {
        backgroundColor: theme.palette.grey[300]
      },
      '&$selected': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.background.paper
      }
    },
    labelIcon: {
      minHeight: theme.layout.tabHeight,
      paddingTop: 0
    }
  },
  MuiTabs: {
    root: {
      minHeight: theme.layout.tabHeight
    },
    indicator: {
      display: 'none'
    }
  },
  MuiTableCell: {
    root: {
      padding: theme.spacing(0.5)
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
  MuiTooltip: {
    tooltip: {
      backgroundColor: theme.palette.grey[200],
      color: theme.palette.text.primary
    },
    arrow: {
      color: theme.palette.grey[200]
    }
  },
  MuiTreeItem: {
    iconContainer: {
      color: theme.palette.grey[500]
    }
  },
  MuiTreeView: {
    root: {
      textAlign: 'left'
    }
  },
  PrivateSwitchBase: {
    root: {
      padding: theme.spacing(1)
    }
  }
})

export default getMuiThemeOverrides
