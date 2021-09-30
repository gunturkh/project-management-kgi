import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'

/**
 * Date Picker
 * Build using Material-UI Picker
 * @see {@link https://material-ui-pickers.dev/api/DatePicker} for more documentation
 *
 * @param {object}    props
 * @param {string}    props.label
 * @param {boolean}   props.disablePast
 * @param {boolean}   props.table                 adjust size to table row
 * @param {string}    props.helper
 * @param {string}    props.className
 * @param {Array}     props.shouldDisableDate     list disabled date @see this.disabledDate()
 * @param {Array}     props.views
 * @param {string}    props.placeholder
 * @param {boolean}   props.disabled
 * @param {boolean}   props.notRequired
 * @param {boolean}   props.clearable             set this true if field not required
 * @param {string}    props.format
 * @param {string}    props.openTo
 *
 */

const styles = (props) => ({
  textField: {
    MuiInputBase: {
      backgroundColor: '#ffffff',
      height: props.table ? '40px' : '56px',
      root: {
        '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
          borderColor: 'rgba(0,0,0,0.4) !important',
        },
      },
    },
    justifyContent: 'center',
    width: '100%',
    color: '#555',
    marginTop: 0,
  },
  cssLabel: {
    color: '#d1d1d1',
    backgroundColor: '#ffffff',

    '&$focused': {
      color: '#555555',
    },
  },

  notchedOutline: {
    borderWidth: '2px',
    borderColor: '#cdcdcd !important',
  },
  focused: {
    '& $notchedOutline': {
      borderColor: '#ef9f98 !important',
    },
  },
})

const dateStyle = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: '#f5f5f5',
      },
    },
    MuiPickersToolbarText: {
      toolbarTxt: {
        color: '#a9a9a9',
      },
      toolbarBtnSelected: {
        color: '#e37676',
      },
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        // backgroundColor: lightBlue.A200,
        // color: "white",
      },
    },
    MuiPickersMonth: {
      monthSelected: {
        color: '#e37676',
        fontWeight: 500,
      },
    },
    MuiPickersDay: {
      current: {
        color: '#2a2a2a',
        backgroundColor: '#fff4f2',
      },
      daySelected: {
        backgroundColor: '#e37676',
        color: '#ffffff',

        '&:hover': {
          backgroundColor: '#d8827a !important',
        },
      },
    },
    MuiTypography: {
      colorPrimary: {
        color: '#e37676',
      },
    },
    MuiButton: {
      textPrimary: {
        color: '#e37676',
      },
    },
  },
})

class DateField extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: null,
    }
  }

  componentDidMount() {
    const { value } = this.props

    this.setState({
      value,
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { value } = nextProps

    this.setState({
      value,
    })
  }

  onChangeTextInput = (e) => {
    const { change } = this.props
    this.setState({
      value: e,
    })
    change(e)
  }

  disabledDate = (date) => {
    const { shouldDisableDate } = this.props
    const arrObjDate = shouldDisableDate.disabledDate

    const arrDate = arrObjDate.map((obj) => {
      const dateInt = parseFloat(obj.date)
      const format = moment(new Date(dateInt)).format('DD MMMM YYYY')
      const newTimeStamp = new Date(format).getTime()
      return newTimeStamp
    })
    const dateNewMax = new Date(shouldDisableDate.maxDate)
    const dateNewMin = new Date('1900-01-01')

    const maxTime = dateNewMax.getTime()
    const minTime = dateNewMin.getTime()
    return arrDate.includes(date.getTime()) || date < minTime || date > maxTime
  }

  render() {
    const {
      classes,
      label,
      disablePast,
      table,
      helper,
      className,
      shouldDisableDate,
      views,
      placeholder,
      disabled,
      notRequired,
      clearable,
      format,
      openTo,
    } = this.props
    const { value } = this.state

    // Uncomment code bellow to see disabled date data

    // const formatDisabledDate = shouldDisableDate.disabledDate.map(obj =>
    //   moment(new Date(parseInt(obj.date))).format('DD MMMM YYYY')
    // );
    // console.log('formated date', formatDisabledDate);

    return (
      <div className={className || 'date-field'}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <MuiThemeProvider theme={dateStyle}>
            <DatePicker
              clearable={clearable}
              required={notRequired ? null : true}
              placeholder={placeholder}
              disabled={disabled}
              disablePast={!!disablePast}
              format={format}
              openTo={openTo}
              label={label}
              value={value}
              shouldDisableDate={shouldDisableDate ? this.disabledDate : null}
              onChange={(e) => {
                this.onChangeTextInput(e)
              }}
              views={views}
              helperText={helper}
              animateYearScrolling={false}
              inputVariant="outlined"
              style={{ width: '100%' }}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel,
                  focused: classes.focused,
                  shrink: 'label-shrink',
                },
                required: false,
              }}
              InputProps={{
                classes: {
                  root: table ? 'table-input-field' : 'date-field-picker',
                  notchedOutline: classes.notchedOutline,
                  focused: classes.focused,
                },
              }}
              autoOk
            />
          </MuiThemeProvider>
        </MuiPickersUtilsProvider>

        {/**
         * FIXME: Change Value validation
         * Material picker doesn't have build in required props. So currently we use native html form to validate.
         * Need to check if the lib update the feature
         */}

        {!disabled && (
          <input
            tabIndex={-1}
            autoComplete="off"
            style={{
              opacity: 0,
              height: 0,
              left: 0,
              position: 'absolute',
              zIndex: -1,
            }}
            value={value || ''}
            onChange={(e) => {
              this.onChangeTextInput(e)
            }}
            required={!notRequired}
          />
        )}
      </div>
    )
  }
}

DateField.defaultProps = {
  label: '',
  disablePast: false,
  table: false,
  helper: '',
  className: '',
  shouldDisableDate: null,
  views: undefined,
  placeholder: null,
  disabled: false,
  notRequired: false,
  clearable: false,
  format: 'dd MMMM yyyy',
  openTo: undefined,
}

DateField.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string,
  disablePast: PropTypes.bool,
  table: PropTypes.bool,
  helper: PropTypes.string,
  className: PropTypes.string,
  shouldDisableDate: PropTypes.any, // this return according BE data, I put any to prevent data changes
  views: PropTypes.array,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  notRequired: PropTypes.bool,
  clearable: PropTypes.bool,
  format: PropTypes.string,
  openTo: PropTypes.string,
}

export default withStyles(styles)(DateField)
