import React, {useState, useEffect, useRef} from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import {Form, Select, Space, Divider} from 'antd' 
import {useSelector} from 'react-redux'
import {SiteManagerDesigner} from '@api/api'
import {selectProjectId, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import Report from './report'

export default function Index() {  
  const {Item} = Form
const [form] = Form.useForm()
  const [options, setOptions] = useState([])
  const projectId = useSelector(selectProjectId)
  const areaId = useSelector(selectOneLevelDefaultId)
  let [AreaID, setAreaid] = useState(areaId)
  const [initname, setInitname] = useState('')
  const onChange = (e) => {
    setInitname(e)
  }
  const CustItem = () => {
  return <Space size={32}>
       <Divider style={{margin: '0px', marginLeft: '32px', height: '32px'}} type="vertical" />
       <Item name="stationName" noStyle >
            <Select options={options} fieldNames={{label: 'name', value: 'name'}} style={{width: '264px'}} onChange={onChange}></Select>  
       </Item>
    </Space>
 }
const getopti = async() => {
  try {
   let {success, data} = await  SiteManagerDesigner.FindSiteList(projectId, AreaID)
   if(success&& Array.isArray(data) && data.length > 0) {
     setOptions([...data])
     setInitname(data[0].name)
     form.setFieldsValue({
      stationName: data[0].name
     })
   }else {
    setOptions([])
    setInitname('')
    form.setFieldsValue({
      stationName: ''
     })
   }
  } catch (error) {
    console.log(error)
  }
 
}

useEffect(() => {
    if(projectId && AreaID) {
      getopti()
    }    

}, [projectId, AreaID])

  return (
    <CustContext.Provider value={{handler: setAreaid, custview: <CustItem  />, form }}>
    <Pagecount showserach={true} bgcolor="transparent" pd="0px">   
        <Report projectId={projectId}  stationName={initname}/>
    </Pagecount>
    </CustContext.Provider>
  )
}
