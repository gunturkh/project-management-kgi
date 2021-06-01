import React from 'react'
import { Helmet } from 'react-helmet'
import { Box, Container, Grid } from '@material-ui/core'
import UsersList from '../components/dashboard/UsersList'
import CreateNewAccount from '../components/account/CreateNewAccount'

const Account = () => (
  <>
    <Helmet>
      <title>Account | Material Kit</title>
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
            <UsersList />
          </Grid>
          <Grid item xs={12}>
            <CreateNewAccount />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
)

export default Account
