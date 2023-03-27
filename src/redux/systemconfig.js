/* 获取系统配置 */
import { CodeSandboxCircleFilled } from '@ant-design/icons'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {Login} from '../axios/api'
const initialState = {
    chineseTitle: "NES6000正泰智慧能源结算收费系统",
    cmmi: 1,
    companyName: "正泰物联技术有限公司",
    createTime: "0001-01-01 00:00:00",
    creator: "",
    englishTitle: "NES6000 Chint Smart Energy Accounting And Charging System",
    id: 0,
    nationalRecordNo: "33010802011465",
    recordNo: "浙ICP备12033679号",
    systemLogoImage: "",
    systemLogoKey: "",
    themeColor: "#509ff1",
    updateTime: "0001-01-01 00:00:00",
    url: "",
    configState: false, // 项目是否处于配置状态   
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
        configProject(state, actions) { // 项目是否处于配置状态           
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
               return Object.assign({}, state, data )
           }else {
               return Object.assign({}, state)
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
export const selectOneLevelDefaultId = state => state.system.onelevel[0]?.id
export const selectshifts = state => state.system.shifts
export const publishState = state => {
  return  state.system.publishState == 1
}
export const {configProject,getSetMenus, getRunMenus, getDesignerMenus, getSiderRunMenus, getSiderDesignerMenus, getMenus, getOnelevel, getshifts, getpublishState} = actions
export default system.reducer
