import { createSlice,nanoid, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import {Login} from '../axios/api'
const initialState = {
    loading: false,
    loginName: "",
    mobile: "",
    nickName: "",
    roleType: '',
    token: "",
    userId: '',
    errMsg: '',
    functions: [],
    projects: []
}
export const loginByName = createAsyncThunk(
    'user/loginByName',
    async (params) => {
      const response =  await Login.LoginByName(params)
      return response
    }
)
const user = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearToken(state) {
          console.log(222222222222)
          return Object.assign({}, state, {token: ''})
        }
    },
    extraReducers: {
        [loginByName.pending]: (state) => {
             return {...state, loading: true}
         },
        [loginByName.fulfilled]: (state, {payload}) => {           
           let {success, errMsg, data} = payload
           if (success) {
               return Object.assign({}, state, data, {loading: false} )
           }else {
               return Object.assign({}, state, {errMsg, loading: false})
           }
        },
        [loginByName.rejected]: (state) => {           
            return {...state, loading: false}
         }
    }

})
export const selectFunctions = state => state.user.selectFunctions
export const selectCurProject = state => (Array.isArray(state?.user.projects) && state.user.projects.length > 0) ? state.user.projects[0] : {}

export const selectLoading = state => state.user.loading
export const selectUser =  (state) => {    
    let {loginName,mobile, nickName,roleType,token,userId} = state.user
    return {loginName,mobile,nickName,roleType,token,userId}
 }
export const {clearToken} = user.actions



export default user.reducer
