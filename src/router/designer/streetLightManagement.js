// 路灯管理


import {lazy} from 'react'
const StreetLightInfo = lazy(() => import("@pages/lightManagement/configure/streetLightInfo"))
const StreetLightScheme = lazy(() => import("@pages/lightManagement/configure/streetLightScheme"))
const StreetLightType = lazy(() => import("@pages/lightManagement/configure/streetLightType")) 
const StreetLightLineConfig = lazy(() => import("@pages/lightManagement/configure/streetLightLineConfig")) 
const StreetLightAreaConfig = lazy(() => import("@pages/lightManagement/configure/streetLightAreaConfig")) 
  
export const streetLightManagement = {
    "021701": StreetLightType, //路灯类型
    "021702": StreetLightInfo, //路灯档案
    "021703": StreetLightScheme, // 路灯控制方案
    "021704": StreetLightLineConfig, // 线路设置
    "021705": StreetLightAreaConfig, // 区域设置
}
