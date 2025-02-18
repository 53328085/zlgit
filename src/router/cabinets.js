/*  智能配电柜 */
import {lazy} from 'react'

 
const Overview = lazy(() => import("@pages/cabinet/siteOverview"))  // 站点概述
const DiskChart = lazy(() => import("@pages/cabinet/diskChartMonitor"))  // 盘面图监控
const DiagramMonitor = lazy(() => import("@pages/cabinet/diagramMonitor"))  // 一次图监控
const EfficiencyMonitor = lazy(() => import("@pages/cabinet/efficiencyMonitor")) // 能效监控
const EnvironmentMonitor = lazy(() => import("@pages/cabinet/environmentMonitor")) // 能效监控
const ConsumptionReading = lazy(() => import("@pages/cabinet/consumptionReading"))  // 能耗抄表
const LoopConsumption = lazy(() => import("@pages/cabinet/loopConsumption"))  // 回路能耗
const TransformerDiagonsis = lazy(() => import("@pages/cabinet/transformerDiagonsis"))  // 变压器诊断
const circuitDiagonsis = lazy(() => import("@pages/cabinet/circuitDiagonsis")) // 断路器诊断
const WarningMessage = lazy(() => import("@pages/cabinet/warningMessage")) // 告警信息
const CarbonStatistics = lazy(() => import("@pages/cabinet/carbonStatistics"))  // 碳排统计
const RunReport = lazy(() => import("@pages/cabinet/runningReport"))  // 运行报告

export let cabinets = {
    '011601': Overview,   
    '011602': DiskChart, 
    '011603': DiagramMonitor, 
    '011604': EfficiencyMonitor, 
    '011605': EnvironmentMonitor,
    '011606': ConsumptionReading,
    '011607': LoopConsumption, 
    '011608': TransformerDiagonsis, 
    '011609': circuitDiagonsis, 
    '011610': WarningMessage, 
    '011611': CarbonStatistics, 
    // '011612': RunReport, 
}
