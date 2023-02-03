/*  运行监控 */
import {lazy} from 'react'
const DeviceType = lazy(() => import("@pages/monitoring/configure/deviceType"))
const Device = lazy(() => import("@pages/monitoring/configure/device"))
const Lighting= lazy(() => import("@pages/monitoring/configure/lighting"))
const Line = lazy(() => import("@pages/monitoring/configure/line"))
const Warning= lazy(() => import("@pages/monitoring/configure/warning"))

export default [
    {
       // index: true,
        path: 'deviceType',
        element: <DeviceType/>
     },
     {
         path: 'device',
         element: <Device/>
     },
     {
        path: 'lighting',
        element: <Lighting/>
    },
    {
        path: 'line',
        element: <Line/>
    },    
    {
        path: 'warning',
        element: <Warning/>
    },
    
]