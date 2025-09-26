/*  光伏发电 */
import { lazy } from 'react'
// const Summary = lazy(() => import("@pages/photovoltaic/summary"))
// const Chart = lazy(() => import("@pages/photovoltaic/chart"))
// const Data = lazy(() => import("@pages/photovoltaic/data"))
// const Station = lazy(() => import("@pages/photovoltaic/station"))
// const Device = lazy(() => import("@pages/photovoltaic/device"))
// const Propare = lazy(() => import("@pages/photovoltaic/propare"))
// const Aerograph = lazy(() => import("@pages/photovoltaic/aerograph"))
// const Alarm = lazy(() => import("@pages/photovoltaic/alarm"))
// const Report = lazy(() => import("@pages/photovoltaic/report"))

const StationTopo = lazy(() => import("@pages/photovoltaic/data"))
const Station = lazy(() => import("@pages/photovoltaic/station"))
const InverterMonitor = lazy(() => import("@pages/photovoltaic/device"))
const Statistic = lazy(() => import("@pages/photovoltaic/propare"))
const Warning = lazy(() => import("@pages/photovoltaic/alarm"))
export let runtimeSolar = {
    // '011001': Summary, 
    // '011002': Chart, 
    // '011003': Station, 
    // '011004': Device, 
    // '011005': Data, 
    // '011006': Propare, 
    // '011007': Aerograph, 
    // '011008': Alarm, 
    // '011009': Report, 


    '011001': StationTopo,
    '011002': Station,
    '011003': InverterMonitor,
    '011004': Statistic,
    '011005': Warning,

}


