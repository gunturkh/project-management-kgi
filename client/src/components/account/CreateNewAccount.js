import React, { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Formik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Snackbar,
  Alert as MuiAlert,
} from '@material-ui/core'
// import { DataGrid } from '@material-ui/data-grid'
import {
  registerUser,
  fetchAllUsersInfo,
} from '../../actions/actionCreators/userActions'
import {
  fetchAllCompaniesInfo,
  updateCompanyById,
} from '../../actions/actionCreators/companyActions'

const role = [
  {
    value: 'ADMIN',
    label: 'Admin',
  },
  {
    value: 'MEMBER',
    label: 'Member',
  },
  {
    value: 'CLIENT',
    label: 'Client',
  },
]

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const CreateNewAccount = (props) => {
  const [alertOpen, setAlertOpen] = useState(false)
  const { user, users, token } = useSelector((state) => state.user)
  const { company, companies, companyLoading } = useSelector(
    (state) => state.company,
  )
  const [userState, setUserState] = useState({})
  const [companyState, setCompanyState] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    const role = { role: 'ADMIN' }
    dispatch(fetchAllUsersInfo(role, token))
    dispatch(fetchAllCompaniesInfo(token))
  }, [user])
  useEffect(() => {
    console.log('users changed: ', users)
    console.log('userState: ', userState)
    const [newUser] = users.filter((user) => {
      return (
        user.username === userState.username &&
        user.position === userState.position
      )
    })
    console.log('NewUser = ', newUser)
    const [getCompanyDataSelected] = companies.filter(
      (company) => company._id === companyState,
    )
    const companyReq = {
      company: companyState,
    }
    if (companyState !== '' && getCompanyDataSelected) {
      const params = getCompanyDataSelected?.companyTeam?.push(companyState)
      delete getCompanyDataSelected._id
      delete getCompanyDataSelected.__v
      console.log('getCompanyDataSelected', getCompanyDataSelected)
      dispatch(updateCompanyById(companyState, getCompanyDataSelected, token))
      // .then(() => navigate('/app/account'))
    }
    console.log('companyReq', companyReq)
  }, [users, userState])

  console.log('users:', users)
  console.log('company:', company)
  console.log('companies:', companies)

  const mappedCompanies =
    companies?.length > 0
      ? companies.map((item) => {
          return {
            value: item._id,
            label: item.companyName,
          }
        })
      : null
  mappedCompanies.unshift({ value: '', label: '' })

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setAlertOpen(false)
  }

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          role: 'CLIENT',
          userRole: '',
          password: '',
          passwordCheck: '',
          position: '',
          company: '',
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(255).required('Username is required'),
          role: Yup.string().max(255).required('Role is required'),
          password: Yup.string().max(255).required('Password is required'),
          passwordCheck: Yup.string()
            .max(255)
            .required('Retype password is required'),
          position: Yup.string().max(255).required('Position is required'),
          company: Yup.string().max(255).required('Company is required'),
        })}
        onSubmit={(e) => {
          console.log('register', e)
          const registerReq = {
            username: e.username,
            password: e.password,
            passwordCheck: e.passwordCheck,
            role: e.role,
            position: e.position,
            userRole: 'ADMIN',
            company: companies.find((company) => company._id === e.company)
              ?.companyName,
          }
          setUserState(registerReq)
          setCompanyState(e.company)
          // dispatch(registerUser(registerReq))

          if (e.company) {
            axios
              .post('/api/user/register', registerReq, {
                headers: { 'x-auth-token': token },
              })
              .then((res) => {
                console.log('res register user:', res.data)
                const newUser = res.data._id
                const [companyFound] = companies.filter(
                  (c) => c._id === e.company,
                )
                console.log('companyFound:', companyFound)
                if (companyFound) {
                  const {
                    companyName,
                    companyEmail,
                    companyAddress,
                    companyLogo,
                    companyTeam,
                  } = companyFound
                  const params = {
                    companyName,
                    companyEmail,
                    companyAddress,
                    companyLogo,
                    companyTeam: [...companyTeam, newUser],
                  }
                  console.log('company params:', params)

                  dispatch(updateCompanyById(e.company, params, token)).then(
                    () => {
                      console.log('done update user')
                      navigate('/app/account')
                      // if (!error) {
                      // } else {
                      //   setAlertOpen(true)
                      // }
                    },
                  )
                }
              })
          }
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
        }) => (
          <form onSubmit={handleSubmit} autoComplete="off" {...props}>
            <Card>
              <CardHeader
                subheader="Please fill the account details "
                title="Create Accout"
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.username && errors.username)}
                      fullWidth
                      helperText={touched.username && errors.username}
                      label="User Name"
                      name="username"
                      onChange={handleChange}
                      required
                      value={values.username}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.password && errors.password)}
                      fullWidth
                      helperText={touched.password && errors.password}
                      label="Password"
                      margin="normal"
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="password"
                      required
                      value={values.password}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(
                        touched.passwordCheck && errors.passwordCheck,
                      )}
                      fullWidth
                      helperText={touched.passwordCheck && errors.passwordCheck}
                      label="Retype Password"
                      margin="normal"
                      name="passwordCheck"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="password"
                      required
                      value={values.passwordCheck}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.position && errors.position)}
                      fullWidth
                      helperText={touched.position && errors.position}
                      label="Job Position"
                      margin="normal"
                      name="position"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      required
                      value={values.position}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Company"
                      name="company"
                      onChange={handleChange}
                      required
                      select
                      SelectProps={{ native: true }}
                      value={values.company}
                      variant="outlined"
                    >
                      {mappedCompanies.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Select Role"
                      name="role"
                      onChange={handleChange}
                      required
                      select
                      SelectProps={{ native: true }}
                      value={values.role}
                      variant="outlined"
                    >
                      {role.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
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
                  as={RouterLink}
                  color="primary"
                  variant="contained"
                  to={'/app/account'}
                  sx={{ marginRight: 2 }}
                >
                  Cancel
                </Button>
                <Button color="primary" variant="contained" type="submit">
                  Create Account
                </Button>
              </Box>
              {/*
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
              */}
            </Card>
          </form>
        )}
      </Formik>
    </>
  )
}

export default CreateNewAccount
