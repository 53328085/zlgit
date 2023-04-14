import React, { useEffect, useMemo, useState } from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import { Monitoring } from '@api/api.js'
import style from './style.module.less'
import GateWay from './gateway'
import Electric from './electric'
import Water from './water'
import Fire from './fire'
import Sensor from './sensor'
import Transform from './transform'
import Video from './video'
import Energy from './energy'
import { message } from 'antd'
export default function Index() {
  const [value, setvalue] = useState('0')
  const [tabs,setTabs] =useState([{key: '0',label: '网关类型',}])
  const { DeviceTypeManager: { AllDeviceStyle } } = Monitoring;
 
  

  let dataProps = {
    value,
    setvalue,
    tabs
  };
 
  const getAllDeviceStyle = async () => {
    try{
      const result = await AllDeviceStyle()
      const { data, errMsg, success } = result;
      if (success) {
        if(Array.isArray(data)){
          let arr= data.map(item => ({
            key: `${item.deviceStyle}`,
            label: `${item.name}类型`
          }))
          arr.unshift({ key: '0', label: '网关类型' })
          setTabs(arr)
          dataProps = {...dataProps,  tabs } 
        }
      }else{
        message.error(errMsg)
      }
    }catch(e){console.log(e)}
  
  }
  let Coms = [
    <GateWay />,
    <Electric />,
    <Water/>,
    <Fire />,
    <Sensor />,
    <Transform />,
    <Video/>,
    '',
    '',
    '',
    '',
    <Energy/>
  ]
  useEffect(() => {
    getAllDeviceStyle()
  }, [])

  return (
    <CustContext.Provider value={dataProps}>
          <Pagecount>
             { Coms[Number(value)] }
          </Pagecount>
    </CustContext.Provider>

  )
}
