/* 获取系统配置 */
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
    url: ""
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
export const recordNo = state => state.system.recordNo

export default system.reducer
