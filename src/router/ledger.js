/*  设备台账 */
import {lazy} from 'react'

const DeviceLedger = lazy(() => import("../pages/ledger/deviceLedger"))
const SpareParts= lazy(() => import("../pages/ledger/spareParts"))
 

export let ledger = {
    '011501': DeviceLedger,
    '011502': SpareParts,
    
}
