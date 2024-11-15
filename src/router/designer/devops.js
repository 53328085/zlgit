/*  运维管理 配置 */
import {lazy} from 'react'
 
const Inspection = lazy(() => import("@pages/devops/configure/inspection"))
const Order= lazy(() => import("@pages/devops/configure/order"))
const InspectionContent = lazy(() => import("@pages/devops/configure/inspectionContent"))
const InspectionAddress = lazy(() => import("@pages/devops/configure/inspectionAddress"))
const Classmanage = lazy(() => import("@pages/devops/configure/classmanage"))
const inspectionManagement = lazy(() => import("@pages/devops/configure/inspectionContent"))
export let maintenance = { 
    '021101': Order,
    '021103':InspectionContent,
    '021104':InspectionAddress,
    '021102': Inspection,
    '021105': Classmanage,
    '021106': inspectionManagement,
}
