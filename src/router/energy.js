/*  运行监控 */
import {lazy} from 'react'
const Summary = lazy(() => import("../pages/energy/summary"))
const Synthetical = lazy(() => import("../pages/energy/synthetical"))
const Ranking= lazy(() => import("../pages/energy/ranking"))
const Timesharing = lazy(() => import("../pages/energy/timesharing"))
const Usage= lazy(() => import("../pages/energy/usage"))

const Direction = lazy(() => import("../pages/energy/direction"))
const Analysis = lazy(() => import("../pages/energy/analysis"))
const Quota = lazy(() => import("../pages/energy/quota"))
const Comm = lazy(() => import("../pages/energy/comm"))
export default [
    {
       // index: true,
        path: 'summary',
        element: <Summary/>
     },
     {
         path: 'synthetical',
         element: <Synthetical/>
     },
     {
        path: 'ranking',
        element: <Ranking/>
    },
    {
        path: 'timesharing',
        element: <Timesharing/>
    },
    {
        path: 'usage',
        element: <Usage/>
    },
    {
        path: 'direction',
        element: <Direction/>
    },
    {
        path: 'analysis',
        element: <Analysis/>
    },
    {
        path: 'quota',
        element: <Quota/>
    },
   
    {
        path: 'comm',
        element: <Comm/>
    }
]