import React, {useState, useEffect, useRef, Suspense, useMemo} from 'react'
import {useSelector} from 'react-redux'
import {useAntdTable, usePagination} from 'ahooks'
import {Button, Form, message} from 'antd'
import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import UserCard from '@com/useCard'
import {Meter} from '@api/api.js'
import {selectCurProject} from '@redux/user.js'
import CustContext from '@com/content.js'
import columns,  { onDesc} from './columns'
import { CodeSandboxCircleFilled } from '@ant-design/icons'
export default function Index() {
  const [form] = Form.useForm()
  const [formparams, setFormparams] = useState(form.getFieldsValue())
  const [value, setvalue] = useState('electric')
  const projectId = useSelector(selectCurProject)?.id 
  
  let [display, setDisplay] = useState(true)  
  const [total, setTotal] = useState(0)
  const tableref = useRef()
  const meterType = {
    electric: 1,
    water: 2,
    gas: 3
  }
  let params = {
    projectId: projectId,
    meterType: meterType[value],
    lineStatus: 0,
    bindStatus: 0,
    pageNum: 1,
    pageSize: 12,
    alike: '',
  }
  const header = useMemo(() => columns.map(i => i.dataIndex), [columns])
  const firstRow = useMemo(() => {
    let obj = {}
    columns.forEach(col => {
      obj[col.dataIndex] = col.title
    });
    return obj
  }, [columns])  
  const onDownload = () => {
    params.pageSize = total
    Meter.Overview(params).then(res => {
      let {success, data } = res
      let tbData = data?.data      
      if (!success) return message.warning('下载数据出错')
      if(success && Array.isArray(tbData)) {
        let jsondata = tbData.map(d => {
          let obj = {}
          for(let key of header) {
             if (key == 'status') {
               obj[key] = ['', '离线', '在线'][d[key]] || ''              
             } else {
              obj[key] = d[key]
             } 
          }
          return obj
        } )       
        tableref.current.downloadByData({header, data:[firstRow, ...jsondata], sheetName: '测试' })
      }
    }).catch((e) => {
      console.log(e)
      message.warning('下载数据出错')
    })
    
  }


  const tabs = [
    {label: '电表', key: 'electric'},
    {label: '水表', key: 'water'},
    {label: '燃气表', key: 'gas'}
  ]
  

  const getTableData = ({current, pageSize}, formData) => {  
    setFormparams((form) => ({...form, ...formData}))
   
    if (!display) return;
    params = Object.assign({}, params, {pageNum: current, pageSize}, formData)
    return  Meter.Overview(params).then(res => {
      let {success, data, totalNum} = res
       setTotal(totalNum)
      if (success && Array.isArray(data?.data)) {
        return {
          total: totalNum,
          list: data.data
        }
      
      }else {
        return {
          total: 0,
          list: []
        }
      }
    })
  }
  const getCardData = ({current, pageSize}) => {  
    params = Object.assign({}, params, {pageNum: current, pageSize}, formparams)
    return  Meter.Overview(params).then(res => {
      let {success, data, totalNum} = res
      if (success && Array.isArray(data?.data)) {
        return {
          total: totalNum,
          list: data.data
        }
      
      }else {
        return {
          total: 0,
          list: []
        }
      }
    })
  }
  const {tableProps, search} = useAntdTable(getTableData, {
    form,
    refreshDeps: [projectId, value, display],
    defaultPageSize: 12,
   })
 
   const {data, pagination} = usePagination(getCardData, {
    refreshDeps: [projectId, value, formparams],
    defaultPageSize: 12,

   })
  const propsData ={
    tabs,
    value,
    setvalue,
    form,
    search,
    display,
    apply: true,
    data: true,
    setDisplay,
    onDownload
  }
  return (
    <CustContext.Provider value={propsData}>
    <Pagecount showserach={true}>        
       {display ? <UserTable columns={columns}  expandable={onDesc} {...tableProps} rowKey='id' ref={tableref}/> : 
        <UserCard   {...{data, pagination}} /> 
    }
    </Pagecount>
    </CustContext.Provider>
  )
}
