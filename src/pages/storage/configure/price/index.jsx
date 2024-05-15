import React, {useEffect, useRef, useState} from 'react'
import style from './style.module.less'
import UseHeader from '@com/useHeader'
import { Button, Input, Select, Space, Form, message } from 'antd';
import imgurl from './imgs'
import {timeList, timeToValue, valueToTime} from './time'
import { StoragePriceDesigner } from '@api/api.js'
import { cloneDeep } from 'lodash';
import finished from '@imgs/finished.png'
import { CaretRightOutlined } from '@ant-design/icons';
import {CustButtonT} from '@com/useButton'
export default function Index() {
  const [pointedForm] = Form.useForm()
  const [peakForm] = Form.useForm()
  const [flatForm] = Form.useForm()
  const [valleyForm] = Form.useForm()
  const Item = Form.Item
  const { QueryStoragePrice, UpdateStoragePrice } = StoragePriceDesigner
  const imgBg = {
    width: 88,
    height: 88,
    lineHeight: '80px',
    textAlign: 'center',
    marginLeft: 60,
    backgroundImage:`url('${imgurl.bgCircle}')`,
    backgroundSize: '100% 100%',
    position: 'relative'
  }
  //select disabled
  const pointStart1 = Form.useWatch('startTime1', pointedForm)
  const pointEnd1 = Form.useWatch('endTime1', pointedForm)
  const pointStart2 = Form.useWatch('startTime2', pointedForm)
  const pointEnd2 = Form.useWatch('endTime2', pointedForm)
  const pointStart3 = Form.useWatch('startTime3', pointedForm)
  const pointEnd3 = Form.useWatch('endTime3', pointedForm)
  const [disPoint2 ,setDisPoint2] = useState(true)
  const [disPoint3 ,setDisPoint3] = useState(true)
  useEffect(()=> {
    if(pointStart1 == -1 || pointEnd1 == -1){
      pointedForm.setFieldValue('startTime2', -1)
      pointedForm.setFieldValue('endTime2', -1)
      setDisPoint2(true)
    }else{
      setDisPoint2(false)
    }
    if(pointStart2 == -1 || pointEnd2 == -1){
      pointedForm.setFieldValue('startTime3', -1)
      pointedForm.setFieldValue('endTime3', -1)
      setDisPoint3(true)
    }else{
      setDisPoint3(false)
    }
  },[pointStart1,pointEnd1, pointStart2, pointEnd2, pointStart3, pointEnd3])

  const peakStart1 = Form.useWatch('startTime1', peakForm)
  const peakEnd1 = Form.useWatch('endTime1', peakForm)
  const peakStart2 = Form.useWatch('startTime2', peakForm)
  const peakEnd2 = Form.useWatch('endTime2', peakForm)
  const peakStart3 = Form.useWatch('startTime3', peakForm)
  const peakEnd3 = Form.useWatch('endTime3', peakForm)
  const [disPeak2 ,setDisPeak2] = useState(true)
  const [disPeak3 ,setDisPeak3] = useState(true)
  useEffect(()=> {
    if(peakStart1 == -1 || peakEnd1 == -1){
      peakForm.setFieldValue('startTime2', -1)
      peakForm.setFieldValue('endTime2', -1)
      setDisPeak2(true)
    }else{
      setDisPeak2(false)
    }
    if(peakStart2 == -1 || peakEnd2 == -1){
      peakForm.setFieldValue('startTime3', -1)
      peakForm.setFieldValue('endTime3', -1)
      setDisPeak3(true)
    }else{
      setDisPeak3(false)
    }
  },[peakStart1,peakEnd1, peakStart2, peakEnd2, peakStart3, peakEnd3])

  const flatStart1 = Form.useWatch('startTime1', flatForm)
  const flatEnd1 = Form.useWatch('endTime1', flatForm)
  const flatStart2 = Form.useWatch('startTime2', flatForm)
  const flatEnd2 = Form.useWatch('endTime2', flatForm)
  const flatStart3 = Form.useWatch('startTime3', flatForm)
  const flatEnd3 = Form.useWatch('endTime3', flatForm)
  const [disFlat2 ,setDisFlat2] = useState(true)
  const [disFlat3 ,setDisFlat3] = useState(true)
  useEffect(()=> {
    if(flatStart1 == -1 || flatEnd1 == -1){
      flatForm.setFieldValue('startTime2', -1)
      flatForm.setFieldValue('endTime2', -1)
      setDisFlat2(true)
    }else{
      setDisFlat2(false)
    }
    if(flatStart2 == -1 || flatEnd2 == -1){
      flatForm.setFieldValue('startTime3', -1)
      flatForm.setFieldValue('endTime3', -1)
      setDisFlat3(true)
    }else{
      setDisFlat3(false)
    }
  },[flatStart1,flatEnd1, flatStart2, flatEnd2, flatStart3, flatEnd3])
  
  const valleyStart1 = Form.useWatch('startTime1', valleyForm)
  const valleyEnd1 = Form.useWatch('endTime1', valleyForm)
  const valleyStart2 = Form.useWatch('startTime2', valleyForm)
  const valleyEnd2 = Form.useWatch('endTime2', valleyForm)
  const valleyStart3 = Form.useWatch('startTime3', valleyForm)
  const valleyEnd3 = Form.useWatch('endTime3', valleyForm)
  const [disValley2 ,setDisValley2] = useState(true)
  const [disValley3 ,setDisValley3] = useState(true)
  useEffect(()=> {
    if(valleyStart1 == -1 || valleyEnd1 == -1){
      valleyForm.setFieldValue('startTime2', -1)
      valleyForm.setFieldValue('endTime2', -1)
      setDisValley2(true)
    }else{
      setDisValley2(false)
    }
    if(valleyStart2 == -1 || valleyEnd2 == -1){
      valleyForm.setFieldValue('startTime3', -1)
      valleyForm.setFieldValue('endTime3', -1)
      setDisValley3(true)
    }else{
      setDisValley3(false)
    }
  },[valleyStart1,valleyEnd1, valleyStart2, valleyEnd2, valleyEnd3, valleyStart3])
  
  //公用组件
  const CustomPrice = props => {
    let {disChange} = props
    return (<div className={style.priceList}>
    <div style={imgBg}>
      <img src={props.imgs} className={style.imgs}></img>
      <span className={style.word}>{props.title}</span>
    </div>
    <Form form={props.formName} layout='inline' colon={false} style={{display:'flex',alignItems: 'center'}} requiredMark={false} autoComplete='off' >
      <div className={style.priceInput}>
        <Space>
          <Item label={ props.title + '电价'} name='price'>
            <Input></Input>
          </Item>
          <span style={{fontSize: 12, color:'#999'}}>(元/kWh)</span>
        </Space>
      </div>
      <img className={style.rightTriggle} src={imgurl.right}></img>
      <div className={style.timeList}>
        <Space size={40}>
          <Item name='startTime1' label='开始时间' labelCol={{span:6}}>
            <Select style={{marginLeft: 40, width: 196}} placeholder='请选择开始时间' >
              {timeList.map(item => {
                return <Select.Option key={item.id} value={item.id} 
                disabled={((props.formName).getFieldValue('endTime1') && (props.formName).getFieldValue('endTime1') != -1 && (props.formName).getFieldValue('endTime1') <= item.id) ? true : false }>{item.label}</Select.Option>
              }) }
            </Select>
          </Item>
          <Item name='endTime1' label='结束时间' labelCol={{span:6}}>
            <Select style={{marginLeft: 40, width: 196}} placeholder='请选择结束时间' >
              {timeList.map(item => {
                return <Select.Option key={item.id} value={item.id} 
                disabled={(( (props.formName).getFieldValue('startTime1') || (props.formName).getFieldValue('startTime1') == 0 )&& (props.formName).getFieldValue('startTime1') != -1 && (props.formName).getFieldValue('startTime1') >= item.id) ? true : false }>{item.label}</Select.Option>
              }) }
            </Select>
          </Item>
        </Space>
        <Space size={40}>
          <Item name='startTime2' label='开始时间' labelCol={{span:6}} >
            <Select style={{marginLeft: 40, width: 196}} placeholder='请选择开始时间' disabled={disChange[0]}>
              {timeList.map(item => {
                return <Select.Option key={item.id} value={item.id} 
                disabled={((props.formName).getFieldValue('endTime2') && (props.formName).getFieldValue('endTime2') != -1 && (props.formName).getFieldValue('endTime2') <= item.id) ? true : false } >{item.label}</Select.Option>
              }) }
            </Select>
          </Item>
          <Item name='endTime2' label='结束时间' labelCol={{span:6}}>
            <Select style={{marginLeft: 40, width: 196}} placeholder='请选择结束时间' disabled={disChange[0]}>
              {timeList.map(item => {
                return <Select.Option key={item.id} value={item.id}
                disabled={(( (props.formName).getFieldValue('startTime2') || (props.formName).getFieldValue('startTime2') == 0 ) && (props.formName).getFieldValue('startTime2') != -1 && (props.formName).getFieldValue('startTime2') >= item.id) ? true : false }>{item.label}</Select.Option>
              }) }
            </Select>
          </Item>
        </Space>
        <Space size={40}>
          <Item name='startTime3' label='开始时间' labelCol={{span:6}} shouldUpdate>
            <Select style={{marginLeft: 40, width: 196}} placeholder='请选择开始时间' disabled={disChange[1]}>
              {timeList.map(item => {
                return <Select.Option key={item.id} value={item.id}
                disabled={((props.formName).getFieldValue('endTime3') && (props.formName).getFieldValue('endTime3') != -1 && (props.formName).getFieldValue('endTime3') <= item.id) ? true : false }>{item.label}</Select.Option>
              }) }
            </Select>
          </Item>
          <Item name='endTime3' label='结束时间' labelCol={{span:6}} shouldUpdate>
            <Select style={{marginLeft: 40, width: 196}} placeholder='请选择结束时间' disabled={disChange[1]}>
              {timeList.map(item => {
                return <Select.Option key={item.id} value={item.id}
                disabled={(( (props.formName).getFieldValue('startTime3') || (props.formName).getFieldValue('startTime3') == 0 ) && (props.formName).getFieldValue('startTime3') != -1 && (props.formName).getFieldValue('startTime3') >= item.id) ? true : false }>{item.label}</Select.Option>
              }) }
            </Select>
          </Item>
        </Space>
      </div>
    </Form>
  </div>)
  }
  const [headerData, setHeaderData] = useState({})
  const getFromChild = data => {
    if(data.areaId == 0 || !data.areaId) return;
    setHeaderData(data)
    queryData(data.projectId, data.areaId)
  }
  const [monthList, setMonthList] = useState([])
  const queryData = (projectId, areaId) => {
    QueryStoragePrice(projectId, areaId).then(res => {
      let {success, data, errMsg} = res
      if(success && data){
        setMonthList(data)
        let arrList = cloneDeep(data[activeTab - 1].storageMonthPrice)
        if(arrList.length == 0){
          setTag('add')
        }else{
          setTag('edit')
        }
        if(activeTab == 1 && arrList.length == 0){
          let obj = {
            startTime1: -1,
            endTime1: -1,
          }
          pointedForm.setFieldsValue(obj)
          peakForm.setFieldsValue(obj)
          flatForm.setFieldsValue(obj)
          valleyForm.setFieldsValue(obj)
          return;
        }
        arrList.map(item => {
          item.startTime1 = item.startTime1 == -1 ? -1 : timeToValue[item.startTime1] 
          item.endTime1 = item.endTime1 == -1 ? -1 : timeToValue[item.endTime1]
          item.startTime2 = item.startTime2 == -1 ? -1 : timeToValue[item.startTime2]
          item.endTime2 = item.endTime2 == -1 ? -1 : timeToValue[item.endTime2]
          item.startTime3 = item.startTime3 == -1 ? -1 : timeToValue[item.startTime3]
          item.endTime3 = item.endTime3 == -1 ? -1 : timeToValue[item.endTime3]
          if(item.type == 1){
            pointedForm.setFieldsValue(item)
          }
          if(item.type == 2){
            peakForm.setFieldsValue(item)
          }
          if(item.type == 3){
            flatForm.setFieldsValue(item)
          }
          if(item.type == 4){
            valleyForm.setFieldsValue(item)
          }
        })
      }else{
        message.error(errMsg)
      }
     })
  }
  
  const changeData = data => {
    let time = new Date()
    let curentTieStamp =time.getTime()
    curentTieStamp += 24 * 60 * 60 * 1000;
    let nextDate = new Date(curentTieStamp)
    let year = nextDate.getFullYear()
    let month = nextDate.getMonth() + 1 
    month = month > 9 ? month : '0' + month
    let day = nextDate.getDate()
    day = day > 9 ? day : '0' + day
    let daytime = year+ '-' + month + '-' + day
    data.price = Number(data.price)
    data.startTime1 = valueToTime[data.startTime1]
    data.endTime1 = valueToTime[data.endTime1]
    data.startTime2 = valueToTime[data.startTime2]
    data.endTime2 = valueToTime[data.endTime2]
    data.startTime3 = valueToTime[data.startTime3]
    data.endTime3 = valueToTime[data.endTime3]
    if(data.endTime1 && data.endTime1 == '24:00'){
      data.endTime1 = daytime + ' 00:00'
    }
    if(data.endTime2 && data.endTime2 == '24:00'){
      data.endTime2 = daytime + ' 00:00'
    }
    if(data.endTime3 && data.endTime3 == '24:00'){
      data.endTime3 = daytime + ' 00:00'
    }
    return data;
  }

  //判断时间重叠
  const checkDouble = (list1, list2) => {
    for(let i =0;i < list1.length; i++){
      for(let j =0;j < list2.length; j++){
        if(i == j){
          continue;
        }
        if( (list2[j][0]>= list1[i][0] && list2[j][0]< list1[i][1]) || (list2[j][1]> list1[i][0] && list2[j][1]<= list1[i][1]) ){
          return [i, j]
        }
      }
    }
    return []
  }


  const onSave = () => {
     const isEmpty = (n) => isNaN(n) || n <=0;

    let param1 = cloneDeep(pointedForm.getFieldsValue(true))
   

    let param2 = cloneDeep(peakForm.getFieldsValue(true))
   
    let param3 = cloneDeep(flatForm.getFieldsValue(true))
    let param4 =cloneDeep(valleyForm.getFieldsValue(true))
    
    if(isEmpty(param1.price) || isEmpty(param2.price)|| isEmpty(param3.price) || isEmpty(param4.price)){
      message.error('请检查尖峰平谷的价格！')
      return;
    }
    let checkArr = []
    let count1 = 0, count2 = 0, count3 = 0, count4 = 0;
    //尖判断
    if(param1.startTime1!= -1 && param1.endTime1 != -1){
      checkArr.push([param1.startTime1, param1.endTime1 == 0 ? 24 : param1.endTime1])
      count1++;
    }else if(param1.startTime1== -1 && param1.endTime1 == -1){}else{
      message.error('请选择完整的尖电价时间段!')
      return;
    }
    if(param1.startTime2!= -1 && param1.endTime2 != -1){
      checkArr.push([param1.startTime2, param1.endTime2 == 0 ? 24 : param1.endTime2])
      count1++;
    }else if(param1.startTime2== -1 && param1.endTime2 == -1){}else{
      message.error('请选择完整的尖电价时间段!')
      return;
    }
    if(param1.startTime3!= -1 && param1.endTime3 != -1){
      checkArr.push([param1.startTime3, param1.endTime3 == 0 ? 24 : param1.endTime3])
      count1++;
    }else if(param1.startTime3== -1 && param1.endTime3 == -1){}else{
      message.error('请选择完整的尖电价时间段!')
      return;
    }

    //峰判断
    if(param2.startTime1!= -1 && param2.endTime1 != -1){
      checkArr.push([param2.startTime1, param2.endTime1 == 0 ? 24 : param2.endTime1])
      count2++;
    }else if(param2.startTime1== -1 && param2.endTime1 == -1){}else{
      message.error('请选择完整的峰电价时间段!')
      return;
    }
    if(param2.startTime2!= -1 && param2.endTime2 != -1){
      checkArr.push([param2.startTime2, param2.endTime2 == 0 ? 24 : param2.endTime2])
      count2++;
    }else if(param2.startTime2== -1 && param2.endTime2 == -1){}else{
      message.error('请选择完整的峰电价时间段!')
      return;
    }
    if(param2.startTime3!= -1 && param2.endTime3 != -1){
      checkArr.push([param2.startTime3, param2.endTime3 == 0 ? 24 : param2.endTime3])
      count2++;
    }else if(param2.startTime3== -1 && param2.endTime3 == -1){}else{
      message.error('请选择完整的峰电价时间段!')
      return;
    }

    //平判断
    if(param3.startTime1!= -1 && param3.endTime1 != -1){
      checkArr.push([param3.startTime1, param3.endTime1 == 0 ? 24 : param3.endTime1])
      count3++;
    }else if(param3.startTime1== -1 && param3.endTime1 == -1){}else{
      message.error('请选择完整的平电价时间段!')
      return;
    }
    if(param3.startTime2!= -1 && param3.endTime2 != -1){
      checkArr.push([param3.startTime2, param3.endTime2 == 0 ? 24 : param3.endTime2])
      count3++;
    }else if(param3.startTime2== -1 && param3.endTime2 == -1){}else{
      message.error('请选择完整的平电价时间段!')
      return;
    }
    if(param3.startTime3!= -1 && param3.endTime3 != -1){
      checkArr.push([param3.startTime3, param3.endTime3 == 0 ? 24 : param3.endTime3])
      count3++;
    }else if(param3.startTime3== -1 && param3.endTime3 == -1){}else{
      message.error('请选择完整的平电价时间段!')
      return;
    }

    //谷判断
    if(param4.startTime1!= -1 && param4.endTime1 != -1){
      checkArr.push([param4.startTime1, param4.endTime1 == 0 ? 24 : param4.endTime1])
      count4++;
    }else if(param4.startTime1== -1 && param4.endTime1 == -1){}else{
      message.error('请选择完整的谷电价时间段!')
      return;
    }
    if(param4.startTime2!= -1 && param4.endTime2 != -1){
      checkArr.push([param4.startTime2, param4.endTime2 == 0 ? 24 : param4.endTime2])
      count4++;
    }else if(param4.startTime2== -1 && param4.endTime2 == -1){}else{
      message.error('请选择完整的谷电价时间段!')
      return;
    }
    if(param4.startTime3!= -1 && param4.endTime3 != -1){
      checkArr.push([param4.startTime3, param4.endTime3 == 0 ? 24 : param4.endTime3])
      count4++;
    }else if(param4.startTime3== -1 && param4.endTime3 == -1){}else{
      message.error('请选择完整的谷电价时间段!')
      return;
    }

    let repeat = checkDouble(checkArr, checkArr)
    if(repeat.length> 0){
      let first = repeat[0]
      let second = repeat[1]
      let firstName = '', secondName = '';
      if(first<= count1 - 1) {firstName = '尖'}
      if((first> count1 - 1) &&  (first<= count1 + count2 - 1)) {firstName = '峰'}
      if((first> count1 + count2 - 1) &&  (first<= count1 + count2 + count3 - 1)) {firstName = '平'}
      if((first> count1 + count2 + count3 - 1)) {firstName = '谷'}
      if(second<= count1 - 1) {secondName = '尖'}
      if((second> count1 - 1) &&  (second<= count1 + count2 - 1)) {secondName = '峰'}
      if((second> count1 + count2 - 1) &&  (second<= count1 + count2 + count3 - 1)) {secondName = '平'}
      if((second> count1 + count2 + count3 - 1)) {secondName = '谷'}
      if(firstName != secondName){
        message.error(firstName + '电价与'+ secondName + '电价时间段存在重叠，请重新选择！')
      }else{
        message.error(firstName + '电价时间段存在重叠，请重新选择！')
      }
      return;
    }
    param1 = changeData(param1)
    param2 = changeData(param2)
    param3 = changeData(param3)
    param4 = changeData(param4)
    if(tag == 'add'){
      param1.id = 0
      param1.type = 1
      param2.id = 0
      param2.type = 2
      param3.id = 0
      param3.type = 3
      param4.id = 0
      param4.type = 4
    }
    UpdateStoragePrice(headerData.projectId, headerData.areaId, activeTab, [param1, param2, param3, param4]).then(res =>{
      let {success, data, errMsg} = res
      if(success){
        message.success(activeTab + '月电价保存成功!')
        queryData(headerData.projectId, headerData.areaId)
      }else{
        message.error(errMsg)
      }
    })
  }
  const [activeTab, setActiveTab] = useState(1)
  const [tag, setTag] = useState('add');
  const changeTab = values => {
    if(activeTab == values.month) return;
    setActiveTab(values.month)
    if(values.storageMonthPrice.length == 0) {
      setTag('add');
      return;
    }else{
      setTag('edit')
      let arrList = cloneDeep(values.storageMonthPrice)
      arrList.map(item => {
        item.startTime1 = item.startTime1 == -1 ? -1 : timeToValue[item.startTime1] 
        item.endTime1 = item.endTime1 == -1 ? -1 : timeToValue[item.endTime1]
        item.startTime2 = item.startTime2 == -1 ? -1 : timeToValue[item.startTime2]
        item.endTime2 = item.endTime2 == -1 ? -1 : timeToValue[item.endTime2]
        item.startTime3 = item.startTime3 == -1 ? -1 : timeToValue[item.startTime3]
        item.endTime3 = item.endTime3 == -1 ? -1 : timeToValue[item.endTime3]
        if(item.type == 1){
          pointedForm.setFieldsValue(item)
        }
        if(item.type == 2){
          peakForm.setFieldsValue(item)
        }
        if(item.type == 3){
          flatForm.setFieldsValue(item)
        }
        if(item.type == 4){
          valleyForm.setFieldsValue(item)
        }
      })
    }
    
  }

  return (
    <div>
      <UseHeader getValues={getFromChild}></UseHeader>
      <div className={style.mainContent}>
        <div className={style.monthList}>
          <div className={style.monthTitle}>月份选择</div>
          {monthList.map((item, index) => {
            return <div key={index} className={style.monthTab} style={{ backgroundColor: activeTab == item.month ? '#237ae4':''}} onClick={()=>changeTab(item)}>
              { item.storageMonthPrice .length == 0 ? null : <img src={finished} className={style.success}></img>}
              <span style={{color:activeTab == item.month ? '#fff': '#515151'}}>{item.month}月电价</span>
              <CaretRightOutlined className={style.rightIcon} style={{color:activeTab == item.month ? '#fff': '#ccc'}}/>
            </div>
          })}
        </div>
        <div className={style.priceContent}>
        <div className={style.headerTitle}>
          <span>电价设置</span>
          <CustButtonT onClick={()=>onSave()} text="save" /> 
        </div>
        <CustomPrice title='尖' formName={pointedForm} imgs={imgurl.jian} disChange={[disPoint2, disPoint3]}></CustomPrice>
        <CustomPrice title='峰' formName={peakForm} imgs={imgurl.feng} disChange={[disPeak2, disPeak3]}></CustomPrice>
        <CustomPrice title='平' formName={flatForm} imgs={imgurl.ping} disChange={[disFlat2, disFlat3]}></CustomPrice>
        <CustomPrice title='谷' formName={valleyForm} imgs={imgurl.gu} disChange={[disValley2, disValley3]}></CustomPrice>
      </div>
      </div>
    </div>
  )
}
