import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Snackbar,
  Alert as MuiAlert,
} from '@material-ui/core'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { updateUser } from '../../actions/actionCreators/userActions'
import Thumb from '../Thumb'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const SettingsPassword = (props) => {
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  console.log('user', user)
  const [values, setValues] = useState({
    password: '',
    confirm: '',
  })

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    })
  }
  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  console.log('user:', user)
  return (
    <>
      <Formik
        initialValues={{
          avatar: user.avatar,
        }}
        onSubmit={(e) => {
          // e.preventDefault()
          console.log('avatar submit: ', e)
          // const postUserReq = {
          //   username: user.username,
          //   newPassword: e.newPassword,
          //   newPasswordCheck: e.newPassword,
          //   role: e.role,
          //   avatar: e.avatar,
          // }
          // console.log('postBoardReq submit: ', postUserReq)
          // dispatch(updateUser(postUserReq)).then(() => {
          //   console.log('done create project')
          //   setOpen(true)
          //   // navigate('/app/projects')
          // })
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
                subheader="Update Profile Picture"
                title="Profile Picture"
              />
              <Divider />
              <CardContent>
                <input
                  id="file"
                  name="avatar"
                  type="file"
                  onChange={(event) => {
                    setFieldValue('avatar', event.currentTarget.files[0])
                  }}
                />
                <Thumb file={values.avatar} />
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
                  Upload Profile Picture
                </Button>
                <Snackbar
                  open={open}
                  autoHideDuration={6000}
                  onClose={handleClose}
                >
                  <Alert
                    onClose={handleClose}
                    severity="success"
                    sx={{ width: '100%' }}
                  >
                    Success update profile picture!
                  </Alert>
                </Snackbar>
              </Box>
            </Card>
          </form>
        )}
      </Formik>
      <Formik
        initialValues={{
          username: user.username,
          newPassword: '',
          newPasswordCheck: '',
          role: user.role,
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(255).required('Username is required'),
          newPassword: Yup.string().max(255).required('Password is required'),
          newPasswordCheck: Yup.string()
            .max(255)
            .required('Password is required'),
        })}
        onSubmit={(e) => {
          // e.preventDefault()
          console.log('form submit: ', e)
          const postUserReq = {
            username: user.username,
            newPassword: e.newPassword,
            newPasswordCheck: e.newPassword,
            role: e.role,
          }
          console.log('postBoardReq submit: ', postUserReq)
          dispatch(updateUser(postUserReq)).then(() => {
            console.log('done create project')
            setOpen(true)
            // navigate('/app/projects')
          })
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
              <CardContent>
                {/*
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  p: 2,
                }}
              >
                <Button color="primary" variant="contained" component="label">
                  Upload Profile Picture
                  <input id="file" name="file" type="file" hidden />
                </Button>
              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
              >
                <Alert
                  onClose={handleClose}
                  severity="success"
                  sx={{ width: '100%' }}
                >
                  Success update password!
                </Alert>
              </Snackbar>
              </Box>
              */}
                {/*
              <TextField
                fullWidth
                error={Boolean(touched.newPassword && errors.newPassword)}
                label="New Password"
                margin="normal"
                name="newPassword"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                required
                value={values.newPassword}
                variant="outlined"
              />
              <TextField
                fullWidth
                error={Boolean(
                  touched.newPasswordCheck && errors.newPasswordCheck,
                )}
                label="Confirm New Password"
                margin="normal"
                name="newPasswordCheck"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                required
                value={values.newPasswordCheck}
                variant="outlined"
              />
              */}
              </CardContent>
              <CardHeader subheader="Update password" title="Password" />
              <Divider />
              <CardContent>
                <TextField
                  fullWidth
                  error={Boolean(touched.newPassword && errors.newPassword)}
                  label="New Password"
                  margin="normal"
                  name="newPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  required
                  value={values.newPassword}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  error={Boolean(
                    touched.newPasswordCheck && errors.newPasswordCheck,
                  )}
                  label="Confirm New Password"
                  margin="normal"
                  name="newPasswordCheck"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  required
                  value={values.newPasswordCheck}
                  variant="outlined"
                />
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
                  Update
                </Button>
                <Snackbar
                  open={open}
                  autoHideDuration={6000}
                  onClose={handleClose}
                >
                  <Alert
                    onClose={handleClose}
                    severity="success"
                    sx={{ width: '100%' }}
                  >
                    Success update password!
                  </Alert>
                </Snackbar>
              </Box>
            </Card>
          </form>
        )}
      </Formik>
    </>
  )
}

export default SettingsPassword
