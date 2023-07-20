/*  结算收费 */
import {lazy} from 'react'

const Summary = lazy(() => import("../pages/prepayment/summary"))
const Bill = lazy(() => import("../pages/prepayment/bill"))
const Charge= lazy(() => import("../pages/prepayment/charge"))
const Customer = lazy(() => import("../pages/prepayment/customer"))
const Data= lazy(() => import("../pages/prepayment/data"))
const Property = lazy(() => import("../pages/prepayment/property"))
const Reading= lazy(() => import("../pages/prepayment/reading"))
const Recharge = lazy(() => import("../pages/prepayment/recharge"))
const Run = lazy(() => import("../pages/prepayment/run"))


export let runtimePrepay = {
  '010801': Summary,
  '010802': Customer,
  '010803': Charge,
  '010804': Property,
  '010805': Bill,
  '010806': Data,
  '010807': Reading,
  '010808': Recharge,
  '010809': Run
}

