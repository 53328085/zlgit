// 空调控制
import {lazy} from 'react'
const airConditioningAutoControl = lazy(() => import("../pages/airConditioningManagement/airConditioningAutoControl"))
const airConditioningEnergyMonitor= lazy(() => import("../pages/airConditioningManagement/airConditioningEnergyMonitor"))
const airConditioningOverview = lazy(() => import("../pages/airConditioningManagement/airConditioningOverview"))
const airConditioningLog = lazy(() => import("../pages/airConditioningManagement/airConditioningLog"))
const airConditioningManualControl = lazy(() => import("../pages/airConditioningManagement/airConditioningManualControl"))
export const airConditioningManagement = {
    '011901': airConditioningOverview,  //空调总览
    '011902': airConditioningEnergyMonitor, // 能耗监测
    '011903': airConditioningManualControl, // 手动控制
    '011904': airConditioningAutoControl, // 自动控制
    '011905': airConditioningLog, // 控制日志
}
