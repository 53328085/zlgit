/*  电气安全 */
import {lazy} from 'react'
const Safe = lazy(() => import("../pages/electric/safe"))
const Warning= lazy(() => import("../pages/electric/warning"))
export default [
    {
       // index: true,
        path: 'safe',
        element: <Safe/>
     },
     {
         path: 'warning',
         element: <Warning/>
     },
    
  
]