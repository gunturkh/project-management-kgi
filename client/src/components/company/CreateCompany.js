import React, { useState } from 'react'
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
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { addCompany } from '../../actions/actionCreators/companyActions'

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

const CreateCompany = (props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <Formik
      initialValues={{
        companyName: '',
        companyEmail: '',
        companyAddress: '',
        companyLogo: '',
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
      })}
      onSubmit={(e) => {
        // e.preventDefault()
        console.log('form submit: ', e)
        const postCompanyReq = {
          companyName: e.companyName,
          companyEmail: e.companyEmail,
          companyAddress: e.companyAddress,
          companyLogo: '',
        }
        console.log('postCompanyReq submit: ', postCompanyReq)
        dispatch(addCompany(postCompanyReq)).then(() => {
          navigate('/app/company')
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
        <form onSubmit={handleSubmit} autoComplete="off" noValidate {...props}>
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
                Create Company
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  )
}

export default CreateCompany
