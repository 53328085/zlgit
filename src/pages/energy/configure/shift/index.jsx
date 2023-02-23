import React, { useRef, useState } from 'react'
import style from './style.module.less'
import { Button, Modal, Form, Input, TimePicker, Space } from 'antd'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import CustModal from '@com/useModal'
import dashed from '@imgs/dashed.png'

export default function Index() {
  const aref = useRef()
  const [addModal, setAddModal] = useState(false)
  const [nextModal, setNextModal] = useState(false)
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
  }
  const onOk = () => {
    setNextModal(false)
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
      <div className={style.header}>
        <div className={style.flex}>
          <span className={style.headerTitle}>班次管理</span>
          <Button type='primary' style={{width: 96}} onClick={() => onAdd()}>新增班次</Button>
        </div>
      </div>
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
    </div>
  )
}
