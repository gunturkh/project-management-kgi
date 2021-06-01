import React, { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from '@material-ui/core'
import {
  registerUser,
  fetchAllUsersInfo,
} from '../../actions/actionCreators/userActions'
import { fetchAllBoards } from '../../actions/actionCreators/boardActions'

const role = [
  {
    value: 'ADMIN',
    label: 'Admin',
  },
  {
    value: 'USER',
    label: 'User',
  },
]

const CreateNewAccount = (props) => {
  const { user, users, token } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    const role = { role: 'ADMIN' }
    dispatch(fetchAllUsersInfo(role, token))
    // dispatch(fetchAllBoards(token))
  }, [user])
  console.log('users:', users)
  return (
    <>
      <Helmet>
        <title>Create Account</title>
      </Helmet>
      <Formik
        initialValues={{
          username: '',
          role: 'ADMIN',
          userRole: '',
          password: '',
          passwordCheck: '',
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(255).required('First name is required'),
          role: Yup.string().max(255).required('Last name is required'),
          password: Yup.string().max(255).required('password is required'),
          passwordCheck: Yup.string().max(255).required('password is required'),
        })}
        onSubmit={(e) => {
          console.log('register')
          const registerReq = {
            username: e.username,
            password: e.password,
            passwordCheck: e.passwordCheck,
            role: e.role,
            userRole: 'ADMIN',
          }
          dispatch(registerUser(registerReq))
            .then(() => {
              console.log('done create account')
              navigate('/app/account')
            })
            .catch((e) => window.alert('error:', e))
          // navigate('/app/dashboard', { replace: true })
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
                <Button color="primary" variant="contained" type="submit">
                  Create Account
                </Button>
              </Box>
            </Card>
          </form>
        )}
      </Formik>
    </>
  )
}

export default CreateNewAccount
