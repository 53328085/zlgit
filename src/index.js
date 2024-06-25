import React from 'react'
import {createRoot} from 'react-dom/client';
import { Provider } from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {persistStore} from 'redux-persist'
import store from './redux/store' 
import './assets/css/theme.less' // 静态定制主题
import 'antd/dist/antd.variable.min.css' //通过ConfigProvider 动态定制主体
import './assets/css/index.less'
//import './assets/css/print.css'
import './i18n' //国际化
import App from './App'
 
let persistor = persistStore(store)
 
const root = createRoot(document.getElementById('root'));

 
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>

)
