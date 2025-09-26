/*  光伏发电 配置 */
import { lazy } from 'react'
const Station = lazy(() => import("@pages/photovoltaic/configure/station"))
const Inverter = lazy(() => import("@pages/photovoltaic/configure/inverter"))
const Price = lazy(() => import("@pages/photovoltaic/configure/price"))
const ParkImg = lazy(() => import("@pages/photovoltaic/configure/parkImg"))


export let designerSolar = {
    '020801': Station,
    '020802': Inverter,
    '020803': Price,
    '020804': ParkImg,
}


