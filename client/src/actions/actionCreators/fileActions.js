import axios from 'axios'
import * as ACTIONS from '../actions'

const BASE_URL = '/files/'

export const fetchFiles = () => (dispatch) => {
  axios
    .get(BASE_URL)
    .then((res) => {
      dispatch({
        type: ACTIONS.GET_FILES,
        payload: { files: res },
      })
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_FILE, payload: { error: e } })
    })
}
