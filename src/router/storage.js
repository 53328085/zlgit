/*  储能管理 */
import {lazy} from 'react'

const Summary = lazy(() => import("@pages/storage/summary"))
const StorageMonitor = lazy(() => import("@pages/storage/storageMonitor"))
const AlternatorMonitor = lazy(() => import("@pages/storage/alternatorMonitor"))
const BMSMonitor = lazy(() => import("@pages/storage/bmsMonitor"))
const Environment = lazy(() => import("@pages/storage/environment"))
const ReportStatistics = lazy(() => import("@pages/storage/reportStatistics"))
const AlarmMessage = lazy(() => import("@pages/storage/alarmMessage"))
const OperationLog = lazy(() => import("@pages/storage/operationLog"))
const StroageReport = lazy(() => import("@pages/storage/StroageReport"))

export let runtimeStorage = {
    '011101': Summary,         //储能总览
    '011102': StorageMonitor,  //储能柜监控
    '011103': AlternatorMonitor,  //PCS监控 (复用storageMonitor)
    '011104': BMSMonitor, //BMS监控
    '011105': Environment,      //环境监控
    '011106': ReportStatistics, //收益统计
    '011107': AlarmMessage,     //告警消息
    '011108': OperationLog,     //操作日志
    '011109': StroageReport,    //运行报告
}
