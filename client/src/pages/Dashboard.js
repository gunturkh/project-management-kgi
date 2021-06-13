import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Box, Container, Grid } from '@material-ui/core'
import LatestOrders from '../components/dashboard/LatestOrders'
import LatestProducts from '../components/dashboard/LatestProducts'
import Sales from '../components/dashboard/Sales'
import TasksProgress from '../components/dashboard/TasksProgress'
import TotalProjects from '../components/dashboard/TotalProjects'
import TotalProfit from '../components/dashboard/TotalProfit'
import TrafficByDevice from '../components/dashboard/TrafficByDevice'
import UsersList from '../components/dashboard/UsersList'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)
  useEffect(() => {
    const localToken = localStorage.getItem('auth-token')
    console.log('localToken:', localToken)
    console.log('localToken?:', localToken === '')
    if (localToken === '') {
      console.log('localToken Empty')
      navigate('/login', { replace: 'true' })
    }
  }, [])
  return (
    <>
      <Helmet>
        <title>Dashboard | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            {user.role === 'ADMIN' && (
              <Grid item lg={6} md={6} xl={6} xs={12}>
                <UsersList widget />
              </Grid>
            )}
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalProjects />
            </Grid>
            {/*
            <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TasksProgress />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalProfit sx={{ height: '100%' }} />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
            <Sales />
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
            <TrafficByDevice sx={{ height: '100%' }} />
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
            <LatestProducts sx={{ height: '100%' }} />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
            <LatestOrders />
            </Grid>
            */}
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default Dashboard
