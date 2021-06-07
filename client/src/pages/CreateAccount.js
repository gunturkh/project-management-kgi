import React from 'react'
import { Helmet } from 'react-helmet'
import { Box, Container, Grid, Button } from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
import UsersList from '../components/dashboard/UsersList'
import CreateNewAccount from '../components/account/CreateNewAccount'

const Account = () => {
  const navigate = useNavigate()
  return (
    <>
      <Helmet>
        <title>Account</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CreateNewAccount />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default Account
