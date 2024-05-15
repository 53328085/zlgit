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
import {apiSlice} from './rtkquery'
//import {apiSlice} from '../pages/test/apiBasic'
import {ProjectList} from "@api/api"
const reducers = combineReducers({
  user,
  system,
 // theme,
 // params,
  zltest,
[apiSlice.reducerPath]: apiSlice.reducer
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
 // middleware: [thunk],
 middleware: getDefaultMiddleware => {
  return getDefaultMiddleware().concat(apiSlice.middleware)
 }
  
  
  
})

 