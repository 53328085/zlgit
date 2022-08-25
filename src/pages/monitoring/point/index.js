import React, {useState, useEffect} from 'react'
import {useSelector, useStore, useDispatch} from 'react-redux'
import {useAntdTable} from 'ahooks'
import {Form} from 'antd'
import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import UserCard from '@com/useCard'
import {Meter} from '@api/api.js'
import {selectCurProject} from '@redux/user.js'
import {selectDisplay} from '@redux/params.js'
import columns,  { onDesc} from './columns'
export default function Index() {
  const [form] = Form.useForm()
  const [value, SetValue] = useState('electric')
  const projectId = useSelector(selectCurProject)?.id 
  let [display, setDisplay] = useState(useSelector(selectDisplay))
  const store = useStore()
  store.subscribe(() => {
      setDisplay(store.getState().params.display)
  })
  const meterType = {
    electric: 1,
    water: 2,
    gas: 3
  }

  const tabs = [
    {label: '电表', value: 'electric'},
    {label: '水表', value: 'water'},
    {label: '燃气表', value: 'gas'}
  ]
  let params = {
    projectId: projectId,
    meterType: meterType[value],
    lineStatus: 0,
    bindStatus: 0,
    pageNum: 1,
    pageSize: 12,
    alike: '',
  }
  let DataContext = React.createContext()
  const getTableData = ({current, pageSize}, formData) => {     
    params = Object.assign({}, params, {pageNum: current, pageSize})
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
    refreshDeps: [projectId, value]
   })
   console.log(tableProps) 
  return (
    <Pagecount tabs={tabs} value={value} setvalue={SetValue} form={form} search={search}>   
   
       {display ? <UserTable columns={columns}  expandable={onDesc} {...tableProps} rowKey='id'/> : 
        <UserCard   {...tableProps} /> 
     /*  <UserCard  dataSource={dataSource} totalNum={totalNum}  datacontext={DataContext} current={current}  setCurrent={setCurrent} />  */
  
    }
    </Pagecount>
  )
}
