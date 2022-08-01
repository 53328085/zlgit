import {configureStore} from '@reduxjs/toolkit'
import {composeWithDevTools} from 'redux-devtools-extension'
import userReduer from './user' 
export default configureStore({
   reducer: {
    user: userReduer
   },
  // middleware:[composeWithDevTools] 引用‘composeWithDevTools’导致异步action出错
})
