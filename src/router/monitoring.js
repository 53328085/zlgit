/*  运行监控 run*/
import {lazy} from 'react'
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
