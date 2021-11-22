import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Snackbar,
  InputLabel,
  Alert as MuiAlert,
} from '@material-ui/core'
import LoadingButton from '@material-ui/lab/LoadingButton'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
  fetchUserInfo,
  updateUser,
  uploadAvatarUser,
} from '../../actions/actionCreators/userActions'
import Thumb from '../Thumb'

const CLOUDINARY_BASE_URL = process.env.REACT_APP_CLOUDINARY_BASE_URL
const preset = process.env.REACT_APP_PRESET

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const SettingsPassword = (props) => {
  const { user, updateStatus, updateError, token } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  console.log('user', user)
  // const [values, setValues] = useState({
  //   password: '',
  //   confirm: '',
  // })
  const [edit, setEdit] = useState(false)
  const [submit, setSubmit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    dispatch(fetchUserInfo(token)).then((res) => {
      console.log("fetcUserInfo res", res)
    }).catch((e) => {
      console.error(e)
    });
  }, [])

  useEffect(() => {
    setImageUrl(user.avatar)
  }, [user])

  useEffect(() => {
    if (submit) {
      setOpen(true)
      setSubmit(false)
    }
  }, [updateStatus])

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

  return (
    <>
      <Formik
        initialValues={{
          avatar: user.avatar,
          name: user.name,
          role: user.role,
          position: user.position,
        }}
        onSubmit={async (e) => {
          setLoading(true)
          const formData = new FormData()
          formData.append('file', e.avatar)
          formData.append('upload_preset', preset)
          try {
            const res = await axios.post(CLOUDINARY_BASE_URL, formData)
            const resUrl = res.data.secure_url
            setImageUrl(resUrl)
            // setLoading(false);
            const postUserReq = {
              username: user.username,
              newPassword: e.newPassword,
              newPasswordCheck: e.newPasswordCheck,
              role: user.role,
              name: e.name,
              position: e.position,
              avatar: resUrl,
            }
            dispatch(updateUser(postUserReq)).then(() => {
              setLoading(false)
              setEdit(false)
            })
          } catch (err) {
          }
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
            <Card sx={{ marginBottom: 5 }}>
              <CardHeader
                subheader="Update Profile Picture"
                title="Profile Picture"
              />
              <Divider />
              <CardContent>
                {user.avatar ? (
                  <InputLabel>Avatar</InputLabel>
                ) : (
                  <InputLabel>There is no avatar uploaded</InputLabel>
                )}
                {edit && (
                  <input
                    id="file"
                    name="avatar"
                    type="file"
                    onChange={(event) => {
                      setFieldValue('avatar', event.currentTarget.files[0])
                    }}
                  />
                )}
                {edit ? (
                  <Thumb file={values.avatar} />
                ) : (
                  <img width="250px" src={imageUrl} alt="Avatar" />
                )}
                <TextField
                  fullWidth
                  error={Boolean(touched.name && errors.name)}
                  label="Name"
                  margin="normal"
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  required
                  value={values.name}
                  variant="outlined"
                  disabled={!edit}
                />
                <TextField
                  fullWidth
                  error={Boolean(touched.position && errors.position)}
                  label="Job Position"
                  margin="normal"
                  name="position"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  required
                  value={values.position}
                  variant="outlined"
                  disabled={!edit}
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
                {edit ? (
                  <>
                    {' '}
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => setEdit(false)}
                      sx={{ marginRight: 2 }}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      loading={loading}
                      color="primary"
                      variant="contained"
                      type="submit"
                    >
                      Submit
                    </LoadingButton>
                  </>
                ) : (
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => setEdit(true)}
                  >
                    Update Profile
                  </Button>
                )}
                <Snackbar
                  open={open}
                  autoHideDuration={6000}
                  onClose={handleClose}
                >
                  <Alert
                    onClose={handleClose}
                    severity={updateError ? "error" : "success"}
                    sx={{ width: '100%' }}
                  >
                    {updateError ? `${updateError}` : `Success update profile picture!`}
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
          const postUserReq = {
            username: user.username,
            newPassword: e.newPassword,
            newPasswordCheck: e.newPasswordCheck,
            role: e.role,
          }
          dispatch(updateUser(postUserReq))
          setSubmit(true)
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          touched,
          values,
        }) => (
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            noValidate
            {...props}
          >
            <Card>
              <CardContent>
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
                <Button color="secondary" variant="contained" type="submit">
                  Update
                </Button>
                <Snackbar
                  open={open}
                  autoHideDuration={6000}
                  onClose={handleClose}
                >
                  <Alert
                    onClose={handleClose}
                    severity={updateError ? "error" : "success"}
                    sx={{ width: '100%' }}
                  >
                    {updateError ? `${updateError}` : `Success update password!`}
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
