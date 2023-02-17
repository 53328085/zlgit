import React, {useState, useRef, useImperativeHandle, forwardRef} from "react";
import { Modal} from "antd";
import styled from "styled-components";
import Draggable  from "react-draggable";
import Useform from "./useform";

 function Custmodal({ 
  fromprops = {
  initialValues: {},
  roletype: ''},
  enable = false,
  type = "normal",
  mold = "form",
  children = null,  
  ...props
} = {}, ref) { 
  const custCorle = {
    normal: "#337af0",
    warn: "#ff4d4f",
   
  }
  const theme = `4px solid ${custCorle[type]}`
  
  const CModal = styled(Modal)`
     .ant-modal-content {
       background-color: ${() => type=='dark' ? '#1b1d23' : '#fff'};
    }
    .ant-modal-header {
      padding: 32px;
      border-bottom: none;
      background-color: ${() => type=='dark' ? '#1b1d23' : '#fff'};
      .ant-modal-title {
        font-size: 16px;
        color: ${() => type=='dark' ? '#fff' : custCorle[type]};;
        padding-left: ${() => type=='dark' ? '0px' : '16px'};
        border-left: ${theme};
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
        background-color: ${() => type=='dark' ? '#1b1d23' : '#fff'};
        color: ${() => type=='dark' ? '#fff' : '#666'};
      }
      .ant-btn-primary {
        border-color: ${custCorle[type]};
        background-color: ${custCorle[type]};
      }
    }
    .ant-form-item:last-of-type {
      margin-bottom: 0px;
    }
  `;
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)
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
  const {onCancel: close, ...rest} = props
  const form = useRef()
  const onCancel = () => {    
    setOpen(false)
  }
  const onOpen = () => {
    setOpen(true)
  }
  const onResetform = () => form.current.resetfrom

  const onGetvalue = () => form.current.getValue()
  
  useImperativeHandle(ref, ()=> ({
    onCancel,
    onOpen,
    onResetform,
    onGetvalue
  }))

 
  return (
    <CModal      
      open={open}
      onCancel={close || onCancel}
      closable={false}
      centered    
      {...rest}      
    >
      {mold == 'cust' ? children : mold == 'default' ? <Useform {...fromprops} ref={form} /> : ''}
    </CModal>
  )

}

export default forwardRef(Custmodal)