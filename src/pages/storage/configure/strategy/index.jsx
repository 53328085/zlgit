import React, { useState, useRef, useEffect } from 'react'
import UseHeader from '@com/useHeader'
import CustModal from '@com/useModal'
import { Divider, message, Form, Space, Input, Button, Select } from 'antd'
import style from './style.module.less'
import { StorageStrategyDesigner, StoragePriceDesigner } from '@api/api.js'
import { CaretRightOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { timeToValue, controlList, timeList, idToTime, timeToId } from './changeJson'
import imgurl from './imgs'
import { range } from 'lodash'

export default function Index() {
  const addRef = useRef()
  const [addForm] = Form.useForm()
  const [strategyForm] = Form.useForm()
  const Item = Form.Item
  const { QueryStrategy, AddStrategy } = StorageStrategyDesigner
  const { QueryStoragePrice } = StoragePriceDesigner
  const [headerData, setHeaderData] = useState({})
  const [strategyList, setStrategyList] =useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [priceList, setPriceList] = useState([])
  const getStrategy = (projectId, areaId) => {
    QueryStrategy(projectId, areaId).then(res => {
      let { success, data, errMsg } = res
      if(success){
        if(data){
          data.map(item => {
            item.strategyTime.map(val => {
              val.startTime = timeToId[val.startTime]
              val.endTime = timeToId[val.endTime]
            })
          })
          setStrategyList(data)
          setActiveTab(data[0].id)
          strategyForm.setFieldsValue(data[0])
        }else{
          setStrategyList([])
        }
      }else{
        message.error(errMsg)
      }
    })
  }
  const getFromChild = data => {
    if(data.areaId == 0 || !data.areaId) return;
    setHeaderData(data)
    getStrategy(data.projectId, data.areaId)
    QueryStoragePrice(data.projectId, data.areaId).then(res => {
      let { success, data, errMsg } = res
      if(success){
        if(data){
          let arrList = []
          data.map(item => {
            if(item.startTime1 != -1 && item.endTime1 != -1){
              arrList.push({
                start: timeToValue[item.startTime1],
                end: item.endTime1 == '00:00' ? 24 : timeToValue[item.endTime1],
                type: item.type,
                name: item.type == 1? '尖' : item.type == 2 ? '峰' : item.type == 3 ? '平' : '谷'
              })
            }
            if(item.startTime2 != -1 && item.endTime2 != -1){
              arrList.push({
                start: timeToValue[item.startTime2],
                end: item.endTime2 == '00:00' ? 24 : timeToValue[item.endTime2],
                type: item.type,
                name: item.type == 1? '尖' : item.type == 2 ? '峰' : item.type == 3 ? '平' : '谷'
              })
            }
            if(item.startTime3 != -1 && item.endTime3 != -1){
              arrList.push({
                start: timeToValue[item.startTime3],
                end: item.endTime3 == '00:00' ? 24 : timeToValue[item.endTime3],
                type: item.type,
                name: item.type == 1? '尖' : item.type == 2 ? '峰' : item.type == 3 ? '平' : '谷'
              })
            }
          })
          setPriceList(arrList)
        }else{
          setPriceList([])
        }
      }else{
        message.error(errMsg)
      }
    })
  }
  const changeTab = item => {
    if(activeTab == item.id) return;
    setActiveTab(item.id)
    strategyForm.setFieldsValue(item)
  }

  const addStrategy = () => {
    addRef.current.onOpen()
  }
  const onOk = async () => {
    try{
      const values = await addForm.validateFields();
      AddStrategy(headerData.projectId, headerData.areaId, values.name).then(res => {
        let {success, data, errMsg} = res
        if(success) {
          addRef.current.onCancel()
          getStrategy(headerData.projectId, headerData.areaId)
        }else{
          message.error(errMsg)
        }
      })
    }catch(errorInfo){}
  }

  const handelValidate = (rule, value, callback) => {
    if(value.length> 8){
      return Promise.reject('最多8字符')
    }else{
      return Promise.resolve();
    }
  }

  const [count, setCount] = useState(0)
  const upList = () => {
    if(strategyList.length <= 8) return;
    if((count)<= 0) return;
    setCount(count - 1)
  }
  const downList = () => {
    if(strategyList.length <= 8) return;
    if((count + 8)>= strategyList.length) return;
    setCount(count + 1)
  }
  const onSave = async() => {
    try{
      const values = await strategyForm.validateFields()
    }catch(errorInfo){}
  }

  return (
    <div>
      <UseHeader getValues={getFromChild}></UseHeader>
      <div className={style.strategyContent}>
        <div className={style.headerTitle}>策略管理</div>
        <Divider dashed style={{margin: '16px 0'}}></Divider>
        <div className={style.strategyItem}>
          <div className={style.left}>
            <div className={style.itemTitle}>策略管理</div>
            <div className={style.strategyList}>
              <div className={style.trans} style={{ top: (-(count * 64) + 16)}}>
                {strategyList.map(item => {
                  return <div key={item.id} className={style.strategyButton} style={{ backgroundColor: activeTab == item.id ? '#237ae4':''}} onClick={()=>changeTab(item)}>
                    <span style={{color:activeTab == item.id ? '#fff': '#515151'}}>{item.name}</span>
                    <CaretRightOutlined style={{color:activeTab == item.id ? '#fff': '#ccc', position: 'absolute',right: 16, top: 16}}></CaretRightOutlined>
                  </div>
                }) }
                <div className={style.strategyButton} onClick={()=>addStrategy()}>
                  <span>+</span>
                </div>
              </div>
            </div>
            <div className={style.changeTab}>
            <CaretUpOutlined  onClick={upList}/>
            <CaretDownOutlined onClick={downList} />
            </div>
          </div>
          <div className={style.right}>
            <div className={style.itemTitle}>充放策略详细设置</div>
            <div className={style.middle}>
              <Form name='strategyForm' form={strategyForm} requiredMark={false} autoComplete='off'>
                <Item label='策略名称'>
                  <Space size={16}>
                    <Item 
                    name='name' 
                    labelAlign='left'
                    noStyle 
                    rules={[{required:true, message:'请输入策略名称'},{validator:handelValidate }]}>
                      <Input style={{width: 205, height: 36}} maxLength={8}></Input>
                    </Item>
                    <div style={{fontSize: 12, color:'#999'}}>最多8字符</div>
                  </Space>
                </Item>
                <div className={style.figureData}>
                  <div className={style.priceLine}>
                  { priceList.map((item, index) => {
                    return <div key={index} style={{ position:'absolute',left:item.start * 59, top: 0, width:(item.end - item.start) * 59, display:'flex', flexDirection:'column',alignItems:'center'}}>
                      <div style={{color:'#fff', height: 20, textAlign:'center', width: 48, lineHeight: '20px', borderRadius: 20, fontSize: 14,backgroundColor:item.type == 1 ? '#aa0410' : item.type == 2 ? '#f93' : item.type == 3 ? '#0dc6d1' : "#4370FF" }}>{item.name}</div>
                      <div style={{marginTop: 8, position:'relative', width: '100%', height:8, borderTop:'1px solid ' + (item.type == 1 ? '#aa0410' : item.type == 2 ? '#f93' : item.type == 3 ? '#0dc6d1' : "#4370FF")}}>
                        <div style={{position: 'absolute', left: 0, top: '-3px', width: 6, height:6, borderRadius: '50%', backgroundColor:item.type == 1 ? '#aa0410' : item.type == 2 ? '#f93' : item.type == 3 ? '#0dc6d1' : "#4370FF" }}></div>
                        <div style={{position: 'absolute', right: 0, top: '-3px', width: 6, height:6, borderRadius: '50%', backgroundColor:item.type == 1 ? '#aa0410' : item.type == 2 ? '#f93' : item.type == 3 ? '#0dc6d1' : "#4370FF" }}></div>
                      </div>
                    </div>
                  }) }
                  </div>
                  <div className={style.progress}>
                    {range(96).map((item, index) => {
                      return <div className={style.item} key={index}></div>
                    }) }
                  </div>
                  <div className={style.timeList}>
                    {range(24).map((item, index) => {
                      return <div key={index}>{item < 10 ? '0' + item : item}</div>
                    })}
                    24
                  </div>
                </div>
                <div className={style.fieldTitle}>
                  <span style={{marginLeft: 0}}>开始时间</span>
                  <span style={{marginLeft: 196}}>结束时间</span>
                  <span style={{marginLeft: 206}}>储能控制类型</span>
                  <span style={{marginLeft: 330}}>储能计划功率</span>
                </div>
                <Form.List name='strategyTime'>
                  {(fields, {add, remove}) => (
                    <>
                     {fields.map(({key, name, ...restField})=>(
                      <Space key={key} style={{display: 'flex', fontSize: 16}} size={24} align='baseline'>
                        <Item {...restField} name={[name, 'startTime']} rules={[{required: true, message:'请选择开始时间'}]}>
                          <Select style={{width: 196}}>
                            { timeList.map(item => {
                              return <Select.Option key={item.id} value={item.id}>{item.label}</Select.Option>
                            })}
                          </Select>
                        </Item>
                        <span>到</span>
                        <Item {...restField} name={[name, 'endTime']}>
                          <Select style={{width: 196}}>
                            { timeList.map(item => {
                              return <Select.Option key={item.id} value={item.id}>{item.label}</Select.Option>
                            })}
                          </Select>
                        </Item>
                        <span>执行</span>
                        <Item {...restField} name={[name, 'controlType']}>
                          <Select style={{width: 196}} onChange={val => { if(val==3){ strategyForm.setFieldValue(['strategyTime', name, 'planP' ], 0)  }   }}>
                            {controlList.map(item => {
                              return <Select.Option key={item.id} value={item.id}>{item.label}</Select.Option>
                            })}
                          </Select>
                        </Item>
                        <span style={{marginLeft: 40}}>预设计划执行功率 (kW)</span>
                        <Item {...restField} name={[name, 'planP']} shouldUpdate >
                          <Input style={{width: 200}} disabled={strategyForm.getFieldValue(['strategyTime', name, 'controlType' ]) == 3 ? true : false }></Input>
                        </Item>
                        <Button danger onClick={()=> remove(name)}>删除</Button>  
                      </Space>
                     ))}
                     <Item>
                        <Button onClick={()=> add()}>新增</Button>
                      </Item>
                    </>
                  )}
                </Form.List>
              </Form>
            </div>
            <div className={style.bottom}>
              <Button type='primary' danger style={{width: 96}}>删除</Button>
              <Button type='primary' style={{width: 96}} onClick={()=>onSave()}>保存</Button>
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <CustModal title='新增策略' ref={addRef}  mold="cust" width={592}  onOk={()=>onOk()}>
        <Form name='addForm' form={addForm} colon={false} requiredMark={false} autoComplete='off' style={{marginLeft: 32, fontSize: 16}}>
          <Item label='新增策略名称' >
          <Space size={16}>
            <Item 
            name='name' 
            labelAlign='left'
            noStyle 
            labelCol={{span: 8}}
            rules={[{required:true, message:'请输入策略名称'},{validator:handelValidate }]}>
              <Input style={{width: 205, height: 36}} maxLength={8}></Input>
            </Item>
            <span style={{fontSize: 12, color:'#999'}}>最多8字符</span>
          </Space>
          </Item>
        </Form>
      </CustModal>
    </div>
  )
}
