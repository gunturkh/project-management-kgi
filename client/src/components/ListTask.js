import React, { useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { useDispatch, useSelector } from 'react-redux'
import {
  Paper, makeStyles, IconButton,
  Snackbar,
  Alert as MuiAlert,
  Box,
  Modal
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import Card from './Card'
import InputCard from './InputCard'
import { createNewCard } from '../actions/actionCreators/cardActions'
import midString from '../ordering/ordering'
import { createNewActivity } from '../actions/actionCreators/activityActions'
import {
  updateListById,
} from '../actions/actionCreators/listActions'
import { updateUserNotification } from '../actions/actionCreators/userActions'
import { makeid } from '../utils/randomString'
import moment from 'moment'

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
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '272px',
    backgroundColor: '#EBECF0',
    marginLeft: theme.spacing(1),
    wordWrap: 'break-word',
  },
  scroll: {
    maxHeight: 'fill-content',
    margin: 0,
    paddingBottom: '20px',
    listStyle: 'none',
    height: '100%',
    '&::-webkit-scrollbar': {
      width: '0.4em',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid green',
    },
  },
  title: {
    padding: theme.spacing(1, 1, 1, 1),
    minWidth: '100px',
    marginLeft: theme.spacing(1.5),
    fontWeight: 'bold',
  },
  wrapper: {
    marginTop: theme.spacing(0.5),
  },
  editable: {
    marginLeft: theme.spacing(-1),
    wordWrap: 'break-word',
    padding: theme.spacing(0, 1, 0, 1),
    boxShadow: 'inset 0 0 0 2px #0079bf',
    width: '210px',
    borderRadius: 4,
  },
}))

export default function Column({ column, tasks, index }) {
  const classes = useStyles()
  const [openAlert, setOpenAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState({ status: null, message: null })
  const { token, user, users } = useSelector((state) => state.user)
  const [taskValue, setTaskValue] = useState({
    name: '',
    description: '',
    priority: [],
    pic: [],
    startDate: null,
    dueDate: null,
    list: null,
    modifyBy: user.username,
    modifyDate: '',
  })
  const [editTaskValue, setEditTaskValue] = useState(taskValue)
  const [listTitle, setListTitle] = useState(column.name)
  const [addCardFlag, setAddCardFlag] = useState(false)
  const [editable, setEditable] = useState(false)
  const [list, setList] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const { currBoard } = useSelector((state) => state.boards)
  const dispatch = useDispatch()

  const handleCloseAlert = () => {
    setOpenAlert(false)
  }
  const handleChange = (e, target) => {
    const noPersistChange = ['priority', 'pic', 'list']
    if (target === 'dueDate') {
      setTaskValue((prevState) => {
        return { ...prevState, dueDate: e }
      })
    } else if (target === 'startDate') {
      setTaskValue((prevState) => {
        return { ...prevState, startDate: e }
      })
    } else if (target?.name === 'pic') {
      setTaskValue((prevState) => {
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

      setTaskValue((prevState) => {
        return {
          ...prevState,
          [e.target.name]: e.target.value,
          modifyBy: user.username,
        }
      })
    }
  }

  const submitHandler = async () => {
    if (taskValue.length === 0) return

    setTaskValue(taskValue)
    const totalTasks = tasks.length
    const postCardReq = {
      name: taskValue.name,
      description: taskValue.description,
      priority: taskValue.priority,
      pic: taskValue.pic,
      dueDate: taskValue.dueDate,
      list: taskValue.list,
      boardId: column.boardId,
      listId: column._id,
      order:
        totalTasks === 0 ? 'n' : midString(tasks[totalTasks - 1].order, ''),
    }
    dispatch(createNewCard(postCardReq, token))
      .then((res) => {
        setAlertMessage({ status: 'success', message: 'Task Created Successfully!' })
        setOpenAlert(true)
      })
      .catch(e => {
        setAlertMessage({ status: 'error', message: 'Failed Created Task!' })
        setOpenAlert(true)
      })
    if (currBoard?.pic.length > 0) {
      await currBoard.pic.map(async (pic) => {
        const picData = await users.filter((user) => user._id === pic)[0]
        const notifMessage = {
          id: makeid(5),
          message: `Task ${taskValue.name}, created by: ${user.name
            }, description: ${taskValue.description}, priority: ${taskValue.priority
            }, due date: ${moment(taskValue.dueDate).format('DD/MM/YYYY')}`,
          link: `/app/projects/details/${currBoard._id}`,
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
    dispatch(
      createNewActivity(
        {
          text: `${user.username} added ${taskValue.name} to ${column.name}`,
          boardId: column.boardId,
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
      list: null,
      modifyBy: '',
    })
    setAddCardFlag(false)
    setEditable(false)
  }
  const handleAddition = () => {
    setAddCardFlag(true)
  }
  const closeButtonHandler = () => {
    setAddCardFlag(false)
    setEditable(false)
    setTaskValue({
      title: '',
      description: '',
      priority: [],
      pic: [],
      dueDate: '',
      list: null,
      modifyBy: '',
    })
  }
  const changedHandler = (e) => {
    const noPersistChange = ['priority', 'pic']
    if (noPersistChange.includes(e.target.name)) e.persist = () => { }
    else e.persist()
    setTaskValue((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitHandler()
    }
  }
  const updateListTitle = () => {
    const text = listTitle.trim().replace(/\s+/g, ' ')
    if (text === '') {
      setListTitle(column.name)
      setEditable(false)
      return
    }
    setListTitle(text)
    dispatch(updateListById(column._id, { name: listTitle }))
    // eslint-disable-next-line no-param-reassign
    column.name = text
    setEditable(false)
  }

  const submitHandlerUpdate = () => {
    setTaskValue(editTaskValue)
    dispatch(updateListById(column._id, editTaskValue))
    // eslint-disable-next-line no-param-reassign
    column.name = editTaskValue.title
    setEditable(false)
  }

  const borderColor = (listTitle) => {
    let color
    switch (listTitle) {
      case 'To-Do':
        return (color = 'gray')
        break
      case 'On-Progress':
        return (color = 'orange')
        break
      case 'Done':
        return (color = 'blue')
        break
      case 'Checked':
        return (color = 'green')
        break
      default:
        break
    }
  }

  return (
    <div className={classes.wrapper}>
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
      {list && (
        <Draggable draggableId={column._id} index={index}>
          {(provided) => (
            <div {...provided.draggableProps} ref={provided.innerRef}>
              <Paper
                elevation={0}
                // onMouseEnter={() => setShowDelete(true)}
                // onMouseLeave={() => setShowDelete(false)}
                onMouseEnter={() => setShowAdd(true)}
                onMouseLeave={() => setShowAdd(false)}
                className={classes.root}
                style={{
                  backgroundColor: `${borderColor(listTitle)}`,
                  padding: '15px',
                }}
                {...provided.dragHandleProps}
              >
                <div
                  className={classes.title}
                // onClick={() => setEditable(true)}
                >
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        color: 'white',
                        fontFamily: 'sans-serif',
                        fontWeight: 700,
                      }}
                    >
                      {column.name}
                    </div>
                    {
                      showAdd &&
                      !editable &&
                      (
                        <IconButton
                          size="small"
                          style={{
                            right: 0,
                            top: 0,
                            position: 'absolute',
                            backgroundColor: '#EBECF0',
                            zIndex: 100,
                          }}
                          onClick={() => { handleAddition() }}
                        >
                          <AddIcon
                            fontSize="small"
                            style={{ backgroundColor: '#EBECF0' }}
                          />
                        </IconButton>
                      )
                    }

                  </div>
                  {/* {editable && ( */}
                  {/*   <div className={classes.editable}> */}
                  {/*     <InputBase */}
                  {/*       onChange={changedHandler} */}
                  {/*       multiline */}
                  {/*       fullWidth */}
                  {/*       value={listTitle} */}
                  {/*       style={{ fontWeight: 'bold' }} */}
                  {/*       // autoFocus */}
                  {/*       onFocus={(e) => { */}
                  {/*         const val = e.target.value */}
                  {/*         e.target.value = '' */}
                  {/*         e.target.value = val */}
                  {/*       }} */}
                  {/*       onBlur={updateListTitle} */}
                  {/*     /> */}
                  {/*   </div> */}
                  {/* )} */}
                </div>
                <Droppable droppableId={column._id} type="card">
                  {
                    // eslint-disable-next-line no-shadow
                    (provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{ textAlign: 'center' }}
                      >
                        <div className={classes.scroll}>
                          {/* eslint-disable-next-line no-shadow */}
                          {(
                            <Modal
                              open={addCardFlag}
                              onClose={closeButtonHandler}
                              aria-labelledby="modal-card-title"
                              aria-describedby="modal-card-description"
                            >
                              <Box sx={modalStyle}>
                                <InputCard
                                  value={taskValue}
                                  changedHandler={handleChange}
                                  itemAdded={submitHandler}
                                  closeHandler={closeButtonHandler}
                                  keyDownHandler={handleKeyDown}
                                  type="card"
                                  btnText="Add Card"
                                  placeholder="Enter a title for this card..."
                                  width="100%"
                                />
                              </Box>
                            </Modal>
                          )}
                          {provided.placeholder}
                          {tasks.map((task, index) => (
                            <Card
                              key={task._id}
                              task={task}
                              index={index}
                              closeHandler={closeButtonHandler}
                            />
                          ))}
                        </div>
                        {/* {!addCardFlag && ( */}
                        {/*   <AddItem */}
                        {/*     handleClick={handleAddition} */}
                        {/*     icon={<AddIcon />} */}
                        {/*     btnText="Add another card" */}
                        {/*     type="card" */}
                        {/*     width="256px" */}
                        {/*   /> */}
                        {/* )} */}
                      </div>
                    )
                  }
                </Droppable>
              </Paper>
            </div>
          )}
        </Draggable>
      )}
    </div>
  )
}
