/* 纯redux */

import React from 'react'
import {createRoot} from 'react-dom/client';
import { Provider } from 'react-redux'
import { legacy_createStore as createStore } from 'redux'
import store from './redux/store'
//import todoApp from './store/reducers'
import App from './components/App'
import './index.css'
const root = createRoot(document.getElementById('root'));
//let store = createStore(todoApp)

root.render(
  <Provider store={store}>
    <App />
  </Provider>

)

/* store.subscribe(() => // 次处不起作用！！！
{
  console.log(1111)
  root.render(
  <App />
  )}
  )
 */