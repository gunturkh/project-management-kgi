import * as ACTIONS from '../actions/actions'

const initialState = {
  cardLoading: true,
  cards: [],
  allCards: [],
}
export const cardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST_CARD:
      return { ...state, cardLoading: true }
    case ACTIONS.POST_REQUEST_CARD:
      return { ...state, cardLoading: true }
    case ACTIONS.GET_CARDS:
      return { ...state, cardLoading: false, cards: action.payload.cards }
    case ACTIONS.GET_ALL_CARDS:
      return { ...state, cardLoading: false, allCards: action.payload.allCards }
    case ACTIONS.ADD_CARD:
      return {
        ...state,
        cardLoading: false,
        cards: [...state.cards, action.payload.card],
      }
    case ACTIONS.UPDATE_CARD: {
      const cardsCopy = [...state.cards]
      const targetIndex = cardsCopy.findIndex(
        (card) => card._id === action.payload.card._id,
      )
      cardsCopy[targetIndex] = action.payload.card
      console.log('cardsCopy:', cardsCopy)
      return { ...state, cards: cardsCopy, cardLoading: false }
    }
    // case ACTIONS.UPDATE_CARD_TIMELINE: {
    //   const cardsCopy = [...state.cards]
    //   const targetIndex = cardsCopy.findIndex(
    //     (card) => card._id === action.payload.card._id,
    //   )
    //   cardsCopy[targetIndex] = action.payload.card
    //   return { ...state, cards: action.payload, cardLoading: false }
    // }
    case ACTIONS.DELETE_CARD: {
      const cardPrev = [...state.cards]
      const index = cardPrev.findIndex(
        (card) => card._id === action.payload.card._id,
      )
      cardPrev.splice(index, 1)
      return { ...state, cards: cardPrev, cardLoading: false }
    }
    case ACTIONS.ERROR_CARD:
      return { ...state, cardLoading: false, cardError: action.payload.error }
    case ACTIONS.VALIDATION_ERROR_CARD:
      return { ...state, cardLoading: false }
    default:
      return state
  }
}
