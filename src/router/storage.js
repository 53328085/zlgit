/*  储能管理 */
import {lazy} from 'react'
import store from '@redux/store'
const Summary = lazy(() => import("@pages/storage/summary"))
const AlternatorMonitor = lazy(() => import("@pages/storage/alternatorMonitor"))
const StorageMonitor = lazy(() => import("@pages/storage/storageMonitor"))
const StorageControl = lazy(() => import("@pages/storage/storageControl"))
const ConsumeStatistics = lazy(() => import("@pages/storage/consumeStatistics"))
const ReportStatistics = lazy(() => import("@pages/storage/reportStatistics"))
const AlarmMessage = lazy(() => import("@pages/storage/alarmMessage"))
const OperationLog = lazy(() => import("@pages/storage/operationLog"))
const StroageReport = lazy(() => import("@pages/storage/StroageReport"))


const ChargingOrder = lazy(() => import("@pages/storage/chargingOrder"))
const Environment = lazy(() => import("@pages/storage/environment"))
const menus = [];
const components = {
    '011101': Summary,  //储能概述
    '011102': AlternatorMonitor, // 
    '011103': StorageMonitor, 
    '011104': StorageControl, 
    '011105': ConsumeStatistics, 
    '011106': ReportStatistics, 
    '011107': ChargingOrder, 
    '011108': Environment, 
    '011109': AlarmMessage, 
    '011110': OperationLog, 
    '011111': StroageReport, 
}
store.subscribe(() => {
    const runmen= store.getState().system.menus.siderRunMenus?.['runtimeStorage']
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})

export default  menus