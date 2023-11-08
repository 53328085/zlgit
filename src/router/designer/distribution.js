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
export let designerDistribution = {
    '020501': Room,
    '020502': Topology,
    '020503': LineManage,
    '020504': TransformerManage,
    '020505': MonitorManage,
    '020506': SensorManage,
    '020507': ContactManage,
    '020508': FibrtManage
}

