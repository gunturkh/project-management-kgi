import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { v4 as uuid } from 'uuid'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllUsersInfo } from '../../actions/actionCreators/userActions'

const Timeline = (props) => {
  const { user, users, token } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  // const navigate = useNavigate()
  useEffect(() => {
    const role = { role: 'ADMIN' }
    dispatch(fetchAllUsersInfo(role, token))
    // dispatch(fetchAllBoards(token))
  }, [user])
  console.log('users:', users)
  return (
    <Card {...props}>
      <CardHeader title="Latest Orders" />
      <Divider />
      <PerfectScrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((user) => (
                <TableRow hover key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Chip color="primary" label={user.role} size="small" />
                  </TableCell>
                  <TableCell>
                    {' '}
                    <Button color="primary" variant="contained" type="submit">
                      Delete User
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2,
        }}
      ></Box>
    </Card>
  )
}

export default Timeline
