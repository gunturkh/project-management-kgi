// import React, { useState, useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { Link as RouterLink, useNavigate, useHistory } from 'react-router-dom'
// import HowToRegIcon from '@material-ui/icons/HowToReg'
// // import { Helmet } from 'react-helmet'
// import * as Yup from 'yup'
// import { Formik } from 'formik'
// import {
//   Box,
//   Button,
//   Container,
//   Grid,
//   Link,
//   TextField,
//   Typography,
// } from '@material-ui/core'
// // import Auth from './Auth'
// import { loginUser } from '../actions/actionCreators/userActions'

// export default function Login() {
//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')
//   const { token, user, successLogin, requestLogin, loginError } = useSelector(
//     (state) => state.user,
//   )
//   const [error, setError] = useState()
//   const [success, setSuccess] = useState(false)
//   const dispatch = useDispatch()
//   const history = useHistory()

//   useEffect(() => {
//     document.title = `Login | KGI Project Management`
//   }, [])

//   useEffect(() => {
//     if (user.username !== undefined) history.push(`/${user.username}/boards`)
//   }, [history, user])

//   useEffect(() => {
//     if (!requestLogin) {
//       if (token && successLogin) {
//         setError('Logged In successfully ✔')
//         setSuccess(true)
//         localStorage.setItem('auth-token', token)
//         // history.push(`/${user.username}/boards`)
//       } else if (!successLogin && !token) {
//         setError(loginError)
//         setSuccess(false)
//       }
//     }
//   }, [token, user, successLogin, requestLogin, loginError, history])

//   const submitHandler = (e) => {
//     // e.preventDefault()
//     console.log('submitHandler: ', e)
//     const { username, password } = e
//     const loginReq = { username, password }
//     console.log('loginReq: ', loginReq)
//     dispatch(loginUser(loginReq))
//     setUsername('')
//     setPassword('')
//   }
//   // const navigate = useNavigate()
//   return (
//     <>
//       {/*
//       <Auth
//       btnText="Register"
//       path="/register"
//       authName="Login"
//       icon={<HowToRegIcon fontSize="small" />}
//       error={error}
//       clearError={() => setError(undefined)}
//       submitHandler={submitHandler}
//       username={username}
//       nameChangeHandler={(e) => {
//         e.preventDefault()
//         setUsername(e.target.value)
//       }}
//       password={password}
//       passwordChangeHandler={(e) => {
//         e.preventDefault()
//         setPassword(e.target.value)
//       }}
//       success={success}
//       />
//       */}
//       <Box
//         sx={{
//           backgroundColor: 'background.default',
//           display: 'flex',
//           flexDirection: 'column',
//           height: '100%',
//           justifyContent: 'center',
//         }}
//       >
//         <Container maxWidth="sm">
//           <Formik
//             initialValues={{
//               username: 'admin',
//               password: 'admin',
//             }}
//             validationSchema={Yup.object().shape({
//               username: Yup.string()
//                 // .text('Must be a valid username')
//                 .max(255)
//                 .required('Email is required'),
//               password: Yup.string().max(255).required('Password is required'),
//             })}
//             onSubmit={(e) => {
//               console.log('login submit: ', e)
//               submitHandler(e)
//               // navigate('/app/dashboard', { replace: true })
//             }}
//           >
//             {({
//               errors,
//               handleBlur,
//               handleChange,
//               handleSubmit,
//               isSubmitting,
//               touched,
//               values,
//             }) => (
//               <form onSubmit={handleSubmit}>
//                 <Box sx={{ mb: 3 }}>
//                   <Typography color="textPrimary" variant="h2">
//                     Sign in
//                   </Typography>
//                   <Typography
//                     color="textSecondary"
//                     gutterBottom
//                     variant="body2"
//                   >
//                     Sign in on the internal platform
//                   </Typography>
//                 </Box>
//                 <Grid container spacing={3}>
//                   <Grid item xs={12} md={6}>
//                     <Button
//                       color="primary"
//                       fullWidth
//                       // startIcon={<FacebookIcon />}
//                       onClick={handleSubmit}
//                       size="large"
//                       variant="contained"
//                     >
//                       Login with Facebook
//                     </Button>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <Button
//                       fullWidth
//                       // startIcon={<GoogleIcon />}
//                       onClick={handleSubmit}
//                       size="large"
//                       variant="contained"
//                     >
//                       Login with Google
//                     </Button>
//                   </Grid>
//                 </Grid>
//                 <Box
//                   sx={{
//                     pb: 1,
//                     pt: 3,
//                   }}
//                 >
//                   <Typography
//                     align="center"
//                     color="textSecondary"
//                     variant="body1"
//                   >
//                     or login with email address
//                   </Typography>
//                 </Box>
//                 <TextField
//                   error={Boolean(touched.username && errors.username)}
//                   fullWidth
//                   helperText={touched.username && errors.username}
//                   label="User Name"
//                   margin="normal"
//                   name="username"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   type="username"
//                   value={values.username}
//                   variant="outlined"
//                 />
//                 <TextField
//                   error={Boolean(touched.password && errors.password)}
//                   fullWidth
//                   helperText={touched.password && errors.password}
//                   label="Password"
//                   margin="normal"
//                   name="password"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   type="password"
//                   value={values.password}
//                   variant="outlined"
//                 />
//                 <Box sx={{ py: 2 }}>
//                   <Button
//                     color="primary"
//                     disabled={isSubmitting}
//                     fullWidth
//                     size="large"
//                     type="submit"
//                     variant="contained"
//                   >
//                     Sign in now
//                   </Button>
//                 </Box>
//                 <Typography color="textSecondary" variant="body1">
//                   Don&apos;t have an account?{' '}
//                   <Link component={RouterLink} to="/register" variant="h6">
//                     Sign up
//                   </Link>
//                 </Typography>
//               </form>
//             )}
//           </Formik>
//         </Container>
//       </Box>
//     </>
//   )
// }

import React, { useState, useEffect } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import * as Yup from 'yup'
import { Formik } from 'formik'
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from '@material-ui/core'
import { loginUser } from '../actions/actionCreators/userActions'
// import FacebookIcon from './icons/Facebook'
// import GoogleIcon from './icons/Google'

const Login = () => {
  // const [username, setUsername] = useState('')
  // const [password, setPassword] = useState('')
  // console.log(username, password)
  const { token, user, successLogin, requestLogin, loginError } = useSelector(
    (state) => state.user,
  )
  // const [error, setError] = useState()
  // const [success, setSuccess] = useState(false)
  // console.log(error, success)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = `Login | KGI Project Management`
  }, [])

  useEffect(() => {
    if (user.username !== undefined)
      navigate(`/app/projects`, { replace: true })
    // navigate(`/register`, { replace: true })
  }, [user])

  useEffect(() => {
    console.log('token: ', token)
    console.log('user: ', user)
    console.log('successLogin: ', successLogin)
    console.log('requestLogin: ', requestLogin)
    console.log('loginError: ', loginError)
    if (!requestLogin) {
      if (token && successLogin) {
        // setError('Logged In successfully ✔')
        // setSuccess(true)
        localStorage.setItem('auth-token', token)
        navigate(`/app/projects`, { replace: true })
        // history.push(`/${user.username}/boards`)
      } else if (!successLogin && !token) {
        // setError(loginError)
        // setSuccess(false)
      }
    }
    requestLogin && console.log('requestLogin = true', true)
  }, [token, user, successLogin, requestLogin, loginError])

  // const submitHandler = (e) => {
  //   e.preventDefault()
  //   console.log('submitHandler: ', e)
  //   // const { username, password } = e
  //   // const loginReq = { username, password }
  //   // console.log('submitHandler: ', e)
  //   // dispatch(loginUser(loginReq))
  //   // setUsername('')
  //   // setPassword('')
  // }
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
              username: 'admin',
              password: 'admin',
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string()
                // .email('Must be a valid email')
                .max(255)
                .required('Username is required'),
              password: Yup.string().max(255).required('Password is required'),
            })}
            onSubmit={(e) => {
              console.log('form submit: ', e)
              const { username, password } = e
              const loginReq = { username, password }
              dispatch(loginUser(loginReq))
              // setUsername('')
              // setPassword('')
              navigate('/', { replace: true })
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
                  <Typography color="textPrimary" variant="h2">
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
                {/*
                <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                <Button
                color="primary"
                fullWidth
                // startIcon={<FacebookIcon />}
                onClick={handleSubmit}
                size="large"
                variant="contained"
                >
                Login with Facebook
                </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                <Button
                fullWidth
                // startIcon={<GoogleIcon />}
                onClick={handleSubmit}
                size="large"
                variant="contained"
                >
                Login with Google
                </Button>
                </Grid>
                </Grid>
                <Box
                  sx={{
                    pb: 1,
                    pt: 3,
                  }}
                >
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="body1"
                  >
                    or login with email address
                  </Typography>
                </Box>
                */}
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
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
                {/*
                <Typography color="textSecondary" variant="body1">
                Don&apos;t have an account?{' '}
                <Link component={RouterLink} to="/register" variant="h6">
                Sign up
                </Link>
                </Typography>
                */}
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  )
}

export default Login
