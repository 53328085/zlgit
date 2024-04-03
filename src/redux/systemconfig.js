/* 获取系统配置 */
 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import zhCN from 'antd/es/locale/zh_CN'; 
import {Login} from '../axios/api'
import antdconfig from './theme' ; //   antd配置
import { Area, ProjectList,ProjectSetting, BigScreen, eneryShift, Monitoring} from "@api/api.js"; 

 
const {DeviceTypeManager: {AllDeviceStyle} } = Monitoring
 
  // 进入项目配置/项目 

  const handlermenu = (Meundata,  id) => {
   
    let lang =  window.localStorage.getItem('i18nextLng')?.slice(0, 2)?.toLowerCase() == 'zh' ? 'cn' : 'en'
    let data = Meundata.filter(d => d.languageName==lang);
    const setMenus = data.filter(m => ['0101', '0102', '0103'].includes(m.no));
    const runMenus = data.filter(m => m.parentNo == '01' && m.select == 1).filter(m => !['0101', '0102', '0103'].includes(m.no)) // 运行功能 菜单
  //  const allRunMenus = data.filter(m => m.parentNo == '01').filter(m => !['0101', '0102', '0103'].includes(m.no)) 
    const designerMenus = data.filter(m => m.parentNo == '02' && m.select == 1) // 设置
  
    const comSet = data.filter(m => m.parentNo=="0201") // 公共设置
  
    let exclude = ['01','02','0101','0102', '0103', '0104'] // 排除  项目概述, 数据大屏， 项目设置， 平台配置,
   
    const sidermenu = data.filter(m => m.parentNo !='01').filter(m => m.parentNo !='02').filter(m => !exclude.includes(m.no));    
    
    const siderRunMenus = {}; // 运行功能 选择的子菜单
   
    runMenus.forEach(item => {
     let {no, key, parentNo} = item 
     if (!exclude.includes(item.no)) { 
        siderRunMenus[key] = sidermenu.filter(m => m.parentNo == no && m.select == 1).sort((a, b) => a.index - b.index)
       
     }   
    }) 
    const siderDesignerMenus = {};
    designerMenus.forEach(item => {
     let {no, key, parentNo} = item 
     if (!exclude.includes(item.no)) {
       siderDesignerMenus[key] = sidermenu.filter(m => m.parentNo == no)?.sort((a, b) => a.index - b.index)
     }   
    }) 
    const menus =  {
     designerMenus, 
     siderDesignerMenus,
     runMenus,
     siderRunMenus, 
     setMenus,  
     comSet,      
     projectId: id,
    }
  
   /*  dispatch(getMenus(menus));
    dispatch(configProject(false))   
    return runMenus?.find(item => item.no == '0104') || runMenus[0]  */
  
    return menus
   }



const initialState = {
    siteConfig: antdconfig,
    themeColor:  {
      primaryColor: '#237AE4'
    },
    intl: {
      lang: zhCN,
      locale: 'zh-cn'
    },
    systemConfigInfo: {},
    currProject: {}, //当前项目信息
    configState: false, // 项目是否处于设计状态   
    jump: false, // 页面跳转
    publishState: NaN, // 项目是否发布 1 发布， 0 未发布
    roomId: [],    
    
    curlRommid: '',
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
   disonlevel: [], // 配电管理运行态下 一级
   
   discurlevel: '', // 配电管理运行状态 选中的值
   isDistribution: false, // 是否在配电管理运行状态下
   currlevel: {}, // 当前选择的一级区域
   shifts: [], // 班次
   datascreen: {}, // 大屏配置
   currentscreen: { // 当前大屏信息
    type: 0,
    url: '',
     primary:'',
   },
  asider: true,
  deviceStyle: [], // 表计类型
  isGranary: false, // 演示国家粮仓用
}
 
export const getWebsiteState = createAsyncThunk(
  'system/getState',
  async (id, {rejectWithValue}) => {
      try {
        let promises = [
          Area.QueryAll({projectId: id,level: 1,parentId: 0}), 
          eneryShift.queryShifts(id), 
       //   ProjectList.QueryMenus(id), 
          ProjectSetting.queryProjectPublishInfo(id),
          BigScreen.QueryBigScreen(id),
          Area.AreaList(id), // 配电管理运行状态下的一级下拉菜单
          AllDeviceStyle(), // 表计类型
         ] 
        let results = await Promise.allSettled(promises)
        return results
      } catch (error) {
         console.log(error)
      }
  }
)
export const getWebsiteMenu = createAsyncThunk(
  "system/getMenu",
  async (id, {rejectWithValue}) => {
     try {
      let {data, success, errMsg} = await ProjectList.QueryMenus(id)
      if(success) {
         return handlermenu(data, id)
         
      }else {
        rejectWithValue(errMsg)
      }
      } catch (error) {
        //console.log(error)
        return rejectWithValue(error)
     }
  }
)
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
            
        },
        getJump(state, {payload}) { // 页面跳转到设计态，还是运行态    
            state.jump = payload     
           
        },
        getMenus(state, {payload}) { 
            state.menus = payload
            
        },
        getRunMenus(state, {payload}) {
            state.runMenus = payload
           
        },
        getDesignerMenus(state, {payload}) {
           state.designerMenus = payload
          
        },
        getSiderRunMenus(state, {payload}) {
            state.siderRunMenus = payload
           
        },
        getSiderDesignerMenus(state, {payload}) {
            state.siderDesignerMenus = payload
            
         },
        getSetMenus(state, {payload}) {
            state.setMenus = payload
          
        },
        getOnelevel(state, {payload}) {  
            state.onelevel =Array.isArray(payload) ? payload : []       
          
        },
        getDisonlevel(state, {payload}) {
           state.disonlevel =Array.isArray(payload) ? payload : [] 
        },
        getisDistribution(state, {payload}) {
          
           state.isDistribution = payload
        },
        getDiscurlevel(state, {payload}) {
          state.discurlevel = payload
        },
        setCurrentlevel(state, {payload}) {
            state.currlevel = payload
        },
        getshifts(state, {payload}) {    
            state.shifts = payload  
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
           state.themeColor =payload;
          
        },
        getRoomId(state,{payload}){
          state.roomId= Array.isArray(payload)?payload:[]
          
        },
       
        getcurlRommid(state, {payload}) {
          state.curlRommid = payload
        },
        getSystemconfiginfo(state, {payload}) {
           state.systemConfigInfo = payload ?? {}
        },
        systemConfigRest(state, actions) {
           let {themeColor, intl} = state;
           console.log(themeColor)
         //  state = {...initialState, themeColor, intl};
           return {...initialState, themeColor, intl}
        },
        setIntl(state, {payload}) { // 设置国际化          
          state.intl = payload
        }
      
    },
     extraReducers: {
      [getWebsiteState.fulfilled]: (state, action) => {
         let {payload} = action
         payload.forEach((res, index) => {
          let {status, value: {success, data}} = res
          if (status ==='fulfilled') {
             if(success) {
             //  dispatch(setCurrentlevel({})) //当前项目设置为空对象   
               state.currlevel={}        
               index == 0 && (state.onelevel = Array.isArray(data) ? data : [])         
               index == 1 && ( state.shifts = Array.isArray(data) ? data : [])
               index == 2 && (state.publishState=data?.state)
               index == 3 && (state.datascreen = data || {})
               index == 4 && (state.disonlevel = Array.isArray(data) ? data : [])
               index == 5 && (state.deviceStyle = Array.isArray(data) ? data : [])
             }else{
               index== 0 && (state.onelevel=[])
               index == 2 && (state.publishState=NaN)
               index == 1 && (state.shifts=[]);
               index == 3 &&  (state.datascreen = {})
               index == 4 && (state.disonlevel = [])
               index == 5 && (state.deviceStyle = [])
             }
          }
        })

      },
      [getWebsiteMenu.fulfilled]:(state, action) => {
         let {payload} = action
         state.menus = payload

      },
     }

     


  /*   extraReducers: {      
        [systemConfig.fulfilled]: (state, {payload}) => { 
           let {success, errMsg, data={}} = payload || {}
           if (success) {          
              return Object.assign({}, state, {systemConfigInfo: data} )
           }else {            
              return Object.assign({}, state, {systemConfigInfo: {}})
           }
        },
        [systemConfig.rejected]: (state, {payload}) => { 
            state.systemConfigInfo = {}
         }

    } */

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
export const selectOneLevel = state =>  state.system.onelevel
export const selectOneLevelDefaultId = state => Number.isFinite(state.system.currlevel?.id) ? state.system.currlevel?.id : Number.isFinite(state.system.onelevel[0]?.id) ? state.system.onelevel[0]?.id : null



export const selectdisOneLevel = state =>  state.system.disonlevel

export const selectdiscurlevel = state => state.system.disonlevel[0]?.id;

export const selectcurlRommid = state =>  state.system.curlRommid
export const selectRoomList = state => state.system.roomIdList
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
export const roomId =state=>state.system.roomId

export const roomName = state =>  {
  return state.system.roomId?.find && state.system.roomId?.find(r => r.id == state.system.curlRommid)?.name 
} 
 
export const deviceStyle = state => state.system.deviceStyle;
export const intl = state => state.system.intl //国际化
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
    getRoomId,
    getSystemconfiginfo,
    getDisonlevel,
    getisDistribution,
    getcurlRommid,
    getDiscurlevel,
    setIntl,
} = actions
export default system.reducer
