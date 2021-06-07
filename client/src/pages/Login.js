import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import * as Yup from 'yup'
import { Formik } from 'formik'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Snackbar,
  Alert as MuiAlert,
} from '@material-ui/core'
import LoadingButton from '@material-ui/lab/LoadingButton'
import { loginUser } from '../actions/actionCreators/userActions'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const Login = () => {
  const { token, user, successLogin, requestLogin, loginError } = useSelector(
    (state) => state.user,
  )
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [alertOpen, setAlertOpen] = React.useState(false)
  useEffect(() => {
    document.title = `Login | KGI Project Management`
  }, [])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setAlertOpen(false)
  }

  useEffect(() => {
    if (user.username !== undefined)
      navigate(`/app/projects`, { replace: true })
  }, [user])

  useEffect(() => {
    if (!requestLogin) {
      if (token && successLogin) {
        localStorage.setItem('auth-token', token)

        const localToken = localStorage.getItem('auth-token')
        if (localToken) {
          navigate(`/app/projects`, { replace: true })
        }
      } else if (!successLogin && !token) {
        navigate(`/login`, { replace: true })
      }
    }
    if (loginError) {
      setAlertOpen(true)
    }
  }, [token, user, successLogin, requestLogin, loginError])

  console.log('successLogin:', successLogin)
  console.log('loginError:', loginError)
  return (
    <>
      <Helmet>
        <title>Login | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              username: '',
              password: '',
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string().max(255).required('Username is required'),
              password: Yup.string().max(255).required('Password is required'),
            })}
            onSubmit={(e, { setSubmitting }) => {
              const { username, password } = e
              const loginReq = { username, password }
              dispatch(loginUser(loginReq)).then(() => {
                setSubmitting(false)
              })
              // .then(() => {
              //   navigate('/app/projects', { replace: true })
              // })
              // .catch((e) => {
              //   window.alert(e)
              //   // navigate('/login', { replace: true })
              // })
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
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography color=")textPrimary" variant="h2">
                    Sign in
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Sign in on the internal platform
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.username && errors.username)}
                  fullWidth
                  helperText={touched.username && errors.username}
                  label="Username"
                  margin="normal"
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.username}
                  variant="outlined"
                />
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
                  value={values.password}
                  variant="outlined"
                />
                <Box sx={{ py: 2 }}>
                  <LoadingButton
                    color="primary"
                    // disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Sign in now
                  </LoadingButton>
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
                    {loginError}
                  </Alert>
                </Snackbar>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  )
}

export default Login
