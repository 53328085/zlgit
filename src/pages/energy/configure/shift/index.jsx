import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';
import style from './style.module.less'
import { Button, Modal, Form, Input, TimePicker, Space, message } from 'antd'
import dayjs from 'dayjs';
import moment from 'moment';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import dashed from '@imgs/dashed.png'
import { eneryShift } from '@api/api.js'
import {useSelector, useDispatch} from 'react-redux'
import {selectProjectId, getshifts, selectshifts} from '@redux/systemconfig.js'
import { useRequest } from 'ahooks';
import Custmodl from '@com/useModal'
 
import {CustButtonT} from "@com/useButton"
const Mainbox = styled.div`
  
&&{
  flex:1;
  .header{
   
    height: 64px;
    padding: 16px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #d7d7d7;
    .flex{
        // width: 100%;
        border-left: 4px solid ${props=>props.theme.primaryColor};
        height: 32px;
        padding-left: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .headerTitle{
        font-size: 14px;
        color: rgba(0, 0, 0, 0.847058823529412);
    }
}
.mainContent{
  //  width: 1680px;
    background-color: #fff;
    border: 1px solid #d7d7d7;
    border-radius: 4px;
    margin-top: 16px;
    padding: 16px;
    position: relative;
    display: flex;
    flex-direction: column;
    .content {
      flex:1;
      display: grid;
      grid-template-columns: repeat(3, minmax(auto, 365px));
      grid-auto-rows: 36px; 
      column-gap: 32px;
      padding-bottom: 32px;
      border-bottom: 1px solid #d7d7d7;
      margin-bottom: 32px;
    }

 
 
    .cardItem{ 
        display: flex;
        
        // border-right: 1px dashed #d7d7d7;
        height: 33px;
        align-items: center;
        column-gap: 16px;
        .ant-input{
          width: auto;
        }
        .ant-picker, .ant-input{
          flex:auto;
        }
        .title{ 
            display: inline-block;
          //  flex: auto;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.847058823529412);
        }
      }
       
    .middleItem{
        border-left: 1px dashed #d7d7d7;
        border-right: 1px dashed #d7d7d7;
        padding-left: 32px;
        padding-right: 32px;
         
    }
}
}
  
`
const Logbox=styled.div`
  display: flex;
   align-items:center;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 32px;
  .defaultStyle{
    display: inline-block;
    width: 148px; 
    height: 56px;
    border: 1px solid #d7d7d7;
    text-align: center;
    line-height: 56px;
    font-size: 16;
    color: #515151;
    background-color: #fff;
    cursor: pointer;
    margin-bottom: 16px;
  }
  .activeStyle { 
    color: #fff;
    background-color: ${props => props.theme.primaryColor};
  }

 
`
const Formbox = styled.div`
&&{
  display: flex;
  align-items: center;
  .ant-form-item {
    margin-bottom: ${props=> props.theme.laptop ? "12px" : "24px"};
  }
  .ant-space-item  .ant-form-item{
    margin-bottom: ${props=> props.theme.laptop ? "0px" : "24px"};
  }
}

`
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

  const [timeRanges, setTimeRanges] = useState([]);

    const handleTimeChange = (id, field, value) => {
    const newRanges = timeRanges.map(range => {
      if (range.id === id) {
        return { ...range, [field]: value };
      }
      return range;
    });
    setTimeRanges(newRanges);
  };

 

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
    return <div className='content'> 
      <div className="cardItem">
        <span className="title">班次{props.index}名称</span>
        <Input defaultValue={itemData.name}  disabled></Input>
      </div>
      <div className="cardItem middleItem">
        <span className="title">开始时间</span>
        <TimePicker defaultValue={dayjs(itemData.startTime, 'HH:mm')} format={format}   disabled></TimePicker>
      </div>
      <div className="cardItem">
        <span className="title">结束时间</span>
        <TimePicker defaultValue={dayjs(itemData.endTime, 'HH:mm')} format={format}  disabled></TimePicker>
      </div>    
    </div>
  }

  const onAdd = () => {
    setAddModal(true)
  }
  const toNext = () => {
    setAddModal(false)
    form.resetFields()
    let newRange = [];

    for(let i = 0; i < classes; i++){
      newRange.push({
        id: i + 1,
        name:'',
        start:null,
        end:null
      })
    }

    setTimeRanges(newRange);

    setNextModal(true)
  }
  const handleCancel = () => {
    setAddModal(false)
    setNextModal(false)
    setEditModal(false)
  }


  // 校验时间段是否重叠
    const validateTimeRanges = () => {
      // 过滤出已设置的时间段并排序
      const validRanges = timeRanges
        .filter(range => range.start && range.end)
        .map(range => ({
          id: range.id,
          start: range.start.valueOf(),
          end: range.end.valueOf()
        }))
        .sort((a, b) => a.start - b.start);
  
      // 检查是否有结束时间早于开始时间
      for (let range of validRanges) {
        if (range.end <= range.start && moment(range.end).format('HH:mm') != '00:00') {
          return { isValid: false, message: '结束时间必须晚于开始时间' };
        }
      }
  
      // 检查时间段是否重叠
      for (let i = 1; i < validRanges.length; i++) {
        let newStart = moment(validRanges[i].start).format('HH:mm')
        let newEnd = moment(validRanges[i - 1].end).format('HH:mm')

        if (newStart.slice(0, 2) < newEnd.slice(0,2) || 
        (newStart.slice(0, 2) == newEnd.slice(0,2) && newStart.slice(3) < newEnd.slice(3))) {
          
          return { isValid: false, message: '时间段不能重叠' };
        }
      }
  
      return { isValid: true, message: '校验通过' };
    };

  //新增
  const onOk = async () => {
    try{
      const values = await form.validateFields()
      const validation = validateTimeRanges();
      if (!validation.isValid) {
        message.error(validation.message);
        return;
      }
      let params = [];
      for(let i = 0; i<classes; i++){
        params.push({
          Name: values['name' + i],
          StartTime: moment(values['start' + i]).format('HH:mm'),
          EndTime: moment(values['end' + i]).format('HH:mm'),
        })
      }
      insertShift(projectId, classes, params).then(res => {
        if(res.success){
          messageApi.open({
            type:'success',
            content:'新增班次成功!'
          })
          shiftQuery()
          setNextModal(false)
        }else{
          message.error(res.errMsg)
        }
      })
    }catch(errorInfo){}
  }

  //编辑
  const onEdit = ()=> {
    setClasses(shiftList.length)
    let newRanges = []
    for(let i = 0; i<shiftList.length; i++){
      editform.setFieldValue(`name${i}`, shiftList[i].name)
      editform.setFieldValue(`start${i}`, moment(shiftList[i].startTime, 'HH:mm'))
      editform.setFieldValue(`end${i}`, moment(shiftList[i].endTime, 'HH:mm'))
      newRanges.push({
        id: shiftList[i].id,
        name: shiftList[i].name,
        start: moment(shiftList[i].startTime, 'HH:mm'),
        end:  moment(shiftList[i].endTime, 'HH:mm')
      })
    }
    setTimeRanges(newRanges);

    setEditModal(true)
  }

  const onUpdate = async () => {
    try{
      const values = await editform.validateFields()
      console.log(values)
      const validation = validateTimeRanges();
      if (!validation.isValid) {
        message.error(validation.message);
        return;
      }
      let params = [];
      for(let i = 0; i< shiftList.length; i++){
        params.push({
          Id: shiftList[i].id,
          Name: values['name' + i],
          StartTime: moment(values['start' + i]).format('HH:mm'),
          EndTime: moment(values['end' + i]).format('HH:mm'),
        })
      }

      updateShift(projectId, params).then(res => {
        if(res.success){
          messageApi.open({
            type: 'success',
            content:'班次方案修改成功!'
          })
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



  return (
    <Mainbox>
      {contextHolder}
      <div className="header">
        <div className="flex">
          <span className="headerTitle">班次管理</span>
          { shiftList.length == 0 ? <Button type='primary' style={{width: 96, height: 36}} onClick={() => onAdd()}>新增班次</Button> : 
          <CustButtonT onClick={() => onDelete()} text="deleteShiftPlan" wh="auto" />  }
        </div>
      </div>
      { shiftList.length > 0 ? <div className="mainContent">
       
        { shiftList.map((item, index) => {
          return <CardItem values={item} index={index + 1}></CardItem>
        }) }
        
        
        <div style={{display: 'flex', marginTop: 0, justifyContent:'flex-end'}}>
          <CustButtonT onClick={() => onEdit()} text="editShift" /> 
        </div>
      </div> : null }
      <Custmodl   open={addModal} title="选择每天的班次数量" onOk={toNext} onCancel={handleCancel} width={600} cancelText={'取消'} centered={true} closable={false} mold="cust" maskClosable={false} okText={'下一步'} okType={'primary'} >
         
          <Logbox>
            <span className={classes == 2 ? 'activeStyle defaultStyle' : 'defaultStyle' } onClick={()=> {setClasses(2)}}>一天两班</span>
            <span className={classes == 3 ? 'activeStyle defaultStyle' : 'defaultStyle' } onClick={()=> {setClasses(3)}}>一天三班</span>
            <span className={classes == 4 ? 'activeStyle defaultStyle' : 'defaultStyle' } onClick={()=> {setClasses(4)}}>一天四班</span>
            <span className={classes == 6 ? 'activeStyle defaultStyle' : 'defaultStyle' } onClick={()=> {setClasses(6)}}>一天六班</span>
            <span className={classes == 8 ? 'activeStyle defaultStyle' : 'defaultStyle' } onClick={()=> {setClasses(8)}}>一天八班</span>
            <span className={classes == 10 ? 'activeStyle defaultStyle' : 'defaultStyle' } onClick={()=> {setClasses(10)}}>一天十班</span>
          </Logbox>
          <img src={dashed} style={{marginTop: 32, width:'100%'}}></img>
        
      </Custmodl>
      {/* 新增 */}
      <Custmodl title="创建班次"  open={nextModal} onOk={onOk} onCancel={handleCancel} width={530} cancelText={'取消'} centered={true} closable={false} maskClosable={false} okText={'确认'} okType={'primary'} mold="cust" >
        
        <Formbox>
          <div style={{maxHeight:'720px', overflowY:'auto', overflowX:'hidden'}}>
            <Form name='addform' labelCol={{span:4}} form={form} labelAlign={'left'} requiredMark={false} autoComplete='off'>
              {
                timeRanges.map((item, index) => {
                  return (
                    <div key={index}>
                    <Item label={`班次${index + 1}名称`} name={'name' + index} rules={[{required:true, message:'班次名称不能为空'}]}>
                      <Input  style={{width:'180px'}} placeholder={'请输入班次名称'}></Input>
                    </Item>
                    <Item label='班次时段'>
                      <Space size={32} style={{display:'flex', alignItems:'flex-start'}}>
                        <Item name={'start' + index} rules={[{required:true, message:'班次时段不能为空'}]}>
                          <TimePicker style={{width: 180}}  minuteStep={15} onChange={(time) => handleTimeChange(index + 1, 'start', time)} format={format}></TimePicker>
                        </Item>
                        <Item name={'end' + index} rules={[{required:true, message:'班次时段不能为空'}]}>
                          <TimePicker style={{width: 180}}  minuteStep={15} onChange={(time) => handleTimeChange(index + 1, 'end', time)} format={format}></TimePicker>
                        </Item>
                      </Space>
                    </Item>
                    </div>
                  )
                })
              }

            </Form>
          </div>
        </Formbox>
        
        <div style={{marginTop:'16px', color:'#f66'}}>
          {'(注意：班次管理只可设置一天内时间段，跨天时间段请分为两段设置！)'}
        </div>
      </Custmodl>
      <Custmodl title='删除班次' ref={dref}  mold="cust" width={512} type="warn" onOk={()=>onDeleteShift()}>
         是否确认删除班次方案？ 
      </Custmodl>
      {/* 编辑 */}
      <Custmodl  title="编辑班次" open={editModal} onOk={onUpdate} onCancel={handleCancel} width={530}  closable={false} mold="cust" >
      <Formbox>
        <div style={{maxHeight:'680px', overflowY:'auto', overflowX:'hidden'}}>
            <Form name='editform' labelCol={{span:4}} form={editform} labelAlign={'left'} requiredMark={false} autoComplete='off'>

              {
                timeRanges.map((item, index) => {
                  return (
                    <div key={index}>
                    <Item label={`班次${index + 1}名称`} name={'name' + index} rules={[{required:true, message:'班次名称不能为空'}]}>
                      <Input  style={{width:'180px'}} placeholder={'请输入班次名称'}></Input>
                    </Item>
                    <Item label='班次时段'>
                      <Space size={32} style={{display:'flex', alignItems:'flex-start'}}>
                        <Item name={'start' + index} rules={[{required:true, message:'班次时段不能为空'}]}>
                          <TimePicker style={{width: 180}}  minuteStep={15} onChange={(time) => handleTimeChange(index + 1, 'start', time)} format={format}></TimePicker>
                        </Item>
                        <Item name={'end' + index} rules={[{required:true, message:'班次时段不能为空'}]}>
                          <TimePicker style={{width: 180}}  minuteStep={15} onChange={(time) => handleTimeChange(index + 1, 'end', time)} format={format}></TimePicker>
                        </Item>
                      </Space>
                    </Item>
                    </div>
                  )
                })
              }
            </Form>
            </div>
            </Formbox>
        <div style={{marginTop:'16px', color:'#f66'}}>
          {'(注意：班次管理只可设置一天内时间段，跨天时间段请分为两段设置！)'}
        </div>
      </Custmodl>
    </Mainbox>
  )
}



