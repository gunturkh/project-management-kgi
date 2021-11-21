import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import {
  Box, Container, Grid, Button,
  Snackbar,
  Alert as MuiAlert,
} from '@material-ui/core'
import { useNavigate, useLocation } from 'react-router-dom'
import CompanyList from '../components/company/CompanyList'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const Company = () => {
  const navigate = useNavigate()
  const { state } = useLocation();
  const [openAlert, setOpenAlert] = useState(false)

  useEffect(() => {
    state && setOpenAlert(true)
  }, [state])
  const handleCloseAlert = () => {
    setOpenAlert(false)
  }

  return (
    <>
      <Helmet>
        <title>Company</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Box
          sx={{
            m: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              color="apple"
              variant="contained"
              onClick={() => navigate(`/app/company/new`, { replace: true })}
            >
              Add Company
            </Button>
          </Box>
        </Box>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CompanyList />
            </Grid>
          </Grid>
        </Container>
        <Snackbar
          open={openAlert}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={state?.status === 'error' ? "error" : "success"}
            sx={{ width: '100%' }}
          >
            {`${state?.message}`}
          </Alert>
        </Snackbar>
      </Box>
    </>
  )
}

export default Company
