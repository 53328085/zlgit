/*  运行监控 */
import {lazy} from 'react'
const Summary = lazy(() => import("../pages/distribution/summary"))
const Loop = lazy(() => import("../pages/distribution/loop"))
const Map= lazy(() => import("../pages/distribution/map"))
const Report = lazy(() => import("../pages/distribution/report"))
const Surroundings= lazy(() => import("../pages/distribution/surroundings"))
const Video = lazy(() => import("../pages/distribution/video"))
const Warning= lazy(() => import("../pages/distribution/warning"))
const Transformer = lazy(() => import("../pages/distribution/transformer"))

export default [
    {
       // index: true,
        path: 'summary',
        element: <Summary/>
     },
     {
         path: 'Loop',
         element: <Loop/>
     },
     {
        path: 'map',
        element: <Map/>
    },
     {
        path: 'report',
        element: <Report/>
    },
    {
        path: 'Surroundings',
        element: <Surroundings/>
    },
    {
        path: 'Warning',
        element: <Warning/>
    },
    {
        path: 'transformer',
        element: <Transformer/>
    },
    {
        path: 'video',
        element: <Video/>
    }
   
]