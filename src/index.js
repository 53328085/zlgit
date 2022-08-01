
import React from 'react'
import {createRoot} from 'react-dom/client';
import { Provider } from 'react-redux'
import store from './redux/store'
import {ConfigProvider} from 'antd'
import antdconfgi from './antdconfig'
import './index.css'
import 'antd/dist/antd.variable.min.css'
import App from './app'
import antdconfig from './antdconfig';

const root = createRoot(document.getElementById('root'));


root.render(
  <Provider store={store}>
    <ConfigProvider {...antdconfig}>
      <App />
    </ConfigProvider>
  </Provider>

)
