import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { Helmet } from 'react-helmet'
import { Box, Container, Grid, TextField, Pagination } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import ProjectListToolbar from '../components/project/ProjectListToolbar'
import ProjectCard from '../components/project/ProjectCard'
import Loading from '../components/Loading'
import { fetchAllBoards } from '../actions/actionCreators/boardActions'
import { fetchAllCompaniesInfo } from '../actions/actionCreators/companyActions'
// import { createNewActivity } from '../actions/actionCreators/activityActions'

const ProjectList = () => {
  const { boards, loading } = useSelector((state) => state.boards)
  const { token, isValid, user } = useSelector((state) => state.user)
  const { companies } = useSelector((state) => state.company)
  const [search, setSearch] = useState('')
  const [foundBoards, setFoundBoards] = useState(boards)
  const [page, setPage] = React.useState(1)
  const handleChange = (event, value) => {
    setPage(value)
  }
  const dispatch = useDispatch()
  useEffect(() => {
    // if (isValid) {
    dispatch(fetchAllBoards(token))
    dispatch(fetchAllCompaniesInfo(token))
    // }
  }, [token, isValid, dispatch])

  let userPartOfCompany = []
  let companyFromUser = ''
  userPartOfCompany = _.filter(companies, { companyTeam: [user.id] })
  companyFromUser = userPartOfCompany[0]?._id
  const mappedBoardsForUser = boards.filter(
    (board) => board.company === companyFromUser,
  )

  console.group('projectList')
  console.log('user:', user)
  console.log('companies:', companies)
  console.log('boards:', boards)
  console.log('userPartOfCompany', userPartOfCompany)
  console.log('companyFromUser', companyFromUser)
  console.log('mappedBoardsForUser', mappedBoardsForUser)
  console.log('foundBoards:', foundBoards)
  console.groupEnd('projectList')

  const filter = (e) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = boards.filter((board) => {
        return board.projectName.toLowerCase().startsWith(keyword.toLowerCase())
        // Use the toLowerCase() method to make it case-insensitive
      })
      setFoundBoards(results)
    } else {
      setFoundBoards(boards)
      // If the text field is empty, show all users
    }

    setSearch(keyword)
  }

  // const filteredBoardsByCompany = []
  // filteredBoardsByCompany = boards.filter(board=>{
  //   return board.
  // })
  const paginateGood = (array, page_size, page_number) => {
    return array.slice(
      page_number * page_size,
      page_number * page_size + page_size,
    )
  }
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
            {user.role === 'ADMIN' && <ProjectListToolbar />}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 5,
              }}
            >
              <TextField
                id="search-projects"
                value={search}
                onChange={filter}
                label="Search"
                variant="outlined"
              />
            </Box>
            <Box sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                {user.role === 'ADMIN' ? (
                  foundBoards && foundBoards.length > 0 ? (
                    paginateGood(foundBoards, 9, page - 1).map((board) => (
                      <Grid item key={board.id} lg={4} md={6} xs={12}>
                        <ProjectCard board={board} />
                      </Grid>
                    ))
                  ) : (
                    <Grid item lg={4} md={6} xs={12}>
                      <p>No boards found</p>
                    </Grid>
                  )
                ) : (
                  mappedBoardsForUser.map((board) => (
                    <Grid item key={board.id} lg={4} md={6} xs={12}>
                      <ProjectCard board={board} />
                    </Grid>
                  ))
                )}
              </Grid>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Pagination
                  count={
                    user.role === 'ADMIN'
                      ? Math.ceil(foundBoards.length / 9)
                      : Math.ceil(mappedBoardsForUser.length / 9)
                  }
                  color="primary"
                  page={page}
                  onChange={handleChange}
                  sx={{ marginTop: 10 }}
                />
              </Box>
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
