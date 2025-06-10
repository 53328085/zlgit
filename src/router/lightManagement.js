// 照明控制
import {lazy} from 'react'
const StreetLightOverview = lazy(() => import("../pages/lightManagement/streetLightOverview"))
const StreetLightEnergyMonitor = lazy(() => import("../pages/lightManagement/streetLightEnergyMonitor"))
const StreetLightManualControl = lazy(() => import("../pages/lightManagement/streetLightManualControl"))
const StreetLightAutoControl = lazy(() => import("../pages/lightManagement/streetLightAutoControl"))
const StreetLightLog = lazy(() => import("../pages/lightManagement/streetLightLog"))
const LightControl = lazy(() => import("../pages/lightManagement/lightControl"))
export let lightManagement = {
    '012001': StreetLightOverview,  //路灯总览
    '012002': StreetLightEnergyMonitor, // 能耗监测
    '012003': StreetLightManualControl, // 手动控制
    '012004': StreetLightAutoControl, // 自动控制
    '012005': StreetLightLog, // 控制日志
    '012006': LightControl, // 照明控制
    
}
