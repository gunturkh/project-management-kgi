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
  Modal,
} from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAllUsersInfo } from '../../actions/actionCreators/userActions'
import { deleteUserById } from '../../actions/actionCreators/userActions'

function rand() {
  return Math.round(Math.random() * 20) - 10
}
function getModalStyle() {
  const top = 50 + rand()
  const left = 50 + rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))
const Timeline = (props) => {
  const classes = useStyles()
  const { user, users, token } = useSelector((state) => state.user)
  const [openModal, setOpenModal] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [modalStyle] = useState(getModalStyle)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  console.log('token: ', token)
  useEffect(() => {
    const role = { role: 'ADMIN' }
    dispatch(fetchAllUsersInfo(role, token))
    // dispatch(fetchAllBoards(token))
  }, [user])
  console.log('users:', users)

  const handleClose = () => {
    setOpenModal(false)
  }

  return (
    <Card {...props}>
      <CardHeader title="Latest Orders" />
      <Divider />
      <PerfectScrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((item) => (
                <>
                  <TableRow hover key={item._id}>
                    <TableCell>{item._id}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>
                      <Chip color="primary" label={item.role} size="small" />
                    </TableCell>
                    <TableCell>
                      {' '}
                      <Button
                        color="primary"
                        variant="contained"
                        disabled={item._id === user.id}
                        onClick={() => {
                          setOpenModal(true)
                          setDeleteId(item._id)
                        }}
                      >
                        {`
                          Delete User ${item._id}
                        `}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <Modal open={openModal} onClose={handleClose}>
                    <div style={modalStyle} className={classes.paper}>
                      <h2 style={{ padding: 5 }}>Delete User</h2>
                      <p style={{ padding: 5 }}>
                        {` Are you sure you want to delete this user ${deleteId}?  `}
                      </p>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          p: 2,
                        }}
                      >
                        <Button
                          color="secondary"
                          variant="contained"
                          style={{ marginRight: 15 }}
                          onClick={() =>
                            dispatch(deleteUserById(deleteId, token))
                              .then(() => {
                                setOpenModal(false)
                              })
                              .then(() => {
                                navigate('/app/account', { replace: 'true' })
                              })
                          }
                        >
                          Yes
                        </Button>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => setOpenModal(false)}
                        >
                          No
                        </Button>
                      </Box>
                    </div>
                  </Modal>
                </>
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
