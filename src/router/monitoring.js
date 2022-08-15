/*  运行监控 */
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
export default [
    {
       // index: true,
        path: 'outline',
        element: <Summary/>
     },
     {
         path: 'electrica',
         element: <Electrical/>
     },
     {
        path: 'gateway',
        element: <Gateway/>
    },
    {
        path: 'loss',
        element: <Loss/>
    },
    {
        path: 'point',
        element: <Point/>
    },
    {
        path: 'report',
        element: <Report/>
    },
    {
        path: 'video',
        element: <Video/>
    },
    {
        path: 'warning',
        element: <Warning/>
    },
    {
        path: 'remote',
        element: <Remote/>
    }
]