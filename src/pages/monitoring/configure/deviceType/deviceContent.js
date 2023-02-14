import React,{useState , useRef} from 'react'
import {useSelector} from 'react-redux'
import { Monitoring } from '@api/api.js'
import style from './style.module.less'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn' 

export default function DeviceContent(props,ref) {
  const {
    value,
    name='新增网关类型',
    AddModal=()=>{},
    canceltext='返回',
    oktext='保存',
    onOk,
    onCancel,
    width=520,
    ModalRef,
    ...other
  } = props
  
  const {DeviceTypeManager:{QueryNotUsed}}=Monitoring
  
  const openAdd =async ()=>{
    await other.openAdd()
    ModalRef.current.onOpen()
  }

  const modalProps = {
    cancelText:canceltext,
    okText:oktext,
    width,
    onOk,
   
  }
  return (
    <div >
      <div className={style.optionBtn}>
          <div>请配置该项目接入的网关类型</div>
          <div className={style.btns}>
            <div className={style.btn} onClick={openAdd}>+新增</div>
            {value===6?<div className={style.btn} style={{marginRight:16}}>批量导入</div>:null}
            <div className={style.btn}>导出</div>
          </div>
        </div>
        {other.children}
        <Modal ref={ModalRef} mold='cust' {...modalProps}>
            <BlueColumn name={name} styled={{padding: '24px 0px'}}></BlueColumn>
            <AddModal></AddModal>
        </Modal>
    </div>
  )
}
