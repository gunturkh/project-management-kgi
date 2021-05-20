import React, { useState, useEffect } from 'react'
import {
  Link as RouterLink,
  useNavigate,
  useParams,
  Redirect,
} from 'react-router-dom'
import moment from 'moment'

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'
import DatePicker from '@material-ui/lab/DatePicker'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchBoardById,
  createNewBoard,
} from '../../actions/actionCreators/boardActions'
// import { createNewActivity } from '../../actions/actionCreators/activityActions'
import Timeline from '../dashboard/Timeline'

const states = [
  {
    value: 'alabama',
    label: 'Alabama',
  },
  {
    value: 'new-york',
    label: 'New York',
  },
  {
    value: 'san-francisco',
    label: 'San Francisco',
  },
]

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: '120px',
    maxWidth: '300px',
  },
}))

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const ProjectDetails = (props) => {
  const classes = useStyles()
  const theme = useTheme()
  const dispatch = useDispatch()
  const { id, name } = useParams()
  const { board, loading, currBoard, error } = useSelector(
    (state) => state.boards,
  )
  const { listLoading, lists } = useSelector((state) => state.lists)
  const { cardLoading, cards } = useSelector((state) => state.cards)
  const { activities } = useSelector((state) => state.activities)
  const { isValid, user, token, tokenRequest } = useSelector(
    (state) => state.user,
  )
  useEffect(() => {
    console.log('token: ', token)
    console.log('tokenRequest: ', tokenRequest)
    console.log('id: ', id)
    console.log('isValid: ', isValid)
    console.log('!error: ', !error)
    console.log('error: ', error)
    if (isValid && !error) {
      if (id.length === 24) {
        dispatch(fetchBoardById(id, token))
        console.log('board: ', board)
        console.log('currBoard: ', currBoard)
        // dispatch(fetchListsFromBoard(id, token))
        // dispatch(fetchsCardsFromBoard(id, token))
        // dispatch(fetchActivitiesFromBoard(id, token))
      }
    }
  }, [dispatch, id, isValid, token, error])
  console.log('classes: ', classes)
  console.log('user: ', user)
  const [values, setValues] = useState({
    firstName: 'Katarina',
    lastName: 'Smith',
    email: 'demo@devias.io',
    phone: '',
    state: 'Alabama',
    country: 'USA',
  })

  const navigate = useNavigate()
  function getStyles() {
    return {
      fontWeight: theme.typography.fontWeightRegular,
    }
  }

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    })
  }
  const names = [
    'Alex Nico',
    'Jonathan',
    'Programmer',
    'Mechanical',
    'Electrical',
    'Sales',
  ]

  return (
    <Card>
      <CardHeader
        subheader="Details about the project"
        title="Project Details"
      />
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <Typography
              align="left"
              color="textPrimary"
              gutterBottom
              variant="h5"
            >
              Company: {currBoard?.company || ''}
            </Typography>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography
              align="left"
              color="textPrimary"
              gutterBottom
              variant="h5"
            >
              Name: {currBoard?.projectName}
            </Typography>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography
              align="left"
              color="textPrimary"
              gutterBottom
              variant="h6"
            >
              Description: {currBoard?.projectDescription}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography
              align="left"
              color="textPrimary"
              gutterBottom
              variant="h6"
            >
              Timeline:{' '}
              {currBoard?.startDate && currBoard?.endDate
                ? `${moment(currBoard.startDate).format(
                    'DD MMMM YYYY',
                  )} - ${moment(currBoard.endDate).format('DD MMMM YYYY')}`
                : ''}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography
              align="left"
              color="textPrimary"
              gutterBottom
              variant="h6"
            >
              PIC: {currBoard?.pic.join(', ') || ''}
            </Typography>
          </Grid>
        </Grid>
        <Grid item lg={12} md={12} xl={12} xs={12}>
          <Timeline />
        </Grid>
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2,
        }}
      ></Box>
    </Card>
  )
}

export default ProjectDetails
