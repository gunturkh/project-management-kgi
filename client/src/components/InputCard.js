import React, { useRef, useEffect } from 'react'
import {
  Paper,
  InputBase,
  makeStyles,
  Button,
  IconButton,
  InputLabel,
  FormControl,
  Select as SelectUI,
  Input,
  MenuItem,
  TextField,
  Box
} from '@material-ui/core'
import Select from 'react-select';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'
import DatePicker from '@material-ui/lab/DatePicker'
import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import { useTheme } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import CloseIcon from '@material-ui/icons/Close'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 100,
    },
  },
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  card: {
    margin: theme.spacing(0.2, 1, 0.09, 1),
    minWidth: '300px',
    wordWrap: 'break-word',
    padding: '30px',
    boxShadow: (props) =>
      props.type === 'list'
        ? 'inset 0 0 0 2px #0079bf'
        : '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
  },
  btn: {
    marginLeft: theme.spacing(1),
    backgroundColor: '#5aac44',
    color: 'white',
    textTransform: 'none',
    '&:hover': {
      opacity: 1.6,
      backgroundColor: '#61BD4F',
    },
  },
  icon: {
    opacity: 0.6,
    color: 'black',
    '&:hover': {
      opacity: 1,
    },
  },
  listBackground: {
    backgroundColor: '#EBECF0',
    marginLeft: (props) =>
      props.marginLeft ? theme.spacing(1) : theme.spacing(0),
    borderRadius: theme.spacing(0.5),
    padding: '10px',
  },
}))

export default function InputItem({
  value,
  changedHandler,
  keyDownHandler,
  itemAdded,
  closeHandler,
  width,
  type,
  btnText,
  placeholder,
  marginLeft,
}) {
  const { token, isValid, user, users, tokenRequest } = useSelector(
    (state) => state.user,
  )
  const { name, description, priority, pic, startDate, dueDate, list } = value
  const theme = useTheme()
  const classes = useStyles({ type, width, marginLeft })
  const divRef = useRef(null)
  const { timelines } = useSelector((state) => state.timeline)
  function getStyles() {
    return {
      fontWeight: theme.typography.fontWeightRegular,
    }
  }

  // useEffect(() => {
  //   if (divRef.current != null) {
  //     divRef.current.scrollIntoView({ behaviour: 'smooth' })
  //   }
  // })
  const handleBlur = () => {
    // closeHandler()
    // itemAdded()
  }
  return (
    <div className={classes.listBackground}>
      <Paper className={`${classes.card} ${classes.width}`}>
        <FormControl style={{ width: '100%', marginBottom: '2rem' }}>
          <TextField
            name="name"
            onChange={changedHandler}
            multiline
            fullWidth
            value={name}
            // autoFocus
            placeholder={'Title'}
            label={'Title'}
            // onBlur={handleBlur}
            // onKeyDown={keyDownHandler}
            variant="standard"
          />
        </FormControl>
        <FormControl style={{ width: '100%', marginBottom: '2rem' }}>
          <TextField
            name="description"
            onChange={changedHandler}
            multiline
            fullWidth
            value={description}
            // autoFocus
            placeholder={'Description'}
            label={'Description'}
            // onBlur={handleBlur}
            // onKeyDown={keyDownHandler}
            variant="standard"
          />
        </FormControl>
        <FormControl style={{ width: '100%', marginBottom: '2rem' }}>
          <InputLabel
            id="demo-mutiple-priority-label"
            style={{ marginLeft: '-15px' }}
          >
            Priority
          </InputLabel>
          <SelectUI
            value={priority}
            onChange={changedHandler}
            name="priority"
            // input={<Input label="Priority" />}
            MenuProps={MenuProps}
            // style={{ maxWidth: '100%' }}
            variant="standard"
            required
          >
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="normal">Normal</MenuItem>
            {/* <MenuItem
                value='low'
                style={getStyles()}
              >
                Low
              </MenuItem> */}
          </SelectUI>
        </FormControl>
        <FormControl style={{ width: '100%', marginBottom: '2rem' }}>
          <div style={{ paddingBottom: '5px' }}>
            Assigned to
          </div>
          <Select
            isMulti
            value={pic}
            onChange={changedHandler}
            name="pic"
            variant="standard"
            required
            options={users.map((user) => {
              return {
                value: user._id,
                label: user.username,
              }
            }
            )}

          >
          </Select>
        </FormControl>
        <FormControl style={{ width: '100%', marginBottom: '2rem' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              views={['day', 'month', 'year']}
              label="Project start date"
              value={startDate}
              onChange={(e) => changedHandler(e, 'startDate')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  helperText="Please fill project start date"
                  variant="standard"
                />
              )}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl style={{ width: '100%', marginBottom: '2rem' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              views={['day', 'month', 'year']}
              label="Project due date"
              value={dueDate}
              onChange={(e) => changedHandler(e, 'dueDate')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  helperText="Please fill project due date"
                  variant="standard"
                />
              )}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl style={{ width: '100%', marginBottom: '2rem' }}>
          <InputLabel
            id="demo-mutiple-pic-label"
            style={{ marginLeft: '-15px' }}
          >
            List
          </InputLabel>
          <SelectUI
            // multiple
            value={list}
            onChange={changedHandler}
            name="list"
            // input={<Input label="PIC" />}
            variant="standard"
            MenuProps={MenuProps}
            // style={{ maxWidth: '100%' }}
            required
          >
            {timelines.map((t) => (
              <MenuItem
                key={`${t.title}-${t._id}`}
                value={t._id}
                style={getStyles()}
              >
                {t.title}
              </MenuItem>
            ))}
          </SelectUI>
        </FormControl>
      </Paper>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '10px 0px'
        }}>
        <Button
          ref={divRef}
          className={classes.btn}
          variant="contained"
          onClick={itemAdded}
        >
          {btnText}
        </Button>
        <IconButton className={classes.icon} onClick={closeHandler}>
          <CloseIcon />
        </IconButton>
      </Box>
    </div>
  )
}
