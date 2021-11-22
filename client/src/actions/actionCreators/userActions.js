import axios from 'axios'
import * as ACTIONS from '../actions'

const BASE_URL = '/api/user/'
const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dzl9cgxtk/image/upload'
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
  return new Promise((resolve, reject) => {
    axios
      .get(BASE_URL, {
        headers: { 'x-auth-token': token },
      })
      .then((res) => {
        dispatch({
          type: ACTIONS.GET_USER,
          payload: { user: res.data, token },
        })
        resolve(res)
      })
      .catch((e) => {
        dispatch({ type: ACTIONS.ERROR_USER, payload: { error: e.message } })
        reject(e)
      })
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
  return new Promise((resolve, reject) => {
    axios
      .post(`${BASE_URL}login`, params)
      .then((res) => {
        dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: { user: res.data } })
        resolve(res)
      })
      .catch((e) => {
        dispatch({
          type: ACTIONS.LOGIN_FAILED,
          payload: { error: e.response.data.msg },
        })
        reject(e)
      })
  })
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
  const options = {
    method: 'POST',
    body: formData,
  }
  return new Promise((resolve, reject) => {
    // axios
    // .post(`${CLOUDINARY_BASE_URL}`, formData)
    // .post(`${BASE_URL}upload`, formData, config)
    fetch(`${cloudinaryUrl}`, options)
      .then((res) => {
        dispatch({
          type: ACTIONS.REGISTER_SUCCESS,
          payload: { user: res.data },
        })
        resolve(res)
      })
      .catch((e) => {
        dispatch({
          type: ACTIONS.REGISTER_FAILED,
          payload: { error: e.response.data.msg },
        })
        reject(e)
      })
  })
}

export const updateUser = (params) => (dispatch) => {
  // dispatch({ type: ACTIONS.UPDATE_REQUEST })
  return new Promise((resolve, reject) => {
    axios
      .patch(`${BASE_URL}update`, params)
      .then((res) => {
        dispatch({
          type: ACTIONS.UPDATE_SUCCESS,
          payload: { user: res.data },
        })
        resolve(res)
      })
      .catch((e) => {
        dispatch({
          type: ACTIONS.UPDATE_FAILED,
          payload: { error: e.response.data.msg },
        })
        reject(e)
      })
  })
}

export const updateUserNotification = (params) => (dispatch) => {
  // dispatch({ type: ACTIONS.UPDATE_REQUEST })
  axios
    .patch(`${BASE_URL}update-notification`, params)
    .then((res) => {
      dispatch({
        type: ACTIONS.UPDATE_NOTIFICATION_SUCCESS,
        payload: { users: res.data },
      })
    })
    .catch((e) => {
      dispatch({
        type: ACTIONS.UPDATE_FAILED,
        payload: { error: e.response.data.msg },
      })
    })
  return Promise.resolve()
}

export const updateUserNotificationStatusById = (params) => (dispatch) => {
  // dispatch({ type: ACTIONS.UPDATE_REQUEST })
  axios
    .patch(`${BASE_URL}update-notification-status`, params)
    .then((res) => {
      dispatch({
        type: ACTIONS.UPDATE_NOTIFICATION_SUCCESS,
        payload: { users: res.data },
      })
    })
    .catch((e) => {
      dispatch({
        type: ACTIONS.UPDATE_FAILED,
        payload: { error: e.response.data.msg },
      })
    })
  return Promise.resolve()
}

export const deleteUserById = (data, token) => (dispatch) => {
  const { id } = data
  return new Promise((resolve, reject) => {
    axios
      .delete(BASE_URL + id, {
        headers: { 'x-auth-token': token },
      })
      .then((res) => {
        dispatch({
          type: ACTIONS.DELETE_USER,
          payload: {
            users: res.data,
            token,
          },
        })
        resolve(res)
      })
      .catch((e) => {
        dispatch({ type: ACTIONS.ERROR_USER, payload: { error: e.message } })
        reject(e)
      })
  })
}

export const logoutUser = () => (dispatch) => {
  dispatch({ type: ACTIONS.LOGOUT_USER })
}
