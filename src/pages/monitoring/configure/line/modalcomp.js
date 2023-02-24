import React from 'react'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import {Input} from 'antd'
export const  modalcomp=()=> {
  return (
       <Modal  mold='cust'>
        <BlueColumn name="新增主线" styled={{ padding: '24px 0px' }}></BlueColumn>
        <div>
        <span>主线</span>
        <Input></Input>
        </div>
        
       </Modal>      

  )
}
