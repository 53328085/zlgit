import React,{useState , useRef, useMemo} from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import { Monitoring } from '@api/api.js'
import style from './style.module.less'
import Modal from '@com/useModal'
 import {preimge} from "@com/usehandler"
import {publishState} from '@redux/systemconfig'
import {Button, Space} from 'antd'
import {  ExportExcel, NewButton} from '@com/useButton'
export default function DeviceContent(props,ref) {
  const {t} = useTranslation(['button'])
  const publish = useSelector(publishState)
  const {
    value,
    name='新增网关类型',
    AddModal,
    cancelText=t("button:cancel"),
    okText=t("button:save"),
    onOk,
    onSure,
    onCancel,
    width=520,
    ModalRef,
    exportExecel=()=>{},
    title="",
    selectOptions,
    form,
    ...other
  } = props
  const [transitionName,setTransition]=useState(undefined)
  const [maskTransitionName,setMaskTransitionName]=useState(undefined)
  const {DeviceTypeManager:{QueryNotUsed}}=Monitoring
  const addformRef=useRef()
  const openAdd =other.open
  // const onCancel=()=>{
  //   ModalRef.current.onCancel()
  // }
  const modalProps = {
    cancelText,
    okText,
    width,
  }
  return (
    <div >
      <div className={style.optionBtn}>
          <div>{title}</div>
          <Space size={16}>
          {publish?null:(<NewButton onClick={openAdd} /> )}  
            {/* {value===6?<div className={style.btn} style={{marginRight:16}} onClick={multiImport}>批量导入</div>:null} */}
            {/* <div className={style.btn} onClick={exportExecel}>导出</div> */}
            <ExportExcel tb={other.tb}/>
          </Space>
        </div>
        <div style={{display:'flex',height:700}}>
          {other.children}
        </div>
        <Modal ref={ModalRef} mold='cust' title={name}  onCancel={()=>{onCancel()}} {...modalProps} transitionName={transitionName} maskTransitionName={maskTransitionName} footer={[
      <Button onClick={()=>{onCancel()}}>{t("button:cancel")}</Button>,
      <Button  type="primary" onClick={onOk}>{t("button:save")}</Button>,
      <Button type="primary"
      onClick={
        async ()=>{
          const flag = await onSure()
          if(flag !== false){
            setTransition("")
            setMaskTransitionName("")
          }
                
        }
      }>{t("button:apply")}</Button>,
  ]}>
      {/* <BlueColumn name={name} styled={{padding: '24px 0px'}}></BlueColumn> */}
      {AddModal}
  </Modal>
 
    </div>
  )
}
