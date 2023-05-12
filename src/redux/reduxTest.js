import { createSlice, nanoid, createAsyncThunk} from '@reduxjs/toolkit'
import {Login} from '../axios/api'
import zhCN from 'antd/es/locale/zh_CN'
 
const initialState = {
  
  componentSize: 'large',
  locale: zhCN,
  zltest: 'zjxszl',
  sysinfo: {},
  status: '加载中',
  error: 'error'
}
export const testthunk = (arg) => { // 同步 thunk
   return (dispatch, getState) => {
     const initState = getState()
     console.log(initState)
     dispatch(setzl(arg))
     
   }

}
export const asyncthunk = createAsyncThunk('zltest/systeminfo', async (params) => { // 异步 thunk
    try {
      let {success, data}  = await Login.SystemConfig()  
       
      return data
    } catch (error) {
      return error
    }
   
})
const zlsilce = createSlice({
    name: 'zltest',
    initialState,
    reducers: {
        setSys: (state, action) => {
            return Object.assign({}, state, action.payload)
        },
        setzl: (state, action) => {
             console.log(action)
             state.zltest = action.payload
        }
    },
    extraReducers(builder) {
       console.log(builder)
       builder
       .addCase(asyncthunk.pending, (state,actions) => {
        state.status='loading'
       })
       .addCase(asyncthunk.fulfilled, (state,actions) => {
        state.status='fulfilled'
        console.log(actions)
        state.sysinfo = actions.payload.message
       })
       .addCase(asyncthunk.rejected, (state,actions) => {
        state.status='failed'
        console.log(actions)
        state.sysinfo = actions.payload?.message
       })
    }

})
const {actions, reducer} = zlsilce
export const zltest = state => state.zltest.zltest
export const status = state => state.zltest.status
export const error = state => state.zltest.error
export const sysinfo = state => state.zltest.sysinfo
export const {setSys, setzl } =  actions
export default reducer
