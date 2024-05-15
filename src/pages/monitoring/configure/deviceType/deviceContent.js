import React,{useState , useRef, useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import { Monitoring } from '@api/api.js'
import style from './style.module.less'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn' 
import {publishState} from '@redux/systemconfig'
import {Button,message, Space} from 'antd'
import {  ExportExcel, NewButton} from '@com/useButton'
export default function DeviceContent(props,ref) {
  const publish = useSelector(publishState)
  const projectId = useSelector(state => state.system.menus.projectId)
  const {
    value,
    name='新增网关类型',
    AddModal,
  //  cancelText='返回',
  //  okText='保存',
    onOk,
    onSure,
    // onCancel,
    width=520,
    ModalRef,
    exportExecel=()=>{},
    title="",
    selectOptions,
    form,
    ...other
  } = props
  
  const {DeviceTypeManager:{QueryNotUsed}}=Monitoring
  const addformRef=useRef()
  const openAdd =async ()=>{

      const result = await QueryNotUsed(projectId)
      const { success, data } = result;
      if (success && Array.isArray(data)) {
        if (data.length > 0) {
          ModalRef.current.onOpen()
        } else {
          message.warning('无可用网关新增!')
          return
        }
  
      }
  }  
  const onCancel=()=>{
    ModalRef.current.onCancel()
  }
  const modalProps = {
   // cancelText,
 //   okText,
    width,
  }
  const AddModalComp=useMemo(()=>{
   
    return ( <Modal ref={ModalRef} mold='cust' title={name}  {...modalProps} custft={true}  onOk={onOk}  /* footer={[
      <Button onClick={onCancel}>{t("cancel")}</Button>,
      <Button  type="primary" onClick={onOk}>{t("save")}</Button>,
      <Button type="primary"
      onClick={
        (e)=>{
          onSure().then(resp=>{
             addformRef.current.open().then(
              res=>{
                
              }
             ).catch(err=>{
              if(!err){
                ModalRef.current.onCancel()
              }
             })
          });          
        }
      }
      >{t("apply")}</Button>,
  ]} */>
     
      <AddModal form={form} ref={addformRef}/>
  </Modal>)
  },[])
  return (
    <div >
      <div className={style.optionBtn}>
          <div>{title}</div>
          <Space size={16}>
          {publish?null:(<NewButton onClick={openAdd} />)}  
            {/* {value===6?<div className={style.btn} style={{marginRight:16}} onClick={multiImport}>批量导入</div>:null} */}
            {/* <div className={style.btn} onClick={exportExecel}>导出</div> */}
            {other.onExport?<ExportExcel tb={other.tb} onExport={other.onExport}/>:null}

          </Space>
      </div>
      <div style={{display:'flex',height:700}}>
          {other.children}
      </div>
        {AddModalComp}

    </div>
  )
}
