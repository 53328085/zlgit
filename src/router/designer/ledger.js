/**
 * 台账管理
 */
import {lazy} from 'react'
const LedgerManagement = lazy(() => import("@pages/ledger/configure/ledgerManagement"))
const SpareParts = lazy(() => import("@pages/ledger/configure/spareParts"))
 
export let ledger = {
    '021301': LedgerManagement,
    '021302': SpareParts,
}
