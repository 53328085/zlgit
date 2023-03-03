import React ,{useCallback, useEffect, useState}from 'react'
import { useSelector } from 'react-redux'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import ParkStreet from './parkstreet'
import PublicLight from './publiclight'
import {Monitoring} from "@api/api"
const { PubliclightManager:{AeraQueryAll}}=Monitoring
export default function Index() {
  const [value, setvalue] = useState('0')
  const projectId = useSelector(state => state.system.menus.projectId)
  const [tabs,setTabs] =useState([
    {key: '0',label: '园区路灯'},
    {key: '1',label: '公共照明'},
  ])

  const [areaList,setAreaList] = useState(null)
  let dataProps={
    value,
    setvalue,
    tabs,
  }
  let Coms = [
    <ParkStreet areaList={areaList}/>,
    <PublicLight areaList={areaList}/>,
  ]
  const getAeraQueryAll= async ()=>{
    const resp = await AeraQueryAll(projectId)
    if(resp.success&&Array.isArray(resp.data)){
      setAreaList([{name:'全部园区',id:0},...resp.data])
    }else{
      setAreaList([])
    }
  }
  useEffect(()=>{
    getAeraQueryAll()

  },[])
  return (
    <CustContext.Provider value={dataProps}>
      <Pagecount>
       { Coms[Number(value)] }
      </Pagecount>
    </CustContext.Provider>
  )
}
