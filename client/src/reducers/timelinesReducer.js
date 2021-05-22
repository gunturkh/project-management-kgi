import * as ACTIONS from '../actions/actions'

const initialState = {
  timelineLoading: true,
  timelines: [],
  currTimeline: [],
}
export const timelinesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST_TIMELINE:
      return { ...state, timelineLoading: true }
    case ACTIONS.GET_TIMELINES:
      return {
        ...state,
        timelineLoading: false,
        timelines: action.payload.timelines,
      }
    case ACTIONS.ADD_TIMELINE:
      return {
        ...state,
        timelines: [...state.timelines, action.payload.timeline],
      }
    case ACTIONS.UPDATE_TIMELINE: {
      const timelinesCopy = [...state.timelines]
      const targetIndex = timelinesCopy.findIndex(
        (timeline) => timeline._id === action.payload.timeline._id,
      )
      timelinesCopy[targetIndex] = action.payload.timeline
      return { ...state, timelines: timelinesCopy, timelineLoading: false }
    }
    case ACTIONS.DELETE_TIMELINE: {
      const timelinePrev = [...state.timelines]
      const index = timelinePrev.findIndex(
        (timeline) => timeline._id === action.payload.timeline._id,
      )
      timelinePrev.splice(index, 1)
      return { ...state, timelines: timelinePrev, timelineLoading: false }
    }
    case ACTIONS.ERROR_TIMELINE:
      return {
        ...state,
        timelineLoading: false,
        timelineError: action.payload.error,
      }
    default:
      return state
  }
}
