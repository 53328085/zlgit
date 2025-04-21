const path = require('path')
const imgurl ={}
let files = require.context('./', true, /\.png$/)
files.keys().forEach(filep => {   
    let filename = path.basename(filep, '.png')
    let file = require(filep +'')
    Object.assign(imgurl, {[filename]: file})
});
 export default imgurl
 
 export {ReactComponent as runtimeProject}   from './designerProject.svg'
 export {ReactComponent as designerProject}   from './designerProject.svg'

export {ReactComponent as designerMonitor}   from './designerMonitor.svg'
export {ReactComponent as runtimeMonitor}   from './designerMonitor.svg'
export {ReactComponent as designerSafe}   from './designerSafe.svg'
export {ReactComponent as runtimeSafe}   from './designerSafe.svg'
export {ReactComponent as designerDistribution} from './designerDistribution.svg'
export {ReactComponent as runtimeDistribution} from './designerDistribution.svg'
export {ReactComponent as runtimePrepay} from './runtimePrepay.svg'
export {ReactComponent as designerPrepay} from './runtimePrepay.svg'

export {ReactComponent as designerEnergy} from './designerEnergy.svg'
export {ReactComponent as runtimeEnergy} from './designerEnergy.svg'

export {ReactComponent as runtimeSolar} from './runtimeSolar.svg'
export {ReactComponent as designerSolar} from './runtimeSolar.svg'

export {ReactComponent as storage} from './storage.svg'
export {ReactComponent as runtimeStorage} from './storage.svg'

export {ReactComponent as runtimeCarbonEmissionManager} from './designCarbonEmissionManage.svg'
export {ReactComponent as designCarbonEmissionManage} from './designCarbonEmissionManage.svg'

export {ReactComponent as runtimeMaintenance} from './runtimeMaintenance.svg'
export {ReactComponent as maintenance} from './runtimeMaintenance.svg'


export {ReactComponent as quota} from './energy.svg'
export {ReactComponent as runtimeQuota} from './energy.svg'

export {ReactComponent as ledger} from './ledger.svg'
export {ReactComponent as runtimeLedger} from './ledger.svg'

export {ReactComponent as cabinets} from './cabinets.svg'
export {ReactComponent as runtimeCabinets} from './cabinets.svg'
export {ReactComponent as designerCommon} from './designerCommon.svg'

// 右边图标

export {ReactComponent as screen} from './screen.svg'
export {ReactComponent as user} from './user.svg'
export {ReactComponent as projectSet} from './projectSet.svg'
export {ReactComponent as platform} from './platform.svg'
export {ReactComponent as back} from './back.svg'

 export {ReactComponent as def}   from './default.svg'