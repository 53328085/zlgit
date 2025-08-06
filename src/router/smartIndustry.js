// 智慧工业
import {lazy} from 'react'
const ColdWaterSystem = lazy(() => import("../pages/smartIndustry/coldWaterSystem"))
const EastHotWaterSystem = lazy(() => import("../pages/smartIndustry/eastHotWaterSystem"))
const WasteHeatRecoverySystem = lazy(() => import("../pages/smartIndustry/wasteHeatRecoverySystem"))
const WestHotWaterSystem = lazy(() => import("../pages/smartIndustry/westHotWaterSystem"))
 
export let smartIndustry = {
    '012101': EastHotWaterSystem,  // 东区热水系统
    '012102': WasteHeatRecoverySystem, // 西区热水系统
    '012103': ColdWaterSystem, // 冷水系统
    '012104': WestHotWaterSystem, // 余热回收系统
   
    
}
