import React from 'react'
import {createRoot} from 'react-dom/client';
import { Provider } from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {persistStore} from 'redux-persist'
import store from './redux/store' 
import 'antd/dist/antd.css'
// import 'antd/dist/antd.min.css'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn'); 
import ConfigProvider  from './antdconfig';
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
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
    </PersistGate>
  </Provider>

)
