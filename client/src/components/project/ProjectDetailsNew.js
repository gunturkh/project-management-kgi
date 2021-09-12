import React, { useEffect, useState, useRef } from 'react'
// import { Redirect, useParams } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import _ from 'lodash'
import {
  makeStyles,
  withStyles,
  InputBase,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  AppBar,
  Tabs,
  Tab,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import { User, Edit, Trash2 } from 'react-feather'
import moment from 'moment'
import {
  fetchBoardById,
  fetchListsFromBoard,
  fetchsCardsFromBoard,
  fetchActivitiesFromBoard,
  updateBoardById,
} from '../../actions/actionCreators/boardActions'
import { updateUserNotification } from '../../actions/actionCreators/userActions'
import List from '../List'
import midString from '../../ordering/ordering'
import { updateCardById } from '../../actions/actionCreators/cardActions'
import {
  createNewList,
  updateListById,
} from '../../actions/actionCreators/listActions'
import InputCard from '../InputCard'
import Loading from '../Loading'
import {
  createNewActivity,
  deleteActivityById,
} from '../../actions/actionCreators/activityActions'
import { fetchAllCompaniesInfo } from '../../actions/actionCreators/companyActions'
import { fetchAllUsersInfo } from '../../actions/actionCreators/userActions'
import AddItem from '../AddItem'
import { fetchTimelineByBoardId } from '../../actions/actionCreators/timelineActions'
import Timeline from '../Timeline'
import { makeid } from '../../utils/randomString'
import { DataGrid } from '@mui/x-data-grid'

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    overflowY: 'auto',
  },
  listContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: theme.spacing(0.5),
    padding: 20,
    boxShadow: '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;',
    // border: 'red solid 1px',
  },
  wrapper: {
    marginTop: theme.spacing(10.3),
    boxShadow: '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;',
    border: 'blue solid 1px',
  },
  editable: {
    marginLeft: theme.spacing(1),
    height: '38px',
    padding: theme.spacing(0, 1, 0, 1),
    boxShadow: 'inset 0 0 0 2px #0079bf',
    borderRadius: 6,
    backgroundColor: '#EBECF0',
    width: '290px',
    position: 'fixed',
    marginTop: theme.spacing(4.5),
    boxShadow: '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;',
  },
}))

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//     backgroundColor: theme.palette.background.paper,
//   },
// }))

export default function ProjectDetailsNew() {
  const classes = useStyles()
  const [tabValue, setTabValue] = React.useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }
  // const navigate = useNavigate()
  /* eslint-disable-next-line */
  // var { id, name } = useParams()
  const { id } = useParams()
  const { timelines } = useSelector((state) => state.timeline)
  const [manipulatedTimelines, setManipulatedTimelines] = useState([])
  const { loading, currBoard, error } = useSelector((state) => state.boards)
  const { listLoading, lists } = useSelector((state) => state.lists)
  const { cardLoading, cards } = useSelector((state) => state.cards)
  const { activities } = useSelector((state) => state.activities)
  const { isValid, user, users, token, tokenRequest } = useSelector(
    (state) => state.user,
  )
  const { companies } = useSelector((state) => state.company)
  const [initialData, setInitialData] = useState({})
  const [initDone, setInitDone] = useState(false)
  const addFlag = useRef(true)
  const [addListFlag, setAddListFlag] = useState(false)
  const [taskValue, setTaskValue] = useState({
    name: '',
    description: '',
    priority: [],
    pic: [],
    dueDate: '',
  })
  const [editTaskValue, setEditTaskValue] = useState(taskValue)
  const [listTitle, setListTitle] = useState('')
  const [color, setColor] = useState('white')
  const [url, setUrl] = useState('')
  const [editable, setEditable] = useState(false)
  const [boardTitle, setBoardTitle] = useState('')
  const dispatch = useDispatch()
  let mappedPic = []
  let mappedCompany = []

  // if (!loading && name !== currBoard.name && currBoard.name !== undefined)
  //   name = currBoard.name
  // else if (name === undefined) name = ''

  useEffect(() => {
    console.log('initialData', initialData)
    console.log('isValid', isValid)
    console.log('error', error)
    // if (isValid && !error) {
    if (id.length === 24) {
      console.log('id:', id)
      dispatch(fetchListsFromBoard(id, token))
      dispatch(fetchBoardById(id, token))
      dispatch(fetchsCardsFromBoard(id, token))
      dispatch(fetchActivitiesFromBoard(id, token))
      dispatch(fetchTimelineByBoardId(id, token))
      dispatch(fetchAllCompaniesInfo(token))
      dispatch(fetchAllUsersInfo(token))
    }
    // }
  }, [dispatch, id, isValid, token, error])
  mappedPic = currBoard?.pic?.map((pic) => {
    return users.find((user) => user._id === pic)?.username
  })
  mappedCompany = companies.find((company) => company._id === currBoard.company)
    ?.companyName
  useEffect(() => {
    if (!_.isEmpty(currBoard)) {
      // setColor(currBoard.image.color)
      // setUrl(currBoard.image.full)
      // setBoardTitle(currBoard.name)
      setColor('white')
      setUrl('')
      // setBoardTitle('test')
      document.title = `${'Project'} | Project Management KGI`
    }
  }, [currBoard])

  useEffect(() => {
    if (!listLoading && !cardLoading) {
      const prevState = { tasks: {}, columns: {}, columnOrder: [] }
      // eslint-disable-next-line no-shadow
      const getTaskIds = (id) => {
        const filteredTasks = _.filter(cards, { listId: id })
        const sortedTasks = _.orderBy(filteredTasks, ['order'], ['asc'])
        const taskIds = []
        sortedTasks.forEach((task) => taskIds.push(task._id))
        return taskIds
      }

      const setContent = () => {
        cards.forEach((card) => (prevState.tasks[card._id] = card))
        const sortedLists = _.orderBy(lists, ['order'], ['asc'])
        sortedLists.forEach((list) => {
          prevState.columns[list._id] = {
            ...list,
            taskIds: getTaskIds(list._id),
          }
          prevState.columnOrder.push(list._id)
        })
      }
      setContent()
      setInitialData({ ...prevState })
      setInitDone(true)
    }
  }, [setInitDone, listLoading, cardLoading, setInitialData, cards, lists])

  useEffect(() => {
    // let manipulatedTimelines = (timelines) => {
    new Promise(async (resolve, reject) => {
      try {
        const result = await Promise.all(
          timelines?.map((time) => {
            let localStart = moment(time.start).local().format('YYYY-MM-DD')
            let localEnd = moment(time.end).local().format('YYYY-MM-DD')
            console.log({ localStart, localEnd })
            const start = localStart.split('T')[0]
            const end = localEnd.split('T')[0]

            return {
              ...time,
              start,
              end,
            }
          }),
        )

        if (result?.length > 0) {
          resolve(result)
          console.log('timelines time', timelines)
          setManipulatedTimelines(result)
        } else resolve([])
      } catch (error) {
        reject([])
      }
    })
    // }
    // console.log('timelines', timelines)
    // const result = await manipulatedTimelines(timelines)
    // console.log('manipulatedTimelines', result)
  }, [timelines])

  const onDragEnd = async (result) => {
    // eslint-disable-next-line no-var
    var newOrder
    const { destination, source, draggableId, type } = result
    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    if (type === 'list') {
      const listOrder = initialData.columnOrder
      if (destination.index === 0) {
        newOrder = midString('', initialData.columns[listOrder[0]].order)
      } else if (destination.index === listOrder.length - 1) {
        newOrder = midString(
          initialData.columns[listOrder[destination.index]].order,
          '',
        )
      } else if (destination.index < source.index) {
        newOrder = midString(
          initialData.columns[listOrder[destination.index - 1]].order,
          initialData.columns[listOrder[destination.index]].order,
        )
      } else {
        newOrder = midString(
          initialData.columns[listOrder[destination.index]].order,
          initialData.columns[listOrder[destination.index + 1]].order,
        )
      }
      dispatch(updateListById(draggableId, { order: newOrder }))
      const newListOrder = Array.from(initialData.columnOrder)
      const destinationColumn = initialData.columns[draggableId]
      destinationColumn.order = newOrder
      newListOrder.splice(source.index, 1)
      newListOrder.splice(destination.index, 0, draggableId)
      const newData = {
        ...initialData,
        columnOrder: newListOrder,
        columns: {
          ...initialData.columns,
          draggableId: destinationColumn,
        },
      }
      setInitialData(newData)
      return
    }
    const startList = initialData.columns[source.droppableId]
    const endList = initialData.columns[destination.droppableId]

    if (startList === endList) {
      const column = startList
      if (destination.index === 0)
        newOrder = midString('', initialData.tasks[column.taskIds[0]].order)
      else if (destination.index === column.taskIds.length - 1)
        newOrder = midString(
          initialData.tasks[column.taskIds[destination.index]].order,
          '',
        )
      else if (destination.index < source.index)
        newOrder = midString(
          initialData.tasks[column.taskIds[destination.index - 1]].order,
          initialData.tasks[column.taskIds[destination.index]].order,
        )
      else
        newOrder = midString(
          initialData.tasks[column.taskIds[destination.index]].order,
          initialData.tasks[column.taskIds[destination.index + 1]].order,
        )

      dispatch(updateCardById(draggableId, { order: newOrder }))
      const newTaskIds = Array.from(column.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)
      const destinationTask = initialData.tasks[draggableId]
      destinationTask.order = newOrder
      const newColumn = {
        ...column,
        taskIds: newTaskIds,
      }
      const newData = {
        ...initialData,
        columns: {
          ...initialData.columns,
          [newColumn._id]: newColumn,
        },
        tasks: {
          ...initialData.tasks,
          draggableId: destinationTask,
        },
      }
      setInitialData(newData)
      return
    }

    // Move from one list to another
    if (endList.taskIds.length === 0) newOrder = 'n'
    else if (destination.index === 0) {
      newOrder = midString('', initialData.tasks[endList.taskIds[0]].order)
    } else if (destination.index === endList.taskIds.length)
      newOrder = midString(
        initialData.tasks[endList.taskIds[destination.index - 1]].order,
        '',
      )
    else
      newOrder = midString(
        initialData.tasks[endList.taskIds[destination.index - 1]].order,
        initialData.tasks[endList.taskIds[destination.index]].order,
      )
    dispatch(
      updateCardById(draggableId, { order: newOrder, listId: endList._id }),
    )
    // const text = `${user.username} moved ${initialData.tasks[draggableId].name} from ${startList.name} to ${endList.name}`
    const text = `${user.username} moved ${initialData.tasks[draggableId].name} from ${startList.name} to ${endList.name} on project ${currBoard.projectName}`
    const recentActivity = activities[activities.length - 1]
    if (
      recentActivity.text ===
        `${user.username} moved ${initialData.tasks[draggableId].name} from ${endList.name} to ${startList.name}` &&
      moment(recentActivity.createdAt).fromNow().includes('second')
    ) {
      dispatch(deleteActivityById(recentActivity._id))
    } else dispatch(createNewActivity({ text, boardId: currBoard._id }, token))

    if (currBoard?.pic.length > 0) {
      await currBoard.pic.map(async (pic) => {
        const picData = await users.filter((user) => user._id === pic)[0]
        console.log('picData: ', { picData })
        const notifMessage = {
          id: makeid(5),
          message: text,
          link: `/app/projects/details/${currBoard._id}`,
          read: false,
        }
        const userParams = {
          ...picData,
          notification: picData?.notification?.length
            ? [...picData.notification, notifMessage]
            : [notifMessage],
        }
        dispatch(updateUserNotification(userParams))
      })
    }

    const startTaskIds = Array.from(startList.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStartList = {
      ...startList,
      taskIds: startTaskIds,
    }
    const destinationTask = initialData.tasks[draggableId]
    destinationTask.order = newOrder
    const endTaskIds = Array.from(endList.taskIds)
    endTaskIds.splice(destination.index, 0, draggableId)
    const newEndList = {
      ...endList,
      taskIds: endTaskIds,
    }
    const newData = {
      ...initialData,
      columns: {
        ...initialData.columns,
        [newStartList._id]: newStartList,
        [newEndList._id]: newEndList,
      },
      tasks: {
        ...initialData.tasks,
        draggableId: destinationTask,
      },
    }
    setInitialData(newData)
  }

  if (id.length < 24) return <h1>Invalid URL</h1>
  // const handleChange = (e) => {
  //   e.preventDefault()
  //   console.log("handleChange from PDN")
  //   // setListTitle(e.target.value)
  // }

  const handleChange = (e) => {
    const noPersistChange = ['priority', 'pic']
    if (noPersistChange.includes(e.target.name)) e.persist = () => {}
    else e.persist()
    setTaskValue((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  }

  const submitHandler = () => {
    if (taskValue.length === 0) return
    // const text = listTitle.trim().replace(/\s+/g, ' ')
    // if (text === '') {
    //   setListTitle(listTitle)
    //   return
    // }
    const totalLists = initialData?.columnOrder?.length
    const postListReq = {
      name: taskValue.title,
      description: taskValue.description,
      priority: taskValue.priority,
      pic: taskValue.pic,
      boardId: currBoard._id,
      order:
        totalLists === 0
          ? 'n'
          : midString(
              initialData.columns[initialData.columnOrder[totalLists - 1]]
                .order,
              '',
            ),
    }
    dispatch(createNewList(postListReq, token))
    dispatch(
      createNewActivity(
        {
          text: `${user.username} added ${taskValue.title} to this board`,
          boardId: currBoard._id,
        },
        token,
      ),
    )
    setTaskValue({
      title: '',
      description: '',
      priority: [],
      pic: [],
      dueDate: '',
    })
  }

  // const submitHandlerUpdate = () => {
  //   setEditable(false)
  //   // if (text === '') {
  //   //   setListTitle(column.name)
  //   //   setEditable(false)
  //   //   return
  //   // }
  //   setEditTaskValue(editTaskValue)
  //   dispatch(updateBoardById(id, editTaskValue))
  //   // eslint-disable-next-line no-param-reassign
  //   currBoard.name = editTaskValue.title
  // }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitHandler()
    }
  }

  const closeButtonHandler = () => {
    setAddListFlag(false)
    addFlag.current = true
    setTaskValue({
      title: '',
      description: '',
      priority: [],
      pic: [],
      dueDate: '',
    })
  }

  const dataGridColumn = [
    {
      field: 'taskName',
      headerName: 'Task Name',
      headerAlign: 'center',
      width: 200,
    },
    {
      field: 'priority',
      headerName: 'Priority',
      headerAlign: 'center',
      width: 200,
    },
    { field: 'list', headerName: 'List', headerAlign: 'center', width: 200 },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'center',
      width: 200,
      sortable: true,
    },
  ]
  const dataGridRow =
    cards.length > 0
      ? cards.map((card, i) => {
          return {
            id: i,
            taskName: card.name,
            priority:
              card.priority.charAt(0).toUpperCase() + card.priority.slice(1),
            list: 'default',
            status:
              lists.length > 0
                ? lists?.filter((list) => {
                    return list?._id === card.listId
                  })[0]?.name
                : '',
          }
        })
      : []

  // const handleAddition = () => {
  //   setAddListFlag(true)
  //   addFlag.current = false
  // }
  // const setBackground = (background) => {
  //   if (background.thumb) {
  //     setUrl(background.full)
  //     setColor('white')
  //     dispatch(
  //       updateBoardById(
  //         currBoard._id,
  //         {
  //           image: {
  //             full: background.full,
  //             thumb: background.thumb,
  //             color: 'white',
  //           },
  //         },
  //         token,
  //       ),
  //     )
  //   } else {
  //     setColor(background)
  //     setUrl('')
  //     dispatch(
  //       updateBoardById(
  //         currBoard._id,
  //         {
  //           image: {
  //             full: '',
  //             thumb: '',
  //             color: background,
  //           },
  //         },
  //         token,
  //       ),
  //     )
  //   }
  // }

  console.log('initialData', initialData)
  console.log('cards', cards)
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Card>
          <div className={classes.root}>
            <AppBar position="static" color="transparent">
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="project details tab"
                centered
              >
                <Tab label="Overview" {...a11yProps(0)} />
                <Tab label="Task" {...a11yProps(1)} />
                <Tab label="Timelines" {...a11yProps(2)} />
                <Tab label="Files" {...a11yProps(3)} />
              </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={0}>
              {/* TODO: Change TabPanel[0] content into task list with sorting feature*/}

              <CardContent
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <div style={{ height: 'auto', minHeight: 300, width: 800 }}>
                  <DataGrid
                    rows={dataGridRow}
                    columns={dataGridColumn}
                    // pageSize={5}
                    // rowsPerPageOptions={[5]}
                    // checkboxSelection
                    disableSelectionOnClick
                  />
                </div>
                {/* <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <Typography
                      align="left"
                      color="textPrimary"
                      gutterBottom
                      variant="h5"
                    >
                      Company: {mappedCompany || ''}
                    </Typography>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <Typography
                      align="left"
                      color="textPrimary"
                      gutterBottom
                      variant="h5"
                    >
                      Name: {currBoard?.projectName}
                    </Typography>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <Typography
                      align="left"
                      color="textPrimary"
                      gutterBottom
                      variant="h6"
                    >
                      Description: {currBoard?.projectDescription}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    <AccessTimeIcon color="action" />
                    <Typography
                      align="left"
                      color="textSecondary"
                      display="inline"
                      sx={{
                        pl: 1,
                      }}
                      variant="body2"
                    >
                      {currBoard?.startDate && currBoard?.endDate
                        ? `${moment(currBoard.startDate).format(
                            'DD MMMM YYYY',
                          )} - ${moment(currBoard.endDate).format(
                            'DD MMMM YYYY',
                          )}`
                        : ''}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                    md={6}
                    xs={12}
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    <User size="20" />
                    <Typography
                      color="textSecondary"
                      display="inline"
                      sx={{ pl: 1 }}
                      variant="body2"
                    >
                      PIC: {mappedPic?.join(', ') || ''}
                    </Typography>
                  </Grid>
                </Grid> */}
              </CardContent>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <>
                <Divider />
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable
                    droppableId="all-columns"
                    direction="horizontal"
                    type="list"
                  >
                    {(provided) => (
                      <div
                        className={classes.listContainer}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {initDone &&
                          initialData.columnOrder.map((columnId, index) => {
                            const column = initialData.columns[columnId]
                            const tasks = column.taskIds.map(
                              (taskId) => initialData.tasks[taskId],
                            )
                            return (
                              <List
                                key={column._id}
                                column={column}
                                tasks={tasks}
                                index={index}
                                style={classes.wrapper}
                              />
                            )
                          })}
                        <div className={classes.wrapper}>
                          {/* {addFlag.current && (
                        <AddItem
                          handleClick={handleAddition}
                          btnText="Add another list"
                          type="list"
                          icon={<AddIcon />}
                          width="256px"
                          color="white"
                          noshadow
                        />
                      )} */}
                          {addListFlag && (
                            <InputCard
                              value={listTitle}
                              changedHandler={handleChange}
                              itemAdded={submitHandler}
                              closeHandler={closeButtonHandler}
                              keyDownHandler={handleKeyDown}
                              type="list"
                              btnText="Add List"
                              placeholder="Enter list title..."
                              width="230px"
                              marginLeft="1"
                            />
                          )}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  p: 2,
                }}
              >
                <Timeline
                  title={currBoard.projectName}
                  eventsData={manipulatedTimelines ?? []}
                />
              </Box>
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              Under Development
            </TabPanel>
          </div>
        </Card>
      )}
      {isValid || tokenRequest ? (
        <div
          className={classes.root}
          style={{
            backgroundColor: `${color}`,
            // backgroundImage: `url(${url})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* <Redirect to={`/b/${id}/${name}`} />
          <Header loggedIn /> */}
          {editable ? (
            <div className={classes.editable}>
              <InputBase
                onChange={(e) => {
                  e.preventDefault()
                  setBoardTitle(e.target.value)
                }}
                fullWidth
                value={boardTitle}
                style={{
                  fontWeight: 'bold',
                  fontFamily: 'sans-serif',
                  fontSize: '20px',
                }}
                autoFocus
                onFocus={(e) => {
                  const val = e.target.value
                  e.target.value = ''
                  e.target.value = val
                }}
                onBlur={() => {
                  setEditable(false)
                  const text = boardTitle.trim().replace(/\s+/g, ' ')
                  if (text === '') {
                    setBoardTitle(currBoard.name)
                    return
                  }
                  dispatch(updateBoardById(id, { name: text }, token))
                  currBoard.name = boardTitle
                }}
              />
              {/* <InputCard
                value={editTaskValue}
                changedHandler={handleChange}
                itemAdded={submitHandlerUpdate}
                closeHandler={closeButtonHandler}
                keyDownHandler={handleKeyDown}
                type="list"
                btnText="Edit List"
                placeholder="Enter list title..."
                width="230px"
                marginLeft="1"
              /> */}
            </div>
          ) : (
            <div></div>
          )}
          {/*
            <SideMenu
            setBackground={setBackground}
            board={{ id, color, url, title: boardTitle }}
            />
            */}
        </div>
      ) : (
        <div></div>
      )}
    </>
  )
}
