import { createSlice, nanoid, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import {Login, ProjectList} from '../axios/api'
import zhCN from 'antd/es/locale/zh_CN'
export const testAdapter = createEntityAdapter()
console.dir(testAdapter);
const initial = {
  
  componentSize: 'large',
  locale: zhCN,
  zltest: 'zjxszl',
  sysinfo: {},
  status: '加载中',
  error: 'error',
  names: [],
  menus: [],
  zlmenus: [],

}
const  initialState = testAdapter.getInitialState(initial)

export const testthunk = (arg) => { // 创建自己的同步 thunk
   console.log(1111)
   return (dispatch, getState) => {
     const initState = getState()
     console.log(initState)
   //  dispatch(setzl(arg))
     
   }

}
export const asyncthunk = createAsyncThunk('zltest/systeminfo', async (params) => { // 异步 thunk
    
   
      let  response  = await Login.SystemConfig()  
      return response.data
   
})

export const getpropject = createAsyncThunk('zltest/menus', async (projectId=1, thunkApi) => { // 异步 thunk
    console.log(thunkApi)
    let  {rejectWithValue, dispatch} = thunkApi
     try {
      let  response  = await ProjectList.QueryMenus(projectId)  
      dispatch(setMenu(response.data))
      return response.data
     } catch (error) {
        
      return  rejectWithValue(error.response.data)
     }
 },

 {
  condition: (projectId, { getState, extra }) => {
       const {zltest} = getState()
       console.dir(zltest)
   /*  const fetchStatus = users.requests[userId]
    if (fetchStatus === 'fulfilled' || fetchStatus === 'loading') {
      
      return false
    } */
  }
}


)
const zlsilce = createSlice({
    name: 'zltest',
    initialState,
    reducers: {
        remove: testAdapter.removeOne
    },
    extraReducers: {
      [asyncthunk.fulfilled]: (state, actions) => {
         console.log(actions)
      },

      [getpropject.fulfilled]: (state, actions) => {
        console.log(actions)
        state.menus = actions.payload
     },
     [getpropject.rejected]: (state, actions) => {
       state.menus = actions.payload
        console.log(actions)
   }


      /*  console.log(builder)
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
       }) */
    }

})

const {actions, reducer} = zlsilce
export const zltest = state => state.zltest.zltest
export const status = state => state.zltest.status
export const error = state => state.zltest.error
export const sysinfo = state => state.zltest.sysinfo
export const names = state => state.zltest.names
export const zlmenus = state => state.zltest.zlmenus;
export const {setSys, setz, addname, setMenu } =  actions
export default reducer
