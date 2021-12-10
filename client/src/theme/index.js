import { createMuiTheme, colors } from '@material-ui/core'
import shadows from './shadows'
import typography from './typography'

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#F4F6F8',
      paper: colors.common.white,
    },
    primary: {
      contrastText: '#ffffff',
      main: '#2064A4',
      green: '#02A858',
    },
    secondary: {
      main: '#2064A4',
    },
    apple: {
      main: '#5EC43C',
      // backgroundColor: 'black',
    },
    black: {
      main: 'black',
    },
    text: {
      primary: '#172b4d',
      secondary: '#6b778c',
    },
  },
  // components: {
  //   MuiLinearProgress: {
  //     variants: [
  //       {
  //         props: { variant: 'apple' },
  //         style: {
  //           main: '#5EC43C',
  //           backgroundColor: 'black',
  //         },
  //       },
  //     ],
  //   },
  // },
  shadows,
  typography,
})

export default theme
