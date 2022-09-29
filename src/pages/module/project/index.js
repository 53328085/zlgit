import React, {useState, useEffect, useRef} from 'react'
import {useSelector} from 'react-redux'
import {useRequest} from 'ahooks'
import {Form, Select, Space, DatePicker, Input, Button} from 'antd'
import Pagecount from '@com/pagecontent'
import {Project} from '@api/api.js'
import {selectCurProject} from '@redux/user.js'
import CustContext from '@com/content.js'
import styled from 'styled-components'
import Item from './item'
import Set from './set'
const Maibox = styled.div`
  display: grid;
  grid-auto-rows: 145px;
  row-gap: 32px;
`
export default function Index() {
  const projectId = useSelector(selectCurProject)?.id 
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 12,
    projectName: '',
    valid: 0
  })
  const [value, setvalue] = useState('1')
  const {queryProject} = Project

  const tabs = [
    {label: '项目发布', key: '1'},
    {label: '项目设置', key: '2'},
   
  ]
  const getData = () => {
    return  queryProject(params).then(res => {
      let {success, data, totalNum} = res
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
  const {data , error, loading} = useRequest(getData)
  console.log(data)
  const propsData ={
    tabs,
    value,
    setvalue
  }
  return (
    <CustContext.Provider value={propsData}>
    <Pagecount showserach={false} pd="32px">   
        
             {
              value == '1' ? <Maibox>{data?.list.map(item => <Item item={item} key={item.id} />)} </Maibox> : <Set />
             }
       
      
    </Pagecount>
    </CustContext.Provider>
  )
}
