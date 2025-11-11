import {lazy} from 'react'
const AirConditioningInfo = lazy(() => import("@pages/airConditioningManagement/configure/airConditioningInfo"))
const AirConditioningScheme = lazy(() => import("@pages/airConditioningManagement/configure/airConditioningScheme"))
const AirConditioningType = lazy(() => import("@pages/airConditioningManagement/configure/airConditioningType")) 
const AirConditioningConfig = lazy(() => import("@pages/airConditioningManagement/configure/airConditioningConfig")) 
const AirConditioningPointSet = lazy(() => import("@pages/airConditioningManagement/configure/airConditioningPointSet")) 
 
export const airConditioningManagement = {
    "021601": AirConditioningType, //空调类型
    "021602": AirConditioningInfo, //空调档案
    "021603": AirConditioningScheme, // 空调控制方案
    "021604": AirConditioningConfig, // 区域管理方案
    "021605": AirConditioningPointSet, // 空调点位
 
}
