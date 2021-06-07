import * as ACTIONS from '../actions/actions'

const initialState = {
  token: undefined,
  currentCompany: {
    companyName: '',
    companyEmail: '',
    companyAddress: '',
    companyLogo: '',
  },
  company: {
    companyName: '',
    companyEmail: '',
    companyAddress: '',
    companyLogo: '',
  },
  companies: [],
}

export const companyReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_COMPANY:
      return {
        ...state,
        company: action.payload.company,
      }
    case ACTIONS.GET_COMPANY_BY_ID:
      return {
        ...state,
        loading: false,
        company: action.payload.company,
      }
    case ACTIONS.GET_COMPANIES:
      return {
        ...state,
        companies: action.payload.companies,
      }
    case ACTIONS.DELETE_COMPANY:
      return {
        ...state,
        companies: action.payload.companies,
      }
    case ACTIONS.UPDATE_COMPANY: {
      const companiesCopy = [...state.companies]
      const targetIndex = companiesCopy.findIndex(
        (company) => company._id === action.payload.company._id,
      )
      companiesCopy[targetIndex] = action.payload.company
      return {
        ...state,
        companies: companiesCopy,
        currentCompany: action.payload.company,
      }
    }
    case ACTIONS.ERROR_COMPANY:
      return { ...state, error: action.payload.error }
    default:
      return state
  }
}
