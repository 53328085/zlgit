import React, {useState, useEffect, useRef, Suspense, useMemo} from 'react'
import {useSelector} from 'react-redux'
import {useAntdTable, usePagination} from 'ahooks'
import {Table, Form, message, Space, Radio, Select, Divider } from 'antd'

import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import UserCard from '@com/useCard'
import {Cradiogroup} from '@com/comstyled'
import {Meter} from '@api/api.js'
import {selectCurProject} from '@redux/user.js'
import CustContext from '@com/content.js'
import columns,  { onDesc} from './columns'
export default function Index() {
  const [form] = Form.useForm()
  const [formparams, setFormparams] = useState(form.getFieldsValue())
  const [value, setvalue] = useState('electric')
  const projectId = useSelector(selectCurProject)?.id 
  let [display, setDisplay] = useState(true)  
  const [total, setTotal] = useState(0)
  const [stateV, setStateV] = useState();
  const [listdata, setListdata] = useState([])
  const tableref = useRef()
  const tableall = useRef()
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
        let colinfo = [ // wch 字符, wpx 像素          
          {
            wch: 20
          },
          {
            wch: 16,
          },
          {wch: 10},
          {wch: 10},
          {wch: 10},
          {wch: 60}
        ] 
    
        tableref.current.downloadByData({header, data:[firstRow, ...jsondata], sheetName: '测试', option: {colinfo} })
      }
    }).catch((e) => {
      console.log(e)
      message.warning('下载数据出错')
    })
    
  }


  const tabs = [
    {label: '电表', value: 'electric'},
    {label: '水表', value: 'water'},
    {label: '燃气表', value: 'gas'},
    {label: '传感器', value: 'sensor'},
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
   // console.log(11111);
   if (display) return;
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
    defaultParams: [
     { current: 1, pageSize: 12}, // 分页参数
     params, // 表单参数
    ],
    refreshDeps: [projectId, value, display], // projectId: 项目ID， value: 电表、水表、燃气表，  display: 表格或卡片模式
   //defaultPageSize: 12,
   }) 
   //console.log(search);
   const {data, pagination} = usePagination(getCardData, {
    refreshDeps: [projectId, value, formparams],
    defaultPageSize: 12,

   })
const printContent = () => tableref.current?.printContent;
const PrintAllContent = async () => {
 /*   try {
    await runAsync({current:1, pageSize: total})
    return tableref.current?.printContent;
   } catch (error) {
     console.log(error);
   } */
   const {list} = await getTableData({current: 1, pageSize: total}, formparams)
   console.log(list)
  
   setListdata(() => [...list])
  
   return () => tableall.current
}
const propsData = { 
  //tabs, 
  value,
  setvalue,
  form,
  search,
  display,
  apply: true,
  data: true,
  print: true,
  printContent,
  PrintAllContent,
  setDisplay,
  onDownload,
}
 const checkChange = ({target: {value}}) => {
   setvalue(value)
 }
const changeState = ({target: {value}}) => {
  setStateV()
};
  return (
    <CustContext.Provider value={propsData}>
    <Pagecount showserach={true}>     
        <div className='button--tabs'>
         <Cradiogroup options={tabs} onChange={checkChange} value={value} optionType="button" />
         <Space>
          <Divider type="vertical" style={{height: '32px'}} />
          <Select 
           allowClear
           placeholder="水表型号"           
           style={{width: '160px'}}
           defaultValue="lucy"
           options={[{ value: 'lucy', label: 'Lucy' }]}
           ></Select>
          <Divider type="vertical" style={{height: '32px'}} />
         <Radio.Group onChange={changeState} value={stateV}>
            <Radio value={1}>正常</Radio>
            <Radio value={2}>告警</Radio>
            <Radio value={3}>失联</Radio>
         </Radio.Group>
         </Space>
        </div>    
       {display ? <UserTable columns={columns}  expandable={onDesc} {...tableProps}  rowKey='id' ref={tableref}/> : 
        <UserCard   {...{data, pagination}} /> 
       
    }
    <div   style={{display: 'none'}}>    
       <Table columns={columns}  expandable={onDesc} dataSource={listdata} pagination={false} rowKey='id'  ref={tableall}  />
   </div>
 
 
    </Pagecount>
    </CustContext.Provider>
  )
}
