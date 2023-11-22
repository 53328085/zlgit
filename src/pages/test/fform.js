import React, {useState, useRef, memo, useCallback, useEffect, forwardRef, createContext, useContext} from 'react'
 
import styled from 'styled-components'
 import {Modal, Button, Space, Row, Col} from 'antd'
 import {ExclamationCircleOutlined, ClearOutlined} from '@ant-design/icons'
const {confirm} = Modal
const context = createContext({name: 'zzzzzz'})
const showConfirm = () => {
   confirm({
     title: '你确定',
     icon: <ExclamationCircleOutlined />,
     content: "some descr",
     onOk: () => {
      return new Promise((resolv, reject) => {
        setTimeout(() => {
          Math.random() > 0.5 ? resolv('1') : reject('2')
        },2000)
      }).then(e => {
        console.log(e);
      }).catch(e => {
        console.log(e)
      })
     },
     okText: 'Yes',
     okType: 'danger',
     okButtonProps: {
      disabled: true,
     },
     cancelText: 'no'
   })
}
const info = () => {
  Modal.error({
   // title: 'This is a notification message',
    content: (
      <div>
        <p>some messages...some messages...</p>
        <p>some messages...some messages...</p>
      </div>
    ),
  })
}
const Mc = memo(function() {
  console.log('render')
  return  (
    <div>记忆组件</div>
  )
})
const Cmodal = styled(Modal)``
export default function Index() {
 
  const [v, setv] = useState('')
  const ref=useRef()
  
   const [confirmLoading, setConfirmLoading] = useState(false)
   const [modalText, setModalText] = useState('ddd')
  const box= useRef()
  const onopen = () =>  {
       ref.current.onOpen()
    
  }
 
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const afterCloase = () => {
    console.log('完全关闭后的回调')
  } 
 
 
  
  return (
        <Row>
          <Col span={2}><Button onClick={onopen}>show</Button></Col>
          <Col span={4}>{v}</Col>
         
        </Row>
  )
}
