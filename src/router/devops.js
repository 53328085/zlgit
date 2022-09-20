/*  运行监控 */
import {lazy} from 'react'
const Summary = lazy(() => import("../pages/devops/summary"))
const Inspection = lazy(() => import("../pages/devops/inspection"))
const Order= lazy(() => import("../pages/devops/order"))
const Runing = lazy(() => import("../pages/devops/runing"))
const Warning= lazy(() => import("../pages/devops/warning"))
export default [
    {
       // index: true,
        path: 'summary',
        element: <Summary/>
     },
     {
         path: 'warning',
         element: <Warning/>
     },
     {
        path: 'order',
        element: <Order/>
    },
     {
        path: 'inspection',
        element: <Inspection/>
    },
    {
        path: 'runing',
        element: <Runing/>
    },
  
]