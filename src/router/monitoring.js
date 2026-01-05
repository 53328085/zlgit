/*  运行监控 run*/
import { lazy } from 'react'
const lazyRetry = function (componentImport, name) {
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

// const Gateway = lazy(() => import("../pages/monitoring/gateway"))
const Gateway = lazy(() => lazyRetry(() => import("../pages/monitoring/gateway"), 'Gateway'))
const Point = lazy(() => lazyRetry(() => import("../pages/monitoring/point"), 'Point'))
const Report = lazy(() => import("../pages/monitoring/report"))
const Summary = lazy(() => import("../pages/monitoring/summary"))
const Video = lazy(() => import("../pages/monitoring/video"))

const Remote = lazy(() => import("../pages/monitoring/remote"))

const Call = lazy(() => import("../pages/monitoring/call"))
const Control = lazy(() => import("../pages/monitoring/control"))

const Analyse = lazy(() => import("../pages/monitoring/analyse"))
const Ianalyse = lazy(() => import("../pages/monitoring/ianalyse"))
const Manualentry = lazy(() => import("../pages/monitoring/manualentry"))
export let runtimeMonitor = {
    '010501': Summary,
    '010502': Gateway,
    '010503': Point,
    '010504': Video,
    '010505': Remote,
    '010506': Call,
    '010507': Report,
    '010508': Control,
    '010509': Analyse, // 对比分析
    '010510': Ianalyse,
    "0105011":Manualentry, //手动录入
}
