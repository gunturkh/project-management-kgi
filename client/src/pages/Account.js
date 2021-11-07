import React from 'react'
import { Helmet } from 'react-helmet'
import { Box, Container, Grid, Button } from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
import UsersList from '../components/dashboard/UsersList'

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
              onClick={() => navigate(`/app/account/new`, { replace: true })}
            >
              Add User
            </Button>
          </Box>
        </Box>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <UsersList />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default Account
