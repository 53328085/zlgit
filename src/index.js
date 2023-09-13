import React from 'react'
import {createRoot} from 'react-dom/client';
import { Provider } from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {persistStore} from 'redux-persist'
import store from './redux/store' 
import './assets/css/theme.less' // 静态定制主题
import 'antd/dist/antd.variable.min.css' //通过ConfigProvider 动态定制主体
import './assets/css/index.less'
import './assets/css/print.css'
import App from './App'
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
      <App />
    </PersistGate>
  </Provider>

)
