/*  配电管理 配置 */
import {lazy} from 'react'

const Room = lazy(() => import("@pages/distribution/configure/index/room"))
const Topology = lazy(() => import("@pages/distribution/configure/index/topology"))
const LineManage = lazy(() => import("@pages/distribution/configure/index/lineManage"))
const TransformerManage = lazy(() => import("@pages/distribution/configure/index/transformerManage"))
const MonitorManage = lazy(() => import("@pages/distribution/configure/index/monitorManage"))
const SensorManage = lazy(() => import("@pages/distribution/configure/index/sensorManage"))
const ContactManage = lazy(() => import("@pages/distribution/configure/index/contactManage")) 
const FibrtManage = lazy(() => import("@pages/distribution/configure/index/fibreManage"))
const Device = lazy(() => import("@pages/distribution/configure/index/device"))
const WorkTicket = lazy(() => import("@pages/distribution/configure/index/workTicket"))
export let designerDistribution = {
    '020501': Room,
    '020502': Topology,
    '020503': LineManage, // 回路管理
    '020504': TransformerManage,
    '020505': MonitorManage,
    '020506': SensorManage,
    '020507': ContactManage,
    '020508': FibrtManage,
    '020509': LineManage, // 线路管理
    '020510': Device, // 配电房设备管理
    '020511': WorkTicket, // 工作票管理
}

