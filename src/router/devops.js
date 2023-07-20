/*  运维管理 */
import {lazy} from 'react'
const Summary = lazy(() => import("../pages/devops/summary"))
const Inspection = lazy(() => import("../pages/devops/inspection"))
const Order= lazy(() => import("../pages/devops/order"))
const Runing = lazy(() => import("../pages/devops/runing"))
const Warning= lazy(() => import("../pages/devops/warning"))


export let runtimeMaintenance = {
    '011301': Summary, 
    '011302': Warning,
    '011303': Order,
    '011304': Inspection,
    '011305': Runing,
}
