import React ,{useCallback, useEffect, useState,useRef}from 'react'
import { useSelector } from 'react-redux'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import ParkStreet from './parkstreet'
import PublicLight from './publiclight'
import {Monitoring} from "@api/api"
const { PubliclightManager:{AeraQueryAll},DeviceManager:{OneLevel}}=Monitoring
export default function Index() {
  const [value, setvalue] = useState('0')
  const projectId = useSelector(state => state.system.menus.projectId)
  const [tabs,setTabs] =useState([
    {key: '0',label: '园区路灯'},
    {key: '1',label: '公共照明'},
  ])

  const [areaList,setAreaList] = useState(null)
  const levelname = useRef("")
  let dataProps={
    value,
    setvalue,
    tabs,
  }
    //获取第一级区域名
    const getOneLevel=async()=>{
      const res =  await OneLevel(projectId)
      if(res.success &&res.data){
        levelname.current=res.data.name
        getAeraQueryAll(res.data.name)
      }else{
       message.error(res.errMsg)
      }
     }
  let Coms = [
    <ParkStreet areaList={areaList} levelname={levelname}/>,
    <PublicLight areaList={areaList} levelname={levelname}/>,
  ]
  const getAeraQueryAll= async (name)=>{
    const resp = await AeraQueryAll(projectId)
    if(resp.success&&Array.isArray(resp.data)){
      setAreaList([{name:name,id:0},...resp.data])
    }else{
      setAreaList([])
    }
  }
  useEffect(()=>{
    getOneLevel()

  },[])
  return (
    <CustContext.Provider value={dataProps}>
      <Pagecount>
       { Coms[Number(value)] }
      </Pagecount>
    </CustContext.Provider>
  )
}
