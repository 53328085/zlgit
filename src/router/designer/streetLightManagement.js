// 路灯管理


import {lazy} from 'react'
const StreetLightInfo = lazy(() => import("@pages/lightManagement/configure/streetLightInfo"))
const StreetLightScheme = lazy(() => import("@pages/lightManagement/configure/streetLightScheme"))
const StreetLightType = lazy(() => import("@pages/lightManagement/configure/streetLightType")) 
 
export const streetLightManagement = {
    "021701": StreetLightType, //路灯类型
    "021702": StreetLightInfo, //路灯档案
    "021703": StreetLightScheme, // 路灯控制方案

}
