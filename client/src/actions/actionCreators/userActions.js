import axios from 'axios'
import * as ACTIONS from '../actions'

const BASE_URL = '/api/user/'
const CLOUDINARY_BASE_URL = 'https://api.cloudinary.com/v1_1/dzl9cgxtk'
const preset = 'avatarkgi'

export const fetchAllUsersInfo = (token) => (dispatch) => {
  dispatch({ type: ACTIONS.USERS_REQUEST })
  axios
    .get(`${BASE_URL}list`, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({
        type: ACTIONS.GET_USERS,
        payload: { users: res.data, token },
      })
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_USER, payload: { error: e.message } })
    })
}

export const fetchUserInfo = (token) => (dispatch) => {
  dispatch({ type: ACTIONS.USER_REQUEST })
  axios
    .get(BASE_URL, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({
        type: ACTIONS.GET_USER,
        payload: { user: res.data, token },
      })
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_USER, payload: { error: e.message } })
    })
}

export const checkTokenValidity = (token) => (dispatch) => {
  dispatch({ type: ACTIONS.TOKEN_REQUEST })
  axios
    .post(`${BASE_URL}tokenIsValid`, null, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({
        type: ACTIONS.TOKEN_RESPONSE,
        payload: { isTokenValid: res.data, token },
      })
    })
    .catch((e) => {
      dispatch({
        type: ACTIONS.TOKEN_RESPONSE_ERROR,
        payload: { error: e.message },
      })
    })
}

export const loginUser = (params) => (dispatch) => {
  dispatch({ type: ACTIONS.LOGIN_REQUEST })
  axios
    .post(`${BASE_URL}login`, params)
    .then((res) => {
      console.log('res:', res)
      dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: { user: res.data } })
    })
    .catch((e) => {
      dispatch({
        type: ACTIONS.LOGIN_FAILED,
        payload: { error: e.response.data.msg },
      })
    })
  return Promise.resolve()
}

export const registerUser = (params) => (dispatch) => {
  dispatch({ type: ACTIONS.REGISTER_REQUEST })
  axios
    .post(`${BASE_URL}register`, params)
    .then((res) => {
      dispatch({
        type: ACTIONS.REGISTER_SUCCESS,
        payload: { user: res.data },
      })
    })
    .catch((e) => {
      dispatch({
        type: ACTIONS.REGISTER_FAILED,
        payload: { error: e.response.data.msg },
      })
    })
  return Promise.resolve()
}

export const uploadAvatarUser = (params) => (dispatch) => {
  // dispatch({ type: ACTIONS.REGISTER_REQUEST })
  const formData = new FormData()
  formData.append('file', params)
  formData.append('upload_preset', preset)
  // const config = {
  //   headers: {
  //     'content-type': 'multipart/form-data',
  //   },
  // }
  axios
    // .post(`${BASE_URL}upload`, formData, config)
    .post(`${CLOUDINARY_BASE_URL}/image/upload`, formData)
    .then((res) => {
      dispatch({
        type: ACTIONS.REGISTER_SUCCESS,
        payload: { user: res.data },
      })
    })
    .catch((e) => {
      console.log('error upload', e)
      // dispatch({
      //   type: ACTIONS.REGISTER_FAILED,
      //   payload: { error: e.response.data.msg },
      // })
    })
  return Promise.resolve()
}

export const updateUser = (params) => (dispatch) => {
  // dispatch({ type: ACTIONS.UPDATE_REQUEST })
  axios
    .patch(`${BASE_URL}update`, params)
    .then((res) => {
      console.log('res update: ', res)
      dispatch({
        type: ACTIONS.UPDATE_SUCCESS,
        payload: { user: res.data },
      })
    })
    .catch((e) => {
      console.log('error update: ', e)
      dispatch({
        type: ACTIONS.UPDATE_FAILED,
        payload: { error: e.response.data.msg },
      })
    })
  return Promise.resolve()
}

export const updateUserNotification = (params) => (dispatch) => {
  // dispatch({ type: ACTIONS.UPDATE_REQUEST })
  axios
    .patch(`${BASE_URL}update-notification`, params)
    .then((res) => {
      console.log('res update: ', res)
      dispatch({
        type: ACTIONS.UPDATE_NOTIFICATION_SUCCESS,
        payload: { users: res.data },
      })
    })
    .catch((e) => {
      console.log('error update: ', e)
      // dispatch({
      //   type: ACTIONS.UPDATE_FAILED,
      //   payload: { error: e.response.data.msg },
      // })
    })
  return Promise.resolve()
}

export const updateUserNotificationStatusById = (params) => (dispatch) => {
  // dispatch({ type: ACTIONS.UPDATE_REQUEST })
  axios
    .patch(`${BASE_URL}update-notification-status`, params)
    .then((res) => {
      console.log('res update: ', res)
      dispatch({
        type: ACTIONS.UPDATE_NOTIFICATION_SUCCESS,
        payload: { users: res.data },
      })
    })
    .catch((e) => {
      console.log('error update: ', e)
      // dispatch({
      //   type: ACTIONS.UPDATE_FAILED,
      //   payload: { error: e.response.data.msg },
      // })
    })
  return Promise.resolve()
}

export const deleteUserById = (data, token) => (dispatch) => {
  const { id } = data
  axios
    .delete(BASE_URL + id, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      console.log('res delete: ', res)
      dispatch({
        type: ACTIONS.DELETE_USER,
        payload: {
          users: res.data,
          token,
        },
      })
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_USER, payload: { error: e.message } })
    })
  return Promise.resolve()
}

export const logoutUser = () => (dispatch) => {
  dispatch({ type: ACTIONS.LOGOUT_USER })
}
