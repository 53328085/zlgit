import React from 'react'
import {createRoot} from 'react-dom/client';
import { Provider } from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {persistStore} from 'redux-persist'
import store from './redux/store'
import {ConfigProvider} from 'antd'
import 'antd/dist/antd.variable.min.css'
import './assets/css/index.less'
import App from './app'
import antdconfig from './antdconfig';
let persistor = persistStore(store)
const root = createRoot(document.getElementById('root'));


root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <ConfigProvider {...antdconfig}>
      <App />
    </ConfigProvider>
    </PersistGate>
  </Provider>

)
