import React, { useEffect, useState, useRef } from 'react'
 
import { Button, Space, message, Form, Input } from 'antd';
import style from './style.module.less'
import { energyPrice } from '@api/api.js'
import { useRequest } from 'ahooks';
import Custmodl from '@com/useModal'
import styled from 'styled-components';
import {useOutletContext} from 'react-router-dom'  
import Pagecount from "@com/pagecontent";
import {Cspin, Serach, Cdivider} from '@com/comstyled'
const Mainbox = styled.div`
  
  display: flex;
  flex: 1;
  flex-direction: column;
  row-gap: 16px;
`
export default function Index() {
  const aref = useRef()
  const eref = useRef()
  const dref = useRef()
  const formRef = useRef()
  const [form] = Form.useForm()
  const [editform] = Form.useForm()
  const Item = Form.Item
  let {exparams} = useOutletContext()
  let {areaId, projectId, areaName=''} = exparams 
  const [messageApi, contextHolder] = message.useMessage();
  const { queryPriceSolutions, insertPriceSolution, updatePriceSolution, deletePriceSolution } = energyPrice
  const [elecPrice, setElecPrice] = useState()
  const [waterPrice, setWaterPrice] = useState()
  const [gasPrice, setGasPrice] = useState()
  const [coalPrice, setCoalPrice] = useState()
  const [fuelPrice, setFuelPrice] = useState()
  const [changeTag, setChangeTag]= useState()
  const [editId, setEditId]= useState()
  const [solutionId, setSolutionId] = useState()
  
  const Actions = (props) => {
    return <div className={style.actions}>
      {props.valueJson ? <Space>
      <Button type='primary' style={{width: 96}} onClick={()=> editPrice(props.valueJson, props.title)}>编辑</Button>
      <Button type='primary' style={{width: 96}} danger onClick={()=> deletePrice(props.valueJson.id, props.title)}>删除</Button>
      </Space> : <Button type='primary' style={{width: 96, marginLeft:'auto'}} onClick={()=> addPrice(props.title)}>新建</Button>}
    </div>
  }

  

  const getSolutions = () => {
    if(!Number.isFinite(areaId)) return
    return queryPriceSolutions(projectId, areaId).then(res => {
      if(res.success){
        setElecPrice()
        setWaterPrice()
        setGasPrice()
        setCoalPrice()
        setFuelPrice()
        let { data } = res
        if(data.length == 0){
          return;
        }else{
          data.map(item => {
            if(item.priceType == 1){
              setElecPrice(item)
            }
            if(item.priceType == 2){
              setWaterPrice(item)
            }
            if(item.priceType == 3){
              setGasPrice(item)
            }
            if(item.priceType == 9){
              setCoalPrice(item)
            }
            if(item.priceType == 10){
              setFuelPrice(item)
            }
          })
        }
      }else{
        messageApi.open({
          type:'error',
          content:res.errMsg
        })
      }
    })
  }

  const {run: queryRun } = useRequest(getSolutions,{
     refreshDeps: [areaId, projectId]
    
  })

  const addPrice = (title) => {
    if(areaId == 0 || !areaId){
      message.warning('请先选择园区！')
      return;
    }
    setChangeTag(title);
    aref.current.onOpen()
  }
  const editPrice = (values, title) => {
    eref.current.onOpen()
    setChangeTag(title);
    setEditId(values.id)
    editform.setFieldsValue(values)
    
  }
  const deletePrice = (values, title) => {
    setChangeTag(title);
    setSolutionId(values)
    dref.current.onOpen()
  }
  const onOk = async () => {
    try {
      const values = await form.validateFields();
      let params = {}
      params.AreaId = areaId
      if(changeTag == 'electric'){
        params.PriceType = 1
        params.Price1 = parseFloat(values.price1)
        params.Price2 = parseFloat(values.price2)
        params.Price3 = parseFloat(values.price3)
        params.Price4 = parseFloat(values.price4)
      }
      if(changeTag == 'water'){
        params.PriceType = 2
        params.Price = parseFloat(values.price)
      }
      if(changeTag == 'gas'){
        params.PriceType = 3
        params.Price = parseFloat(values.price)
      }
      if(changeTag == 'coal'){
        params.PriceType = 9
        params.Price = parseFloat(values.price)
      }
      if(changeTag == 'fuel'){
        params.PriceType = 10
        params.Price = parseFloat(values.price)
      }
      insertPriceSolution(projectId, params).then(res=>{
        if(res.success){
          messageApi.open({
            type:'success',
            content: '定价方案新增成功!'
          })
        }else{
          messageApi.open({
            type:'error',
            content: res.errMsg
          })
        }
        queryRun()
        form.resetFields()
        aref.current.onCancel();
      })
      
    }catch(errorInfo){}
    
  }

  const onSaveEdit = async () => {
    try {
      const values = await editform.validateFields();
      let params = {}
      params.AreaId = areaId
      params.id = editId
      if(changeTag == 'electric'){
        params.PriceType = 1
        params.Price1 = parseFloat(values.price1)
        params.Price2 = parseFloat(values.price2)
        params.Price3 = parseFloat(values.price3)
        params.Price4 = parseFloat(values.price4)
      }
      if(changeTag == 'water'){
        params.PriceType = 2
        params.Price = parseFloat(values.price)
      }
      if(changeTag == 'gas'){
        params.PriceType = 3
        params.Price = parseFloat(values.price)
      }
      if(changeTag == 'coal'){
        params.PriceType = 9
        params.Price = parseFloat(values.price)
      }
      if(changeTag == 'fuel'){
        params.PriceType = 10
        params.Price = parseFloat(values.price)
      }
      updatePriceSolution(projectId, params).then(res=>{
        if(res.success){
          messageApi.open({
            type:'success',
            content: '定价方案编辑成功!'
          })
        }else{
          messageApi.open({
            type:'error',
            content: res.errMsg
          })
        }
        queryRun()
        editform.resetFields()
        eref.current.onCancel();
      })
      
    }catch(errorInfo){}
    
  }

  const onDelete = () => {
    deletePriceSolution(projectId, solutionId).then(res=>{
      if(res.success){
        messageApi.open({
          type:'success',
          content: '定价方案删除成功!'
        })
      }else{
        messageApi.open({
          type:'error',
          content: res.errMsg
        })
      }
      queryRun()
      dref.current.onCancel();
    })
  }

 
  return (
    <Pagecount>
      {contextHolder}
      
      <Mainbox>
        <div className={style.card}>
          <div className={style.cardTitle}>{areaName}电价</div>
          <div className={style.cardContent}>
            <div className={style.contentLeft}>电价&nbsp;(元/度)</div>
            {elecPrice ? <div className={style.contentMiddle}>
              <div>
                <span>尖电价&nbsp;(元/度)</span>
                <span>峰电价&nbsp;(元/度)</span>
                <span>平电价&nbsp;(元/度)</span>
                <span>谷电价&nbsp;(元/度)</span>
              </div>
              <div>
                <span>{elecPrice.price1}</span>
                <span>{elecPrice.price2}</span>
                <span>{elecPrice.price3}</span>
                <span>{elecPrice.price4}</span>
              </div>
            </div> :<div className={style.contentMiddle}></div>}
            <Actions valueJson={elecPrice} title={'electric'}></Actions>
          </div>
        </div>
        <div className={style.card}>
          <div className={style.cardTitle}>{areaName}水价</div>
          <div className={style.cardContent}>
            <div className={style.contentLeft}>水价&nbsp;(元/m³)</div>
            {waterPrice ? <div className={style.contentMiddle}>
              <div>
                <span>水价&nbsp;</span>
              </div>
              <div>
                <span>{waterPrice.price}</span>
              </div>
            </div> : <div className={style.contentMiddle}></div>}
            <Actions valueJson={waterPrice} title={'water'}></Actions>
          </div>
        </div>
        <div className={style.card}>
          <div className={style.cardTitle}>{areaName}燃气价</div>
          <div className={style.cardContent}>
            <div className={style.contentLeft}>燃气价&nbsp;(元/m³)</div>
            {gasPrice ? <div className={style.contentMiddle}>
              <div>
                <span>燃气价&nbsp;</span>
              </div>
              <div>
                <span>{ gasPrice.price }</span>
              </div>
            </div> : <div className={style.contentMiddle}></div>}
            <Actions valueJson={gasPrice} title={'gas'}></Actions>
          </div>
        </div>
        <div className={style.card}>
          <div className={style.cardTitle}>{areaName}煤炭价</div>
          <div className={style.cardContent}>
            <div className={style.contentLeft}>煤炭价&nbsp;(元/吨)</div>
            {coalPrice ? <div className={style.contentMiddle}>
              <div>
                <span>煤炭价&nbsp;</span>
              </div>
              <div>
                <span>{ coalPrice.price }</span>
              </div>
            </div> : <div className={style.contentMiddle}></div>}
            <Actions valueJson={coalPrice} title={'coal'}></Actions>
          </div>
        </div>
        <div className={style.card}>
          <div className={style.cardTitle}>{areaName}燃油价</div>
          <div className={style.cardContent}>
            <div className={style.contentLeft}>燃油价&nbsp;(元/吨)</div>
            {fuelPrice ? <div className={style.contentMiddle}>
              <div>
                <span>燃油价&nbsp;</span>
              </div>
              <div>
                <span>{ fuelPrice.price }</span>
              </div>
            </div> : <div className={style.contentMiddle}></div>}
            <Actions valueJson={fuelPrice} title={'fuel'}></Actions>
          </div>
        </div>
      </Mainbox>
      <Custmodl title='新增价格' ref={aref}  mold="cust" width={592} onOk={onOk}>
        { changeTag == 'electric' ?<div className={style.formStyle} >
          <Form name='addform' labelCol={{span:6}} form={form} labelAlign={'left'} requiredMark={false} autoComplete='off' >
            <div style={{display:"flex", alignItems: "center", justifyContent:'space-around'}}>
            <div className={style.itemStyle}>
              <Item label='尖电价' rules={[{required:true, message:'尖电价不能为空！'}]}>
                <Space>
                  <Item name='price1' rules={[{required:true, message:'尖电价不能为空！'}]}>
                    <Input style={{width:'112px'}}></Input>
                  </Item>
                  <span style={{fontSize: 14, color:'#999'}}>(元/度)</span>
                </Space>
              </Item>
              <Item label='平电价' rules={[{required:true, message:'平电价不能为空！'}]}>
                <Space>
                  <Item name='price3' rules={[{required:true, message:'平电价不能为空！'}]}>
                    <Input style={{width:'112px'}}></Input>
                  </Item>
                  <span style={{fontSize: 14, color:'#999'}}>(元/度)</span>
                </Space>
              </Item>
            </div>
            <div className={style.itemStyle}>
              <Item label='峰电价' rules={[{required:true, message:'峰电价不能为空！'}]}>
                <Space>
                  <Item name='price2' rules={[{required:true, message:'峰电价不能为空！'}]}>
                    <Input style={{width:'112px'}}></Input>
                  </Item>
                  <span style={{fontSize: 14, color:'#999'}}>(元/度)</span>
                </Space>
              </Item>
              <Item label='谷电价' rules={[{required:true, message:'谷电价不能为空！'}]}>
                <Space>
                  <Item name='price4' rules={[{required:true, message:'谷电价不能为空！'}]}>
                    <Input style={{width:'112px'}}></Input>
                  </Item>
                  <span style={{fontSize: 14, color:'#999'}}>(元/度)</span>
                </Space>
              </Item>
            </div>
            </div>
          </Form>
        </div> : null }
        { changeTag == 'water' ? <div style={{display:"flex", alignItems: "center"}}>
          <Form name='addform' labelCol={{span:6}} form={form} labelAlign={'left'} requiredMark={false} autoComplete='off' >
            <Item label='水价' rules={[{required:true, message:'水价不能为空！'}]}>
              <Space>
                <Item name='price' rules={[{required:true, message:'水价不能为空！'}]}>
                  <Input style={{width:'112px'}}></Input>
                </Item>
                <span style={{fontSize: 14, color:'#999'}}>(元/m³)</span>
              </Space>
            </Item>
          </Form>
        </div> : null}

        { changeTag == 'gas' ? <div style={{display:"flex", alignItems: "center"}}>
          <Form name='addform' labelCol={{span:6}} form={form} labelAlign={'left'} requiredMark={false} autoComplete='off' >
            <Item label='燃气价' rules={[{required:true, message:'燃气价不能为空！'}]}>
              <Space>
                <Item name='price' rules={[{required:true, message:'燃气价不能为空！'}]}>
                  <Input style={{width:'112px'}}></Input>
                </Item>
                <span style={{fontSize: 14, color:'#999'}}>(元/m³)</span>
              </Space>
            </Item>
          </Form>
        </div> : null}

        { changeTag == 'coal' ? <div style={{display:"flex", alignItems: "center"}}>
          <Form name='addform' labelCol={{span:6}} form={form} labelAlign={'left'} requiredMark={false} autoComplete='off' >
            <Item label='煤炭价' rules={[{required:true, message:'煤炭价不能为空！'}]}>
              <Space>
                <Item name='price' rules={[{required:true, message:'煤炭价不能为空！'}]}>
                  <Input style={{width:'112px'}}></Input>
                </Item>
                <span style={{fontSize: 14, color:'#999'}}>(元/吨)</span>
              </Space>
            </Item>
          </Form>
        </div> : null}

        { changeTag == 'fuel' ? <div style={{display:"flex", alignItems: "center"}}>
          <Form name='addform' labelCol={{span:6}} form={form} labelAlign={'left'} requiredMark={false} autoComplete='off' >
            <Item label='燃油价' rules={[{required:true, message:'燃油价不能为空！'}]}>
              <Space>
                <Item name='price' rules={[{required:true, message:'燃油价不能为空！'}]}>
                  <Input style={{width:'112px'}}></Input>
                </Item>
                <span style={{fontSize: 14, color:'#999'}}>(元/吨)</span>
              </Space>
            </Item>
          </Form>
        </div> : null}
      </Custmodl>
      <Custmodl title='编辑价格' ref={eref}  mold="cust" width={592} onOk={onSaveEdit}>
        { changeTag == 'electric' ?<div className={style.formStyle} >
          <Form name='editform' ref={formRef} labelCol={{span:6}} form={editform} labelAlign={'left'} requiredMark={false} autoComplete='off' >
            <div style={{display:"flex", alignItems: "center", justifyContent:'space-around'}}>
            <div className={style.itemStyle}>
              <Item label='尖电价' rules={[{required:true, message:'尖电价不能为空！'}]}>
                <Space>
                  <Item name='price1' rules={[{required:true, message:'尖电价不能为空！'}]}>
                    <Input style={{width:'112px'}}></Input>
                  </Item>
                  <span style={{fontSize: 14, color:'#999'}}>(元/度)</span>
                </Space>
              </Item>
              <Item label='平电价' rules={[{required:true, message:'平电价不能为空！'}]}>
                <Space>
                  <Item name='price3' rules={[{required:true, message:'平电价不能为空！'}]}>
                    <Input style={{width:'112px'}}></Input>
                  </Item>
                  <span style={{fontSize: 14, color:'#999'}}>(元/度)</span>
                </Space>
              </Item>
            </div>
            <div className={style.itemStyle}>
              <Item label='峰电价' rules={[{required:true, message:'峰电价不能为空！'}]}>
                <Space>
                  <Item name='price2' rules={[{required:true, message:'峰电价不能为空！'}]}>
                    <Input style={{width:'112px'}}></Input>
                  </Item>
                  <span style={{fontSize: 14, color:'#999'}}>(元/度)</span>
                </Space>
              </Item>
              <Item label='谷电价' rules={[{required:true, message:'谷电价不能为空！'}]}>
                <Space>
                  <Item name='price4' rules={[{required:true, message:'谷电价不能为空！'}]}>
                    <Input style={{width:'112px'}}></Input>
                  </Item>
                  <span style={{fontSize: 14, color:'#999'}}>(元/度)</span>
                </Space>
              </Item>
            </div>
            </div>
          </Form>
        </div> : null }
        { changeTag == 'water' ? <div style={{display:"flex", alignItems: "center"}}>
          <Form name='editform' ref={formRef} labelCol={{span:6}} form={editform} labelAlign={'left'} requiredMark={false} autoComplete='off' >
            <Item label='水价' rules={[{required:true, message:'水价不能为空！'}]}>
              <Space>
                <Item name='price' rules={[{required:true, message:'水价不能为空！'}]}>
                  <Input style={{width:'112px'}}></Input>
                </Item>
                <span style={{fontSize: 14, color:'#999'}}>(元/m³)</span>
              </Space>
            </Item>
          </Form>
        </div> : null}

        { changeTag == 'gas' ? <div style={{display:"flex", alignItems: "center"}}>
          <Form name='editform' ref={formRef} labelCol={{span:6}} form={editform} labelAlign={'left'} requiredMark={false} autoComplete='off' >
            <Item label='燃气价' rules={[{required:true, message:'燃气价不能为空！'}]}>
              <Space>
                <Item name='price' rules={[{required:true, message:'燃气价不能为空！'}]}>
                  <Input style={{width:'112px'}}></Input>
                </Item>
                <span style={{fontSize: 14, color:'#999'}}>(元/m³)</span>
              </Space>
            </Item>
          </Form>
        </div> : null}

        { changeTag == 'coal' ? <div style={{display:"flex", alignItems: "center"}}>
          <Form name='editform' ref={formRef} labelCol={{span:6}} form={editform} labelAlign={'left'} requiredMark={false} autoComplete='off' >
            <Item label='煤炭价' rules={[{required:true, message:'煤炭价不能为空！'}]}>
              <Space>
                <Item name='price' rules={[{required:true, message:'煤炭价不能为空！'}]}>
                  <Input style={{width:'112px'}}></Input>
                </Item>
                <span style={{fontSize: 14, color:'#999'}}>(元/吨)</span>
              </Space>
            </Item>
          </Form>
        </div> : null}

        { changeTag == 'fuel' ? <div style={{display:"flex", alignItems: "center"}}>
          <Form name='editform' ref={formRef} labelCol={{span:6}} form={editform} labelAlign={'left'} requiredMark={false} autoComplete='off' >
            <Item label='燃油价' rules={[{required:true, message:'燃油价不能为空！'}]}>
              <Space>
                <Item name='price' rules={[{required:true, message:'燃油价不能为空！'}]}>
                  <Input style={{width:'112px'}}></Input>
                </Item>
                <span style={{fontSize: 14, color:'#999'}}>(元/吨)</span>
              </Space>
            </Item>
          </Form>
        </div> : null}
      </Custmodl>
      <Custmodl title='删除价格' ref={dref}  mold="cust" width={512} type="warn" onOk={()=>onDelete()}>        
          <span> 是否删除{ changeTag == 'electric'? '电价' : changeTag == 'water'? '水价' : changeTag == 'gas'? '燃气价' : changeTag == 'coal'? '煤炭价' : changeTag == 'fuel'? '燃油价' : '' }? </span>       
      </Custmodl>
    </Pagecount>
  )
}