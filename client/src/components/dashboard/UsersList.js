import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { v4 as uuid } from 'uuid'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Modal,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import { Trash2 } from 'react-feather'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAllUsersInfo } from '../../actions/actionCreators/userActions'
import { deleteUserById } from '../../actions/actionCreators/userActions'
import Fade from '@material-ui/core/Fade'
import Loading from '../Loading'
import {
  fetchAllCompaniesInfo,
  updateCompanyById,
} from '../../actions/actionCreators/companyActions'

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
  const { user, users, role, token, tokenRequest, userRequest } = useSelector(
    (state) => state.user,
  )
  const { companies } = useSelector((state) => state.company)
  const [openModal, setOpenModal] = useState(false)
  const [deleteItem, setDeleteItem] = useState({})
  const [modalStyle] = useState(getModalStyle)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  console.log('token: ', token)
  useEffect(() => {
    if (token) {
      dispatch(fetchAllUsersInfo(token))
    }
  }, [])
  console.log('users:', users)
  console.log('companies:', companies)

  const handleClose = () => {
    setOpenModal(false)
  }

  const deleteCompanyTeam = (id) => {
    let updatedCompanyTeam = companies.map((c) => {
      return { ...c, companyTeam: c.companyTeam.filter((team) => team !== id) }
    })
    let updatedCompanyId = companies.find((c) =>
      c.companyTeam.find((team) => team === id),
    )?._id

    const [updatedCompany] = updatedCompanyTeam.filter(
      (c) => c._id === updatedCompanyId,
    )
    if (updatedCompany) {
      const {
        companyName,
        companyEmail,
        companyAddress,
        companyLogo,
        companyTeam,
      } = updatedCompany
      const params = {
        companyName,
        companyEmail,
        companyAddress,
        companyLogo,
        companyTeam,
      }
      console.log('update company params:', params)

      dispatch(updateCompanyById(updatedCompanyId, params, token)).then(() => {
        console.log('done update user')
        // navigate('/app/account')
      })
    }

    console.log('deleted id:', deleteItem.id)
    console.log('companies:', companies)
    console.log('updated company team:', updatedCompanyTeam)
    console.log('updated Company ID:', updatedCompanyId)
    console.log('Updated Company:', updatedCompany)
  }

  return (
    <>
      {tokenRequest || userRequest ? (
        <Loading />
      ) : (
        <Card {...props}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom variant="h6">
              USER LIST
            </Typography>
            <Divider />
            <PerfectScrollbar>
              <Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell color="textPrimary">USERNAME</TableCell>
                      <TableCell color="textPrimary">ROLE</TableCell>
                      <TableCell color="textPrimary">COMPANY</TableCell>
                      {!props.widget ? (
                        <TableCell color="textPrimary">ACTION</TableCell>
                      ) : null}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users?.map((item) => (
                      <>
                        <TableRow hover key={item._id}>
                          <TableCell color="textSecondary">
                            {item.username}
                          </TableCell>
                          <TableCell color="textSecondary">
                            <Chip
                              color="primary"
                              label={item.role}
                              size="small"
                            />
                          </TableCell>
                          <TableCell color="textSecondary">
                            <Chip
                              color="primary"
                              label={item.company || 'KGI'}
                              size="small"
                            />
                          </TableCell>
                          {!props.widget ? (
                            <TableCell>
                              {' '}
                              {item._id !== user.id && (
                                <Button
                                  color="secondary"
                                  variant="contained"
                                  disabled={
                                    item._id === user.id ||
                                    item.role === 'ADMIN' ||
                                    user.role !== 'ADMIN'
                                  }
                                  onClick={() => {
                                    setOpenModal(true)
                                    setDeleteItem({
                                      username: item.username,
                                      id: item._id,
                                    })
                                  }}
                                  style={{
                                    marginRight: 5,
                                  }}
                                >
                                  <Trash2 size="20" />
                                </Button>
                              )}
                            </TableCell>
                          ) : null}
                        </TableRow>
                        <Modal open={openModal} onClose={handleClose}>
                          <div style={modalStyle} className={classes.paper}>
                            <h2 style={{ padding: 5 }}>Delete User</h2>
                            <p style={{ padding: 5 }}>
                              {` Are you sure you want to delete this user '${deleteItem.username}'?  `}
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
                                onClick={() => {
                                  deleteCompanyTeam(deleteItem.id)
                                  dispatch(
                                    deleteUserById(
                                      { id: deleteItem.id },
                                      token,
                                    ),
                                  ).then(() => {
                                    setOpenModal(false)
                                    handleClose()
                                    navigate('/app/account', { state: { status: 'success', message: 'User deleted successfully!' } })
                                  }).catch(e => {
                                    navigate('/app/account', { state: { status: 'error', message: 'Failed to Delete User!' } })
                                  })
                                }}
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
          </CardContent>
          {props.widget ? (
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
                to="/app/account"
              >
                View all
              </Button>
            </Box>
          ) : null}
        </Card>
      )}
    </>
  )
}

export default Timeline
