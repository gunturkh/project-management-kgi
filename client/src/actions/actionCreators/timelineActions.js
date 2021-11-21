import axios from 'axios'
import * as ACTIONS from '../actions'

const BASE_URL = '/api/timelines/'

export const fetchTimelineByBoardId = (boardId, token) => (dispatch) => {
  dispatch({ type: ACTIONS.MAKE_REQUEST_TIMELINE })
  axios
    .get(BASE_URL + boardId, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({
        type: ACTIONS.GET_TIMELINES,
        payload: { timelines: res.data },
      })
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_TIMELINE, payload: { error: e } })
    })
}

export const fetchTimelineByTimelineId = (timelineId, token) => (dispatch) => {
  dispatch({ type: ACTIONS.MAKE_REQUEST_TIMELINE })
  axios
    .get(BASE_URL + timelineId, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({
        type: ACTIONS.GET_TIMELINE_BY_ID,
        payload: { currTimelines: res.data },
      })
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_TIMELINE, payload: { error: e } })
    })
}

export const createNewTimelines = (params, token) => (dispatch) => {
  dispatch({ type: ACTIONS.POST_REQUEST_TIMELINE })
  console.log('create timeline token', token)
  return new Promise((resolve, reject) => {
    axios
      .post(BASE_URL, params, {
        headers: { 'x-auth-token': token },
      })
      .then((res) => {
        dispatch({ type: ACTIONS.ADD_TIMELINE, payload: { timeline: res.data } })
        resolve(res)
      })
      .catch((e) => {
        if (e.message === 'Network Error') {
          dispatch({
            type: ACTIONS.ERROR_TIMELINE,
            payload: { error: e.message },
          })
          reject(e)
        }
        else if (e.response.status === 422) {
          dispatch({ type: ACTIONS.VALIDATION_ERROR_TIMELINE })
          reject(e)
        }
      })
  })
}

export const updateTimelineById = (id, params) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .patch(BASE_URL + id, params)
      .then((res) => {
        dispatch({
          type: ACTIONS.UPDATE_TIMELINE,
          payload: { timeline: res.data },
        })
        resolve(res)
      })
      .catch((e) => {
        dispatch({ type: ACTIONS.ERROR_TIMELINE, payload: { error: e.message } })
        reject(e)
      })
  })
}

export const updateTimelineByBoardId = (id, params) => (dispatch) => {
  console.log('updateTimelineByBoardId:', id, params)
  return new Promise((resolve, reject) => {
  axios
    .patch(BASE_URL + id, params)
    .then((res) => {
      dispatch({
        type: ACTIONS.UPDATE_TIMELINE,
        payload: { timeline: res.data },
      })
      resolve(res)
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_TIMELINE, payload: { error: e.message } })
      reject(e)
    })
    })
}

export const deleteTimelineById = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
  axios
    .delete(BASE_URL + id)
    .then((res) => {
      dispatch({
        type: ACTIONS.DELETE_TIMELINE,
        payload: { timeline: res.data },
      })
      resolve(res)
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_TIMELINE, payload: { error: e.message } })
      reject(e)
    })
    })

}
