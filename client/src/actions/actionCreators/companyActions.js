import axios from 'axios'
import * as ACTIONS from '../actions'

const BASE_URL = '/api/company/'

export const fetchAllCompaniesInfo = (token) => (dispatch) => {
  dispatch({ type: ACTIONS.MAKE_REQUEST_COMPANY })
  axios
    .get(`${BASE_URL}`, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({
        type: ACTIONS.GET_COMPANIES,
        payload: { companies: res.data, token },
      })
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_COMPANY, payload: { error: e.message } })
    })
}

export const fetchCompanyById = (id, token) => (dispatch) => {
  dispatch({ type: ACTIONS.MAKE_REQUEST_COMPANY })
  axios
    .get(BASE_URL + id, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({
        type: ACTIONS.GET_COMPANY_BY_ID,
        payload: { company: res.data, token },
      })
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_COMPANY, payload: { error: e.message } })
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

export const addCompany = (params) => (dispatch) => {
  // dispatch({ type: ACTIONS.REGISTER_REQUEST })
  return new Promise((resolve, reject) => {
  axios
    .post(`${BASE_URL}`, params)
    .then((res) => {
      dispatch({
        type: ACTIONS.ADD_COMPANY,
        payload: { company: res.data },
      })
      resolve(res)
    })
    .catch((e) => {
      dispatch({
        type: ACTIONS.ERROR_COMPANY,
        payload: { error: e.response.data.msg },
      })
      reject(e)
    })
    })
}

export const updateCompanyById = (id, params, token) => (dispatch) => {
  dispatch({ type: ACTIONS.MAKE_REQUEST_COMPANY })
  return new Promise((resolve, reject) => {
    axios
      .patch(`${BASE_URL}/${id}`, params, {
        headers: { 'x-auth-token': token },
      })
      .then((res) => {
        console.log('res update: ', res)
        dispatch({
          type: ACTIONS.UPDATE_COMPANY,
          payload: { company: res.data },
        })
        resolve(res)
      })
      .catch((e) => {
        console.log('error update: ', e)
        dispatch({
          type: ACTIONS.ERROR_COMPANY,
          payload: { error: e.response.data.msg },
        })
        reject(e)
      })
  })
}

export const deleteCompanyById = (id, token) => (dispatch) => {
  dispatch({ type: ACTIONS.MAKE_REQUEST_COMPANY })
  return new Promise((resolve, reject) => {
  axios
    .delete(BASE_URL + id, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      console.log('res delete: ', res)
      dispatch({
        type: ACTIONS.DELETE_COMPANY,
        payload: {
          companies: res.data,
          token,
        },
      })
      resolve(res)
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_COMPANY, payload: { error: e.message } })
      reject(e)
    })
    })
}
