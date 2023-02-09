import React,{useState} from 'react'
import {useSelector} from 'react-redux'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import DeviceContent from './deviceContent'
import { Monitoring } from '@api/api.js'
import {selectCurProject} from '@redux/user.js'

export default function Index() {
  const [value,setvalue] = useState('0')
  const projectId = useSelector(selectCurProject)
  console.log(projectId)
  const tabs =[
    {
      key:'0',
      label:'网关类型',
    },
    {
      key:'1',
      label:'电表类型',
    },
    {
      key:'2',
      label:'水表类型',
    },
    {
      key:'3',
      label:'燃气表类型',
    },
    {
      key:'4',
      label:'传感器类型',
    },
    {
      key:'5',
      label:'变压器类型',
    },
    {
      key:'6',
      label:'视频监控类型',
    },
  ] 
  const gatewaycolumns = [
    {
      title:'网关型号',
      dataIndex:''
    },
    {
      title:'网关缩略图',
      dataIndex:''
    },
    {
      title:'已用网关数量',
      dataIndex:''
    },
    {
      title:'操作',
      dataIndex:''
    },
  ]

  let params = {
    projectId:1,
    pageNum:1,
    pageSize:10,
    alike:''
  }

  const getTableData = async ()=>{
    const {DeviceTypeManager:{ GatewayType}} = Monitoring;
    console.log(GatewayType)
    const result = await GatewayType(params)
    console.log(result)
  }
  getTableData()
  const propsData = {
      tabs,
      value,
      setvalue
  }
  return (
    <CustContext.Provider value={propsData}>
      <Pagecount>
        {
          <DeviceContent columns = {value==='0'? gatewaycolumns:[]}></DeviceContent>
        }
       
        
      </Pagecount>
    </CustContext.Provider>
    
  )
}
