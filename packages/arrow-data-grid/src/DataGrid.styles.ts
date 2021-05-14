import { makeStyles, Theme, useTheme } from '@material-ui/core/styles'

const HeaderHeightUnits = 7

const CondensetRowHeightUnits = 3
const DefaultRowHeightUnits = 6.5

interface Heights {
  header: number
  row: number
}

interface UseHeightsProps {
  rowCondensed: boolean
}

export const useHeights = ({ rowCondensed }: UseHeightsProps): Heights => {
  const theme = useTheme()

  return {
    header: theme.spacing(HeaderHeightUnits),
    row: theme.spacing(rowCondensed ? CondensetRowHeightUnits : DefaultRowHeightUnits)
  }
}

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .MuiDataGrid-windowContainer': {
      height: 'auto !important'
    },
    '& .MuiDataGrid-window': {
      position: 'inherit',
      top: '0 !important',
      marginTop: theme.spacing(7)
    },
    '& .MuiDataGrid-viewport': {
      maxHeight: 'fit-content! important'
    },
    '& .MuiDataGrid-renderingZone': {
      maxHeight: 'fit-content! important'
    },
    '& .MuiDataGrid-row': {
      maxHeight: 'fit-content! important'
    },
    '& .MuiDataGrid-cell': {
      maxHeight: 'fit-content! important',
      lineHeight: 'inherit !important'
    },
    '& .MuiDataGrid-cell:focus': {
      outline: 'none !important'
    }
  }
}))
