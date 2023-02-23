import React, {useState, useEffect} from 'react'
import style from './style.module.less'
import Region from './regionManage'
import Building from './buildingManage'
import Room from './roomManage'
import CModal from '@com/useModal'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import {Area} from '@api/api.js'

export default function Index() {
  const projectId = useSelector(selectProjectId);
  const [value, setvalue] = useState()
  const [tabs, setTabs] = useState([])
  const allLevel = async () => {
     try {
      let {success, data} =  await Area.AllLevel(projectId)
      if(success && Array.isArray(data)) {
         setTabs([...data.map((d) => ({label: d.name, key: d.level}))])
         setvalue(data[0]?.level)
      }

     } catch (error) {
      console.log(error)
     }
    
  }
/*   const tabs = [
    { label: '园区', key: 'region' },
    { label: '建筑', key: 'building'},
    { label: '房间', key: 'room' },
  ] */
  const propsData ={
    tabs,
    value,
    setvalue
  }
/*   const  RegionCom = {
    region: Region,
    building: Building,
    room: Room,
   }
  let Com = RegionCom[value] */
  useEffect(() => {
    allLevel()
  }, [])
  return (
    <CustContext.Provider value={propsData}>
    <Pagecount showserach={false}>   
       <Region projectId={projectId} CModal={CModal} level={value} />
    </Pagecount>
    </CustContext.Provider>
  )
}
