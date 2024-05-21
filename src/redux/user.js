import { createSlice,nanoid, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import {Login} from '../axios/api'
const initialState = {
    memorize: false, // 是否记住用户名, 记住用户名同时记住密码
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
    platformLang: [],
    hostServer: '', // ws
}
//let password = ''
export const loginByName = createAsyncThunk(  // type: 1 用户名， type: 手机号
    'user/loginByName',
    async (params) => { 
    
      let {type, ...param} = params    
      let handler = ['LoginByName', 'LoginByPhone'][type]     
      const response =  await Login[handler](param)
      return response
    }
)
 
const user = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearToken(state) {
           state.token=''
        },
        memorizeName(state, {payload}) {   
            state.memorize = payload       
           
        },
        memorizePhone(state, {payload}) {      
             state.memoPhone = payload    
        },
        getPassword(state, {payload}) {
            state.password = payload
        },
        userRest(state, actions) {  
            let name = state.memorize ? state.name : '';
            let mobile = state.memoPhone ? state.mobile : '';
           // state = {...initialState, memorize: state.memorize, name, memoPhone: state.memoPhone, mobile};
            return {...initialState, memorize: state.memorize, name, memoPhone: state.memoPhone, mobile};
        },
        getLang(state, {payload=[]}) {
            state.platformLang= payload
        }
    },
    extraReducers: {
        [loginByName.pending]: (state) => {
             return {...state, loading: true}
         },
        [loginByName.fulfilled]: (state, {payload}) => {           
           let {success, errMsg, data} = payload
           if (success) {
               window.sessionStorage.setItem("chintwulian", 's')
               window.sessionStorage.setItem('useToken', data.token)
              // state = {...data, loading: false, password}
              return Object.assign({}, state, data, {loading: false},   )
           }else {
               return Object.assign({}, state, {errMsg, loading: false})
               
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
    let {name,mobile, roleType,token,userId, password, hostServer} = state.user 
    return {name,mobile,roleType,token,userId, password,hostServer }
 }
export const manager = state => state.user?.roleType == 3 // 是否是项目管理员
export const maintenance = state => state.user?.roleType == 4 // 是否是运维人员
export const selectMemorize = state => state.user.memorize
export const selectMemoPhone = state => state.user.memoPhone
export const platformLang = state => state.user.platformLang
export const {clearToken, memorizeName, memorizePhone, userRest, getPassword, getLang} = actions



export default reducer
