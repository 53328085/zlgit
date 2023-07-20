/*  光伏发电 配置 */
import {lazy} from 'react'
const Station = lazy(() => import("@pages/photovoltaic/configure/station"))
const Inverter = lazy(() => import("@pages/photovoltaic/configure/inverter"))
const Chart= lazy(() => import("@pages/photovoltaic/configure/chart"))


export let designerSolar = {
    '020801': Station, 
    '020802': Inverter,
    '020803': Chart,
}


