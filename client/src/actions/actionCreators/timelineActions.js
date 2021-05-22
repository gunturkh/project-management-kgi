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
  axios
    .post(BASE_URL, params, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({ type: ACTIONS.ADD_TIMELINE, payload: { timeline: res.data } })
    })
    .catch((e) => {
      if (e.message === 'Network Error')
        dispatch({
          type: ACTIONS.ERROR_TIMELINE,
          payload: { error: e.message },
        })
      else if (e.response.status === 422)
        dispatch({ type: ACTIONS.VALIDATION_ERROR_TIMELINE })
    })
}

export const updateTimelineById = (id, params) => (dispatch) => {
  axios
    .patch(BASE_URL + id, params)
    .then((res) => {
      dispatch({
        type: ACTIONS.UPDATE_TIMELINE,
        payload: { timeline: res.data },
      })
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_TIMELINE, payload: { error: e.message } })
    })
}

export const updateTimelineByBoardId = (id, params) => (dispatch) => {
  console.log('updateTimelineByBoardId:', id, params)
  axios
    .patch(BASE_URL + id, params)
    .then((res) => {
      dispatch({
        type: ACTIONS.UPDATE_TIMELINE,
        payload: { timeline: res.data },
      })
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_TIMELINE, payload: { error: e.message } })
    })
}

export const deleteTimelineById = (id) => (dispatch) => {
  axios
    .delete(BASE_URL + id)
    .then((res) => {
      dispatch({
        type: ACTIONS.DELETE_TIMELINE,
        payload: { timeline: res.data },
      })
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_TIMELINE, payload: { error: e.message } })
    })
}
