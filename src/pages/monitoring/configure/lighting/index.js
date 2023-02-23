import React ,{useState}from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import ParkStreet from './parkstreet'
import PublicLight from './publiclight'
export default function Index() {
  const [value, setvalue] = useState('0')
  const [tabs,setTabs] =useState([
    {key: '0',label: '园区路灯'},
    {key: '1',label: '公共照明'},
  ])
  let dataProps={
    value,
    setvalue,
    tabs
  }
  let Coms = [
    <ParkStreet />,
    <PublicLight />,
  ]
  return (
    <CustContext.Provider value={dataProps}>
      <Pagecount>
       { Coms[Number(value)] }
      </Pagecount>
    </CustContext.Provider>
  )
}
