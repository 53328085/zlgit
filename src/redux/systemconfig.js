/* 获取系统配置 */
import { CodeSandboxCircleFilled } from '@ant-design/icons'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {Login} from '../axios/api'
const initialState = {
    systemConfigInfo: {},
    configState: false, // 项目是否处于设计状态   
    publishState: NaN, // 项目是否发布 1 发布， 0 未发布
    menus: {
        projectId: 0, // 项目ID
        runMenus: [], // 项目top菜单栏 左边 选择的
        designerMenus: [], // 设置top菜单栏
        siderRunMenus: [], // 项目 sider
        siderDesignerMenus: [], // 设置 sider
        setMenus: [], // 项目top菜单栏 右边
        comSet: [], //公共设置
      //  allRunMenus: [],
      //  allsinderRunMenus: {},
    },
   onelevel: [], // 一级
   currlevel: {}, // 当前选择的一级区域
   shifts: [], // 班次
}
export const systemConfig = createAsyncThunk(
    'system/getConfig',
    async (params) => {
      const response =  await Login.SystemConfig(params)
      return response
    }
)
const system = createSlice({
    name: 'system',
    initialState,
    reducers: {
        configProject(state, actions) { // 项目是否处于设计状态           
            return Object.assign({}, state, {configState: actions.payload})
        },
        getMenus(state, actions) {
            return Object.assign({}, state, {menus: actions.payload})
        },
        getRunMenus(state, actions) {
            return Object.assign({}, state, {runMenus: actions.payload })
        },
        getDesignerMenus(state, actions) {
           return Object.assign({}, state, {designerMenus: actions.payload })
        },
        getSiderRunMenus(state, actions) {
            return Object.assign({}, state, {siderRunMenus: actions.payload })
        },
        getSiderDesignerMenus(state, actions) {
            return Object.assign({}, state, {siderDesignerMenus: actions.payload })
         },
        getSetMenus(state, actions) {
            return Object.assign({}, state, {setMenus: actions.payload })
        },
        getOnelevel(state, actions) {          
            return Object.assign({}, state, {onelevel: actions.payload })
        },
        setCurrentlevel(state, actions) {
            return Object.assign({}, state, {currlevel: actions.payload })
        },
        getshifts(state, actions) {           
            return Object.assign({}, state, {shifts: actions.payload })
        },
        getpublishState(state, actions) {           
            return Object.assign({}, state, {publishState: actions.payload })
        }
    },

    extraReducers: {      
        [systemConfig.fulfilled]: (state, {payload}) => {           
           let {success, errMsg, data} = payload
           if (success) {
               return Object.assign({}, state, {systemConfigInfo: data} )
           }else {
               return Object.assign({}, state, {systemConfigInfo: {}})
           }
        }
    }

})
 

const {actions} = system
export const recordNo = state => state.system.recordNo

export const runMenus  = state => state.system.menus?.runMenus 
export const designerMenus  = state => state.system.menus?.designerMenus 
export const siderDesignerMenus  = state => state.system.menus?.siderDesignerMenus
export const siderRunMenus  = state => state.system.menus?.siderRunMenus
export const setMenus  = state => state.system.menus?.setMenus
export const comSetFirst  = state => state.system.menus?.comSet[0]
//export const allRunMenus  = state => state.system.menus?.allRunMenus
//export const allsinderRunMenus  = state => state.system.menus?.allsinderRunMenus
export const selectProjectId = state => state.system.menus?.projectId
export const selectOneLevel = state => state.system.onelevel
export const selectOneLevelDefaultId = state => state.system.currlevel?.id || state.system.onelevel[0]?.id
export const levelDefaultLabel = state => state.system.currlevel?.levelName || state.system.onelevel[0]?.levelName
export const selectshifts = state => state.system.shifts
export const publishState = state => {
  return  state.system.publishState == 1
}
export const systemConfigInfo = state => state.system.systemConfigInfo
export const {configProject,getSetMenus,setCurrentlevel, getRunMenus, getDesignerMenus, getSiderRunMenus, getSiderDesignerMenus, getMenus, getOnelevel, getshifts, getpublishState} = actions
export default system.reducer
