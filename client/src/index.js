// import React from 'react'
// import ReactDOM from 'react-dom'
// import { Provider } from 'react-redux'
// import store from './store/configureStore'
// import AppRouter from './routers/AppRouter'
// import './index.css'

// const JSX = (
//   <Provider store={store}>
//     <AppRouter />
//   </Provider>
// )

// ReactDOM.render(
//   <React.StrictMode>{JSX}</React.StrictMode>,
//   document.getElementById('root'),
// )

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store/configureStore'
import * as serviceWorker from './serviceWorker'
import App from './App'

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
)

serviceWorker.unregister()
