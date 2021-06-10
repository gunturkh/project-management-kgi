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
  companyLoading: true,
}

export const companyReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST_COMPANY:
      return { ...state, companyLoading: true }
    case ACTIONS.GET_COMPANY:
      return {
        ...state,
        company: action.payload.company,
        companyLoading: false,
      }
    case ACTIONS.GET_COMPANY_BY_ID:
      return {
        ...state,
        loading: false,
        company: action.payload.company,
        companyLoading: false,
      }
    case ACTIONS.GET_COMPANIES:
      return {
        ...state,
        companies: action.payload.companies,
        companyLoading: false,
      }
    case ACTIONS.DELETE_COMPANY:
      return {
        ...state,
        companies: action.payload.companies,
        companyLoading: false,
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
        companyLoading: false,
      }
    }
    case ACTIONS.ERROR_COMPANY:
      return { ...state, error: action.payload.error, companyLoading: false }
    default:
      return state
  }
}
