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
export default [
    {
       // index: true,
        path: 'summary',
        element: <Summary/>
     },
     {
         path: 'bill',
         element: <Bill/>
     },
     {
        path: 'charge',
        element: <Charge/>
    },
     {
        path: 'customer',
        element: <Customer/>
    },
    {
        path: 'data',
        element: <Data/>
    },
    {
        path: 'property',
        element: <Property/>
    },
    {
        path: 'reading',
        element: <Reading/>
    },
    {
        path: 'recharge',
        element: <Recharge/>
    },
    {
        path: 'run',
        element: <Run/>
    }
   
]