import {lazy} from 'react'
const WaterNetworkTopology = lazy(() => import("../pages/waterManagement/waterNetworkTopology"))
const DmaPartitionLeakControl = lazy(() => import("../pages/waterManagement/dmaPartitionLeakControl"))

export const runtimeWaterManagement = {
    '011801': DmaPartitionLeakControl,  //DMA分区控漏
    '011802': WaterNetworkTopology, // 水网拓扑
     
    
}