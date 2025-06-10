// 水务管理
import {lazy} from 'react'
const DmaPartitionManagement = lazy(() => import("@pages/waterManagement/configure/dmaPartitionManagement"))
 
 
export const designerWaterManagement = {
    '021501': DmaPartitionManagement,
}
