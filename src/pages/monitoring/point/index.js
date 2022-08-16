import React, {useState, useEffect} from 'react'
import {useSelector, useStore} from 'react-redux'
import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import {Meter} from '@api/api.js'
import { recordNo } from '../../../redux/systemconfig'
import {selectCurProject} from '@redux/user.js'
import {selectArea} from '@redux/params.js'
export default function Index() {
  const [value, SetValue] = useState(1)
  const [dataSource, setDataSource] = useState([]) 
  const projectId = useSelector(selectCurProject)?.id
  const arearParams = useSelector(selectArea)
  let [initparams, setInitparams] = useState({...arearParams})
  const store = useStore()
  //const projectId = useSelector()
  const columns = [
    {
      dataIndex: "sn",
      title: "设备编号",
      key: 'sn'
    },
    {
      dataIndex: "categoryName",
      title: "设备型号",
      key: 'categoryName'
    },
    {
      dataIndex: "status", // status 1: 离线 2：在线
      title: "设备状态",
      key: 'status'
    },
    {
      dataIndex: "address",
      title: "安装地址",
      key: 'address'
    },
    {
      dataIndex: "customer",
      title: "客户名",
      key: 'customer'
    },
    {
      dataIndex: "lastSampleTime",
      title: "更新时间",
      key: 'lastSampleTime'
    },
  ]
  const params = {
    projectId: projectId,
    meterType: value*1,
    lineStatus: 0,
    bindStatus: 0,
    pageNum: 1,
    pageSize: 12,
    alike: '',
  }
  const getData = () => {
    Meter.Overview(params).then(res => {
      let {success, data} = res
      if (success && Array.isArray(data?.data)) {
        setDataSource(data.data)
      }else {
        setDataSource([])
      }
    })
  }

  useEffect(() => { // 监听value数据变化    
    getData()
    return () => {}
  }, [value, projectId, initparams])
/*   useEffect(() => { 
    getData()
  }, [projectId])
  useEffect(() => { 
    getData()
  }, [initparams]) */
  
  const tabs = [
    {label: '电表', value: 1},
    {label: '水表', value: 2},
    {label: '燃气表', value: 3}
  ]
  const onDesc = {
      expandedRowRender: (record) => {
         const desc = record.data.map(r => <span key={r.pointId}>{r.description}{r.display}</span>)
         return (<div key={record.id}>{desc}</div>)
        },
      rowExpandable: (record) => Array.isArray(record.data) && record.data?.length > 0
    }

  return (
    <Pagecount tabs={tabs} value={value} setvalue={SetValue}>
       <UserTable columns={columns} dataSource={dataSource} expandable={onDesc}/>
    </Pagecount>
  )
}
