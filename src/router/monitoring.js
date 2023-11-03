/*  运行监控 run*/
import {lazy} from 'react'
const lazyRetry = function(componentImport, name) {
    return new Promise((resolve, reject) => {
        // 检查是否已经刷新过了
        const hasRefreshed = JSON.parse(
            window.sessionStorage.getItem(`${name}-retry-lazy-refreshed`) || 'false'
        );
        // 动态导入组件
        componentImport().then((component) => {
            window.sessionStorage.setItem(`${name}-retry-lazy-refreshed`, 'false'); 
            resolve(component);
        }).catch((error) => {
            if (!hasRefreshed) { // 没有刷新过，需要刷新页面刷新
                window.sessionStorage.setItem(`${name}-retry-lazy-refreshed`, 'true'); 
                return window.location.reload(); // 
            }
            reject(error); 
        });
    });
}
const Electrical = lazy(() => import("../pages/monitoring/electrical"))
// const Gateway = lazy(() => import("../pages/monitoring/gateway"))
const Gateway = lazy(()=>lazyRetry(() => import("../pages/monitoring/gateway"),'Gateway'))
const Loss= lazy(() => import("../pages/monitoring/loss"))
const Point = lazy(() => lazyRetry(()=>import("../pages/monitoring/point"),'Point'))
const Report= lazy(() => import("../pages/monitoring/report"))
const Summary = lazy(() => import("../pages/monitoring/summary"))
const Video = lazy(() => import("../pages/monitoring/video"))
const Warning = lazy(() => import("../pages/monitoring/warning"))
const Remote = lazy(() => import("../pages/monitoring/remote"))
const Oplog = lazy(() => import("../pages/monitoring/oplog"))
const Call = lazy(() => import("../pages/monitoring/call"))
const Control= lazy(() => import("../pages/monitoring/control"))

 
 export let runtimeMonitor = {
    '010501': Summary,
    '010502': Gateway,
    '010503': Point,
    '010504': Video,
    '010505': Remote,
    '010506': Call,
    '010507': Report,
     '010508': Control
 }
