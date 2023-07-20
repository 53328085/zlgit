/*  碳排管理 */
import {lazy} from 'react'

//const Monitor = lazy(() => import("@pages/carbon/monitor"))
const Summary = lazy(() => import("@pages/carbon/summary"))
const Details = lazy(() => import("@pages/carbon/details"))
const Direction = lazy(() => import("@pages/carbon/direction"))
const Report = lazy(() => import("@pages/carbon/report"))

export let runtimeCarbon = {
    '011201': Summary, 
    '011202': Details, 
    '011203': Direction, 
    '011204': Report, 
}
