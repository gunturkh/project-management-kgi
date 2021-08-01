import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { v4 as uuid } from 'uuid'
import PerfectScrollbar from 'react-perfect-scrollbar'
import axios from 'axios'
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
import {
  fetchAllUsersInfo,
  deleteUserById,
} from '../../actions/actionCreators/userActions'
import {
  fetchAllBoards,
  fetchListsFromBoard,
  fetchsCardsFromBoard,
} from '../../actions/actionCreators/boardActions'
import Fade from '@material-ui/core/Fade'
import Loading from '../Loading'

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
const ProjectsDashboard = (props) => {
  const classes = useStyles()
  const { user, users, role, token, tokenRequest, userRequest } = useSelector(
    (state) => state.user,
  )
  const { boards, currBoard } = useSelector((state) => state.boards)
  const { cards } = useSelector((state) => state.cards)
  const { lists } = useSelector((state) => state.lists)
  const [openModal, setOpenModal] = useState(false)
  const [deleteItem, setDeleteItem] = useState({})
  const [modalStyle] = useState(getModalStyle)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [boardsValue, setBoardsValue] = React.useState([])
  const open = Boolean(anchorEl)
  console.log('token: ', token)
  useEffect(() => {
    if (token) {
      dispatch(fetchAllUsersInfo(token))
      dispatch(fetchAllBoards(token))
    }
  }, [])
  useEffect(() => {
    let result = []
    async function fetchData() {
      if (boards.length) {
        await boards.map(async (item) => {
          let combine = {}
          await axios
            .get(`/api/boards/${item._id}/cards`, {
              headers: { 'x-auth-token': token },
            })
            .then((res) => {
              combine.cards = res.data
            })
          await axios
            .get(`/api/boards/${item._id}/lists`, {
              headers: { 'x-auth-token': token },
            })
            .then((res) => {
              combine.lists = res.data
            })
          if (combine.lists.length > 0) {
            const checkedList = combine.lists.filter((d) => {
              return d.name === 'Checked'
            })
            console.log('OnProgress list', checkedList)
            if (checkedList.length > 0 && combine.cards.length > 0) {
              const countResult = combine.cards.filter(
                (d) => d.listId === checkedList[0]._id,
              )
              console.log('count result', countResult)
              const percentage = Math.round(
                (countResult.length / combine.cards.length) * 100,
              )
              console.log('count result percentage', percentage)
              combine.percentage = percentage
            }
          }
          result.push({
            ...item,
            cards: combine.cards,
            lists: combine.lists,
            taskPercentage: combine?.percentage ?? 0,
          })
          console.log('result:', result)
          if (boards.length === result.length) setBoardsValue(result)
        })
      }
    }
    fetchData()
  }, [])

  console.log('users:', users)
  console.log('boardsValue:', boardsValue)

  const handleClose = () => {
    setOpenModal(false)
  }

  console.log('Projects Board:', boards)
  console.log('Cards Board:', cards)
  console.log('lists Board:', lists)
  return (
    <>
      {tokenRequest || userRequest ? (
        <Loading />
      ) : (
        <Card {...props}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom variant="h6">
              Projects
            </Typography>
            <Divider />
            <PerfectScrollbar>
              <Box>
                {boardsValue.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell color="textPrimary">Project Name</TableCell>
                        <TableCell color="textPrimary">Status</TableCell>
                        <TableCell color="textPrimary">Progress</TableCell>
                        {!props.widget ? (
                          <TableCell color="textPrimary">Action</TableCell>
                        ) : null}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {boardsValue?.map((item) => (
                        <>
                          <TableRow
                            hover
                            key={item._id}
                            component={RouterLink}
                            to={`/app/projects/details/${item._id}`}
                          >
                            <TableCell color="textSecondary">
                              {item.projectName}
                            </TableCell>
                            <TableCell color="textSecondary">
                              <Chip
                                color="primary"
                                label={item.status}
                                size="small"
                              />
                            </TableCell>
                            <TableCell color="textSecondary">
                              <Chip
                                color="primary"
                                label={`${item.taskPercentage}%` ?? '0%'}
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
                                      // setDeleteItem({
                                      //   projectName: item.projectName,
                                      //   id: item._id,
                                      // })
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
                              <h2 style={{ padding: 5 }}>Delete Project</h2>
                              <p style={{ padding: 5 }}>
                                {` Are you sure you want to delete this project '${deleteItem.projectName}'?  `}
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
                                    dispatch(
                                      deleteUserById(
                                        { id: deleteItem.id },
                                        token,
                                      ),
                                    )
                                      .then(() => {
                                        setOpenModal(false)
                                        handleClose()
                                      })
                                      .then(() => {
                                        navigate('/app/account', {
                                          replace: 'true',
                                        })
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
                ) : (
                  <Typography textAlign="center">
                    Currently there is no project to show
                  </Typography>
                )}
              </Box>
            </PerfectScrollbar>
          </CardContent>
          {props.widget && boards.length > 0 ? (
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
          ) : null}
        </Card>
      )}
    </>
  )
}

export default ProjectsDashboard
