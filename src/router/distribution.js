/*  配电管理 */
import {lazy} from 'react'

const Summary = lazy(() => import("../pages/distribution/summary"))
const Loop = lazy(() => import("../pages/distribution/loop"))
const Map= lazy(() => import("../pages/distribution/map"))
const Report = lazy(() => import("../pages/distribution/report"))
const Surroundings= lazy(() => import("../pages/distribution/surroundings"))
//const Video = lazy(() => import("../pages/distribution/video"))
const Video = lazy(() => import("../pages/monitoring/video"))
const Warning= lazy(() => import("../pages/distribution/warning"))
const Transformer = lazy(() => import("../pages/distribution/transformer"))
const Contact= lazy(() => import("../pages/distribution/contact"))
const Fibre= lazy(() => import("../pages/distribution/fibre"))


export let runtimeDistribution = {
    '010701': Summary,
    '010702': Map,
    '010703': Transformer,
    '010704': Loop,
    '010706': Surroundings,
    '010705': Video,
    '010707': Contact,
    '010708': Fibre,
    '010709': Warning,
    '010710': Report
}

