import React,{useState , useRef, useMemo} from 'react'
import {useSelector} from 'react-redux'
import { Monitoring } from '@api/api.js'
import style from './style.module.less'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn' 
import {publishState} from '@redux/systemconfig'
import {Button} from 'antd'

export default function DeviceContent(props,ref) {
  const publish = useSelector(publishState)
  const {
    value,
    name='新增网关类型',
    AddModal,
    cancelText='返回',
    okText='保存',
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
  const [transitionName,setTransition]=useState(undefined)
  const [maskTransitionName,setMaskTransitionName]=useState(undefined)
  const {DeviceTypeManager:{QueryNotUsed}}=Monitoring
  const addformRef=useRef()
  const openAdd =other.open
  const onCancel=()=>{
    ModalRef.current.onCancel()
  }
  const modalProps = {
    cancelText,
    okText,
    width,
  }
//   const AddModalComp=useMemo(()=>{
//     return ( <Modal ref={ModalRef} mold='cust' {...modalProps} footer={[
//       <Button onClick={onCancel}>取消</Button>,
//       <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={onOk}>保存</Button>,
//       <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} 
//       onClick={
//         ()=>{
//           onSure().then(resp=>{
//              addformRef.current.open().then(
//               res=>{
                
//               }
//              ).catch(err=>{
//               if(!err){
//                 ModalRef.current.onCancel()
//               }
//              })
//           });          
//         }
//       }>应用</Button>,
//   ]}>
//       <BlueColumn name={name} styled={{padding: '24px 0px'}}></BlueColumn>
//       {AddModal}
//   </Modal>)
//   },[])
  return (
    <div >
      <div className={style.optionBtn}>
          <div>{title}</div>
          <div className={style.btns}>
          {publish?null:(<div className={style.btn} onClick={openAdd}>+新增</div>)}  
            {/* {value===6?<div className={style.btn} style={{marginRight:16}} onClick={multiImport}>批量导入</div>:null} */}
            <div className={style.btn} onClick={exportExecel}>导出</div>
          </div>
        </div>
        <div style={{display:'flex',height:700}}>
          {other.children}
        </div>
        <Modal ref={ModalRef} mold='cust' {...modalProps} transitionName={transitionName} maskTransitionName={maskTransitionName} footer={[
      <Button onClick={onCancel}>取消</Button>,
      <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={onOk}>保存</Button>,
      <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} 
      onClick={
        ()=>{
          onSure()
        //   .then(resp=>{
            setTransition("")
            setMaskTransitionName("")
            //  addformRef.current.open().then(
            //   res=>{
              
            //   }
            //  ).catch(err=>{
            //   if(!err){
            //     ModalRef.current.onCancel()
            //   }
            //  })
        //   });          
        }
      }>应用</Button>,
  ]}>
      <BlueColumn name={name} styled={{padding: '24px 0px'}}></BlueColumn>
      {AddModal}
  </Modal>
 
    </div>
  )
}
