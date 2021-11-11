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
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import { Trash2, MoreVertical } from 'react-feather'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  fetchAllUsersInfo,
  deleteUserById,
} from '../../actions/actionCreators/userActions'
import { updateUserNotification } from '../../actions/actionCreators/userActions'
import {
  fetchAllBoards,
  updateBoardById,
  deleteBoardById,
} from '../../actions/actionCreators/boardActions'
import { fetchAllCards } from '../../actions/actionCreators/cardActions'
import Fade from '@material-ui/core/Fade'
import Loading from '../Loading'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { makeid } from '../../utils/randomString'

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress color="apple" style={{ backgroundColor: 'black' }} variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  )
}
// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`,
  }))

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone

  return result
}
const grid = 8

const getItemStyle = (isDragging, draggableStyle, color) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : color,
  borderRadius: '15px',
  border: '3px black solid',

  // styles we need to apply on draggables
  ...draggableStyle,
})
const getListStyle = (isDraggingOver, color) => ({
  background: isDraggingOver ? 'lightblue' : color,
  padding: grid,
  width: '100%',
  minWidth: '300px',
})

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
const SimpleMenu = ({ id, projectName, setOpenModal, setDeleteItem }) => {
  const { user } = useSelector((state) => state.user)
  const [anchorEl, setAnchorEl] = React.useState(null)
  console.log('id edit: ', id)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertical
          color="black"
          size={20} />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem component={RouterLink} to={`/app/projects/edit/${id}`}>
          Edit
        </MenuItem>
        {user.role === 'ADMIN' && (
          <MenuItem
            onClick={() => {
              setOpenModal(true)
              setDeleteItem({
                projectName: projectName,
                id: id,
              })
            }}
          >
            Delete
          </MenuItem>
        )}
      </Menu>
    </div>
  )
}
function ProjectDragDropArea({ setOpenModal, setDeleteItem }) {
  const dispatch = useDispatch()
  const [allCards, setAllCards] = React.useState([])
  const [allLists, setAllLists] = React.useState([])
  // const [state, setState] = useState([
  //   getItems(10),
  //   getItems(5, 10),
  //   getItems(10, 10),
  // ])
  useEffect(() => {

    const getAllBoardsCards = async () => {
      await axios.get(`/api/cards`, { headers: { 'x-auth-token': token } })
        .then((res) => {
          // console.log("all cards: ", res.data)
          setAllCards(res.data);
          let cardsByBoardId = res.data.reduce((acc, curVal) => {
            // acc[curVal.boardId] = acc[curVal.boardId].push(curVal) || acc[curVal.boardId]
            (acc[curVal.boardId] = acc[curVal.boardId] || []).push(curVal)
            // console.log("curVal.boardId", curVal.boardId)
            // console.log("reduce curVal", acc[curVal.boardId])
            return acc
          }, [])
          // console.log("cardsByBoardId: ", cardsByBoardId)
          // console.log("typeof cardsByBoardId: ", typeof cardsByBoardId)
          // setAllCards(cardsByBoardId);
        })

    }
    const getAllBoardsLists = async () => {
      await axios.get(`/api/lists`, { headers: { 'x-auth-token': token } })
        .then((res) => {
          // console.log("all lists: ", res.data)
          setAllLists(res.data);
          let listsByBoardId = res.data.reduce((acc, curVal) => {
            // acc[curVal.boardId] = acc[curVal.boardId].push(curVal) || acc[curVal.boardId]
            (acc[curVal._id] = acc[curVal._id] || []).push(curVal)
            // console.log("curVal.boardId", curVal.boardId)
            // console.log("reduce curVal", acc[curVal.boardId])
            return acc
          }, [])
          // console.log("listsByBoardId: ", listsByBoardId)
          // console.log("typeof listsByBoardId: ", typeof listsByBoardId)
          // setAllLists(listsByBoardId);
        })

    }
    getAllBoardsCards();
    getAllBoardsLists();
  }, [])

  const getBoardColor = (status) => {
    let color
    switch (status) {
      case 'Kick Off':
        color = '#BFBFBF'
        break
      case 'In Progress':
        color = '#FFC635'
        break
      case 'Installation & Commissioning':
        color = '#4675CA'
        break
      case 'Validation':
        color = '#00AF50'
        break
      case 'Closed':
        color = '#757070'
        break

      default:
        color = '#FFFFFF'
        break
    }
    return color
  }
  const getBoards = (boards, status) => {
    try {
      if (boards.length > 0) {
        return {
          title: status,
          projects: boards.filter((board) => board.status === status),
          color: getBoardColor(status),
        }
        // return boards.filter((board) => board.status === status)
      } else return []
    } catch (error) {
      return []
    }
  }
  const { boards } = useSelector((state) => state.boards)
  const { user, users, token } = useSelector((state) => state.user)
  const { cards } = useSelector((state) => state.cards)
  // const { lists } = useSelector((state) => state.lists)
  const [state, setState] = useState([
    getBoards(boards, 'Kick Off'),
    getBoards(boards, 'In Progress'),
    getBoards(boards, 'Installation & Commissioning'),
    getBoards(boards, 'Validation'),
    getBoards(boards, 'Closed'),
  ])

  useEffect(() => {
    setState([
      getBoards(boards, 'Kick Off'),
      getBoards(boards, 'In Progress'),
      getBoards(boards, 'Installation & Commissioning'),
      getBoards(boards, 'Validation'),
      getBoards(boards, 'Closed'),
    ])
  }, [boards])

  console.log('Kick Off Board:', getBoards(boards, 'Kick Off'))
  console.log('Cards from store:', cards)
  function onDragEnd(result) {
    console.log('onDragEnd result:', result)
    const { source, destination, draggableId } = result

    // dropped outside the list
    if (!destination) {
      return
    }
    const sInd = +source.droppableId
    const dInd = +destination.droppableId

    if (sInd === dInd) {
      const items = reorder(
        state[sInd].projects,
        source.index,
        destination.index,
      )
      const newState = [...state]
      newState[sInd].projects = items
      setState(newState)
    } else {
      const result = move(
        state[sInd].projects,
        state[dInd].projects,
        source,
        destination,
      )
      const newState = [...state]
      newState[sInd].projects = result[sInd]
      newState[dInd].projects = result[dInd]
      const [draggedData] = result[dInd].filter(
        (data) => data._id === draggableId,
      )
      const {
        pic,
        _id,
        projectName,
        projectDescription,
        status,
        startDate,
        endDate,
        company,
      } = draggedData
      const { title } = newState[dInd]
      console.log({ resultsInd: result[sInd], resultdInd: result[dInd] })
      console.log('newState: ', newState[dInd])
      console.log('draggedData: ', draggedData)
      console.log({
        pic,
        _id,
        projectName,
        projectDescription,
        status,
        startDate,
        endDate,
        company,
      })
      const postBoardReq = {
        userId: user.id,
        projectName: projectName,
        projectDescription: projectDescription,
        startDate: startDate,
        endDate: endDate,
        company: company,
        pic: pic,
        status: title,
      }
      console.log('title', postBoardReq)
      dispatch(updateBoardById(draggableId, postBoardReq, token)).then(
        async () => {
          console.log('done update project')
          if (pic.length > 0) {
            await pic.map(async (pic) => {
              const picData = await users.filter((user) => user._id === pic)[0]
              console.log('picData: ', { picData })
              const notifMessage = {
                id: makeid(5),
                message: `Project ${projectName}, created by: ${user.name
                  }, and you were assigned to it. Description: ${projectDescription}, status: ${status}, start date: ${moment(
                    startDate,
                  ).format('DD/MM/YYYY')}, end date:${moment(endDate).format(
                    'DD/MM/YYYY',
                  )} `,
                link: `/app/projects/details/${_id}`,
                read: false,
              }
              let notif = picData?.notification ?? []
              const userParams = {
                ...picData,
                notification: picData?.notification?.length
                  ? [...notif, notifMessage]
                  : [notifMessage],
              }
              dispatch(updateUserNotification(userParams))
            })
          }
        },
      )
      // setState(newState.filter((group) => group.projects.length))
    }
  }

  console.log('projects state: ', state)
  return (
    <div>
      {/* <button
        type="button"
        onClick={() => {
          setState([...state, []])
        }}
      >
        Add new group
      </button>
      <button
        type="button"
        onClick={() => {
          setState([...state, getItems(1)])
        }}
      >
        Add new item
      </button> */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          {state?.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <>
                  <div
                    style={{
                      backgroundColor: getBoardColor(el.title),
                      width: '100%',
                      margin: '10px 0px',
                    }}
                  >
                    <div
                      style={{
                        margin: '10px',
                        textAlign: 'center',
                        fontWeight: 700,
                      }}
                    >
                      Status Project: {el?.title}
                    </div>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '50px 1fr 1fr 1fr 1fr 1fr 50px',
                        width: '100%',
                        padding: '0px 20px',
                        fontWeight: 700,
                      }}
                    >
                      <div>No</div>
                      <div>Project Name</div>
                      <div>Job Description</div>
                      <div>Progress</div>
                      <div>Start Date</div>
                      <div>End Date</div>
                    </Box>
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(
                        snapshot.isDraggingOver,
                        getBoardColor(el.title),
                      )}
                      {...provided.droppableProps}
                    >
                      {el.projects.map((item, index) => (
                        <Draggable
                          key={item._id}
                          draggableId={item._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style,
                                getBoardColor(item.status),
                              )}
                            >
                              <Box
                                sx={{
                                  display: 'grid',
                                  gridTemplateColumns:
                                    '50px 1fr 1fr 1fr 1fr 1fr 50px',
                                  width: '100%',
                                }}
                              >
                                <div>{index}</div>
                                <div>{item.projectName}</div>
                                <div>{item.projectDescription}</div>
                                <div>
                                  {/* {cards
                                    .filter((c) => c.boardId === item._id)
                                    .map((i) => {
                                      const res = lists.filter(
                                        (l) => i.listId === l._id,
                                      )[0]
                                      return <p>{res.name}</p>
                                    })} */}
                                  <LinearProgressWithLabel
                                    variant="determinate"
                                    value={
                                      (
                                        allCards.filter((c) => c.boardId === item._id)
                                          ?.map((i) => {
                                            const res = allLists.filter(
                                              (l) => i.listId === l._id,
                                            )[0]
                                            return res?.name
                                          })
                                          .reduce((acc, curVal) => {
                                            curVal === 'Checked' ||
                                              curVal === 'Done'
                                              ? (acc += 1)
                                              : (acc = acc)
                                            return acc
                                          }, 0) /
                                        allCards.filter((c) => c.boardId === item._id).length) *
                                      100
                                    }
                                  />
                                </div>
                                <div>
                                  {moment(item.startDate).format(
                                    'DD MMMM YYYY',
                                  )}
                                </div>
                                <div>
                                  {moment(item.endDate).format('DD MMMM YYYY')}
                                </div>
                                <div>
                                  <SimpleMenu
                                    id={item._id}
                                    projectName={item.projectName}
                                    setOpenModal={setOpenModal}
                                    setDeleteItem={setDeleteItem}
                                  />
                                </div>
                              </Box>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>{' '}
                  </div>
                </>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  )
}

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
      // dispatch(fetchAllCards(token))
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
        <Box sx={{ margin: '0px 5rem' }}>
          <ProjectDragDropArea
            setOpenModal={setOpenModal}
            setDeleteItem={setDeleteItem}
          />
          {/* <Card {...props}>
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
                          <TableCell color="textPrimary">
                            Project Name
                          </TableCell>
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
                                  {` Are you sure you want to delete this project '${deleteItem.projectName} with id : ${deleteItem.id}'?  `}
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
                                        deleteBoardById(deleteItem.id, token),
                                      ).then(() => {
                                        setOpenModal(false)
                                        handleClose()
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
          </Card> */}
        </Box>
      )}
    </>
  )
}

export default ProjectsDashboard
