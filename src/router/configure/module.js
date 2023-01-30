/*  运行监控 */
import {lazy} from 'react'
const Project = lazy(() => import("@pages/module/project"))
const User = lazy(() => import("@pages/module/user"))
const Region = lazy(() => import("@pages/module/region"))
const File= lazy(() => import("@pages/module/file"))
const Energy = lazy(() => import("@pages/module/energy"))
const Pricing= lazy(() => import("@pages/module/pricing"))
const Cockpit= lazy(() => import("@pages/module/cockpit"))

export default [
    {
       // index: true,
        path: 'project',
        element: <Project/>
     },
     {
         path: 'user',
         element: <User/>
     },
     {
        path: 'region',
        element: <Region/>
    },
    /*  {
        path: 'File',
        element: <File/>
    },
     {
        path: 'energy',
        element: <Energy/>
    }, 
    {
        path: 'pricing',
        element: <Pricing/>
    },*/
    {
        path: 'cockpit',
        element: <Cockpit/>
    },
  
]