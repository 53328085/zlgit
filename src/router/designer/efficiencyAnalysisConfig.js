// 能效分析


import {lazy} from 'react'
const EfficiencyDeviceConfig = lazy(() => import("@pages/efficiencyAnalysis/configure/efficiencyDeviceConfig"))
const CustomReportConfig = lazy(() => import("@pages/efficiencyAnalysis/configure/customReportConfig"))
 
  
export const efficiencyAnalysisConfig = {
    "021801": EfficiencyDeviceConfig, //能效设备配置
    "021802": CustomReportConfig, //自定义报表配置
    
}
