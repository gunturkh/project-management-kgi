import axios from 'axios'
import * as ACTIONS from '../actions'

const BASE_URL = '/api/company/'

export const fetchAllCompaniesInfo = (token) => (dispatch) => {
  // dispatch({ type: ACTIONS.COMPANY_REQUEST })
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
  // dispatch({ type: ACTIONS.COMPANY_REQUEST })
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
  axios
    .post(`${BASE_URL}`, params)
    .then((res) => {
      dispatch({
        type: ACTIONS.ADD_COMPANY,
        payload: { company: res.data },
      })
    })
    .catch((e) => {
      dispatch({
        type: ACTIONS.ERROR_COMPANY,
        payload: { error: e.response.data.msg },
      })
    })
  return Promise.resolve()
}

export const updateCompanyById = (id, params, token) => (dispatch) => {
  // dispatch({ type: ACTIONS.UPDATE_REQUEST })
  axios
    .patch(`${BASE_URL}+${id}`, params, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      console.log('res update: ', res)
      dispatch({
        type: ACTIONS.UPDATE_COMPANY,
        payload: { company: res.data },
      })
    })
    .catch((e) => {
      console.log('error update: ', e)
      dispatch({
        type: ACTIONS.ERROR_COMPANY,
        payload: { error: e.response.data.msg },
      })
    })
  return Promise.resolve()
}

export const deleteCompanyById = (id, token) => (dispatch) => {
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
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_COMPANY, payload: { error: e.message } })
    })
  return Promise.resolve()
}
