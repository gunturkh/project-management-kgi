import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Box, Container, Grid } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import ProjectListToolbar from '../components/project/ProjectListToolbar'
import ProjectCard from '../components/project/ProjectCard'
import Loading from '../components/Loading'
import { fetchAllBoards } from '../actions/actionCreators/boardActions'
// import { createNewActivity } from '../actions/actionCreators/activityActions'

const ProjectList = () => {
  const { boards, loading } = useSelector((state) => state.boards)
  const { token, isValid, user, tokenRequest } = useSelector(
    (state) => state.user,
  )
  const dispatch = useDispatch()
  useEffect(() => {
    if (isValid) {
      dispatch(fetchAllBoards(token))
    }
  }, [token, isValid, dispatch])
  console.log('boards:', boards)
  return (
    <>
      <Helmet>
        <title>Projects | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        {loading ? (
          <Loading />
        ) : (
          <Container maxWidth={false}>
            <ProjectListToolbar />
            <Box sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                {boards.map((board) => (
                  <Grid item key={board.id} lg={4} md={6} xs={12}>
                    <ProjectCard board={board} />
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                pt: 3,
              }}
            >
              {/* <Pagination color="primary" count={3} size="small" /> */}
            </Box>
          </Container>
        )}
      </Box>
    </>
  )
}

export default ProjectList
