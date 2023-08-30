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
import Generic from './Generic' // 新增加的设备类型通用
import { Monitoring } from '@api/api.js'
import { message } from 'antd'
const { DeviceTypeManager: { AllDeviceStyle,},DeviceManager:{OneLevel} } = Monitoring

export default function Index() {
  const [value, setvalue] = useState('0')

  const [Coms,setComs]=useState([
    <GateWay/>,
  ])
  const [tabs,setTabs] =useState([
    {key: '0',label: '网关'},
  ])
  let dataProps={
    value,
    setvalue,
    tabs,
    tabwidth: "120px",
    tabgap: 8,
  }

 
  const getAllDeviceStyle=async ()=>{
    const resp = await AllDeviceStyle()
    if(resp.success&&Array.isArray(resp.data)){
      const data = resp.data
      let arr=[<GateWay/>]
     
      for(let k of data){
        if(k.name==='电表'){
          arr[1]=<Electric deviceStyle={k.deviceStyle} />
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
        }else if(k.deviceStyle >6 && k.name!="视频监控") {
          let i = Number(k.deviceStyle)
          arr[i] = <Generic deviceStyle={k.deviceStyle} name={k.name} key={k.deviceStyle} />
        }
      }
     // console.log(arr)
      const tabs = data.map(it=>{return {key:it.deviceStyle.toString(),label:it.name}})
   //   console.log(tabs)
     // tabs.pop()
      setTabs([{key: '0',label: '网关'},
      ...tabs
    ])

      setComs([...arr])
     
    }
  }
  useEffect(()=>{
    getAllDeviceStyle()
    
  },[])
 
  return (
    <CustContext.Provider value={dataProps}>
      <Pagecount>
       { Coms[Number(value)] }
      </Pagecount>
    </CustContext.Provider>
  )
}
