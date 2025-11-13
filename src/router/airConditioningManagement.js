// 空调控制
import { lazy } from 'react'
const AirConditioningAutoControl = lazy(() => import("../pages/airConditioningManagement/airConditioningAutoControl"))
const AirConditioningEnergyMonitor = lazy(() => import("../pages/airConditioningManagement/airConditioningEnergyMonitor"))
const AirConditioningOverview = lazy(() => import("../pages/airConditioningManagement/airConditioningOverview"))
const AirConditioningLog = lazy(() => import("../pages/airConditioningManagement/airConditioningLog"))
const AirConditioningManualControl = lazy(() => import("../pages/airConditioningManagement/airConditioningManualControl"))
const AirConditioningPoints = lazy(() => import("../pages/airConditioningManagement/airConditioningPoints"))
export const airConditioningManagement = {
    '011901': AirConditioningOverview,  //空调总览
    '011902': AirConditioningEnergyMonitor, // 能耗监测
    '011903': AirConditioningManualControl, // 手动控制
    '011904': AirConditioningAutoControl, // 自动控制
    '011905': AirConditioningLog, // 控制日志
    '011906': AirConditioningPoints, // 空调点位图
}
