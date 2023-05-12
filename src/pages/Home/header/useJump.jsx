import React, {useEffect, useMemo} from 'react'
import { useSelector, useDispatch  } from "react-redux";
 
import { datascreen, getCurrentScreen, configState} from "@redux/systemconfig";
export default function useJump(primary, isconfig) {
    const dispatch = useDispatch();
    const {
        bigScreenEnabled,
       bigScreenUrl,
      monitorBigScreenEnabled,
      monitorBigScreenUrl,
      safeBigScreenEnabled,
      safeBigScreenUrl,
     distributionEnabled,
     distributionScreenUrl,
     prepayEnabled,
     prepayScreenUrl,
     energyEnabled,
     energyScreenUrl,
     solarEnabled,
     solarScreenUrl,
     storageEnabled,
     storageScreenUrl,
     carbonEnabled,
     carbonScreenUrl,
    maintenanceEnabled,
     maintenanceScreenUrl
      } = useSelector(datascreen);
      
      const onChoose = () => {
        if(isconfig) return;   
        switch (primary) {
          case  'runtimeProject':        
           console.log(bigScreenEnabled) 
           dispatch(getCurrentScreen({type: bigScreenEnabled, key: bigScreenUrl, primary}));
           break;
         case  'runtimeMonitor':          
           dispatch(getCurrentScreen({type: monitorBigScreenEnabled, key: monitorBigScreenUrl, primary}));
           break;
         case  'runtimeSafe':
            dispatch(getCurrentScreen({type: safeBigScreenEnabled, key: safeBigScreenUrl, primary}));
            break;
         case  'runtimeDistribution':
            dispatch(getCurrentScreen({type: distributionEnabled, key: distributionScreenUrl, primary}));
            break;
         case  'runtimePrepay':
            dispatch(getCurrentScreen({type: prepayEnabled, key: prepayScreenUrl, primary}));
            break;
         case  'runtimeEnergy':
            dispatch(getCurrentScreen({type: energyEnabled, key: energyScreenUrl, primary}));
            break;          
         case  'runtimeSolar':
            dispatch(getCurrentScreen({type: solarEnabled, key: solarScreenUrl, primary}));
            break;              
         case  'runtimeStorage':
            dispatch(getCurrentScreen({type: storageEnabled, key: storageScreenUrl, primary}));
            break;
          
         case  'runtimeCarbon':
            dispatch(getCurrentScreen({type: carbonEnabled, key: carbonScreenUrl, primary}));
            break;
         case  'runtimeMaintenance':
                dispatch(getCurrentScreen({type: maintenanceEnabled, key: maintenanceScreenUrl, primary}));
                break; 
         default:
            dispatch(getCurrentScreen({type: 0, key: '', primary: ''}));                              
        }
     }
    useEffect(() => {
      onChoose();
    }, [primary, isconfig])
}
