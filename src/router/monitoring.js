/*  运行监控 run*/
import {lazy} from 'react'
import store from '@redux/store'
const Electrical = lazy(() => import("../pages/monitoring/electrical"))
const Gateway = lazy(() => import("../pages/monitoring/gateway"))
const Loss= lazy(() => import("../pages/monitoring/loss"))
const Point = lazy(() => import("../pages/monitoring/point"))
const Report= lazy(() => import("../pages/monitoring/report"))
const Summary = lazy(() => import("../pages/monitoring/summary"))
const Video = lazy(() => import("../pages/monitoring/video"))
const Warning = lazy(() => import("../pages/monitoring/warning"))
const Remote = lazy(() => import("../pages/monitoring/remote"))
const Oplog = lazy(() => import("../pages/monitoring/oplog"))

const menus = [];
const components = {
    '010501': Summary,
    '010502': Point,
    '010503': Gateway,
    '010504': Remote,
    '010505': Warning,
    '010506': Video,
    '010507': Electrical,
    '010508': Oplog,
    '010509': Report,
}
store.subscribe(() => {
    const runmen= store.getState().system.menus?.siderRunMenus?.['runtimeMonitor'] 
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})
export default  menus