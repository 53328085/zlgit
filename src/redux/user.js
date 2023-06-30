import { createSlice,nanoid, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import {Login} from '../axios/api'
const initialState = {
    memorize: false, // 是否记住用户名
    memoPhone: false, // 是否记住手机号码
    loading: false,
    name: "",
    password: '',
    mobile: "",  
    roleType: '',
    token: "",
    userId: '',
    errMsg: '',
    functions: [],
    projects: [],   
}
let password = ''
export const loginByName = createAsyncThunk(  // type: 1 用户名， type: 手机号
    'user/loginByName',
    async (params) => { 
       password = params.pwd
      let {type, ...param} = params     
      let handler = ['LoginByName', 'LoginByPhone'][type] 
      console.log(handler)
      const response =  await Login[handler](param)
      return response
    }
)
 
const user = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearToken(state) {
          return Object.assign({}, state, {token: ''})
        },
        memorizeName(state, actions) {          
            return Object.assign({}, state, {memorize: actions.payload})
        },
        memorizePhone(state, actions) {           
            return Object.assign({}, state, {memoPhone: actions.payload})
        }
    },
    extraReducers: {
        [loginByName.pending]: (state) => {
             return {...state, loading: true}
         },
        [loginByName.fulfilled]: (state, {payload}) => {           
           let {success, errMsg, data} = payload
           if (success) {
               return Object.assign({}, state, data, {loading: false, password},   )
           }else {
               return Object.assign({}, state, {errMsg, loading: false, password: ''})
           }
        },
        [loginByName.rejected]: (state) => {           
            return {...state, loading: false, password: ''}
         }
    }

})
const {actions, reducer} = user
export const selectFunctions = state => state.user.selectFunctions
export const selectCurProject = state => (Array.isArray(state?.user.projects) && state.user.projects.length > 0) ? state.user.projects[0] : {}

export const selectLoading = state => state.user.loading
export const selectUser =  (state) => {    
    let {name,mobile, roleType,token,userId, password} = state.user 
    return {name,mobile,roleType,token,userId, password}
 }
export const manager = state => state.user?.roleType == 3 // 是否是项目管理员
export const maintenance = state => state.user?.roleType == 4 // 是否是运维人员
export const selectMemorize = state => state.user.memorize
export const selectMemoPhone = state => state.user.memoPhone
export const {clearToken, memorizeName, memorizePhone} = actions



export default reducer
