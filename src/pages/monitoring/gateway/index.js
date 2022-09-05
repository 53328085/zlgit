import React, {useState, useEffect} from 'react'
import {useSelector, useStore, useDispatch} from 'react-redux'
import {useAntdTable, usePagination} from 'ahooks'
import {Form, Select} from 'antd'
import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import UserCard from '@com/useCard'
import {SettingManage} from '@api/api.js'
import {selectCurProject} from '@redux/user.js'
import CustContext from '@com/content.js'
// import {selectDisplay} from '@redux/params.js'
import columns,  { onDesc} from './columns'
import style from'./style.module.less'


export default function Index() {
  const [form] = Form.useForm()
  const {Option} = Select
  const [selectedValue, setselectedValue] = useState(null)
  const onChange = (value) => {
    console.log(`selected ${value}`);
    setselectedValue(value);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };

  const [formparams, setFormparams] = useState(form.getFieldValue())
  const projectId = useSelector(selectCurProject)?.id 
  // let [display, setDisplay] = useState(useSelector(selectDisplay))
  let [display, setDisplay] = useState(true)
  const store = useStore()
  store.subscribe(() => {
      setDisplay(store.getState().params.display)
  })

  let params = {
    projectId: projectId,
    enableState:1,
    pageNum: 1,
    pageSize: 12,
    alike: '',
  }

  const getTableData = ({ current, pageSize}, formData) => {
    setFormparams((form) => ({...form, ...formData}))
    if(!display) return;

    params = Object.assign({}, params, {PageNum: current, pageSize}, formData)
    return SettingManage.GatewayFindAlike(params).then(res => {
      let {success, data, totalNum} = res;
      console.log(data)
      if (success && Array.isArray(data)) {
        return {
          total: totalNum,
          list: data
        }
      
      }else {
        return {
          total: 0,
          list: []
        }
      }
    })
  }

  const getCardData = ({ current, pageSize}) => {
    params = Object.assign({}, params, {PageNum: current, pageSize})
    return SettingManage.GatewayFindAlike(params).then(res => {
      let {success, data, totalNum} = res;
      if (success && Array.isArray(data)) {
        return {
          total: totalNum,
          list: data
        }
      
      }else {
        return {
          total: 0,
          list: []
        }
      }
    })
  }

  const {tableProps, search} = useAntdTable(getTableData,{
    form,
    refreshDeps: [projectId, display, selectedValue],
    defaultPageSize:12,
  })
  console.log(tableProps)

  const {data, pagination} = usePagination(getCardData,{
    refreshDeps: [projectId, formparams],
    defaultPageSize:9,
  })

  const propsData ={
    form,
    search,
    display,
    setDisplay,
  }

  return (
    <CustContext.Provider value= {propsData}>
      <Pagecount>
      <Select
        className={style.selectCss}
        showSearch
        placeholder="网关型号"
        optionFilterProp="children"
        onChange={onChange}
        onSearch={onSearch}
        size="middle"
        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
      >
        <Option value="jack">Jack</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="tom">Tom</Option>
      </Select>
        {display ? <UserTable columns={columns}   {...tableProps} rowKey='id' /> : 
          <UserCard   {...{data, pagination}} /> 
        }
      </Pagecount>
    </CustContext.Provider>
  )
}
