import React, { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  InputLabel,
  OutlinedInput,
  MenuItem,
  Select,
  FormControl,
  Snackbar,
  Alert as MuiAlert,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { addCompany } from '../../actions/actionCreators/companyActions'
import { fetchAllUsersInfo } from '../../actions/actionCreators/userActions'

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

const CreateCompany = (props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()
  const { error } = useSelector((state) => state.company)
  const { token, isValid, user, users, tokenRequest } = useSelector(
    (state) => state.user,
  )
  const [alertOpen, setAlertOpen] = React.useState(false)
  function getStyles() {
    return {
      fontWeight: theme.typography.fontWeightRegular,
    }
  }

  useEffect(() => {
    // if (isValid) {
    dispatch(fetchAllUsersInfo(token))
    // }
  }, [])
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setAlertOpen(false)
  }
  return (
    <Formik
      initialValues={{
        companyName: '',
        companyEmail: '',
        companyAddress: '',
        companyLogo: '',
        companyTeam: [],
      }}
      validationSchema={Yup.object().shape({
        companyName: Yup.string().max(255).required('Company name is required'),
        companyEmail: Yup.string()
          .email()
          .max(255)
          .required('Company email is required'),
        companyAddress: Yup.string()
          .max(255)
          .required('Company address is required'),
        // companyTeam: Yup.array().required('Company team PIC is required'),
      })}
      onSubmit={(e) => {
        // e.preventDefault()
        console.log('form submit: ', e)
        const postCompanyReq = {
          companyName: e.companyName,
          companyEmail: e.companyEmail,
          companyAddress: e.companyAddress,
          companyLogo: '',
          companyTeam: e.companyTeam,
        }
        console.log('postCompanyReq submit: ', postCompanyReq)
        dispatch(addCompany(postCompanyReq)).then(() => {
          if (!error) {
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
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Card>
            <CardHeader
              subheader="Enter information about your project"
              title="Create Company"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                  <TextField
                    error={Boolean(touched.companyName && errors.companyName)}
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
                    error={Boolean(touched.companyEmail && errors.companyEmail)}
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
                // color="primary"
                variant="contained"
                onClick={() => navigate(`/app/company/`, { replace: true })}
                style={{ marginRight: '1em', backgroundColor: '#c51162' }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                // disabled={isSubmitting}
                type="submit"
              >
                Create Company
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
  )
}

export default CreateCompany
