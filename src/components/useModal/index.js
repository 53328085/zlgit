import React, {useState, useRef, useImperativeHandle, forwardRef, memo} from "react";
import {useTranslation} from 'react-i18next'
import { Button, Modal, Space} from "antd";
import styled, {css} from "styled-components";
import Draggable  from "react-draggable";
import Useform from "./useform";
import redwarn from '@imgs/redwarn.png'
import Ok from "./ok.svg"
//const theme =(type) =>   `4px solid ${custCorle[type]}`
const sty = css`
.ant-modal-header{
  padding: 16px;
}
.ant-modal-body{
  padding: 0 16px 16px 16px;
}
.ant-modal-footer {
  padding: 0 16px 16px 16px;
}
`
const theme = (props) => props.type == 'warn' ? props.theme.errorColor : props.theme.primaryColor
const custCorle =(props) => {
 return {
  normal: props.theme.primaryColor,
  warn: props.theme.errorColor,
 // dark: "#fff"
 }[props.type]
}
const CModal = styled(Modal)`
   .ant-modal-content {
    border-radius: 12px;
    box-shadow: none;
    overflow: hidden;
   //  background-color: ${(props) => props.type=='dark' ? '#1b1d23' : '#fff'};
  }
  .ant-modal-header {
    padding:20px 28px;
    border-bottom: none;
  //  background-color: ${(props) => props.type=='dark' ? '#1b1d23' : '#fff'};
    .ant-modal-title {
      font-size: 16px;
      color: ${custCorle};;
      padding-left: ${props => props.nolf ? 0 : '16px'} ;
    //  border-left: ${props =>  props.nolf ? 'none' : `4px solid  ${theme(props)}`};
      height: 22px;
      line-height: 22px;
      position:relative;
      display:flex;
      align-items: center;
      &::before{
         content:"";
          position: absolute;
          display: block;
          width:3px;
          height:16px; 
          left:0; 
          background-color: ${props =>  props.nolf ? 'none' : `${theme(props)}`};
      }
    }
  }
  .ant-modal-body {
    padding: 0 28px 20px 28px;
  }
  .ant-modal-footer {
    border-top: none;
    padding: 0 28px 28px 20px;
    .ant-btn {
      padding: 0px;
      width: 88px;
      height: 36px;
    }
    .ant-btn + .ant-btn {
      margin-left: 16px;
    }
    .ant-btn-default {
      background-color: ${(props) => props.type=='dark' ? '#1b1d23' : '#fff'};
      // color: #666;
    }
 .ant-btn-primary {
      border-color:   ${custCorle};
      background-color: ${custCorle};
    }  
  }
  .ant-form-item:last-of-type {
    margin-bottom: 0px;
  }
  ${props=>props.theme.laptop ? sty : null}
  ${props => props.custsty}
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
  const {onCancel: close, custft=false, onOk,title, bodyStyle, warnimg=true, ...rest} = props
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
         (type=="warn" || type=="ok") ? {
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
      {type=="ok" && warnimg && <img src={Ok} style={{width: '48px', marginRight: "16px", marginLeft:"32px"}} /> }
      {mold == 'cust' ? children : mold == 'default' ? <Useform {...fromprops} ref={formref} /> : ''}
    </CModal>
  )
 
}
 
export default forwardRef(Custmodal)