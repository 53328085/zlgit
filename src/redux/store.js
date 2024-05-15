import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {persistStore, persistReducer} from 'redux-persist' // redux 持久化
import storage from 'redux-persist/lib/storage' // redux 持久化
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user' 
import system from './systemconfig' //根据IP或域名获取系统配置
// import theme from './theme' // 配置 antd 
// import params from './params' // 查询参数， 表格、列表显示模式等
import zltest from './reduxTest' // 测试用
import {api} from '../pages/test/apiBasic'
const reducers = combineReducers({
  user,
  system,
 // theme,
 // params,
  zltest,
  [api.reducerPath]: api.reducer
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
  middleware: [thunk],
  // middleware:  getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware).concat(thunk)
  
})

/* export default configureStore({
   reducer: {
    user,
    system,
    theme
   },
  // middleware:[composeWithDevTools] 引用‘composeWithDevTools’导致异步action出错
}) */
