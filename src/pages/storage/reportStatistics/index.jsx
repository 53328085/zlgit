import React, {useState, useEffect} from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import CModal from '@com/useModal'
import {useSelector} from 'react-redux'
import {selectProjectId, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import Report from './report'
import {SiteManagerDesigner} from '@api/api'
import {Form, Space, Divider, Select } from 'antd'
const {Item} = Form
export default function Index() {  
  const projectId = useSelector(selectProjectId)
  const areaId = useSelector(selectOneLevelDefaultId)
  cosnt [options, setOptions] = useState([])
  let [AreaID, setAreaid] = useState(areaId)
  const CustItem = () => {
     <Space size={32}>
        <Divider />
        <Item name="stationName" noStyle>
             <Select options={options}></Select>  
        </Item>
     </Space>
  }
 const getopti = async() => {
   try {
    let {success} = await  SiteManagerDesigner.FindSiteList(projectId, areaId)
   } catch (error) {
     console.log(error)
   }
  
 }

 useEffect(() => {
   
      getopti()
    

 }, [projectId, AreaID])
  return (
    <CustContext.Provider value={{handler: setAreaid, custview: <CustItem />}}>
    <Pagecount showserach={true} >   
      <Report projectId={projectId}  areaId={AreaID} /> 
    </Pagecount>
    </CustContext.Provider>
  )
}
