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
        test: (state, action) => {
            return state
        }
    },
    extraReducers: {
        [loginByName.pending]: (state, action) => {
            state.loading = false
         },
        [loginByName.fulfilled]: (state, {payload}) => {           
           let {success, errMsg, data} = payload
           if (success) {
               return Object.assign({}, state, data, {loading: true} )
           }else {
               return Object.assign({}, state, {errMsg, loading: true})
           }
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

export default user.reducer
