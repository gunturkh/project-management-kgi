import React from 'react'
import moment from 'moment'
import { v4 as uuid } from 'uuid'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import FullCalendar from '@fullcalendar/react'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'

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
const Timeline = (props) => (
  <Card {...props}>
    <CardHeader title={props.title || ''} />
    <Divider />
    <PerfectScrollbar>
      {/*
    <Box sx={{ minWidth: 800 }}>{calendar}</Box>
    */}
      <Box sx={{ minWidth: 800, p: 10 }}>
        <FullCalendar
          class
          weekNumberCalculation="ISO"
          initialView="dayGridMonth"
          // defaultView={viewCalendar()}
          editable
          selectable
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          header={false}
          height={700}
          // slotDuration="00:30:00"
          // snapDuration="00:30:00"
          // scrollTime="09:00:00"
          events={props?.eventsData || []}
          // ref={this.calendarRef}
          fixedWeekCount={false}
          allDaySlot={false}
          displayEventTime={false}
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

export default Timeline
