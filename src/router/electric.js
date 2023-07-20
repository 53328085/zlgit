/*  电气安全 */
import {lazy} from 'react'

const Safe = lazy(() => import("../pages/electric/safe"))
const Warning= lazy(() => import("../pages/electric/warning"))
const Runreport = lazy(() => import("../pages/electric/runreport"))

export let runtimeSafe = {
    '010601': Safe,
    '010602': Warning,
    '010603': Runreport
}
