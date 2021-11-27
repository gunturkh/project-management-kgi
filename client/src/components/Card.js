import React, { useState, useEffect } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import {
  Paper, makeStyles, InputBase, IconButton,
  Snackbar,
  Alert as MuiAlert,
  Modal,
  Box,
} from '@material-ui/core'
import InputCard from './InputCard'

import { useDispatch, useSelector } from 'react-redux'
import { Edit } from 'react-feather'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import {
  updateCardById,
  deleteCardById,
} from '../actions/actionCreators/cardActions'
import { createNewActivity } from '../actions/actionCreators/activityActions'
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter'
import moment from 'moment'
import { makeid } from '../utils/randomString'
import { updateUserNotification } from '../actions/actionCreators/userActions'
import axios from 'axios'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  // p: 4,
};

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(1, 1, 1, 1),
    margin: theme.spacing(1),
    width: '230px',
    wordWrap: 'break-word',
    zIndex: '-100',
    '&:hover': {
      backgroundColor: '#EBECF0',
    },
  },
  delete: {
    position: 'absolute',
    right: 0,
    zIndex: 1000,
    top: 0,
    backgroundColor: '#EBECF0',
  },
}))

export default function Card({ task, index }) {
  const [openAlert, setOpenAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState({ status: null, message: null })
  const { token, user, users } = useSelector((state) => state.user)
  const { cards } = useSelector((state) => state.cards)
  const { lists } = useSelector((state) => state.lists)
  const { timelines } = useSelector((state) => state.timeline)
  const [editable, setEditable] = useState(false)
  const [submit, setSubmit] = useState(false)
  const [title, setTitle] = useState(task.name)
  const [editTaskValue, setEditTaskValue] = useState({
    name: task.name,
    description: task.description ? task.description : '',
    priority: task.priority,
    pic: task.pic,
    startDate: task.startDate,
    dueDate: task.dueDate,
    modifyDate: task.updatedAt,
    modifyBy: task.modifyBy,
    list: task?.list,
    // priority: task.priority ? [{label: task.priority, value: task.priority}] : [],
    // pic: task.pic ? task?.pic?.map(t=>{return {label: t, value: t}}) : []
  })
  const handleCloseAlert = () => {
    setOpenAlert(false)
  }
  const [card, setCard] = useState(true)
  const [showDelete, setShowDelete] = useState(false)
  const classes = useStyles()
  const { currBoard } = useSelector((state) => state.boards)
  const dispatch = useDispatch()
  let mappedPic = []
  let mappedList = []
  mappedPic = task?.pic?.map((pic) => {
    return users.find((user) => user._id === pic || user._id === pic.value)?.username
  })
  if (typeof task.list === 'array') {
    mappedList = task?.list?.map((list) => {
      return timelines.find((t) => t._id === list)
    })
  }
  if (typeof task.list === 'string')
    mappedList = timelines.find((t) => t._id === task.list)
  const handleChange = (e, target) => {
    const noPersistChange = ['priority', 'pic', 'list']
    if (target === 'dueDate') {
      setEditTaskValue((prevState) => {
        return { ...prevState, dueDate: e }
      })
    } else if (target === 'startDate') {
      setEditTaskValue((prevState) => {
        return { ...prevState, startDate: e }
      })
    } else if (target?.name === 'pic') {
      setEditTaskValue((prevState) => {
        return {
          ...prevState,
          [target.name]: e,
          modifyBy: user.username,
        }
      })
    }
    else {
      if (noPersistChange.includes(e.target.name)) e.persist = () => { }
      else e.persist()
      setEditTaskValue((prevState) => {
        return {
          ...prevState,
          [e.target.name]: e.target.value,
          modifyBy: user.username,
        }
      })
    }
  }

  const submitHandlerUpdate = async () => {
    setEditable(false)
    setEditTaskValue(editTaskValue)
    dispatch(updateCardById(task._id, editTaskValue))
      .then((res) => {
        setAlertMessage({ status: 'success', message: 'Task Edit Successfully!' })
        setOpenAlert(true)
      })
      .catch(e => {
        setAlertMessage({ status: 'error', message: 'Failed Edit Task!' })
        setOpenAlert(true)
      })
    if (currBoard?.pic.length > 0) {
      await currBoard.pic.map(async (pic) => {
        const picData = await users.filter((user) => user._id === pic)[0]
        const notifMessage = {
          id: makeid(5),
          message: `Task ${editTaskValue.name}, edited by: ${user.name
            }, description: ${editTaskValue.description}, priority: ${editTaskValue.priority
            }, due date: ${moment(editTaskValue.dueDate).format('DD/MM/YYYY')}`,
          link: `/app/projects/details/${currBoard._id}`,
          read: false,
        }
        const userParams = {
          ...picData,
          notification: picData?.notification?.length
            ? [...picData?.notification, notifMessage]
            : [notifMessage],
        }
        dispatch(updateUserNotification(userParams))
      })
    }
    // eslint-disable-next-line no-param-reassign
    task.name = editTaskValue.name
  }

  const closeButtonHandler = () => {
    setEditable(false)
    setEditTaskValue({
      name: task.name,
      description: task.description ? task.description : '',
      priority: task.priority,
      pic: task.pic,
      startDate: task.startDate,
      modifyDate: task.updatedAt,
      modifyBy: task.modifyBy,
      dueDate: task.dueDate,
      list: task?.list ?? null,
    })
    // addListFlagHandler(false)
    // addFlag.current = true
    // setEditTaskValue({
    //   title: '',
    //   description: '',
    //   priority: [],
    //   pic: []
    // })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitHandlerUpdate()
    }
  }

  const priorityColor = (priority) => {
    let color
    switch (priority) {
      case 'high':
        color = 'red'
        break
      case 'normal':
        color = 'orange'
        break
      // case 'low':
      //   color = 'green';
      //   break;

      default:
        break
    }
    return color
  }

  return (
    <>
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
      <Draggable draggableId={task._id} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {card && (
              <Paper
                className={classes.card}
                onMouseEnter={() => setShowDelete(true)}
                onMouseLeave={() => setShowDelete(false)}
              >
                {editable ? (
                  <Modal
                    open={editable}
                    onClose={closeButtonHandler}
                    aria-labelledby="modal-card-title"
                    aria-describedby="modal-card-description"
                  >
                    <Box sx={modalStyle}>
                      <InputCard
                        value={editTaskValue}
                        changedHandler={handleChange}
                        itemAdded={submitHandlerUpdate}
                        closeHandler={closeButtonHandler}
                        keyDownHandler={handleKeyDown}
                        type="list"
                        btnText="Edit List"
                        placeholder="Enter list title..."
                        // width="230px"
                        marginLeft="1"
                      />
                    </Box>
                  </Modal>
                ) : (
                  <div style={{ position: 'relative' }}>
                    {showDelete && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-evenly',
                        }}
                      >
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
                        <IconButton
                          className={classes.delete}
                          size="small"
                          onClick={() => {
                            setCard(false)
                            dispatch(deleteCardById(task._id)).then((res) => {
                              alert('delete card success')
                              setAlertMessage({ status: 'success', message: 'Task Delete Successfully!' })
                              setOpenAlert(true)
                            })
                              .catch(e => {
                                setAlertMessage({ status: 'error', message: 'Failed Delete Task!' })
                                setOpenAlert(true)
                              })
                            const text = `${user.username} deleted card ${task.name}`
                            if (currBoard?.pic.length > 0) {
                              currBoard.pic.map(async (pic) => {
                                const picData = await users.filter(
                                  (user) => user._id === pic,
                                )[0]
                                const notifMessage = {
                                  id: makeid(5),
                                  message: `Task ${task.name} on project ${currBoard.projectName}, deleted by: ${user.name}`,
                                  link: `/app/projects/details/${currBoard._id}`,
                                  read: false,
                                }
                                const userParams = {
                                  ...picData,
                                  notification: picData?.notification?.length
                                    ? [...picData?.notification, notifMessage]
                                    : [notifMessage],
                                }
                                dispatch(updateUserNotification(userParams))
                              })
                            }
                            dispatch(
                              createNewActivity(
                                { text, boardId: task.boardId },
                                token,
                              ),
                            )
                          }}
                        >
                          <DeleteForeverIcon
                            fontSize="small"
                            style={{ backgroundColor: '#EBECF0' }}
                          />
                        </IconButton>
                        <IconButton
                          className={classes.delete}
                          size="small"
                          onClick={() => {
                            setEditable(true)
                          }}
                        >
                          <Edit size="18" />
                        </IconButton>
                      </div>
                    )}
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <div
                        style={{ textAlign: 'left', fontWeight: 700, padding: 5 }}
                      >
                        {task?.name}
                      </div>
                      <div
                        style={{
                          textAlign: 'left',
                          color: priorityColor(task.priority),
                          fontWeight: 700,
                          padding: 5,
                        }}
                      >
                        {task?.priority
                          ? capitalizeFirstLetter(task?.priority)
                          : ''}
                      </div>
                    </div>
                    <div
                      style={{ textAlign: 'left', fontWeight: 400, padding: 5 }}
                    >
                      Desc: {task?.description}
                    </div>
                    {/* <div
    style={{
    textAlign: 'left',
    fontWeight: 600,
    padding: 5,
    color: 'gray',
    }}
    >
    Start Date: {moment(task?.startDate).format('DD/MM/YYYY')}
    </div> */}
                    <div
                      style={{
                        textAlign: 'left',
                        fontWeight: 600,
                        padding: 5,
                        color: 'gray',
                      }}
                    >
                      End Date: {moment(task?.dueDate).format('DD/MM/YYYY')}
                    </div>
                    <div
                      style={{ textAlign: 'left', padding: 5, fontWeight: 600 }}
                    >
                      Assigned To: {mappedPic?.join(', ') || ''}
                    </div>
                    <div
                      style={{ textAlign: 'left', fontWeight: 400, padding: 5 }}
                    >
                      List: {mappedList?.title ?? ''}
                    </div>
                    <div
                      style={{ textAlign: 'left', fontWeight: 400, padding: 5 }}
                    >
                      Modify By: {task?.modifyBy ?? ''}
                    </div>
                    <div
                      style={{ textAlign: 'left', fontWeight: 400, padding: 5 }}
                    >
                      Modify Date:{' '}
                      {moment(task.updatedAt).format('DD/MM/YYYY hh:mm') ?? ''}
                    </div>
                  </div>
                )}
              </Paper>
            )}
          </div>
        )}
      </Draggable>
    </>)
}
