import * as ACTIONS from '../actions/actions'

const initialState = {
  token: undefined,
  user: {
    id: undefined,
    username: undefined,
    role: undefined,
    avatar: undefined,
    name: undefined,
    position: undefined,
    notification: undefined,
    pinned: undefined,
  },
  users: [],
  isValid: false,
  successLogin: false,
  requestLogin: true,
  successRegister: false,
  requestRegister: true,
  userRequest: true,
  tokenRequest: true,
  error: null,
  updateError: null,
  updateStatus: null,
}

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.TOKEN_REQUEST:
      return { ...state, tokenRequest: true }
    case ACTIONS.TOKEN_RESPONSE:
      return {
        ...state,
        isValid: action.payload.isTokenValid,
        token: action.payload.token,
        tokenRequest: false,
      }
    case ACTIONS.USER_REQUEST:
      return { ...state, userRequest: true }
    case ACTIONS.USERS_REQUEST:
      return { ...state, userRequest: true }
    case ACTIONS.GET_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        userRequest: false,
      }
    case ACTIONS.GET_USERS:
      return {
        ...state,
        users: action.payload.users,
        token: action.payload.token,
        userRequest: false,
        tokenRequest: false,
      }
    case ACTIONS.DELETE_USER:
      return {
        ...state,
        users: action.payload.users,
        token: action.payload.token,
        userRequest: false,
        tokenRequest: false,
      }
    case ACTIONS.LOGIN_REQUEST:
      return { ...state, requestLogin: true, successLogin: false }
    case ACTIONS.REGISTER_REQUEST:
      return {
        ...state,
        tokenRequest: true,
        requestRegister: true,
        successRegister: false,
        tokenRequest: true,
      }
    case ACTIONS.LOGIN_FAILED:
      return {
        ...state,
        successLogin: false,
        requestLogin: false,
        loginError: action.payload.error,
      }
    case ACTIONS.REGISTER_FAILED:
      return {
        ...state,
        successRegister: false,
        requestRegister: false,
        tokenRequest: false,
        registerError: action.payload.error,
      }
    case ACTIONS.UPDATE_FAILED:
      return {
        ...state,
        updateError: action.payload.error,
        updateStatus: false,
      }
    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.user.token,
        user: {
          id: action.payload.user.user.id,
          username: action.payload.user.user.username,
          role: action.payload.user.user.role,
          avatar: action.payload.user.user.avatar,
          name: action.payload.user.user.name,
          position: action.payload.user.user.position,
          notification: action.payload.user.user.notification,
          pinned: action.payload.user.user.pinned,
        },
        requestLogin: false,
        successLogin: true,
        isValid: true,
        loginError: '',
      }
    case ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        // user: {
        //   id: action.payload.user._id,
        //   username: action.payload.user.username,
        // },
        users: [...state.users, action.payload.user],
        requestRegister: false,
        successRegister: true,
        tokenRequest: false,
        error: null,
      }
    case ACTIONS.UPDATE_SUCCESS:
      return {
        ...state,
        user: {
          id: action.payload.user._id,
          username: action.payload.user.username,
          role: action.payload.user.role,
          avatar: action.payload.user.avatar,
          name: action.payload.user.name,
          position: action.payload.user.position,
          pinned: action.payload.user.pinned,
        },
        updateError: null,
        updateStatus: true,
      }
    case ACTIONS.UPDATE_NOTIFICATION_SUCCESS:
      return {
        ...state,
        users: action.payload.users,
      }
    case ACTIONS.ERROR_USER:
      return { ...state, error: action.payload.error }
    case ACTIONS.TOKEN_RESPONSE_ERROR:
      return { ...state, tokenError: action.payload.error }
    default:
      return state
  }
}
