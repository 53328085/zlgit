import React,{useState} from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import GateWay from './gateway'
import Electric from './electric'
import Water from './water'
import Fire from './fire'
import Sensor from './sensor'
import Transform from './transform'
import Video from './video'

export default function Index() {
  const [value, setvalue] = useState('0')
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
    tabs
  }
  let Coms = [
    <GateWay />,
    <Electric />,
    <Water/>,
    <Fire />,
    <Sensor />,
    <Transform />,
    <Video/>
  ]
  return (
    <CustContext.Provider value={dataProps}>
      <Pagecount>
       { Coms[Number(value)] }
      </Pagecount>
    </CustContext.Provider>
  )
}
