import React, {useRef} from 'react'
import style from './style.module.less'
import UseHeader from '@com/useHeader'
import { Button, Input, Select, Space } from 'antd';
import imgurl from './imgs'
import timeList from './time'

export default function Index() {
  const peakRef = useRef()
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
  const fakeData = [
    {
      "id": 1,
      "areaId": 1,
      "price": 1,
      "type": 1,
      "startTime1": "03:00",
      "endTime1": "04:00",
      "startTime2": "05:00",
      "endTime2": "06:00",
      "startTime3": "07:00",
      "endTime3": "08:00"
    }
  ]
  const getFromChild = data => {
    if(data.areaId == 0 || !data.areaId) return;
  }
  const onSave = () => {
    console.log(peakRef.current.input.value)
  }
  return (
    <div>
      <UseHeader getValues={getFromChild}></UseHeader>
      <div className={style.priceContent}>
        <div className={style.headerTitle}>
          <span>计费管理</span>
          <Button type='primary' style={{ width: 96 }} onClick={()=>onSave()}>保存</Button>
        </div>
        <div className={style.priceList}>
          <div style={imgBg}>
            <img src={imgurl.jian} className={style.imgs}></img>
            <span className={style.word}>尖</span>
          </div>
          <div className={style.priceInput}>
            <Space>
              <span style={{fontSize: 16, color:'#515151'}}>尖电价</span>
              <Input ref={peakRef}></Input>
              <span style={{fontSize: 12, color:'#999'}}>(元/kWh)</span>
            </Space>
          </div>
          <img className={style.rightTriggle} src={imgurl.right}></img>
          <div className={style.timeList}>
            <Space size={40}>
              <span>开始时间</span>
              <Select style={{width: 196}} defaultValue={-1}>
                <Select.Option key={-1} value={-1}>请选择开始时间</Select.Option>
                {timeList.map(item => {
                  return <Select.Option key={item.id} value={item.id}>{item.label}</Select.Option>
                }) }
              </Select>
              <span>结束时间</span>
              <Select style={{width: 196}} defaultValue={-1}>
                <Select.Option key={-1} value={-1}>请选择结束时间</Select.Option>
                {timeList.map(item => {
                  return <Select.Option key={item.id} value={item.id}>{item.label}</Select.Option>
                }) }
              </Select>
            </Space>
            <Space size={40}>
              <span>开始时间</span>
              <Select style={{width: 196}} defaultValue={-1}>
                <Select.Option key={-1} value={-1}>请选择开始时间</Select.Option>
                {timeList.map(item => {
                  return <Select.Option key={item.id} value={item.id}>{item.label}</Select.Option>
                }) }
              </Select>
              <span>结束时间</span>
              <Select style={{width: 196}} defaultValue={-1}>
                <Select.Option key={-1} value={-1}>请选择结束时间</Select.Option>
                {timeList.map(item => {
                  return <Select.Option key={item.id} value={item.id}>{item.label}</Select.Option>
                }) }
              </Select>
            </Space>
            <Space size={40}>
              <span>开始时间</span>
              <Select style={{width: 196}} defaultValue={-1}>
                <Select.Option key={-1} value={-1}>请选择开始时间</Select.Option>
                {timeList.map(item => {
                  return <Select.Option key={item.id} value={item.id}>{item.label}</Select.Option>
                }) }
              </Select>
              <span>结束时间</span>
              <Select style={{width: 196}} defaultValue={-1}>
                <Select.Option key={-1} value={-1}>请选择结束时间</Select.Option>
                {timeList.map(item => {
                  return <Select.Option key={item.id} value={item.id}>{item.label}</Select.Option>
                }) }
              </Select>
            </Space>
          </div>
        </div>
      </div>
    </div>
  )
}
