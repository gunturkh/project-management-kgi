import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { v4 as uuid } from 'uuid'
import { useNavigate } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'
import DatePicker from '@material-ui/lab/DatePicker'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import {
  createNewTimelines,
  updateTimelineByBoardId,
  deleteTimelineById,
} from '../actions/actionCreators/timelineActions'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  Divider,
  TextField,
  Dialog,
  DialogContent,
} from '@material-ui/core'
// import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import FullCalendar from '@fullcalendar/react'
// import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import { User, Edit, Trash2 } from 'react-feather'

const orders = [
  {
    id: uuid(),
    ref: 'CDD1049',
    amount: 30.5,
    customer: {
      name: 'Ekaterina Tankova',
    },
    createdAt: 1555016400000,
    status: 'pending',
  },
  {
    id: uuid(),
    ref: 'CDD1048',
    amount: 25.1,
    customer: {
      name: 'Cao Yu',
    },
    createdAt: 1555016400000,
    status: 'delivered',
  },
  {
    id: uuid(),
    ref: 'CDD1047',
    amount: 10.99,
    customer: {
      name: 'Alexa Richardson',
    },
    createdAt: 1554930000000,
    status: 'refunded',
  },
  {
    id: uuid(),
    ref: 'CDD1046',
    amount: 96.43,
    customer: {
      name: 'Anje Keizer',
    },
    createdAt: 1554757200000,
    status: 'pending',
  },
  {
    id: uuid(),
    ref: 'CDD1045',
    amount: 32.54,
    customer: {
      name: 'Clarke Gillebert',
    },
    createdAt: 1554670800000,
    status: 'delivered',
  },
  {
    id: uuid(),
    ref: 'CDD1044',
    amount: 16.76,
    customer: {
      name: 'Adam Denisov',
    },
    createdAt: 1554670800000,
    status: 'delivered',
  },
]

// const calendar = new Calendar(calendarEl, {
//   plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
//   initialView: 'dayGridMonth',
//   headerToolbar: {
//     left: 'prev,next today',
//     center: 'title',
//     right: 'dayGridMonth,timeGridWeek,listWeek',
//   },
// })

// const viewCalendar = () => {
//   let view
//   if ($(window).width() < 600) {
//     view = 'timeGridDay'
//   } else {
//     view = 'dayGridMonth'
//   }
//   return view
// }
const eventsData = [
  { title: 'All Day Event', start: '2021-05-01' },
  { title: 'Long Event', start: '2021-05-07', end: '2021-05-10' },
  {
    groupId: '999',
    title: 'Repeating Event',
    start: '2021-05-09T16:00:00+00:00',
  },
  {
    groupId: '999',
    title: 'Repeating Event',
    start: '2021-05-16T16:00:00+00:00',
  },
  { title: 'Conference', start: '2021-05-06', end: '2021-05-08' },
  {
    title: 'Meeting',
    start: '2021-05-07T10:30:00+00:00',
    end: '2021-05-07T12:30:00+00:00',
  },
  { title: 'Lunch', start: '2021-05-07T12:00:00+00:00' },
  { title: 'Birthday Party', start: '2021-05-08T07:00:00+00:00' },
  { url: 'http://google.com/', title: 'Click for Google', start: '2021-05-28' },
]

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: '120px',
    maxWidth: '300px',
  },
}))
function rand() {
  return Math.round(Math.random() * 20) - 10
}
function getModalStyle() {
  const top = 50 + rand()
  const left = 50 + rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    padding: 20,
    // transform: `translate(-${top}%, -${left}%)`,
  }
}
const changeTimelineStatus = (status) => {
  let result
  switch (status) {
    case 'view':
      result = 'View Timeline Details'
      break
    case 'edit':
      result = 'Edit Timeline Details'
      break
    case 'create':
      result = 'Create Timeline '
      break

    default:
  }
  return result
}
const Timeline = (props) => {
  const classes = useStyles()
  const [openModal, setOpenModal] = useState(false)
  const [modalStyle] = useState(getModalStyle)
  const navigate = useNavigate()
  const theme = useTheme()
  function getStyles() {
    return {
      fontWeight: theme.typography.fontWeightRegular,
    }
  }
  // const handleOpen = () => {
  //   setOpenModal(true)
  // }
  const handleModalClose = () => {
    setOpenModal(false)
  }
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [timelineDialogStatus, setTimelineDialogStatus] = useState('view')
  const { currBoard, error } = useSelector((state) => state.boards)
  const { token, isValid, user, tokenRequest } = useSelector(
    (state) => state.user,
  )
  // const { currTimeline } = useSelector((state) => state.timeline)
  const [timeline, setTimeline] = useState([])
  useEffect(() => {
    console.log('timeline data:', timeline)
    console.log('classes:', classes)
    console.log('timelineDialogStatus data:', timelineDialogStatus)
    console.log('eventsData:', props.eventsData)
  }, [timeline, timelineDialogStatus])

  console.log('USER TOKEN: ', token)
  const handleClickOpen = () => {
    setOpen(true)
    setTimelineDialogStatus('create')
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Card {...props}>
      {/* <CardHeader title={props.title || ''} /> */}
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2,
          }}
        >
          <Button
            color="primary"
            variant="contained"
            // onClick={() => navigate(`/app/projects/new`, { replace: true })}
            onClick={handleClickOpen}
          >
            Create Timeline
          </Button>
          <Dialog open={openModal} onClose={handleModalClose}>
            <div style={modalStyle} className={classes.paper}>
              <h2 style={{ padding: 5 }}>Delete Timeline {timeline?.title}</h2>
              <p style={{ padding: 5 }}>
                Are you sure you want to delete this timeline
              </p>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  p: 2,
                }}
              >
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ marginRight: 15 }}
                  onClick={(e) => {
                    dispatch(deleteTimelineById(timeline.id, token)).then(
                      () => setOpenModal(false),
                      setOpen(false),
                    )
                  }}
                >
                  Yes
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => setOpenModal(false)}
                >
                  No
                </Button>
              </Box>
            </div>
          </Dialog>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            {/* <DialogTitle id="form-dialog-title">New Timeline</DialogTitle> */}
            <DialogContent>
              {/*
              <DialogContentText>
                Enter new timeline information
              </DialogContentText>
              <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              />
              */}
              {timelineDialogStatus === 'view' && (
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: '100%',
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        pb: 3,
                      }}
                    >
                      <Button
                        component="div"
                        // color="primary"
                        // variant="contained"
                        // onClick={() => navigate(`/app/projects/new`, { replace: true })}
                        onClick={() => {
                          console.log('edit')
                          setTimelineDialogStatus('edit')
                        }}
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 'medium',
                          justifyContent: 'flex-start',
                          letterSpacing: 0,
                          // py: 1.25,
                          textTransform: 'none',
                          width: '50%',
                          color: 'primary.main',
                        }}
                      >
                        <Edit size="20" />
                      </Button>
                      <Button
                        component="div"
                        onClick={() => {
                          setOpenModal(true)
                        }}
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 'medium',
                          justifyContent: 'flex-end',
                          letterSpacing: 0,
                          // py: 1.25,
                          textTransform: 'none',
                          width: '50%',
                          color: 'primary.main',
                        }}
                      >
                        <Trash2 size="20" />
                      </Button>
                    </Box>
                    <Typography
                      align="left"
                      color="textPrimary"
                      gutterBottom
                      variant="h4"
                    >
                      {timeline?.title}
                    </Typography>
                    {/* <Typography */}
                    {/*   align="left" */}
                    {/*   color="textPrimary" */}
                    {/*   gutterBottom */}
                    {/*   variant="h4" */}
                    {/* > */}
                    {/*   Timeline Start Date:{' '} */}
                    {/*   {timeline?.start */}
                    {/*     ? moment(timeline.start).format('DD MMM YYYY') */}
                    {/*     : ''} */}
                    {/* </Typography> */}
                    {/* <Typography */}
                    {/*   align="left" */}
                    {/*   color="textPrimary" */}
                    {/*   gutterBottom */}
                    {/*   variant="h4" */}
                    {/* > */}
                    {/*   Timeline End Date:{' '} */}
                    {/*   {timeline?.end */}
                    {/*     ? moment(timeline.end).format('DD MMM YYYY') */}
                    {/*     : ''} */}
                    {/* </Typography> */}
                    <Grid
                      item
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                      }}
                    >
                      <AccessTimeIcon color="action" />
                      <Typography
                        color="textSecondary"
                        display="inline"
                        sx={{ pl: 1 }}
                        variant="body2"
                      >
                        {timeline?.start && timeline?.end
                          ? `${moment(timeline.start).format(
                              'DD MMMM YYYY',
                            )} - ${moment(timeline.end).format('DD MMMM YYYY')}`
                          : ''}
                      </Typography>
                    </Grid>
                  </CardContent>
                </Card>
              )}
              {timelineDialogStatus === 'create' && (
                <Formik
                  initialValues={{
                    title: '',
                    // projectDescription: '',
                    start: moment(),
                    end: moment(),
                    boardId: currBoard._id,
                    // pic: [],
                  }}
                  validationSchema={Yup.object().shape({
                    title: Yup.string()
                      .max(255)
                      .required('Timeline name is required'),
                    // projectDescription: Yup.string() .max(255) .required('Project description is required'),
                    start: Yup.date().required(
                      'Timeline start date is required',
                    ),
                    end: Yup.string().required('Timeline end date is required'),
                    // pic: Yup.array().required('Troject PIC is required'),
                    // company: Yup.string().max(255).required('Project company is required'),
                  })}
                  onSubmit={(e) => {
                    // e.preventDefault()
                    console.log('create timeline : ', e)
                    const timelineReq = {
                      title: e.title,
                      // projectDescription: e.projectDescription,
                      start: e.start,
                      end: e.end,
                      boardId: currBoard._id,
                    }
                    console.log('timelineReq submit: ', timelineReq)
                    console.log('timeline token submit: ', token)
                    dispatch(createNewTimelines(timelineReq, token))
                      .then(() => {
                        console.log('done create timeline')
                        setOpen(false)
                        // navigate('/app/projects')
                      })
                      .catch((error) => window.alert(error))
                    // navigate(`/app/projects`, { replace: true })
                    // const { username, password } = e
                    // const loginReq = { username, password }
                    // dispatch(loginUser(loginReq))
                    // setUsername('')
                    // setPassword('')
                    // navigate('/', { replace: true })
                  }}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values,
                    setFieldValue,
                  }) => (
                    <form
                      onSubmit={handleSubmit}
                      autoComplete="off"
                      noValidate
                      {...props}
                    >
                      <Card>
                        <CardHeader
                          subheader="Enter information about your timeline"
                          title={changeTimelineStatus(timelineDialogStatus)}
                        />
                        <Divider />
                        <CardContent>
                          <Grid container spacing={3}>
                            <Grid item md={12} xs={12}>
                              <TextField
                                error={Boolean(touched.title && errors.title)}
                                fullWidth
                                helperText="Please fill project name"
                                label="Timeline title"
                                name="title"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                required
                                value={values.title}
                                variant="outlined"
                              />
                            </Grid>
                            <Grid item md={6} xs={6}>
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  views={['day', 'month', 'year']}
                                  label="Timeline start date"
                                  value={values.start}
                                  onChange={(e) => {
                                    setFieldValue('start', e)
                                    console.log('start: ', e)
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      required
                                      helperText="Please fill timeline start date"
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            </Grid>
                            <Grid item md={6} xs={6}>
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  views={['day', 'month', 'year']}
                                  label="Timeline end date"
                                  value={values.end}
                                  onChange={(e) => {
                                    e.setHours(23, 59, 59)
                                    setFieldValue(
                                      'end',
                                      // moment(e).add('23.59', 'hours'),
                                      e,
                                    )
                                    console.log('end: ', e)
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      required
                                      helperText="Please fill timeline end date"
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            </Grid>
                          </Grid>
                        </CardContent>
                        <Divider />
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            p: 2,
                          }}
                        >
                          <Button
                            color="primary"
                            variant="contained"
                            disabled={isSubmitting}
                            type="submit"
                          >
                            Create Timeline
                          </Button>
                        </Box>
                      </Card>
                    </form>
                  )}
                </Formik>
              )}
              {timelineDialogStatus === 'edit' && (
                <Formik
                  initialValues={{
                    title: timeline?.title,
                    // projectDescription: '',
                    start: timeline?.start
                      ? moment(timeline.start).format('DD MMM YYYY')
                      : '',
                    end: timeline?.end
                      ? moment(timeline.end).format('DD MMM YYYY')
                      : '',
                    boardId: currBoard._id,
                    id: timeline?.id,
                    // pic: [],
                  }}
                  validationSchema={Yup.object().shape({
                    title: Yup.string()
                      .max(255)
                      .required('Timeline name is required'),
                    // projectDescription: Yup.string() .max(255) .required('Project description is required'),
                    start: Yup.date().required(
                      'Timeline start date is required',
                    ),
                    end: Yup.string().required('Timeline end date is required'),
                    // pic: Yup.array().required('Troject PIC is required'),
                    // company: Yup.string().max(255).required('Project company is required'),
                  })}
                  onSubmit={(e) => {
                    // e.preventDefault()
                    console.log('edit timeline : ', e)
                    //set end time to 23:59:59 so the timeline shows correctly
                    const endTime = new Date(e.end).setHours(23, 59, 59)
                    const timelineReq = {
                      _id: e.id,
                      title: e.title,
                      start: e.start,
                      end: endTime,
                      boardId: currBoard._id,
                    }
                    console.log('timelineReq submit: ', timelineReq)
                    console.log('timeline token submit: ', token)
                    dispatch(
                      updateTimelineByBoardId(
                        // `${timelineReq.boardId}/${timelineReq._id}`,
                        `${timelineReq.boardId}/${timelineReq._id}`,
                        timelineReq,
                      ),
                    )
                      .then(() => {
                        console.log('done edit timeline')
                        setOpen(false)
                        // navigate('/app/projects')
                      })
                      .catch((error) => window.alert(error))
                    // navigate(`/app/projects`, { replace: true })
                    // const { username, password } = e
                    // const loginReq = { username, password }
                    // dispatch(loginUser(loginReq))
                    // setUsername('')
                    // setPassword('')
                    // navigate('/', { replace: true })
                  }}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values,
                    setFieldValue,
                  }) => (
                    <form
                      onSubmit={handleSubmit}
                      autoComplete="off"
                      noValidate
                      {...props}
                    >
                      <Card>
                        <CardHeader
                          subheader="Enter information about your timeline"
                          title={changeTimelineStatus(timelineDialogStatus)}
                        />
                        <Divider />
                        <CardContent>
                          <Grid container spacing={3}>
                            <Grid item md={12} xs={12}>
                              <TextField
                                error={Boolean(touched.title && errors.title)}
                                fullWidth
                                helperText="Please fill project name"
                                label="Timeline title"
                                name="title"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                required
                                value={values.title}
                                variant="outlined"
                              />
                            </Grid>
                            <Grid item md={6} xs={6}>
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  views={['day', 'month', 'year']}
                                  label="Timeline start date"
                                  value={values.start}
                                  onChange={(e) => {
                                    setFieldValue('start', e)
                                    console.log('start: ', e)
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      required
                                      helperText="Please fill timeline start date"
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            </Grid>
                            <Grid item md={6} xs={6}>
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  views={['day', 'month', 'year']}
                                  label="Timeline end date"
                                  value={values.end}
                                  onChange={(e) => {
                                    e.setHours(23, 59, 59)
                                    setFieldValue(
                                      'end',
                                      // moment(e).add('23.59', 'hours'),
                                      e,
                                    )
                                    console.log('end: ', e)
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      required
                                      helperText="Please fill timeline end date"
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            </Grid>
                          </Grid>
                        </CardContent>
                        <Divider />
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            p: 2,
                          }}
                        >
                          <Button
                            color="primary"
                            variant="contained"
                            // disabled={isSubmitting}
                            type="submit"
                          >
                            Edit Timeline
                          </Button>
                        </Box>
                      </Card>
                    </form>
                  )}
                </Formik>
              )}
            </DialogContent>
            {/*
      <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button onClick={handleClose}>Subscribe</Button>
      </DialogActions>
      */}
          </Dialog>
        </Box>
      </Box>
      <Divider />
      <PerfectScrollbar>
        {/*
    <Box sx={{ minWidth: 800 }}>{calendar}</Box>
    */}
        <Box sx={{ p: 2, minWidth: 800 }}>
          <FullCalendar
            // class
            weekNumberCalculation="ISO"
            initialView="dayGridMonth"
            // defaultView={viewCalendar()}
            editable
            selectable
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
            header={false}
            height={700}
            width={'100%'}
            // slotDuration="00:30:00"
            // snapDuration="00:30:00"
            // scrollTime="09:00:00"
            events={props?.eventsData || []}
            // ref={this.calendarRef}
            fixedWeekCount={false}
            allDaySlot={false}
            displayEventTime={false}
            eventClick={(e) => {
              console.log('eventClick timeline', e)
              setOpen(true)
              setTimelineDialogStatus('view')
              const timelineObj = {
                start: e.event._instance.range.start,
                end: e.event._instance.range.end,
                title: e.event._def.title,
                id: e.event._def.extendedProps._id,
              }
              setTimeline(timelineObj)
            }}
            // eventRender={info => {
            //   console.log('info.view.type => ', info.view.type);
            //   // Render tooltip
            //   if (info.view.type === 'timeGridDay' && info.event.extendedProps.description) {
            //     info.el.querySelector('.fc-title').innerHTML = `
            //     <div class="mt-2">${info.event.extendedProps.timeslot} ${info.event.title}</div><br>
            //     <div>${info.event.title}</div>
            //     <div>${info.event.extendedProps.description}</div>`;
            //     const tooltip = new Tooltip(info.el, {
            //       title: `<div class="tooltip-content">
            //         <div class="title">${moment(info.event.start).format('MMMM DD, YYYY')}</div>
            //         <a href=${info.event.url} class="d-flex bar" style="background-color: ${
            //         info.event.backgroundColor
            //       }"><span class="text-bold">${info.event.extendedProps.timeslot}</span>
            //       <div>
            //        <div>${info.event.extendedProps.additional}</div>
            //     <div>${info.event.extendedProps.description}</div>
            //       </div>
            //       </a>
            //         </div>`,
            //       html: true,
            //       placement: 'bottom',
            //       trigger: 'hover',
            //       container: 'body',
            //     });
            //   }

            //   // Render tooltip
            //   if (info.view.type !== 'timeGridDay') {
            //     const tooltip = new Tooltip(info.el, {
            //       title: `<div class="tooltip-content">
            //         <div class="title">${moment(info.event.start).format('MMMM DD, YYYY')}</div>
            //         <a href=${info.event.url} class="d-flex bar" style="background-color: ${
            //         info.event.backgroundColor
            //       }"><span class="text-bold">${info.event.extendedProps.timeslot}</span>
            //       <div>
            //        <div>${info.event.extendedProps.additional}</div>
            //       </div>
            //       </a>
            //         </div>`,
            //       html: true,
            //       placement: 'bottom',
            //       trigger: 'hover',
            //       container: 'body',
            //     });
            //   }
            // }}
            eventLimit
          />
        </Box>
      </PerfectScrollbar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2,
        }}
      >
        {/*
    <Button
    color="primary"
    endIcon={<ArrowRightIcon />}
    size="small"
    variant="text"
    >
    View all
    </Button>
    */}
      </Box>
    </Card>
  )
}

export default Timeline
