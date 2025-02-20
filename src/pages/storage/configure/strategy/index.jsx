import React, { useState, useRef, useEffect } from 'react'
import {CheckCircleOutlined} from "@ant-design/icons"
import styled, {css} from 'styled-components'
import UseHeader from '@com/useHeader'
import CustModal from '@com/useModal'
import {useSelector} from "react-redux"
import { Divider, message, Form, Space, Input, Button, Select } from 'antd'
import style from './style.module.less'
import { StorageStrategyDesigner } from '@api/api.js'
import { CaretRightOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { timeToValue, controlList, timeList, idToTime, timeToId } from './changeJson'
import imgurl from './imgs'
import { themeColor,adaptation  } from '@redux/systemconfig.js'
import { cloneDeep, range, transform } from 'lodash'
import {CustButtonT} from "@com/useButton"
import {isLightColor} from "@com/usehandler"
import Pagecount from '@com/pagecontent' 
 
const Ctitle = styled.div`
 background-color: ${props => props.theme.primaryderived || "#000033"};
 color: #fff;
`
const csssty= css`
  .headerTitle{
    height: 24px;
    font-size: 14px;
  }
`
const Mainbox = styled.div`
  
    flex:1;
    border: 1px solid #d7d7d7;
    background-color: #fff;
    border-radius: 4px;
    padding: 16px;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
/*     :global{
        .ant-form-item-no-colon, .ant-form-item-label{
            font-size: 16px!important;
        }
        .ant-form-item-label > label{
            font-size: 16px!important;
        }
        
    } */

    .headerTitle {
        border-left: 4px solid var(--ant-primary-color);
        padding-left: 16px;
        font-size: 16px;
        color: #515151;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .strategyItem{
        display: flex;        
        column-gap: 16px;
        .itemTitle{
            width: 100%;
          //  background-color: #033;
            height: 36px;
         //   color: #fff;
            line-height: 36px;
            text-align: center;
            font-size: 14px;
        }
        .left{
            flex: 0 0 184px;
           
            border: 1px solid #d7d7d7;
            display: flex;
            flex-direction: column;
            .strategyList{
                //width: 100%;
              //  height: 604px;
                padding: 16px;
                overflow: hidden;
                position: relative;
                flex:1;
                .trans{
                    position: absolute;
                    left: 16px;
                    top: 16px;
                    transition: all 1s;
                }
                .strategyButton{
                    width: 152px;
                    height: 48px;
                    border: 1px solid #d7d7d7;
                    border-radius: 2px;
                    color: #515151;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    margin-bottom: 16px;
                    cursor: pointer;
                }
                .active{
                    background-color: var(--ant-primary-color);
                    color: #fff!important;
                }
            }
            .changeTab{
             //   width: 100%;
                height: 64px;
                background-color: #e4e4e4;
                display: flex;
                align-items: center;
                justify-content: space-around;
                font-size: 36px;
                color: #fff;
                span{
                    &:active{
                        color: var(--ant-primary-color);
                    }
                }
            }
        }
        .right{
            
         //   width: 1448px;
          //  height: 704px;
            border: 1px solid #d7d7d7;
            display: flex;
            flex-direction: column;
            flex:1;
            .middle{ 
                flex:1;
                padding: 16px;
             
                position: relative;
                .figureData{
                    margin: 16px 0;
                    .priceLine{
                        width: 100%;
                        position: relative;
                        height: 40px;
                    }
                    .progress{
                      //  width: 1416px;
                        height: 80px;
                        border: 1px solid #d7d7d7;
                        padding: 0 3px;
                      //  display: flex;
                        align-items: center;
                        display: grid;
                        grid-template-columns: repeat(${props=>props.listlen}, 1fr);
                        column-gap: ${props => props.theme.laptop ? "1px" : "3px"};;
                        .item{
                           // width: 12px;
                            height: 72px;
                            background-color: #f2f2f2;
                             
                        }
                    }
                    .timeList{
                        margin-top: 4px;
                        display: grid;
                        grid-template-columns: repeat(25, 1fr);
                        div{
                            padding: 0;
                            margin: 0; 
                            font-size: 14px;
                            color: #333;
                        }
                    }
                    
                }
                .fieldTitle{
                    margin-top: 8px;
                    margin-bottom: 8px;
                    font-size: ${props => props.theme.laptop ? "14px" : "16px"};
                    color: #000;
                    display: grid;
                    grid-template-columns: repeat(4,1fr);
                    padding-right: ${props=> props.theme.laptop ? "136px" : "200px"};
                }
                .items {
                  display: flex;
                  align-items: flex-start;
                  justify-content: space-between;
                  position: relative;
                  padding-right: ${props=> props.theme.laptop ? "68px" : "104px"};
                  .tip{
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                  .ext{
                    padding-left: ${props=> props.theme.laptop ? 0 : "2em"};
                  }
                }
                .legend{
                    position: absolute;
                    left: 16px;
                    bottom: 8px;
                    width: 260px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 12px;
                    color: #000;
                    .square{
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        margin-right: 6px;
                    }
                }
            }
            .bottom{
                
                height: 64px;
                background-color: #e4e4e4;
                display: flex;
                padding: 16px;
                align-items: center;
                justify-content: space-between;
            }
        }
        
    }
    ${props => props.theme.laptop ? csssty : null}
 
`

export default function Index() {
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
  const {primaryColor, primaryderived, successColor} =useSelector(themeColor)
  let isLight =isLightColor(primaryderived)
  const {laptop} = useSelector(adaptation)
  const addRef = useRef()
  const editRef = useRef()
  const deleteRef = useRef()
  const [addForm] = Form.useForm()
  const [strategyForm] = Form.useForm()
  const Item = Form.Item
  const { QueryStrategy, AddStrategy, UpdateStrategy, DeleteStrategy } = StorageStrategyDesigner
  const [headerData, setHeaderData] = useState({})
  const [strategyList, setStrategyList] =useState([])
  const [activeTab, setActiveTab] = useState(0)
  const getStrategy = (projectId, areaId, activeId) => {
    QueryStrategy(projectId, areaId).then(res => {
      let { success, data, errMsg } = res
      if(success){
        if(data.length> 0){
          data.map(item => {
            item.strategyTime.map(val => {
              val.startTime = timeToId[val.startTime]
              val.endTime = timeToId[val.endTime]
            })
          })
          setStrategyList(data)
          if(!activeId){
            setActiveTab(data[0].id)
            strategyForm.setFieldsValue(data[0])
          }else{
            setActiveTab(activeId)
            data.map(item => {
              if(item.id == activeId){
                strategyForm.setFieldsValue(item)
              }
            })
          }
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
          addForm.resetFields();
          getStrategy(headerData.projectId, headerData.areaId, activeTab)
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
      let params = cloneDeep(values)
      params.strategyTime.map(item => {
        console.log(item)
        item.startTime = idToTime[item.startTime]
        item.endTime = idToTime[item.endTime]
        item.endTime = item.endTime == '24:00' ? daytime + ' 00:00' : item.endTime
        item.id = item.id? item.id: 0
        item.strategyId = activeTab
      })
      params.id = activeTab
      UpdateStrategy(headerData.projectId, params).then(res => {
        let {success, data, errMsg} = res
        if(success){
          editRef.current.onOpen()
        }else{
          message.error(errMsg)
        }
      })
    }catch(erroInfo){}
  }
  const onClose = () => {
    editRef.current.onCancel()
    getStrategy(headerData.projectId, headerData.areaId, activeTab)
  }
  const onDelete = () => {
    deleteRef.current.onOpen()
  }
  const onConfirmDel = () => {
    DeleteStrategy(headerData.projectId, activeTab).then(res => {
      if(res.success){
        deleteRef.current.onCancel()
        message.success('删除策略成功!')
        setCount(0)
        getStrategy(headerData.projectId, headerData.areaId)
      }else{
        deleteRef.current.onCancel()
        message.success(res.errMsg)
      }
    })
  }
  const nameValue = Form.useWatch('strategyTime', strategyForm)
  const [colorList, setColorList] = useState([])
  const len = colorList?.length??0
  useEffect(()=> {
    let arr = []
    if(nameValue == undefined) return;
    nameValue.map(item => {
      if(item != undefined) {
        if((item.startTime>= 0 && item.endTime >= 0)  ){
          if(item.startTime >= item.endTime){
            message.error('开始时间不得大于或等于结束时间,请重新选择！');
            return;
          }
          if(!item.controlType) return;
          arr.push({
            startTime: item.startTime,
            endTime: item.endTime,
            type: item.controlType
          })
        }
      }
    })
    for(let i = 0; i < arr.length; i++){
      for(let j = 0; j< arr.length; j++){
        if(i == j){
          continue;
        }
        if(arr[j].startTime >= arr[i].startTime && arr[j].startTime < arr[i].endTime){
          message.error('策略时间段存在重叠，请重新选择！')
          return;
        }
      }
    }
    let colors = cloneDeep(timeList)
    colors.splice(96, 1)
    for(let i = 0; i < colors.length; i++){
      for(let j = 0; j< arr.length; j++){
        if(colors[i].id >= arr[j].startTime && colors[i].id < arr[j].endTime){
          colors[i].type = arr[j].type
        }
      }
    }
    // console.log(arr)
    // console.log(colors)
    setColorList(colors)
  },[nameValue])
  const timewd = laptop ? "96px": "196px"
  return (
    <Pagecount pd="0px" bgcolor="transparent">
      <UseHeader getValues={getFromChild}></UseHeader>
      <Mainbox listlen={len}>
        <div className="headerTitle">策略管理</div>
        <Divider dashed style={{margin: laptop ? "8px 0" : '16px 0'}}></Divider>
        <div className="strategyItem">
          <div className="left">
            <Ctitle isLight={isLight} className="itemTitle">策略管理</Ctitle>
            <div className="strategyList">
              <div className="trans" style={{ top: (-(count * 64) + 16)}}>
                {strategyList.map(item => {
                  return <div key={item.id} className="strategyButton" style={{ backgroundColor: activeTab == item.id ? primaryColor : ''}} onClick={()=>changeTab(item)}>
                    <span style={{color:activeTab == item.id ? '#fff': '#515151'}}>{item.name}</span>
                    <CaretRightOutlined style={{color:activeTab == item.id ? '#fff': '#ccc', position: 'absolute',right: 16, top: 16}}></CaretRightOutlined>
                  </div>
                }) }
                <div className="strategyButton" onClick={()=>addStrategy()}>
                  <span>+</span>
                </div>
              </div>
            </div>
            <div className="changeTab">
            <CaretUpOutlined  onClick={upList}/>
            <CaretDownOutlined onClick={downList} />
            </div>
          </div>
          <div className="right">
            <Ctitle isLight={isLight} className="itemTitle">充放策略详细设置</Ctitle>
            <div className="middle">
              <Form name='strategyForm' form={strategyForm} requiredMark={false} autoComplete='off' style={{paddingBottom: "16px"}}>
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
                <div className="figureData">
                  <div className="progress">
                    {colorList.map((item, index) => {
                      return <div className="item" title={index} key={index} style={{background:item.type == 1 ? '#4370FF' : item.type == 2 ? '#f93' : item.type == 3 ? '#0dc6d1' : item.type == 4 ? '#333' : '#f2f2f2'}}></div>
                    }) }
                  </div>
                  <div className="timeList">
                    {
                      Array.from({length: 25}, (_, index) => {
                        return <div key={index}>{index < 10 ? '0' + index : index}</div>
                      })
                    }
                  
                  </div>
                </div>
                <div className="fieldTitle">
                  <span>开始时间</span>
                  <span >结束时间</span>
                  <span>储能控制类型</span>
                  <span>储能计划功率</span>
                </div>
                <Item shouldUpdate noStyle>
                  {() => (
                    <Form.List name='strategyTime'>
                    {(fields, {add, remove}) => (
                      <div style={{overflowY:'auto'}}>
                       {fields.map(({key, name, ...restField}, index)=>(
                        <div key={key}  className='items'>
                          <Item   {...restField} name={[name, 'startTime']} rules={[{required:true, message:'请选择开始时间'}]}>
                            <Select style={{width: timewd}}>
                              { timeList.map(item => {
                                return <Select.Option key={item.id} value={item.id}
                                disabled={ (strategyForm.getFieldValue(['strategyTime', name, 'endTime']) <= item.id  && strategyForm.getFieldValue(['strategyTime', name, 'endTime'] )) ? true: false }>{item.label}</Select.Option>
                              })}
                            </Select>
                          </Item>
                          <div className='tip'>到</div>
                          <Item   {...restField} name={[name, 'endTime']} rules={[{required:true, message:'请选择结束时间'}]}>
                            <Select style={{width: timewd}}>
                              { timeList.map(item => {
                                return <Select.Option key={item.id} value={item.id}
                                disabled={ (strategyForm.getFieldValue(['strategyTime', name, 'startTime']) >= item.id  && strategyForm.getFieldValue(['strategyTime', name, 'endTime'] )) ? true: false }>{item.label}</Select.Option>
                              })}
                            </Select>
                          </Item>
                          <div className='tip'>执行</div>
                          <Item   {...restField} name={[name, 'controlType']} shouldUpdate rules={[{required:true, message:'请选择控制类型'}]}>
                            <Select style={{width: timewd}} onChange={val => { if(val == 3 || val == 4){ strategyForm.setFieldValue(['strategyTime', name, 'planP' ], 0) }}}>
                              {controlList.map(item => {
                                return <Select.Option key={item.id} value={item.id}>{item.label}</Select.Option>
                              })}
                            </Select>
                          </Item>
                          <div className='tip ext'>预设计划执行功率 (kW)</div>
                          <Item   {...restField} name={[name, 'planP']} shouldUpdate={true} rules={[{required:true, message:'请输入功率'}]}>
                            {/*['strategyTime', name, 'controlType' ]  */}
                            <Input style={{width: laptop ? 100 : 200}} disabled={(strategyForm.getFieldValue(['strategyTime', name, 'controlType' ]) == 3 || strategyForm.getFieldValue(['strategyTime', name, 'controlType' ]) == 4) ? true : false}></Input>
                          </Item>
                          <CustButtonT danger onClick={()=> remove(name)} text="delete" wh={laptop ? '60px' : "96px"} /> 
                          {index == fields.length - 1 ? <CustButtonT onClick={()=> add() } text="new" ghost  wh={laptop ? '60px' : "96px"}  style={{position: "absolute", right:  "0px"}} />: null}  
                        </div>
                       ))}
                       { fields.length == 0 ? <CustButtonT onClick={()=> add() } text="new" ghost /> : null}  
                      </div>
                    )}
                    
                  </Form.List>
                  )}
                </Item>
              </Form>
              <div className="legend">
                <div style={{display:"flex", alignItems:'center'}}>
                  <span className="square" style={{backgroundColor:'#4370ff'}}></span>
                  <span>充电</span>
                </div>
                <div style={{display:"flex", alignItems:'center'}}>
                  <span className="square" style={{backgroundColor:'#f93'}}></span>
                  <span>放电</span>
                </div>
                <div style={{display:"flex", alignItems:'center'}}>
                  <span className="square" style={{backgroundColor:'#0dc6d1'}}></span>
                  <span>待机</span>
                </div>
                <div style={{display:"flex", alignItems:'center'}}>
                  <span className="square" style={{backgroundColor:'#333'}}></span>
                  <span>停机</span>
                </div>
              </div>
            </div>
            <div className="bottom">
              <CustButtonT   danger   onClick={()=>onDelete()} text="delete" /> 
              <CustButtonT  onClick={()=>onSave()} text="save" /> 
            </div>
            <div></div>
          </div>
        </div>
      </Mainbox>
      <CustModal title='新增策略' ref={addRef}  mold="cust" width={592} maskClosable={false}  onOk={()=>onOk()}>
        <Form name='addForm' form={addForm} colon={false} requiredMark={false} autoComplete='off' style={{marginLeft: 32, fontSize: 16}}>
          <Item label='新增策略名称' >
          <Space>
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
      <CustModal title='操作提示' ref={editRef}  mold="cust" width={592} footer={null}  maskClosable={false}>
        <div style={{display:'flex',alignItems:'center', justifyContent:'center'}}>
           <CheckCircleOutlined  style={{fontSize:'44px', color:successColor,  marginRight:16}} />  
          <span style={{fontSize: 16, color: '#333'}}>策略保存成功!</span>
        </div>
        <div style={{marginTop: 32, display:'flex',justifyContent:'flex-end', alignItems:'center'}}>
          <CustButtonT   onClick={()=>onClose()} text="cancel" /> 
        </div>
      </CustModal>
      <CustModal title='删除策略' ref={deleteRef}  mold="cust" type={'warn'} width={592}   maskClosable={false} onOk={()=>onConfirmDel()}>
       是否确认删除该策略？
      </CustModal>
    </Pagecount>
  )
}
