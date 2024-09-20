/*  能耗定额 */
import {lazy} from 'react'

const ParkQuota = lazy(() => import("../pages/quota/parkQuota/index.jsx"))
const QuotaAlarms = lazy(() => import("../pages/quota/quotaAlarms.jsx"))
const QuotaDetail= lazy(() => import("../pages/quota/quotaDetail.jsx"))



export let runtimeQuota = {
  '011401': ParkQuota,
  '011402': QuotaDetail,
  '011403': QuotaAlarms,

}

