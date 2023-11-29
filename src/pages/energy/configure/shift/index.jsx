import React, { useEffect, useRef, useState } from 'react'
import style from './style.module.less'
import { Button, Modal, Form, Input, TimePicker, Space, message } from 'antd'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import dashed from '@imgs/dashed.png'
import { eneryShift } from '@api/api.js'
import {useSelector, useDispatch} from 'react-redux'
import {selectProjectId, getshifts, selectshifts} from '@redux/systemconfig.js'
import { useRequest } from 'ahooks';
import Custmodl from '@com/useModal'
import warning from '@imgs/warning.png'

export default function Index() {
  const dref = useRef()
  const dispatch = useDispatch();
  const projectId = useSelector(selectProjectId);
  const [messageApi, contextHolder] = message.useMessage();
  const { queryShifts, insertShift, updateShift, deleteShift } = eneryShift
  const [addModal, setAddModal] = useState(false)
  const [nextModal, setNextModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [classes, setClasses] = useState(2)
  const [form] = Form.useForm()
  const [editform] = Form.useForm()
  const Item = Form.Item
  const format = 'HH:mm';

  const defaultStyle = {
    display: 'inline-block',
    width: 148, 
    height: 56,
    border: '1px solid #d7d7d7',
    textAlign: 'center',
    lineHeight: '56px',
    fontSize: 16,
    color: '#515151',
    backgroundColor: '#fff',
    cursor:'pointer'
  }
  const activeStyle = {
    display: 'inline-block',
    width: 148, 
    height: 56,
    border: '1px solid #d7d7d7',
    textAlign: 'center',
    lineHeight: '56px',
    fontSize: 16,
    color: '#fff',
    backgroundColor:'#237ae4'
  }

  useEffect(()=>{
    shiftQuery()
  },[])
  const [shiftList, setShiftList] = useState([])
  const getShift = () => {
    return queryShifts(projectId).then(res => {
      if(res.success){
        setShiftList(res.data)
        if(res.data){
          dispatch(getshifts(res.data));
        }else{
          dispatch(getshifts([]));
        }
      }else{
        messageApi.open({
          type:'error',
          content: res.errMsg
        })
      }
    })
  }
  const { run: shiftQuery } = useRequest(getShift,{
    manual: true,
  })

  const CardItem = (props)=> {
    let itemData = props.values
    return <><div className={style.card}>
      <div className={style.cardItem}>
        <span className={style.title}>班次{props.index}名称</span>
        <Input defaultValue={itemData.name} style={{width: 248,height: 36}} disabled></Input>
      </div>
      <div className={style.middleItem}>
        <span className={style.title}>开始时间</span>
        <TimePicker defaultValue={dayjs(itemData.startTime, 'HH:mm')} format={format} style={{width: 248,height: 36}} disabled></TimePicker>
      </div>
      <div className={style.cardItem}>
        <span className={style.title}>结束时间</span>
        <TimePicker defaultValue={dayjs(itemData.endTime, 'HH:mm')} format={format} style={{width: 248,height: 36}} disabled></TimePicker>
      </div>
    </div>
    { props.index == shiftList.length ? null : <img src={dashed} style={{width: 1120, marginTop: 32, marginBottom: 32}}></img> }
    </>
  }

  const onAdd = () => {
    setAddModal(true)
  }
  const toNext = () => {
    setAddModal(false)
    form.resetFields()
    setNextModal(true)
  }
  const handleCancel = () => {
    setAddModal(false)
    setNextModal(false)
    setEditModal(false)
  }
  //新增
  const onOk = async () => {
    try{
      const values = await form.validateFields()
      let params = [];
      params.push({
        Name: values.className1,
        StartTime:time1,
        EndTime: disabledTime1
      })
      params.push({
        Name: values.className2,
        StartTime:time2,
        EndTime: disabledTime2
      })
      if(classes >= 3){
        params.push({
          Name: values.className3,
          StartTime:time3,
          EndTime: disabledTime3
        })
      }
      if(classes == 4){
        params.push({
          Name: values.className4,
          StartTime:time4,
          EndTime: disabledTime4
        })
      }
      insertShift(projectId, classes, params).then(res => {
        if(res.success){
          messageApi.open({
            type:'success',
            content:'新增班次成功!'
          })
          setTime1(null)
          setTime2(null)
          setTime3(null)
          setTime4(null)
          setDisabledTime1(null)
          setDisabledTime2(null)
          setDisabledTime3(null)
          setDisabledTime4(null)
          shiftQuery()
          setNextModal(false)
        }else{
          message.error(res.errMsg)
        }
      })
    }catch(errorInfo){}
  }

  //编辑
  const [editTime1, setEditTime1] = useState(null)
  const [disabledEditTime1, setDisabledEditTime1] = useState(null)
  const [editTime2, setEditTime2] = useState(null)
  const [disabledEditTime2, setDisabledEditTime2] = useState(null)
  const [editTime3, setEditTime3] = useState(null)
  const [disabledEditTime3, setDisabledEditTime3] = useState(null)
  const [editTime4, setEditTime4] = useState(null)
  const [disabledEditTime4, setDisabledEditTime4] = useState(null)
  const onChangeEdit1 = (time, timeString) =>{
    setEditTime1(timeString)
    if(classes == 2){
      setDisabledEditTime2(timeString)
    }
    if(classes == 3){
      setDisabledEditTime3(timeString)
    }
    if(classes == 4){
      setDisabledEditTime4(timeString)
    }
  } 
  const onChangeEdit2 = (time, timeString) =>{
    setEditTime2(timeString)
    setDisabledEditTime1(timeString)
  } 
  const onChangeEdit3 = (time, timeString) =>{
    setEditTime3(timeString)
    setDisabledEditTime2(timeString)
  } 
  const onChangeEdit4 = (time, timeString) =>{
    setEditTime4(timeString)
    setDisabledEditTime4(timeString)
  }
  const onEdit = ()=> {
    setClasses(shiftList.length)
    setEditModal(true)
    editform.setFieldValue('className1',shiftList[0].name)
    editform.setFieldValue('time1', dayjs(shiftList[0].startTime, 'HH:mm'))
    setEditTime1(shiftList[0].startTime)
    setDisabledEditTime1(shiftList[0].endTime)
    editform.setFieldValue('className2',shiftList[1].name)
    editform.setFieldValue('time2', dayjs(shiftList[1].startTime, 'HH:mm'))
    setEditTime2(shiftList[1].startTime)
    setDisabledEditTime2(shiftList[1].endTime)
    if(shiftList.length >= 3){
      editform.setFieldValue('className3',shiftList[2].name)
      editform.setFieldValue('time3', dayjs(shiftList[2].startTime, 'HH:mm'))
      setEditTime3(shiftList[2].startTime)
      setDisabledEditTime3(shiftList[2].endTime)
    }
    if(shiftList.length == 4){
      editform.setFieldValue('className4',shiftList[3].name)
      editform.setFieldValue('time4', dayjs(shiftList[3].startTime, 'HH:mm'))
      setEditTime4(shiftList[3].startTime)
      setDisabledEditTime4(shiftList[3].endTime)
    }
  }

  const onUpdate = async () => {
    try{
      const values = await editform.validateFields()
      let params = [];
      params.push({
        Id: shiftList[0].id,
        Name: values.className1,
        StartTime:editTime1,
        EndTime: disabledEditTime1
      })
      params.push({
        Id: shiftList[1].id,
        Name: values.className2,
        StartTime:editTime2,
        EndTime: disabledEditTime2
      })
      if(classes >= 3){
        params.push({
          Id: shiftList[2].id,
          Name: values.className3,
          StartTime:editTime3,
          EndTime: disabledEditTime3
        })
      }
      if(classes == 4){
        params.push({
          Id: shiftList[3].id,
          Name: values.className4,
          StartTime:editTime4,
          EndTime: disabledEditTime4
        })
      }
      updateShift(projectId, params).then(res => {
        if(res.success){
          messageApi.open({
            type: 'success',
            content:'班次方案修改成功!'
          })
          setEditTime1(null)
          setEditTime2(null)
          setEditTime3(null)
          setEditTime4(null)
          setDisabledEditTime1(null)
          setDisabledEditTime2(null)
          setDisabledEditTime3(null)
          setDisabledEditTime4(null)
          shiftQuery()
          setEditModal(false)
        }else{
          message.error(res.errMsg || '班次方案修改失败，请重试!')
        }
        
      })
    } catch(errorInfo){}
  }
  
  //删除
  const onDelete = () => {
    dref.current.onOpen()
  }
  const onDeleteShift = () => {
    deleteShift(projectId).then(res => {
      if(res.success){
        messageApi.open({
          type:'success',
          content:"删除班次方案成功!"
        })
      }else{
        messageApi.open({
          type:'error',
          content:res.errMsg || '删除失败，请重试！'
        })
      }
      dref.current.onCancel()
      shiftQuery()
    })
  }

  const [time1, setTime1] = useState(null)
  const [disabledTime1, setDisabledTime1] = useState(null)
  const [time2, setTime2] = useState(null)
  const [disabledTime2, setDisabledTime2] = useState(null)
  const [time3, setTime3] = useState(null)
  const [disabledTime3, setDisabledTime3] = useState(null)
  const [time4, setTime4] = useState(null)
  const [disabledTime4, setDisabledTime4] = useState(null)
  const onChange1 = (time, timeString) =>{
    setTime1(timeString)
    if(classes == 2){
      setDisabledTime2(timeString)
    }
    if(classes == 3){
      setDisabledTime3(timeString)
    }
    if(classes == 4){
      setDisabledTime4(timeString)
    }
  } 
  const onChange2 = (time, timeString) =>{
    setTime2(timeString)
    setDisabledTime1(timeString)
  } 
  const onChange3 = (time, timeString) =>{
    setTime3(timeString)
    setDisabledTime2(timeString)
  } 
  const onChange4 = (time, timeString) =>{
    setTime4(timeString)
    setDisabledTime3(timeString)
  }
  const disabledHoursFun = (str1, str2) => {
    let arr = [];
    if(str1){
      let value = parseInt(str1.slice(0,2))
      for(let i = 0;i<= value; i++){
        arr.push(i)
      }
    }
    if(str2){
      let value = parseInt(str2.slice(0,2))
      for(let i = value;i<= 23; i++){
        arr.push(i)
      }
    }
    return arr   
  } 


  return (
    <div>
      {contextHolder}
      <div className={style.header}>
        <div className={style.flex}>
          <span className={style.headerTitle}>班次管理</span>
          { shiftList.length == 0 ? <Button type='primary' style={{width: 96, height: 36}} onClick={() => onAdd()}>新增班次</Button> : 
          <Button type='primary' danger style={{width: 112, height: 36}} onClick={() => onDelete()}>删除班次方案</Button> }
        </div>
      </div>
      { shiftList.length > 0 ? <div className={style.mainContent}>
        { shiftList.map((item, index) => {
          return <CardItem values={item} index={index + 1}></CardItem>
        }) }
        <img src={dashed} style={{width:'100%', marginTop: 32,marginBottom: 16}}></img>
        <div style={{display: 'flex', marginTop: 0, justifyContent:'flex-end'}}>
          <Button type='primary' style={{width: 112, height: 36}} onClick={() => onEdit()}>编辑班次</Button>
        </div>
      </div> : null }
      <Modal className={style.addModal} open={addModal} onOk={toNext} onCancel={handleCancel} width={600} cancelText={'取消'} centered={true} closable={false} maskClosable={false} okText={'下一步'} okType={'primary'} >
        <div className={style.addHeader}>选择每天的班次数量</div>
        <div className={style.addBody}>
          <div style={{display: 'flex', alignItems:'center', justifyContent:'space-around', marginTop:'32px'}}>
            <span style={classes == 2 ? activeStyle : defaultStyle } onClick={()=> {setClasses(2)}}>一天两班</span>
            <span style={classes == 3 ? activeStyle : defaultStyle } onClick={()=> {setClasses(3)}}>一天三班</span>
            <span style={classes == 4 ? activeStyle : defaultStyle } onClick={()=> {setClasses(4)}}>一天四班</span>
          </div>
          <img src={dashed} style={{marginTop: 32, width:'100%'}}></img>
        </div>
      </Modal>
      {/* 新增 */}
      <Modal className={style.addModal} open={nextModal} onOk={onOk} onCancel={handleCancel} width={530} cancelText={'取消'} centered={true} closable={false} maskClosable={false} okText={'确认'} okType={'primary'} >
        <div className={style.addHeader}>创建班次</div>
        <div className={style.addBody}>
          <div style={{display:"flex", alignItems: "center"}}>
            <Form name='addform' labelCol={{span:4}} form={form} labelAlign={'left'} requiredMark={false} autoComplete='off'>
              <Item label='班次1名称' name='className1' rules={[{required:true, message:'班次名称不能为空'}]}>
                <Input style={{width:'180px'}} placeholder={'请输入班次名称'}></Input>
              </Item>
              <Item label='班次时段' >
                <Space size={32} style={{display:'flex', alignItems:'flex-start'}}>
                  <Item name='time1' rules={[{required:true, message:'班次时段不能为空'}]}>
                    <TimePicker style={{width: 180}} onChange={onChange1} format={format} disabledHours={()=>disabledHoursFun(null, time2)}></TimePicker>
                  </Item>
                  <TimePicker style={{width: 180}} disabled value={dayjs(disabledTime1, 'HH:mm')} format={format}></TimePicker>
                </Space>
              </Item>
              <img src={dashed} style={{width:'100%'}}></img>
              <Item label='班次2名称' name='className2' rules={[{required:true, message:'班次名称不能为空'}]}>
                <Input style={{width:'180px'}} placeholder={'请输入班次名称'}></Input>
              </Item>
              <Item label='班次时段' >
                <Space size={32} style={{display:'flex', alignItems:'flex-start'}}>
                  <Item name='time2' rules={[{required:true, message:'班次时段不能为空'}]}>
                    <TimePicker style={{width: 180}} onChange={onChange2} format={format} disabledHours={()=>disabledHoursFun(time1, classes>=3 ? time3 : null)}></TimePicker>
                  </Item>
                  <TimePicker style={{width: 180}} disabled value={dayjs(disabledTime2, 'HH:mm')} format={format}></TimePicker>
                </Space>
              </Item>
              <img src={dashed} style={{width:'100%'}}></img>
              {classes >= 3 ? <><Item label='班次3名称' name='className3' rules={[{required:true, message:'班次名称不能为空'}]}>
                  <Input style={{width:'180px'}} placeholder={'请输入班次名称'}></Input>
                </Item>
                <Item label='班次时段' >
                  <Space size={32} style={{display:'flex', alignItems:'flex-start'}}>
                    <Item name='time3' rules={[{required:true, message:'班次时段不能为空'}]}>
                      <TimePicker style={{width: 180}} onChange={onChange3} format={format} disabledHours={()=>disabledHoursFun(time2, classes == 4 ? time4 : null)}></TimePicker>
                    </Item>
                    <TimePicker style={{width: 180}} disabled value={dayjs(disabledTime3, 'HH:mm')} format={format}></TimePicker>
                  </Space>
                </Item>
                <img src={dashed} style={{width:'100%'}}></img> </> : null}
              { classes == 4 ? <>
                <Item label='班次4名称' name='className4' rules={[{required:true, message:'班次名称不能为空'}]}>
                  <Input style={{width:'180px'}} placeholder={'请输入班次名称'}></Input>
                </Item>
                <Item label='班次时段' >
                  <Space size={32} style={{display:'flex', alignItems:'flex-start'}}>
                    <Item name='time4' rules={[{required:true, message:'班次时段不能为空'}]}>
                      <TimePicker style={{width: 180}} onChange={onChange4} format={format} disabledHours={()=>disabledHoursFun(time3, null)}></TimePicker>
                    </Item>
                    <TimePicker style={{width: 180}} disabled value={dayjs(disabledTime4, 'HH:mm')} format={format}></TimePicker>
                  </Space>
                </Item>
                <img src={dashed} style={{width:'100%'}}></img> 
                </> : null }
            </Form>
          </div>
        </div>
      </Modal>
      <Custmodl title='删除班次' ref={dref}  mold="cust" width={512} type="warn" onOk={()=>onDeleteShift()}>
         是否确认删除班次方案？ 
      </Custmodl>
      {/* 编辑 */}
      <Custmodl  title="编辑班次" open={editModal} onOk={onUpdate} onCancel={handleCancel} width={530}  closable={false} mold="cust" >
            <Form name='editform' labelCol={{span:4}} form={editform} labelAlign={'left'} requiredMark={false} autoComplete='off'>
              <Item label='班次1名称' name='className1' rules={[{required:true, message:'班次名称不能为空'}]}>
                <Input style={{width:'180px'}} placeholder={'请输入班次名称'}></Input>
              </Item>
              <Item label='班次时段' style={{height: 32}} >
                <Space size={32} style={{display:'flex', alignItems:'flex-start'}}>
                  <Item name='time1' rules={[{required:true, message:'班次时段不能为空'}]}>
                    <TimePicker style={{width: 180}} onChange={onChangeEdit1} defaultValue={dayjs(editTime1, 'HH:mm')} format={format} disabledHours={()=>disabledHoursFun(null, editTime2)}></TimePicker>
                  </Item>
                  <TimePicker style={{width: 180}} disabled value={dayjs(disabledEditTime1, 'HH:mm')} format={format}></TimePicker>
                </Space>
              </Item>
              <img src={dashed} style={{width:'100%'}}></img>
              <Item label='班次2名称' name='className2' rules={[{required:true, message:'班次名称不能为空'}]}>
                <Input style={{width:'180px'}} placeholder={'请输入班次名称'}></Input>
              </Item>
              <Item label='班次时段' style={{height: 32}}>
                <Space size={32} style={{display:'flex', alignItems:'flex-start'}}>
                  <Item name='time2' rules={[{required:true, message:'班次时段不能为空'}]}>
                    <TimePicker style={{width: 180}} onChange={onChangeEdit2} defaultValue={dayjs(editTime2, 'HH:mm')} format={format} disabledHours={()=>disabledHoursFun(editTime1, classes>=3 ? editTime3 : null)}></TimePicker>
                  </Item>
                  <TimePicker style={{width: 180}} disabled value={dayjs(disabledEditTime2, 'HH:mm')} format={format}></TimePicker>
                </Space>
              </Item>
              <img src={dashed} style={{width:'100%'}}></img>
              {classes >= 3 ? <><Item label='班次3名称' name='className3' rules={[{required:true, message:'班次名称不能为空'}]}>
                  <Input style={{width:'180px'}} placeholder={'请输入班次名称'}></Input>
                </Item>
                <Item label='班次时段' style={{height: 32}}>
                  <Space size={32} style={{display:'flex', alignItems:'flex-start'}}>
                    <Item name='time3' rules={[{required:true, message:'班次时段不能为空'}]}>
                      <TimePicker style={{width: 180}} defaultValue={dayjs(editTime3, 'HH:mm')} onChange={onChangeEdit3} format={format} disabledHours={()=>disabledHoursFun(editTime2, classes == 4 ? editTime4 : null)}></TimePicker>
                    </Item>
                    <TimePicker style={{width: 180}} disabled value={dayjs(disabledEditTime3, 'HH:mm')} format={format}></TimePicker>
                  </Space>
                </Item>
                <img src={dashed} style={{width:'100%'}}></img> </> : null}
              { classes == 4 ? <>
                <Item label='班次4名称' name='className4' rules={[{required:true, message:'班次名称不能为空'}]}>
                  <Input style={{width:'180px'}} placeholder={'请输入班次名称'}></Input>
                </Item>
                <Item label='班次时段' style={{height: 32}}>
                  <Space size={32} style={{display:'flex', alignItems:'flex-start'}}>
                    <Item name='time4' rules={[{required:true, message:'班次时段不能为空'}]}>
                      <TimePicker style={{width: 180}} defaultValue={dayjs(editTime4, 'HH:mm')} onChange={onChangeEdit4} format={format} disabledHours={()=>disabledHoursFun(editTime3, null)}></TimePicker>
                    </Item>
                    <TimePicker style={{width: 180}} disabled value={dayjs(disabledEditTime4, 'HH:mm')} format={format}></TimePicker>
                  </Space>
                </Item>
                <img src={dashed} style={{width:'100%'}}></img> 
                </> : null }
            </Form>
      </Custmodl>
    </div>
  )
}
