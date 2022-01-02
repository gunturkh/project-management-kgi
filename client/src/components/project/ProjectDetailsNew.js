import React, { useEffect, useState, useRef, Fragment } from 'react'
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
  Select,
  TableBody,
  TableRow,
  Table,
  TableCell,
  Link,
  Snackbar,
  Alert as MuiAlert,
} from '@material-ui/core'
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Menu,
  InputLabel,
  CircularProgress,
} from '@mui/material'
import AddIcon from '@material-ui/icons/Add'
import MoreVertIcon from '@material-ui/icons/MoreVert'
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
import { updateTimelineByBoardId } from '../../actions/actionCreators/timelineActions'
import { updateUserNotification } from '../../actions/actionCreators/userActions'
import ListTask from '../ListTask'
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
import axios from 'axios'
import { DropzoneDialog, DropzoneArea } from 'material-ui-dropzone'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import * as ACTIONS from '../../actions/actions.js'

const useStyles = makeStyles((theme) => ({
  root: {
    // minHeight: '100vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
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
  previewChip: {
    minWidth: 160,
    maxWidth: 210,
  },
  dropZone: {
    minHeight: 50,
  },
}))

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

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
  const [openAlert, setOpenAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState({ status: null, message: null })
  const [editTaskValue, setEditTaskValue] = useState(taskValue)
  const [listTitle, setListTitle] = useState('')
  const [color, setColor] = useState('white')
  const [url, setUrl] = useState('')
  const [editable, setEditable] = useState(false)
  const [boardTitle, setBoardTitle] = useState('')
  const dispatch = useDispatch()
  let mappedPic = []
  let mappedCompany = []

  const [selectedFolderIndex, setSelectedFolderIndex] = useState('')
  const [openUploadModal, setOpenUploadModal] = useState(false)
  const [addFile, setAddFile] = useState([])
  const [chooseFolder, setChooseFolder] = useState('')
  const [listFile, setListFile] = useState([])
  const [refreshList, setRefreshList] = useState(true)
  const [progressLoading, setProgressLoading] = useState(false)

  const handleCloseAlert = () => {
    setOpenAlert(false)
  }

  useEffect(() => {
    if (id.length === 24) {
      dispatch(fetchListsFromBoard(id, token))
      dispatch(fetchBoardById(id, token))
      dispatch(fetchsCardsFromBoard(id, token))
      dispatch(fetchActivitiesFromBoard(id, token))
      dispatch(fetchTimelineByBoardId(id, token))
      dispatch(fetchAllCompaniesInfo(token))
      dispatch(fetchAllUsersInfo(token))
    }
  }, [dispatch, id, isValid, token, error])

  mappedPic = currBoard?.pic?.map((pic) => {
    return users.find((user) => user._id === pic)?.username
  })
  mappedCompany = companies.find((company) => company._id === currBoard.company)
    ?.companyName
  useEffect(() => {
    if (!_.isEmpty(currBoard)) {
      setColor('white')
      setUrl('')
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

      axios
        .get(`/api/boards/${currBoard._id}/projectCards`, {
          headers: { 'x-auth-token': token },
        })
        .then((res) => {
          res.data.timelineWithList.forEach((t) => {
            dispatch(
              updateTimelineByBoardId(`${currBoard._id}/${t.timeline}`, {
                ...t.timelineParam[0],
                progress: t.progress,
              }),
            )
          })
        })
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
          setManipulatedTimelines(result)
        } else resolve([])
      } catch (error) {
        reject([])
      }
    })
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
      updateCardById(draggableId, {
        order: newOrder,
        listId: endList._id,
        modifyBy: user.username,
      }),
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

  const handleChange = (e) => {
    const noPersistChange = ['priority', 'pic']
    if (noPersistChange.includes(e.target.name)) e.persist = () => { }
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
      .then(res => {
        setAlertMessage({ status: 'success', message: 'Task Created Successfully!' })
        setOpenAlert(true)
      })

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

  const handleListItemClick = (event, index) => {
    setSelectedFolderIndex(index)
  }

  const handleCellClick = (param, event) => {
    event.stopPropagation()
  }

  const handleRowClick = (param, event) => {
    event.stopPropagation()
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

  const dataFileColumn = [
    {
      field: 'fileName',
      headerName: 'File Name',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => {
        const filename = params.row.fileName.replace(/\.[^/.]+$/, '')
        return (
          <a
            href={params.row.webViewLink}
            style={{ textDecoration: 'none', color: 'black' }}
            target="_blank"
          >
            {filename}
          </a>
        )
      },
    },
    {
      field: 'date',
      headerName: 'Date',
      headerAlign: 'center',
      flex: 0.5,
      align: 'center',
    },
    {
      field: 'fileType',
      headerName: 'Type',
      headerAlign: 'center',
      flex: 0.25,
      align: 'center',
    },
    {
      field: 'Action',
      headerName: '',
      headerAlign: 'center',
      flex: 0.2,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const SimpleMenu = () => {
          const [anchorEl, setAnchorEl] = React.useState(null)

          const handleClick = (event) => {
            setAnchorEl(event.currentTarget)
          }

          const handleClose = () => {
            setAnchorEl(null)
          }

          const handleDownload = (event, params) => {
          }

          const handleDeleteFile = (params) => {
            const _id = params.row.id
            const filteredFiles = currBoard?.files
              ?.filter((d) => d.id !== _id)
              .map((item) => {
                return { ...item }
              })
            const param = {
              userId: currBoard.userId,
              projectName: currBoard.projectName,
              projectDescription: currBoard.projectDescription,
              startDate: currBoard.startDate,
              endDate: currBoard.endDate,
              company: currBoard.company,
              pic: currBoard.pic,
              status: currBoard.status,
              files: [...filteredFiles],
            }
            dispatch(updateBoardById(id, param, token))
          }

          return (
            <div>
              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon />
              </Button>
              <Menu
                id="action-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <Link
                  href={params.row.webContentLink}
                  style={{ textDecoration: 'none', color: 'black' }}
                >
                  <MenuItem
                    onClick={(event) => {
                      handleDownload(event, params)
                    }}
                  >
                    Download
                  </MenuItem>
                </Link>
                <MenuItem
                  onClick={() => {
                    handleDeleteFile(params)
                  }}
                >
                  Delete
                </MenuItem>
              </Menu>
            </div>
          )
        }
        return (
          <div>
            <SimpleMenu />
          </div>
        )
      },
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
          list: timelines.filter((t) => t._id === card.list)[0]?.title,
          status:
            lists.length > 0
              ? lists?.filter((list) => {
                return list?._id === card.listId
              })[0]?.name
              : '',
        }
      })
      : []

  const dataFileRow = currBoard?.files
    ?.filter((w) => w.folder.includes(selectedFolderIndex))
    .map((item, index) => {
      const type = item.mimeType?.split('/') || ''
      const date = moment(item.modifiedTime).format('DD MMMM YYYY hh:mm:ss')
      return {
        id: item.id,
        fileName: item.name,
        date: date,
        fileType: type[1],
        webContentLink: item.webContentLink,
        webViewLink: item.webViewLink,
      }
    })

  // Handle File Upload

  const handleOpenModal = () => {
    setOpenUploadModal(true)
  }

  const handleCloseModal = () => {
    setOpenUploadModal(false)
  }

  const handleUpload = () => {
    // addFile
    const formData = new FormData()
    formData.append('folder', chooseFolder)
    for (let i = 0; i < addFile.length; i++) {
      formData.append('files', addFile[i])
    }
    try {
      if (!progressLoading) {
        setProgressLoading(true)
        const res = axios.post('/files', formData)
        res.then((data) => {
          setRefreshList(true)
          setOpenUploadModal(false)
          setProgressLoading(false)
          const uploadedFiles = data.data.map((d) => {
            return { ...d, folder: chooseFolder, boardId: currBoard._id }
          })
          const params = {
            userId: currBoard.userId,
            projectName: currBoard.projectName,
            projectDescription: currBoard.projectDescription,
            startDate: currBoard.startDate,
            endDate: currBoard.endDate,
            company: currBoard.company,
            pic: currBoard.pic,
            status: currBoard.status,
            files: [...uploadedFiles, ...currBoard.files],
          }
          dispatch(updateBoardById(id, params, token))
        })
      }
    } catch (err) {
      console.error('ERROR: ', err)
    }
  }

  const handleChooseFolder = (e) => {
    setChooseFolder(e.target.value)
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Card>
          <Snackbar
            open={openAlert}
            autoHideDuration={6000}
            onClose={handleCloseAlert}
          >
            <Alert
              onClose={handleCloseAlert}
              severity={alertMessage?.status === 'error' ? "error" : "success"}
              sx={{ width: '100%' }}
            >
              {`${alertMessage?.message}`}
            </Alert>
          </Snackbar>
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
            <TabPanel value={tabValue} index={0}
              style={{ height: '100vh' }}
            >
              <CardContent
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <div
                  style={{
                    height: 'auto',
                    minHeight: 400,
                    width: 800,
                  }}
                >
                  <Grid container spacing={3} justifyContent="center" alignContent="center" flexDirection="column">
                    <Typography
                      align="center"
                      color="textPrimary"
                      gutterBottom
                      variant="h1"
                    >
                      {mappedCompany || ''}
                    </Typography>
                    <Typography
                      align="center"
                      color="textPrimary"
                      gutterBottom
                      variant="h2"
                    >
                      {currBoard?.projectName}
                    </Typography>
                    <Typography
                      align="center"
                      color="textPrimary"
                      gutterBottom
                      variant="h3"
                    >
                      {currBoard?.projectDescription}
                    </Typography>
                    <Grid
                      item
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 5,
                        pl: 0,
                      }}
                    >
                      <User size="20" />
                      <Typography
                        align="center"
                        color="textSecondary"
                        variant="body2"
                      >
                        {mappedPic?.join(', ') || ''}
                      </Typography>
                    </Grid>
                  </Grid>
                  <DataGrid
                    sortingOrder={['desc', 'asc']}
                    rows={dataGridRow}
                    columns={dataGridColumn}
                    disableSelectionOnClick
                  />
                </div>
              </CardContent>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
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
                            <ListTask
                              key={column._id}
                              column={column}
                              tasks={tasks}
                              index={index}
                              style={classes.wrapper}
                            />
                          )
                        })}
                      <div className={classes.wrapper}>
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
              <Box sx={{ flexGrow: 1, padding: 0 }}>
                <Grid
                  container
                  spacing={0.5}
                  rowSpacing={0.5}
                >
                  <Grid item xs={3} md={3}>
                    <List component="nav">
                      <ListItemButton
                        selected={selectedFolderIndex === ''}
                        onClick={(event) => handleListItemClick(event, '')}
                      >
                        <ListItemText primary="All Files" />
                      </ListItemButton>
                      <Divider />
                      <List dense paddingLeft={24}>
                        <ListItemButton
                          selected={
                            selectedFolderIndex === 'mechanical-drawing'
                          }
                          onClick={(event) =>
                            handleListItemClick(event, 'mechanical-drawing')
                          }
                        >
                          <ListItemText primary="Mechanical Assembly Drawing" />
                        </ListItemButton>
                        <ListItemButton
                          selected={
                            selectedFolderIndex === 'electrical-drawing'
                          }
                          onClick={(event) =>
                            handleListItemClick(event, 'electrical-drawing')
                          }
                        >
                          <ListItemText primary="Electrical Wiring Diagram" />
                        </ListItemButton>
                        <ListItemButton
                          selected={selectedFolderIndex === 'pneumatic-diagram'}
                          onClick={(event) =>
                            handleListItemClick(event, 'pneumatic-diagram')
                          }
                        >
                          <ListItemText primary="Pneumatic Diagram" />
                        </ListItemButton>
                        <ListItemButton
                          selected={selectedFolderIndex === 'io-list'}
                          onClick={(event) =>
                            handleListItemClick(event, 'io-list')
                          }
                        >
                          <ListItemText primary="I/O List" />
                        </ListItemButton>
                        <ListItemButton
                          selected={selectedFolderIndex === 'plc-program'}
                          onClick={(event) =>
                            handleListItemClick(event, 'plc-program')
                          }
                        >
                          <ListItemText primary="PLC Program" />
                        </ListItemButton>
                        <ListItemButton
                          selected={selectedFolderIndex === 'hmi-program'}
                          onClick={(event) =>
                            handleListItemClick(event, 'hmi-program')
                          }
                        >
                          <ListItemText primary="HMI Program" />
                        </ListItemButton>
                        <ListItemButton
                          selected={selectedFolderIndex === 'vb-srccode'}
                          onClick={(event) =>
                            handleListItemClick(event, 'vb-srccode')
                          }
                        >
                          <ListItemText primary="VB Source Code Program" />
                        </ListItemButton>
                        <ListItemButton
                          selected={
                            selectedFolderIndex === 'electrical-partlist'
                          }
                          onClick={(event) =>
                            handleListItemClick(event, 'electrical-partlist')
                          }
                        >
                          <ListItemText primary="Electrical Part List" />
                        </ListItemButton>
                        <ListItemButton
                          selected={
                            selectedFolderIndex === 'mechanical-partlist'
                          }
                          onClick={(event) =>
                            handleListItemClick(event, 'mechanical-partlist')
                          }
                        >
                          <ListItemText primary="Mechanical Part List" />
                        </ListItemButton>
                        <ListItemButton
                          selected={
                            selectedFolderIndex === 'pneumatic-partlist'
                          }
                          onClick={(event) =>
                            handleListItemClick(event, 'pneumatic-partlist')
                          }
                        >
                          <ListItemText primary="Pneumatic Part List" />
                        </ListItemButton>
                        <ListItemButton
                          selected={selectedFolderIndex === 'others'}
                          onClick={(event) =>
                            handleListItemClick(event, 'others')
                          }
                        >
                          <ListItemText primary="Others" />
                        </ListItemButton>
                      </List>
                    </List>
                  </Grid>
                  <Grid item xs={9} md={9}>
                    {user?.role === 'ADMIN' || user?.role === 'MEMBER' &&
                      (
                        <Button
                          onClick={handleOpenModal}
                          color="primary"
                          variant="contained"
                        >
                          Attach File
                        </Button>
                      )
                    }
                    <Dialog
                      open={openUploadModal}
                      onClose={handleCloseModal}
                      maxWidth={'md'}
                      fullWidth={true}
                    >
                      <DialogContent>
                        <Box minHeight={120}>
                          <DropzoneArea
                            dropzoneClass={classes.dropZone}
                            onChange={(files) => setAddFile(files)}
                            dropzoneText={
                              'Drag & drop or click here, max 3 file at one time'
                            }
                            showAlerts={false}
                            showPreviews={true}
                            showPreviewsInDropzone={false}
                            useChipsForPreview
                            previewGridProps={{
                              container: { spacing: 1, direction: 'row' },
                            }}
                            previewChipProps={{
                              classes: { root: classes.previewChip },
                            }}
                            previewText="Selected files"
                          />
                        </Box>
                        <Select
                          style={{ minWidth: 320 }}
                          value={chooseFolder}
                          onChange={handleChooseFolder}
                          label="Choose Folder"
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="mechanical-drawing">
                            Mechanical Assembly Drawing
                          </MenuItem>
                          <MenuItem value="electrical-drawing">
                            Electrical Wiring Drawing
                          </MenuItem>
                          <MenuItem value="pneumatic-diagram">
                            Pneumatic Diagram
                          </MenuItem>
                          <MenuItem value="io-list">I/O List</MenuItem>
                          <MenuItem value="plc-program">PLC Program</MenuItem>
                          <MenuItem value="hmi-program">HMI Program</MenuItem>
                          <MenuItem value="vb-srccode">
                            VB Source Code Program
                          </MenuItem>
                          <MenuItem value="electrical-partlist">
                            Electrical Part List
                          </MenuItem>
                          <MenuItem value="mechanical-partlist">
                            Mechanical Part List
                          </MenuItem>
                          <MenuItem value="pneumatic-partlist">
                            Pneumatic Part List
                          </MenuItem>
                          <MenuItem value="others">Others</MenuItem>
                        </Select>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseModal}>Cancel</Button>
                        <Button
                          form="form-upload"
                          type="submit"
                          onClick={handleUpload}
                          color="primary"
                          variant="contained"
                          disabled={progressLoading}
                        >
                          Upload
                          {progressLoading && (
                            <CircularProgress
                              size={24}
                              sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                              }}
                            />
                          )}
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <Box width="100%" height={450}>
                      <DataGrid
                        rows={dataFileRow}
                        columns={dataFileColumn}
                        disableSelectionOnClick
                        onCellClick={handleCellClick}
                        onRowClick={handleRowClick}
                      />
                    </Box>
                    {/* <Box>
                      <Table>
                        <TableBody>
                          {currBoard?.files
                            ?.filter((w) =>
                              w.folder.includes(selectedFolderIndex),
                            )
                            .map((item, index) => (
                              <>
                                <TableRow hover key={index}>
                                  <TableCell color="textSecondary">
                                    <a
                                      href={item.webViewLink}
                                      style={{
                                        color: 'black',
                                        textDecoration: 'none',
                                        fontWeight: '500',
                                      }}
                                      target="_blank"
                                    >
                                      {item.name}
                                    </a>
                                  </TableCell>
                                </TableRow>
                              </>
                            ))}
                        </TableBody>
                      </Table>
                    </Box>*/}
                  </Grid>
                </Grid>
              </Box>
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
