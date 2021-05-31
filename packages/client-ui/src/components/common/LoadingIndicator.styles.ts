import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  loadingIndicator: {
    width: '100%',
    maxWidth: '50vmin',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  indicatorSquare: {
    position: 'relative',
    width: '60%',
    height: 0,
    paddingTop: '60%', // the padding is a replacement for height to make height === width
    margin: 'auto',

    '& div': {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      color: 'black'
    },
    '& div:before': {
      content: `''`,
      display: 'block',
      margin: '0 auto',
      width: '15%',
      height: '15%',
      backgroundColor: (props: Record<string, string>) =>
        (props?.color as string) ? props.color : theme.palette.primary.main,
      borderRadius: '100%',
      animation: '$spinnerDotAnimation 1.3s infinite ease-in-out both'
    },

    '& div:nth-child(2)': {
      transform: 'rotate(30deg)',

      '&:before': {
        animationDelay: '0.1s'
      }
    },

    '& div:nth-child(3)': {
      transform: 'rotate(60deg)',

      '&:before': {
        animationDelay: '0.2s'
      }
    },

    '& div:nth-child(4)': {
      transform: 'rotate(90deg)',

      '&:before': {
        animationDelay: '0.3s'
      }
    },

    '& div:nth-child(5)': {
      transform: 'rotate(120deg)',

      '&:before': {
        animationDelay: '0.4s'
      }
    },

    '& div:nth-child(6)': {
      transform: 'rotate(150deg)',

      '&:before': {
        animationDelay: '0.5s'
      }
    },

    '& div:nth-child(7)': {
      transform: 'rotate(180deg)',

      '&:before': {
        animationDelay: '0.6s'
      }
    },

    '& div:nth-child(8)': {
      transform: 'rotate(210deg)',

      '&:before': {
        animationDelay: '0.7s'
      }
    },

    '& div:nth-child(9)': {
      transform: 'rotate(240deg)',

      '&:before': {
        animationDelay: '0.8s'
      }
    },

    '& div:nth-child(10)': {
      transform: 'rotate(270deg)',

      '&:before': {
        animationDelay: '0.9s'
      }
    },

    '& div:nth-child(11)': {
      transform: 'rotate(300deg)',

      '&:before': {
        animationDelay: '1s'
      }
    },

    '& div:nth-child(12)': {
      transform: 'rotate(330deg)',

      '&:before': {
        animationDelay: '1.1s'
      }
    }
  },
  '@keyframes spinnerDotAnimation': {
    '0%, 80%, 100%': {
      transform: 'scale(0)'
    },
    '40%': {
      transform: 'scale(1)'
    }
  }
}))
