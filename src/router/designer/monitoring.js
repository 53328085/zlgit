/*  运行监控 配置 */
import {lazy} from 'react'

const DeviceType = lazy(() => import("@pages/monitoring/configure/deviceType"))
const Device = lazy(() => import("@pages/monitoring/configure/device"))
const Lighting= lazy(() => import("@pages/monitoring/configure/lighting"))
const Line = lazy(() => import("@pages/monitoring/configure/line"))
const Warning= lazy(() => import("@pages/monitoring/configure/warning"))

export let designerMonitor = {
    '020301': DeviceType,
    '020302': Device,
    '020303': Lighting,
    '020304': Line,
    '020305': Warning,
}

