import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@material-ui/core'
import { green } from '@material-ui/core/colors'
// import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import AppsIcon from '@material-ui/icons/Apps'
import { Link as RouterLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAllBoards } from '../../actions/actionCreators/boardActions'
import { fetchAllCompaniesInfo } from '../../actions/actionCreators/companyActions'

const TotalProjects = (props) => {
  const { boards } = useSelector((state) => state.boards)
  const { token, isValid, user, tokenRequest } = useSelector(
    (state) => state.user,
  )
  const { companies } = useSelector((state) => state.company)
  const dispatch = useDispatch()
  useEffect(() => {
    if (isValid) {
      dispatch(fetchAllBoards(token))
      dispatch(fetchAllCompaniesInfo(token))
    }
  }, [token, isValid, dispatch])

  let userPartOfCompany = []
  let companyFromUser = ''
  userPartOfCompany = _.filter(companies, { companyTeam: [user.id] })
  companyFromUser = userPartOfCompany[0]?._id
  const mappedBoardsForUser = boards.filter(
    (board) => board.company === companyFromUser,
  )
  console.log('boards:', boards)
  return (
    <Card {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              TOTAL PROJECTS
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {user.role === 'ADMIN'
                ? boards.length
                : mappedBoardsForUser.length}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: '#3250a0',
                height: 56,
                width: 56,
              }}
            >
              <AppsIcon />
            </Avatar>
          </Grid>
        </Grid>
        {/*
    <Box
    sx={{
      alignItems: 'center',
        display: 'flex',
        pt: 2,
    }}
    >
    <ArrowUpwardIcon sx={{ color: green[900] }} />
    <Typography
    variant="body2"
    sx={{
      color: green[900],
        mr: 1,
    }}
    >
    16%
    </Typography>
    <Typography color="textSecondary" variant="caption">
    Since last month
    </Typography>
    </Box>
    */}
      </CardContent>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2,
        }}
      >
        <Button
          component={RouterLink}
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
          to="/app/projects"
        >
          View all
        </Button>
      </Box>
    </Card>
  )
}

export default TotalProjects
