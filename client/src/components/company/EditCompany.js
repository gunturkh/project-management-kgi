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
  Snackbar,
  Alert as MuiAlert,
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
  fetchCompanyById,
  updateCompanyById,
} from '../../actions/actionCreators/companyActions'
import { fetchAllUsersInfo } from '../../actions/actionCreators/userActions'
// import { createNewActivity } from '../../actions/actionCreators/activityActions'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: '120px',
    maxWidth: '300px',
  },
}))

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

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

const EditCompany = (props) => {
  const classes = useStyles()
  const theme = useTheme()
  const dispatch = useDispatch()
  const { id } = useParams()
  const { companies, company, companyLoading, error } = useSelector(
    (state) => state.company,
  )
  const { isValid, user, users, token, tokenRequest } = useSelector(
    (state) => state.user,
  )
  let mappedTeam = []
  mappedTeam = company?.companyTeam?.map((team) => {
    console.log('team:', team)
    return {
      username: users.find((user) => user._id === team)?.username,
      _id: users.find((user) => user._id === team)?._id,
    }
  })
  console.log('mappedTeam:', mappedTeam)
  const [alertOpen, setAlertOpen] = React.useState(false)
  function getStyles() {
    return {
      fontWeight: theme.typography.fontWeightRegular,
    }
  }
  useEffect(() => {
    console.log('isValid: ', isValid)
    console.log('error: ', error)
    // if (isValid && !error) {
    if (id.length === 24) {
      dispatch(fetchAllUsersInfo(token))
      dispatch(fetchCompanyById(id, token))
      console.log('company: ', company)
      console.log('companies: ', companies)
      // dispatch(fetchListsFromBoard(id, token))
      // dispatch(fetchsCardsFromBoard(id, token))
      // dispatch(fetchActivitiesFromBoard(id, token))
    }
    // }
  }, [dispatch, id, isValid, token])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setAlertOpen(false)
  }

  const navigate = useNavigate()
  function getStyles() {
    return {
      fontWeight: theme.typography.fontWeightRegular,
    }
  }

  return (
    <>
      {companyLoading ? (
        <Loading />
      ) : (
        <Formik
          initialValues={{
            companyName: company?.companyName,
            companyEmail: company?.companyEmail,
            companyAddress: company?.companyAddress,
            companyLogo: company?.companyLogo,
            companyTeam: company?.companyTeam,
          }}
          validationSchema={Yup.object().shape({
            companyName: Yup.string()
              .max(255)
              .required('Company name is required'),
            companyEmail: Yup.string()
              .email()
              .max(255)
              .required('Company email is required'),
            companyAddress: Yup.string()
              .max(255)
              .required('Company address is required'),
          })}
          onSubmit={(e) => {
            console.log('form submit: ', e)
            const postCompanyReq = {
              companyName: e.companyName,
              companyEmail: e.companyEmail,
              companyAddress: e.companyAddress,
              companyLogo: '',
              companyTeam: e.companyTeam,
            }
            dispatch(updateCompanyById(id, postCompanyReq, token)).then(() => {
              if (!error) {
                console.log('done update company')
                navigate('/app/company')
              } else {
                setAlertOpen(true)
              }
            })
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
                  subheader="Company information can be edited"
                  title="Edit Company"
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <TextField
                        error={Boolean(
                          touched.companyName && errors.companyName,
                        )}
                        fullWidth
                        helperText="Please fill project name"
                        label="Company name"
                        name="companyName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.companyName}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <TextField
                        error={Boolean(
                          touched.companyEmail && errors.companyEmail,
                        )}
                        fullWidth
                        helperText="Please fill project email"
                        label="Company email"
                        name="companyEmail"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.companyEmail}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <TextField
                        error={Boolean(
                          touched.companyAddress && errors.companyAddress,
                        )}
                        fullWidth
                        helperText="Please fill company address"
                        label="Company address"
                        name="companyAddress"
                        rows={4}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        value={values.companyAddress}
                        variant="outlined"
                        multiline
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <div>
                        <FormControl style={{ width: '100%' }}>
                          <InputLabel id="demo-mutiple-name-label">
                            Team Member
                          </InputLabel>
                          <Select
                            // labelId="demo-mutiple-name-label"
                            // id="demo-mutiple-name"
                            multiple
                            value={values.companyTeam}
                            onChange={(e) => {
                              setFieldValue('companyTeam', e.target.value)
                            }}
                            input={<OutlinedInput label="Team Member" />}
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
                    Edit Company
                  </Button>
                </Box>
                <Snackbar
                  open={alertOpen}
                  autoHideDuration={6000}
                  onClose={handleClose}
                >
                  <Alert
                    onClose={handleClose}
                    severity="error"
                    sx={{ width: '100%' }}
                  >
                    {error}
                  </Alert>
                </Snackbar>
              </Card>
            </form>
          )}
        </Formik>
      )}
    </>
  )
}

export default EditCompany
