import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import thunk from 'redux-thunk'
import storage from 'redux-persist/lib/storage'
import { boardReducer } from '../reducers/boardReducer'
import { listsReducer } from '../reducers/listsReducer'
import { cardsReducer } from '../reducers/cardsReducer'
import { activityReducer } from '../reducers/activityReducer'
import { imageReducer } from '../reducers/imageReducer'
import { userReducer } from '../reducers/userReducer'
import * as ACTIONS from '../actions/actions'

const persistConfig = {
  key: 'reducer',
  storage,
}

const appReducer = combineReducers({
  boards: boardReducer,
  lists: listsReducer,
  cards: cardsReducer,
  activities: activityReducer,
  images: imageReducer,
  user: userReducer,
})

const rootReducer = (state, action) => {
  if (action.type === ACTIONS.LOGOUT_USER) {
    // eslint-disable-next-line no-param-reassign
    state = undefined
  }
  return appReducer(state, action)
}

const presistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(
  presistedReducer,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
  ),
)

const persistor = persistStore(store)
export { persistor, store }

// export default createStore(
//   rootReducer,
//   compose(
//     applyMiddleware(thunk),
//     window.__REDUX_DEVTOOLS_EXTENSION__ &&
//       window.__REDUX_DEVTOOLS_EXTENSION__(),
//   ),
// )
