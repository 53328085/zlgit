import React, {useRef, useState, forwardRef,useImperativeHandle} from 'react'
import {Space, Form, Input} from 'antd'
import Usetable from '@com/useTable'
import {CustButton,   CustLink } from '@com/useButton'
import CModal from '@com/useModal'
export default forwardRef(function Index({columns, value, onChange, onedit,ondel, name, deltext}, ref) {
  
     
    const edit = (record,index) => {
      onedit(record,index,name)
    }
    const add = () => {
      setIsadd(true)
    }
    const del = (index) => {
        ondel(index,name, deltext)
    }
    const onOk = () => {

    }
 
    const mcolumns = [
        ...columns,
        {
            title: '操作', 
            key: 'op',
            align: 'center',
            width: 130,
            render(_, record, i){
               return <Space><CustLink text="edit" onClick={()=> edit(record,i)} /><CustLink text="delete" type="danger" onClick={() =>del(i)} /></Space>
            }
          },
      ]
  return (
    <Usetable columns={mcolumns}  dataSource={value}  hbg="#d3e4fa"  hbc="#515151"  pd="8px 4px" /> 
  )
})
