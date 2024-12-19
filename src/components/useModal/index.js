import React, {useState, useRef, useImperativeHandle, forwardRef, memo} from "react";
import {useTranslation} from 'react-i18next'
import { Button, Modal, Space} from "antd";
import styled from "styled-components";
import Draggable  from "react-draggable";
import Useform from "./useform";
import redwarn from '@imgs/redwarn.png'
//const theme =(type) =>   `4px solid ${custCorle[type]}`
const theme = (props) => props.type == 'warn' ? `#ff4d4f` : props.theme.primaryColor
const custCorle =(props) => {
 return {
  normal: props.theme.primaryColor,
  warn: "#ff4d4f",
 // dark: "#fff"
 }[props.type]
}
const CModal = styled(Modal)`
   .ant-modal-content {
   //  background-color: ${(props) => props.type=='dark' ? '#1b1d23' : '#fff'};
  }
  .ant-modal-header {
    padding: 32px;
    border-bottom: none;
  //  background-color: ${(props) => props.type=='dark' ? '#1b1d23' : '#fff'};
    .ant-modal-title {
      font-size: 16px;
      color: ${custCorle};;
      padding-left: ${props => props.nolf ? 0 : '16px'} ;
      border-left: ${props =>  props.nolf ? 'none' : `4px solid  ${theme(props)}`};
      height: 32px;
      line-height: 32px;
    }
  }
  .ant-modal-body {
    padding: 0 32px 32px 32px;
  }
  .ant-modal-footer {
    border-top: none;
    padding: 0 32px 32px 32px;
    .ant-btn {
      padding: 0px;
      width: 96px;
      height: 36px;
    }
    .ant-btn + .ant-btn {
      margin-left: 16px;
    }
    .ant-btn-default {
      background-color: ${(props) => props.type=='dark' ? '#1b1d23' : '#fff'};
      color: #666;
    }
 .ant-btn-primary {
      border-color:   ${custCorle};
      background-color: ${custCorle};
    }  
  }
  .ant-form-item:last-of-type {
    margin-bottom: 0px;
  }
`;
 
 
 function Custmodal({ 
  fromprops = {
  initialValues: {},
  roletype: '',
  enable: false,
  
}, 
  type = "normal",
  mold = "form",
  children = null,  
  loading=false,
  ...props
} = {}, ref) { 
  const {t} = useTranslation("button")
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  })
  const draggleRef = useRef(null)
  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };
  const {onCancel: close, custft=false, onOk,title, bodyStyle, warnimg = true, ...rest} = props
  const formref = useRef()
  const onCancel = () => {
    setOpen(false)
  }
  const onOpen = () => {
    setOpen(true)
  }
 // const onResetform = () => formref.current.resetfrom()
 
  const onGetvalue = () => formref.current.getValue()
  const [currbtn, setCurrbtn] = useState(1)
  const CustFooter = [
      <Button onClick={onCancel} key="cancel"  danger={type=="warn"}>{t('cancel')}</Button>,
       <Button type="primary" loading={currbtn == 1 && loading} onClick={() => {
        
        setCurrbtn(1)
        onOk()
       }} key="apply" >{t('apply')}</Button> ,
       <Button type="primary" loading={currbtn == 2 && loading} key="ok" onClick={() => {
        setCurrbtn(2)
        onOk().then(() => {
          onCancel();
        });
        
       }}>{t('ok')}</Button>
      ]
  
  useImperativeHandle(ref, ()=> ({
    onCancel,
    onOpen,
    onResetform() {
      formref.current.resetfrom()
    },
    onGetvalue
  }))
  
  
  return (
    <CModal      
      open={open}
      onCancel={close || onCancel}
      closable={false}    
      centered  
      cancelButtonProps={{danger: type=="warn"}}
      maskClosable={false}
      footer={custft ? CustFooter : undefined }
      onOk={onOk}
      type={type}      
      confirmLoading={loading}
      bodyStyle= {
         type=="warn" ? {
           display: 'flex',
           alignItems: 'center',
           fontSize: '16px',
           color: "#515151",
           ...bodyStyle
         }: null
      }
      title={
      title ?   <div 
        style={{cursor: 'move'}}
        onMouseOver={() => {
          if(disabled) {
            setDisabled(false)
          }
        }}
        onMouseOut={() => {
          setDisabled(true)
        }}
        >{title}</div> : null
      }  
      modalRender={(modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
      destroyOnClose
      {...rest}  
    >
      {type=="warn" && warnimg && <img src={redwarn} style={{width: '54px', marginRight: "32px"}} /> }
      {mold == 'cust' ? children : mold == 'default' ? <Useform {...fromprops} ref={formref} /> : ''}
    </CModal>
  )
 
}
 
export default forwardRef(Custmodal)