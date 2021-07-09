import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store/configureStore'
// import { ChakraProvider } from '@chakra-ui/react'
import * as serviceWorker from './serviceWorker'
import App from './App'

ReactDOM.render(
  // <ChakraProvider>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  // </ChakraProvider>,
  document.getElementById('root'),
)

serviceWorker.unregister()
