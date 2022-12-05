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
console.log(detectZoom)
const {ratio, screen}= detectZoom()

const root = createRoot(document.getElementById('root'));

//console.log('m', ratio)
//console.log('s', screen)
console.log(window.outerHeight)
console.log(window.outerWidth)
console.log(window.innerHeight)
document.body.style.height = window.outerHeight*(Number(ratio) / 100) + 'px'
document.body.style.width = window.outerWidth*(Number(ratio) / 100) + 'px'
//document.body.style.transform=`scale(${100 / Number(ratio)})` 
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <ConfigProvider {...antdconfig}>
      <App />
    </ConfigProvider>
    </PersistGate>
  </Provider>

)
