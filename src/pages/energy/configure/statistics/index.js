import React, {useState, useEffect, useRef} from 'react'
 
import Region from './region'
 
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
  const [levels, setLevels] = useState([])
 
  const levelData = levels.find(l => l.level == value) || {}
 



  const allLevel = async () => {
     try {
      let {success, data} =  await Area.AllLevel(projectId)
      if(success && Array.isArray(data)) {
         setTabs([...data.map((d) => ({label: d.name, key: String(d.level)}))])
         setvalue(String(data[0]?.level))
         setLevels(data) 
      }

     } catch (error) {
      console.log(error)
     }
    
  }

  const propsData ={
    tabs,
    value,
    setvalue,
    
  }
 
  useEffect(() => {
    allLevel()
  }, [])
  return (
    <CustContext.Provider value={propsData}>
    <Pagecount showserach={false}>   
    {  levels.length > 0 &&  <Region projectId={projectId} CModal={CModal} {...levelData} allLevel={levels}   /> }
    </Pagecount>
    </CustContext.Provider>
  )
}
