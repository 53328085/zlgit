import React, { useEffect, useState } from 'react'
import {Form, Select} from 'antd'
import styled from 'styled-components'
import {nanoid} from '@reduxjs/toolkit' 
import UserTable from "@com/useTable";
import {PowerQuality} from "@api/api"
import {dnzlfxcolumns} from './columns'
import {dnzlfxoption} from './options'
import {isObject} from '@com/usehandler'
const Mainbox = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: 32px minmax(680px, 1fr) 40px;
  row-gap: 16px;
  padding-left: 16px;
  .op {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      padding-left: 16px;
      height: 25px;
      border-left: 5px solid ${props => props.theme.primaryColor};
      line-height: 25px;
      color: #515151;
    }
  } 
  .chartbox {
    display: flex;
    
  }
  .result {
    height: 40px;
    padding: 8px 16px;
    border: 1px solid #d7d7d7;
    color:#515151;
    display: flex;
    align-items: center;
  }
`
 

const arrlen =(arr) => {
  return Array.isArray(arr) && arr?.length >0
}
 
 
export default function Index({projectId, day, sn}) {
  const [form] = Form.useForm()
  const [datas, setDatas] = useState([])
  let {items, result} = datas || {}
  const tableData = arrlen(items) ?items : []

  const [loading, setLoading] =useState(false)

  const getData = async() => {
      try {
       setLoading(true)
       let {group} = await form.validateFields()
       const body ={
        projectId,
        sn,
        day: day.format("yyyy-MM-DD"),
        group
       }
      let {success, data} = await  PowerQuality.DNZLFX(body)
        if(success && isObject(data)) {
          setDatas(data)
        }else {
          setDatas({})
        }
      } catch (error) {
        setDatas({})
        console.log(error)
      }finally{
        setLoading(false)
      }
      
  }
  const onValuesChange =() =>{
    getData()
  }
  useEffect(() => {
     if(Number.isInteger(parseInt(projectId))&& sn && day) {
        getData()
     }
  }, [projectId, day, sn ])

  return (
    <Mainbox>
      <div className='op' key={nanoid()}>
        <Form form={form} layout="inline" onValuesChange={onValuesChange}>
             <Form.Item name="group" initialValue={1}>
              <Select style={{width:200}} options={dnzlfxoption}></Select>
              </Form.Item>
          </Form>
       </div>
       <div className='chartbox' key={nanoid()}>
            <UserTable columns={dnzlfxcolumns} dataSource={tableData} istheme="theme" rowKey={nanoid()} loading={loading} scroll={{
            scrollToFirstRowOnChange: true, 
            y: 672
          }
          }></UserTable>
       </div>
      <div className='result'>
        {result}
      </div>
     </Mainbox>
  )
}
