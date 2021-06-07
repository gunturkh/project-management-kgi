import React from 'react'
import { Helmet } from 'react-helmet'
import { Box, Container, Grid, Button } from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
import CompanyList from '../components/company/CompanyList'

const Company = () => {
  const navigate = useNavigate()
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
              color="primary"
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
      </Box>
    </>
  )
}

export default Company
