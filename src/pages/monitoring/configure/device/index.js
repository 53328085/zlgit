import React,{useEffect, useState} from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import GateWay from './gateway'
import Electric from './electric'
import Water from './water'
import Fire from './fire'
import Sensor from './sensor'
import Transform from './transform'
import Video from './video'

import { Monitoring } from '@api/api.js'
import { message } from 'antd'
const { DeviceTypeManager: { AllDeviceStyle,}, } = Monitoring

export default function Index() {
  const [value, setvalue] = useState('0')


  const [Coms,setComs]=useState([
    <GateWay/>,
    // <Electric />,
    // <Water/>,
    // <Fire />,
    // <Sensor />,
    // <Transform />,
    // <Video/>
  ])
  const [tabs,setTabs] =useState([
    {key: '0',label: '网关'},
    {key: '1',label: '电表'},
    {key: '2',label: '水表'},
    {key: '3',label: '燃气表'},
    {key: '4',label: '传感器'},
    {key: '5',label: '变压器'},
    {key: '6',label: '视频监控'},
  ])
  let dataProps={
    value,
    setvalue,
    tabs,

  }

 
  const getAllDeviceStyle=async ()=>{
    const resp = await AllDeviceStyle()
    if(resp.success&&Array.isArray(resp.data)){
      const data = resp.data
      let arr=[<GateWay/>]
     
      for(let k of data){
        if(k.name==='电表'){
          arr[1]=<Electric deviceStyle={k.deviceStyle}/>
        }else if(k.name==='水表'){
          arr[2]=<Water deviceStyle={k.deviceStyle}/>
        }
        else if(k.name==='燃气表'){
          arr[3]=<Fire deviceStyle={k.deviceStyle}/>
        }else if(k.name==='传感器'){
          arr[4]=<Sensor deviceStyle={k.deviceStyle}/>
        }else if(k.name==='变压器'){
          arr[5]=<Transform deviceStyle={k.deviceStyle}/>
        }else if(k.name==='视频监控'){
          arr[6]=<Video deviceStyle={k.deviceStyle}/>
        }
      }
      setComs(()=>arr)
      console.log(arr)
    }
  }
  useEffect(()=>{
    getAllDeviceStyle()
    console.log(Coms)
  },[])
 
  return (
    <CustContext.Provider value={dataProps}>
      <Pagecount>
       { Coms[Number(value)] }
      </Pagecount>
    </CustContext.Provider>
  )
}
