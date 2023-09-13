import React, { useEffect, useState } from 'react'
import BlueColumn from '@com/bluecolumn'
import { Form,  Input, Select,TimePicker  } from 'antd'
import styled from 'styled-components'
import { useReactive,useMemoizedFn,useLatest  } from 'ahooks';
import WarningPng from '@imgs/warning.png'
import MyModal from '@com/useModal'
import style from './style.module.less'
const FlexDiv = styled.div`
  display: flex;
  justify-content: space-between;
`

export default function Buildplan() {  
   const [form] = Form.useForm()
   const [planList,setPlanList] =useState([])
   const planSelect=[
        {
          value:1,
          label: "一天一班"
        },
        {
          value:2,
          label: "一天二班"
        },
        {
          value:3,
          label: "一天三班"
        },
        {
          value:4,
          label: "一天四班"
        },
      ]
    const changePlan=(v)=>{
      let arr=[]
      for(let i=0; i<v; i++){
        arr.push(<FlexDiv>
            <Form.Item label={`班次${i+1}名称`} >
            <Input placeholder="请输入班次"></Input>
            </Form.Item>
            <Form.Item label="班次时段">
            <TimePicker.RangePicker format={'HH:mm'}/>
            </Form.Item>
            </FlexDiv>)
        }
        setPlanList(()=>[...arr])
      }
  return (
    <div>
      <Form
      form={form}
      colon={false}
      >
        <Form.Item 
         label="班次选择&nbsp;&nbsp; "
         name="plan"
        >
          <Select options={planSelect} style={{width:183}} onChange={changePlan}></Select>
        </Form.Item>
        {planList}
      </Form>

    </div>
  )
}



export function EditUser({editUser}){
  
  const [form] =Form.useForm()
  useEffect(()=>{
   console.log(editUser)
    form.setFieldValue("user",editUser)
  },[])
  return (
    <Form
    form={form}
    >
      <Form.Item name="user">
        <Select>
          
        </Select>
      </Form.Item>
    </Form>
  )
}

export let DeleteModal = ({ delRef, name = '', content = '', ...other }) => {
  return (

    <MyModal mold='cust' ref={delRef} {...other} className={style.DelModal}>
     
      <BlueColumn name={name} styled={{ padding: '24px 0px', color: '#ff4d4f' }} bg={{ backgroundColor: '#ff4d4f' }}></BlueColumn>
      <div>
        <img src={WarningPng} style={{ margin: '0 32px', width: 48, height: 48 }}></img>
        <span>{content}</span>
      </div>
 
    </MyModal>

  )
}