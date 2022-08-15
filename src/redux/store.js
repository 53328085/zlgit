import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {persistStore, persistReducer} from 'redux-persist' // redux 持久化
import storage from 'redux-persist/lib/storage' // redux 持久化
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user' 
import system from './systemconfig' //根据IP或域名获取系统配置
import theme from './them' // 配置 antd 

const reducers = combineReducers({
  user,
  system,
  theme
})
const persistConfig = {
  key: 'redux_state',
  storage,
  blacklist: ['user.loading']
}
const persistedReducer = persistReducer(persistConfig, reducers);
export default configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

/* export default configureStore({
   reducer: {
    user,
    system,
    theme
   },
  // middleware:[composeWithDevTools] 引用‘composeWithDevTools’导致异步action出错
}) */
