import {configureStore} from '@reduxjs/toolkit'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user' 
import system from './systemconfig' //根据IP或域名获取系统配置
import theme from './them' // 配置 antd 
export default configureStore({
   reducer: {
    user,
    system,
    theme
   },
  // middleware:[composeWithDevTools] 引用‘composeWithDevTools’导致异步action出错
})
