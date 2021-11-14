import axios from 'axios'
import * as ACTIONS from '../actions'

const BASE_URL = '/api/cards/'

export const fetchAllCards = (token) => (dispatch) => {
  dispatch({ type: ACTIONS.MAKE_REQUEST_CARD })
  axios
    .get(BASE_URL, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({ type: ACTIONS.GET_CARDS, payload: { cards: res.data } })
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_CARD, payload: { error: e } })
    })
}

export const fetchAllCardsV2 = (token) => (dispatch) => {
  dispatch({ type: ACTIONS.MAKE_REQUEST_CARD })
  axios
    .get(BASE_URL, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({ type: ACTIONS.GET_ALL_CARDS, payload: { allCards: res.data } })
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_CARD, payload: { error: e } })
    })
}

export const createNewCard = (params, token) => (dispatch) => {
  dispatch({ type: ACTIONS.POST_REQUEST_CARD })
  axios
    .post(BASE_URL, params, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({ type: ACTIONS.ADD_CARD, payload: { card: res.data } })
    })
    .catch((e) => {
      if (e.message === 'Network Error')
        dispatch({ type: ACTIONS.ERROR_CARD, payload: { error: e.message } })
      else if (e.response.status === 422)
        dispatch({ type: ACTIONS.VALIDATION_ERROR_CARD })
    })
  return Promise.resolve()
}

export const updateCardById = (id, params) => (dispatch) => {
  axios
    .patch(BASE_URL + id, params)
    .then((res) => {
      dispatch({ type: ACTIONS.UPDATE_CARD, payload: { card: res.data } })
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_CARD, payload: { error: e.message } })
    })
  return Promise.resolve()
}

export const deleteCardById = (id) => (dispatch) => {
  axios
    .delete(BASE_URL + id)
    .then((res) => {
      dispatch({ type: ACTIONS.DELETE_CARD, payload: { card: res.data } })
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_CARD, payload: { error: e.message } })
    })
}
