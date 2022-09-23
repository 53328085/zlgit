/*  光伏发电 */
import {lazy} from 'react'
const Summary = lazy(() => import("../pages/photovoltaic/summary"))
const Analysis = lazy(() => import("../pages/photovoltaic/analysis"))
const Monitor= lazy(() => import("../pages/photovoltaic/monitor"))
const Surroundings = lazy(() => import("../pages/photovoltaic/surroundings"))
const Warn= lazy(() => import("../pages/photovoltaic/warn"))

const Run = lazy(() => import("../pages/photovoltaic/run"))
export default [
    {
       // index: true,
        path: 'summary',
        element: <Summary/>
     },
     {
         path: 'analysis',
         element: <Analysis/>
     },
     {
        path: 'monitor',
        element: <Monitor/>
    },
     {
        path: 'surroundings',
        element: <Surroundings/>
    },
    {
        path: 'warn',
        element: <Warn/>
    },   
    {
        path: 'run',
        element: <Run/>
    }
   
]