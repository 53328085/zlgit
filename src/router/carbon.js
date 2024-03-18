/*  碳排管理 */
import {lazy} from 'react'

//const Monitor = lazy(() => import("@pages/carbon/monitor"))
const Summary = lazy(() => import("@pages/carbon/summary"))
const Details = lazy(() => import("@pages/carbon/details"))
const Examining = lazy(() => import("@pages/carbon/examining"))
const Direction = lazy(() => import("@pages/carbon/direction"))
const Report = lazy(() => import("@pages/carbon/report"))

export let runtimeCarbon = {
    '011201': Summary, 
    '011202': Examining, 
    '011203': Details, 
    '011204': Direction, 
    '011205': Report, 
}
