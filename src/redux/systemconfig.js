/* 获取系统配置 */
 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {Login} from '../axios/api'
import antdconfig from './theme' ; //   antd配置
 
 
const initialState = {
    siteConfig: antdconfig,
    themeColor: '#237AE4',
    systemConfigInfo: {},
    currProject: {}, //当前项目信息
    configState: false, // 项目是否处于设计状态   
    jump: false, // 页面跳转
    publishState: NaN, // 项目是否发布 1 发布， 0 未发布
    menus: {
        projectId: 0, // 项目ID
        runMenus: [], // 运行 top菜单栏 左边 选择的
        designerMenus: [], // 设计 top菜单栏
        siderRunMenus: [], // 运行 sider
        siderDesignerMenus: [], // 设计 sider
        setMenus: [], // 项目top菜单栏 右边
        comSet: [], //公共设置
      //  allRunMenus: [],
      //  allsinderRunMenus: {},
    },
   onelevel: [], // 一级
   currlevel: {}, // 当前选择的一级区域
   shifts: [], // 班次
   datascreen: {}, // 大屏配置
   currentscreen: { // 当前大屏信息
    type: 0,
    url: '',
     primary:'',
   },
  asider: true,
  isGranary: false, // 演示国家粮仓用
}
export const systemConfig = createAsyncThunk(
    'system/getConfig',
    async (params, {rejectWithValue}) => {
      try {
        const response =  await Login.SystemConfig(params)
        return response
      } catch (err) {
         let error = err
         if(!error.response) {
            throw err;
         }

         return rejectWithValue(err.response.data)
      }
   
    }
)
const system = createSlice({
    name: 'system',
    initialState,
    reducers: {
        getCurrProjectInfo(state, {payload}) { // 当前项目信息
            state.currProject = payload   
        },
        configProject(state, {payload}) { // 项目是否处于设计状态     
            state.configState = payload    
            //return Object.assign({}, state, {configState: actions.payload})
        },
        getJump(state, {payload}) { // 页面跳转到设计态，还是运行态    
            state.jump = payload     
           // return Object.assign({}, state, {jump: actions.payload})
        },
        getMenus(state, {payload}) { 
            state.menus = payload
            //return Object.assign({}, state, {menus: actions.payload})
        },
        getRunMenus(state, {payload}) {
            state.runMenus = payload
           // return Object.assign({}, state, {runMenus: actions.payload })
        },
        getDesignerMenus(state, {payload}) {
           state.designerMenus = payload
          // return Object.assign({}, state, {designerMenus: actions.payload })
        },
        getSiderRunMenus(state, {payload}) {
            state.siderRunMenus = payload
            //return Object.assign({}, state, {siderRunMenus: actions.payload })
        },
        getSiderDesignerMenus(state, {payload}) {
            state.siderDesignerMenus = payload
            // return Object.assign({}, state, {siderDesignerMenus: actions.payload })
         },
        getSetMenus(state, {payload}) {
            state.setMenus = payload
           // return Object.assign({}, state, {setMenus: actions.payload })
        },
        getOnelevel(state, {payload}) {  
            state.onelevel =Array.isArray(payload) ? payload : []       
           // return Object.assign({}, state, {onelevel: actions.payload })
        },
        setCurrentlevel(state, {payload}) {
            state.currlevel = payload

           // return Object.assign({}, state, {currlevel: actions.payload })
        },
        getshifts(state, {payload}) {    
            state.shifts = payload  
          // return Object.assign({}, state, {shifts: actions.payload })
        },
        getpublishState(state, {payload}) {  
            state.publishState = payload         
           // return Object.assign({}, state, {publishState: actions.payload })
        },
        getdataScreen(state, {payload}) {   
            state.datascreen = payload        
           // return Object.assign({}, state, {datascreen: actions.payload })
        },
        getCurrentScreen(state, {payload}) {  // 当前大屏
            state.currentscreen = payload
           // return Object.assign({}, state, {currentscreen: actions.payload})
        },
        getIsGranary(state, {payload}) {  // 是否国家粮仓
            state.isGranary = payload
           // return Object.assign({}, state, {isGranary: actions.payload})
         },
        getThemeColor(state, {payload}) {
           state.themeColor = payload || "#237AE4";
          
        },
        systemConfigRest(state, actions) {
          console.log(initialState)
          return state = initialState;
      }
    },

    extraReducers: {      
        [systemConfig.fulfilled]: (state, {payload}) => { 
           let {success, errMsg, data={}} = payload || {}
           if (success) {
             
            
              // state.systemConfigInfo = data
           //  Object.assign({}, state, {siteconfig})
            //  state.siteconfig.theme.primaryColor = data.themeColor || "#237AE4" // 主题色
              return Object.assign({}, state, {systemConfigInfo: data} )
           }else {
             // state.systemConfigInfo = {}
              return Object.assign({}, state, {systemConfigInfo: {}})
           }
        },
        [systemConfig.rejected]: (state, {payload}) => { 
            state.systemConfigInfo = {}
         }

    }

})
 

const {actions} = system
export const recordNo = state => state.system.recordNo
export const menus  = state => state.system.menus
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
export const selectOneLevelDefaultId = state => state.system.currlevel?.id || state.system.onelevel[0]?.id || ''

export const levelDefaultLabel = state =>  state.system.currlevel?.levelName || state.system.onelevel[0]?.levelName || ''
export const selectshifts = state => state.system.shifts
export const publishState = state => {
  return  state.system.publishState == 1
}
export const systemConfigInfo = state => state.system.systemConfigInfo
export const jump = state => state.system.jump
export const mixtitle = state =>  (state.system?.systemConfigInfo?.title || "NIS6000")+ ' '+(state.system?.systemConfigInfo?.chineseTitle || "正泰综合能源服务平台");
export const datascreen = state => state.system.datascreen ?? {}
export const configState = state => state.system.configState;
export const currentscreen = state => state.system.currentscreen
export const isGranary = state => state.system.isGranary

export const currProject  = state => state.system.currProject
export const custconfig = state => state.system.siteConfig

export const themeColor = state => state.system.themeColor
export const {
    configProject,
    getSetMenus,
    setCurrentlevel, 
    getRunMenus,
    getDesignerMenus,
    getSiderRunMenus,
    getSiderDesignerMenus, 
    getMenus, 
    getOnelevel, 
    getshifts, 
    getpublishState,
    getJump,
    getdataScreen,
    getCurrentScreen,
    getIsGranary,
    getCurrProjectInfo,
    getThemeColor,
    systemConfigRest,
} = actions
export default system.reducer
