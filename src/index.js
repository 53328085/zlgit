import React from 'react'
import {createRoot} from 'react-dom/client';
import { Provider } from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {persistStore} from 'redux-persist'
import store from './redux/store'
import {ConfigProvider} from 'antd'
import 'antd/dist/antd.variable.min.css'
import './assets/css/index.less'
import App from './App'
import antdconfig from './antdconfig';
import {detectZoom} from './hooks/detectZoom'
let persistor = persistStore(store)
const {ratio, screen}= detectZoom()
const root = createRoot(document.getElementById('root'));
window.addEventListener('resize', () => {
  document.body.style.height = window.innerHeight*(Number(ratio) / 100) + 'px'
  document.body.style.width = window.outerWidth*(Number(ratio) / 100) + 'px'
})
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <ConfigProvider {...antdconfig}>
      <App />
    </ConfigProvider>
    </PersistGate>
  </Provider>

)
