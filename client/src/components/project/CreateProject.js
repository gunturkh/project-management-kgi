import React, { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import moment from 'moment'

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Select,
  MenuItem,
  OutlinedInput,
  InputLabel,
  FormControl,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'
import DatePicker from '@material-ui/lab/DatePicker'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAllBoards,
  createNewBoard,
} from '../../actions/actionCreators/boardActions'
import { createNewActivity } from '../../actions/actionCreators/activityActions'

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

const CreateProject = (props) => {
  const classes = useStyles()
  const theme = useTheme()
  const { token, isValid, user, tokenRequest } = useSelector(
    (state) => state.user,
  )
  const dispatch = useDispatch()
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
    <Formik
      initialValues={{
        projectName: '',
        projectDescription: '',
        startDate: moment(),
        endDate: moment().add(1, 'months'),
        company: '',
        pic: [],
      }}
      validationSchema={Yup.object().shape({
        projectName: Yup.string().max(255).required('Project name is required'),
        projectDescription: Yup.string()
          .max(255)
          .required('Project description is required'),
        startDate: Yup.date().required('Project start date is required'),
        endDate: Yup.string().required('Project end date is required'),
        pic: Yup.array().required('Project PIC is required'),
        company: Yup.string().max(255).required('Project company is required'),
      })}
      onSubmit={(e) => {
        // e.preventDefault()
        console.log('form submit: ', e)
        const postBoardReq = {
          userId: user.id,
          projectName: e.projectName,
          projectDescription: e.projectDescription,
          startDate: e.startDate,
          endDate: e.endDate,
          company: e.company,
          pic: e.pic,
        }
        console.log('postBoardReq submit: ', postBoardReq)
        dispatch(createNewBoard(postBoardReq))
        navigate(`/app/projects`, { replace: true })
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
        <form onSubmit={handleSubmit} autoComplete="off" noValidate {...props}>
          <Card>
            <CardHeader
              subheader="The information can be edited"
              title="Profile"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                  <TextField
                    error={Boolean(touched.projectName && errors.projectName)}
                    fullWidth
                    helperText="Please fill project name"
                    label="Project name"
                    name="projectName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.projectName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <TextField
                    error={Boolean(
                      touched.projectDescription && errors.projectDescription,
                    )}
                    fullWidth
                    helperText="Please fill project description"
                    label="Project Description"
                    name="projectDescription"
                    rows={4}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.projectDescription}
                    variant="outlined"
                    multiline
                  />
                </Grid>
                <Grid item md={6} xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      views={['day', 'month', 'year']}
                      label="Project start date"
                      value={values.startDate}
                      onChange={(e) => {
                        setFieldValue('startDate', e)
                        console.log('values: ', e)
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          required
                          helperText="Please fill project start date"
                          variant="outlined"
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item md={6} xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      views={['day', 'month', 'year']}
                      label="Project end date"
                      value={values.endDate}
                      onChange={(e) => {
                        setFieldValue('endDate', e)
                        console.log('values: ', e)
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          required
                          helperText="Please fill project end date"
                          variant="outlined"
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item md={6} xs={12}>
                  <div>
                    <FormControl style={{ width: '100%' }}>
                      <InputLabel id="demo-mutiple-name-label">
                        Project PIC
                      </InputLabel>
                      <Select
                        // labelId="demo-mutiple-name-label"
                        // id="demo-mutiple-name"
                        multiple
                        value={values.pic}
                        onChange={(e) => setFieldValue('pic', e.target.value)}
                        input={<OutlinedInput label="PIC" />}
                        MenuProps={MenuProps}
                        style={{ maxWidth: '100%' }}
                        required
                      >
                        {names.map((name) => (
                          <MenuItem key={name} value={name} style={getStyles()}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Company"
                    name="company"
                    onChange={handleChange}
                    required
                    value={values.company}
                    variant="outlined"
                  />
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
                Create Project
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  )
}

export default CreateProject
