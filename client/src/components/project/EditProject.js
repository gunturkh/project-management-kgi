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
import Loading from '../Loading'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchBoardById,
  updateBoardById,
} from '../../actions/actionCreators/boardActions'
import { fetchAllCompaniesInfo } from '../../actions/actionCreators/companyActions'
import {
  fetchAllUsersInfo,
  updateUserNotification,
} from '../../actions/actionCreators/userActions'
import { makeid } from '../../utils/randomString'

const statusOptions = [
  {
    label: 'Kick Off',
    value: 'Kick Off',
  },
  {
    label: 'In Progress',
    value: 'In Progress',
  },
  {
    label: 'Installation & Commissioning',
    value: 'Installation & Commissioning',
  },
  {
    label: 'Validation',
    value: 'Validation',
  },
  {
    label: 'Closed',
    value: 'Closed',
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

const EditProject = (props) => {
  const classes = useStyles()
  const theme = useTheme()
  const dispatch = useDispatch()
  const { id, name } = useParams()
  const { board, loading, currBoard, error } = useSelector(
    (state) => state.boards,
  )
  const { companies } = useSelector((state) => state.company)
  const { isValid, user, users, token, tokenRequest } = useSelector(
    (state) => state.user,
  )
  useEffect(() => {
    if (isValid) {
      if (id.length === 24) {
        dispatch(fetchBoardById(id, token))
        dispatch(fetchAllUsersInfo(token))
        dispatch(fetchAllCompaniesInfo(token))
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
    <>
      {loading ? (
        <Loading />
      ) : (
        <Formik
          initialValues={{
            projectName: currBoard?.projectName,
            projectDescription: currBoard?.projectDescription,
            startDate: currBoard?.startDate ? moment(currBoard.startDate) : '',
            endDate: currBoard?.endDate ? moment(currBoard.endDate) : '',
            company: currBoard?.company || null,
            pic: currBoard?.pic || [],
            status: currBoard?.status || '',
          }}
          validationSchema={Yup.object().shape({
            projectName: Yup.string()
              .max(255)
              .required('Project name is required'),
            projectDescription: Yup.string()
              .max(255)
              .required('Project description is required'),
            startDate: Yup.date().required('Project start date is required'),
            endDate: Yup.string().required('Project end date is required'),
            pic: Yup.array().required('Project PIC is required'),
            status: Yup.string().required('Project status is required'),
            // company: Yup.string() .max(255) .required('Project company is required'),
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
              status: e.status,
            }
            console.log('postBoardReq submit: ', postBoardReq)
            console.log('update id: ', id)
            console.log('update token: ', token)
            dispatch(updateBoardById(id, postBoardReq, token)).then(
              async () => {
                console.log('done update project')
                if (currBoard?.pic.length > 0) {
                  await currBoard.pic.map(async (pic) => {
                    const picData = await users.filter(
                      (user) => user._id === pic,
                    )[0]
                    console.log('picData: ', { picData })
                    const notifMessage = {
                      id: makeid(5),
                      message: `Project ${e.projectName}, created by: ${
                        user.name
                      }, and you were assigned to it. Description: ${
                        e.projectDescription
                      }, status: ${e.status}, start date: ${moment(
                        e.startDate,
                      ).format('DD/MM/YYYY')}, end date:${moment(
                        e.endDate,
                      ).format('DD/MM/YYYY')} `,
                      link: `/app/projects/details/${currBoard._id}`,
                      read: false,
                    }
                    let notif = picData?.notification ?? []
                    const userParams = {
                      ...picData,
                      notification: picData?.notification?.length
                        ? [...notif, notifMessage]
                        : [notifMessage],
                    }
                    dispatch(updateUserNotification(userParams))
                  })
                }
                navigate('/app/projects')
              },
            )
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
                  subheader="Project information can be edited"
                  title="Edit Project"
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <TextField
                        error={Boolean(
                          touched.projectName && errors.projectName,
                        )}
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
                          touched.projectDescription &&
                            errors.projectDescription,
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
                    <Grid item md={4} xs={4}>
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
                    <Grid item md={4} xs={4}>
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
                    <Grid item md={4} xs={4}>
                      <div>
                        <FormControl style={{ width: '100%' }}>
                          <InputLabel id="demo-mutiple-name-label">
                            Project Status
                          </InputLabel>
                          <Select
                            // labelId="demo-mutiple-name-label"
                            // id="demo-mutiple-name"
                            value={values.status}
                            onChange={(e) => {
                              setFieldValue('status', e.target.value)
                            }}
                            input={<OutlinedInput label="Status" />}
                            MenuProps={MenuProps}
                            style={{ maxWidth: '100%' }}
                            required
                          >
                            {statusOptions.map((status, id) => (
                              <MenuItem
                                key={`${status.label}-${id}`}
                                value={status.value}
                                style={getStyles()}
                              >
                                {status.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
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
                            onChange={(e) =>
                              setFieldValue('pic', e.target.value)
                            }
                            input={<OutlinedInput label="PIC" />}
                            MenuProps={MenuProps}
                            style={{ maxWidth: '100%' }}
                            required
                          >
                            {users.map((user) => (
                              <MenuItem
                                key={`${user.username}-${user._id}`}
                                value={user._id}
                                style={getStyles()}
                              >
                                {user.username}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <div>
                        <FormControl style={{ width: '100%' }}>
                          <InputLabel id="demo-mutiple-name-label">
                            Company
                          </InputLabel>
                          <Select
                            // labelId="demo-mutiple-name-label"
                            // id="demo-mutiple-name"
                            // multiple
                            value={values.company}
                            onChange={(e) =>
                              setFieldValue('company', e.target.value)
                            }
                            input={<OutlinedInput label="Company" />}
                            MenuProps={MenuProps}
                            style={{ maxWidth: '100%' }}
                            required
                          >
                            <MenuItem value={null}>None</MenuItem>
                            {companies.map((company) => (
                              <MenuItem
                                key={`${company.companyName}-${company._id}`}
                                value={company._id}
                                style={getStyles()}
                              >
                                {company.companyName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
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
                    Edit Project
                  </Button>
                </Box>
              </Card>
            </form>
          )}
        </Formik>
      )}
    </>
  )
}

export default EditProject
