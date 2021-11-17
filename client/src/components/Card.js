import React, { useState, useEffect } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { Paper, makeStyles, InputBase, IconButton } from '@material-ui/core'
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
  console.log('Card task:', task)
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
  console.log("mappedPic", mappedPic)
  console.log('task list', task?.list)
  if (typeof task.list === 'array') {
    mappedList = task?.list?.map((list) => {
      console.log('list', list)
      console.log('timelines', timelines)
      return timelines.find((t) => t._id === list)
    })
  }
  if (typeof task.list === 'string')
    mappedList = timelines.find((t) => t._id === task.list)
  console.log('mappedList', mappedList)
  const handleChange = (e, target) => {
    console.log('handleChange card:', { e, target })
    console.log("card handleChange ", { e, target })
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
      console.log("pic on change", e)
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
      console.log('setState card: ', {
        name: e.target.name,
        value: e.target.value,
      })
      setEditTaskValue((prevState) => {
        return {
          ...prevState,
          [e.target.name]: e.target.value,
          modifyBy: user.username,
        }
      })
    }
  }

  useEffect(() => {
    console.log('cards changed:', cards)
    console.log('lists changed:', lists)

    // axios
    //   .get(`/api/boards/${currBoard._id}/projectCards`, {
    //     headers: { 'x-auth-token': token },
    //   })
    //   .then((res) => {
    //     console.log('projectCards', res.data)
    //   })
    // const timelinesParamArr = []
    // const filteredLists = []
    // const filteredTimelines = []

    // const onlyUnique = (value, index, self) => {
    //   return self.indexOf(value) === index
    // }
    // cards.forEach((card) => {
    //   const [filteredTimeline] = timelines.filter((timeline) => {
    //     if (card?.list?.length > 0) {
    //       return timeline._id === card.list[0]
    //     } else return
    //   })
    //   const [filteredList] = lists.filter((list) => card.listId === list._id)
    //   const params = { card, list: filteredList, timeline: filteredTimeline }
    //   filteredLists.push(filteredList)
    //   filteredTimelines.push(filteredTimeline)
    //   timelinesParamArr.push(params)
    // })
    // const uniqueTimelines =
    //   filteredTimelines.length > 0 ? filteredTimelines.filter(onlyUnique) : null

    // const listsFromUniqueTimeline = uniqueTimelines
    //   ? uniqueTimelines.map((i) => {
    //       const [params] = lists.filter((list) => {
    //         return list._id === i.listId
    //       })
    //       return params?.name
    //     })
    //   : null

    //   const progress = listsFromTimelineId
    //     ? (listsFromTimelineId.reduce((acc, curVal) => {
    //         curVal === 'Checked' || curVal === 'Done' ? (acc += 1) : (acc = acc)
    //         return acc
    //       }, 0) /
    //         listsFromTimelineId.length) *
    //       100
    //     : 0
    // if (timelinesParamArr.length > 0) {
    //   timelinesParamArr.forEach((item) => {
    //   })
    // }
    // console.log('timelinesParamArr', timelinesParamArr)
    // console.log('uniqueTimelines', uniqueTimelines)
    // console.log('listsFromUniqueTimeline', listsFromUniqueTimeline)
    // if (submit) {
    //   console.log('submit?', submit)
    //   const getTimeline =
    //     timelines.length > 0
    //       ? timelines.filter((t) => t._id === editTaskValue.list)
    //       : null

    //   const getCardsWithTimelineId =
    //     cards.length > 0
    //       ? cards.filter((c) => {
    //           return c.list[0] === editTaskValue.list
    //         })
    //       : null

    //   const listsFromTimelineId = getCardsWithTimelineId
    //     ? getCardsWithTimelineId.map((i) => {
    //         const [params] = lists.filter((list) => {
    //           return list._id === i.listId
    //         })
    //         return params.name
    //       })
    //     : null

    //   const progress = listsFromTimelineId
    //     ? (listsFromTimelineId.reduce((acc, curVal) => {
    //         curVal === 'Checked' || curVal === 'Done' ? (acc += 1) : (acc = acc)
    //         return acc
    //       }, 0) /
    //         listsFromTimelineId.length) *
    //       100
    //     : 0

    //   console.log('progress', progress)

    //   const timelineParams = getTimeline.length ? getTimeline[0] : null

    //   console.log('cards', cards)
    //   getTimeline && console.log('getTimeline: ', getTimeline)
    //   timelineParams && console.log('timelineParams: ', timelineParams)
    //   getCardsWithTimelineId &&
    //     console.log('getCardsWithTimelineId: ', getCardsWithTimelineId)
    //   console.log('lenlistsFromTimelineIdth : ', listsFromTimelineId)
    //   console.log('length timeline: ', listsFromTimelineId.length)
    //   // setSubmit(false)
    // }
  }, [cards, lists])

  const submitHandlerUpdate = async () => {
    setEditable(false)
    // setSubmit(true)
    setEditTaskValue(editTaskValue)
    dispatch(updateCardById(task._id, editTaskValue))
    if (currBoard?.pic.length > 0) {
      await currBoard.pic.map(async (pic) => {
        const picData = await users.filter((user) => user._id === pic)[0]
        console.log('picData: ', { picData })
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
  console.log('submit status? ', submit)
  return (
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
                // <InputBase
                //   onChange={(e) => {
                //     e.preventDefault()
                //     setTitle(e.target.value)
                //   }}
                //   multiline
                //   fullWidth
                //   value={title}
                //   style={{ minHeight: '7px' }}
                //   autoFocus
                //   onFocus={(e) => {
                //     const val = e.target.value
                //     e.target.value = ''
                //     e.target.value = val
                //   }}
                //   onBlur={() => {
                //     setEditable(false)
                //     const text = title.trim().replace(/\s+/g, ' ')
                //     if (text === '') {
                //       setTitle(task.name)
                //       return
                //     }
                //     setTitle(text)
                //     dispatch(updateCardById(task._id, { name: text }))
                //     // eslint-disable-next-line no-param-reassign
                //     task.name = text
                //   }}
                // />
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
              ) : (
                <div style={{ position: 'relative' }}>
                  {showDelete && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                      }}
                    >
                      <IconButton
                        className={classes.delete}
                        size="small"
                        onClick={async () => {
                          setCard(false)
                          dispatch(deleteCardById(task._id))
                          const text = `${user.username} deleted card ${task.name}`
                          if (currBoard?.pic.length > 0) {
                            await currBoard.pic.map(async (pic) => {
                              const picData = await users.filter(
                                (user) => user._id === pic,
                              )[0]
                              console.log('picData: ', { picData })
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
  )
}
