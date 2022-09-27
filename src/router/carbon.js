/*  运行监控 */
import {lazy} from 'react'
const Monitor = lazy(() => import("../pages/carbon/monitor"))

export default [
    {
       // index: true,
        path: 'monitor',
        element: <Monitor/>
     },
     
  
]