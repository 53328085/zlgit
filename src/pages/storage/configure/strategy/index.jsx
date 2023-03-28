import React, { useState, useRef } from 'react'
import UseHeader from '@com/useHeader'
import CustModal from '@com/useModal'
import { Divider, message, Form, Space, Input } from 'antd'
import style from './style.module.less'
import { StorageStrategyDesigner } from '@api/api.js'
import { CaretRightOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

export default function Index() {
  const addRef = useRef()
  const [addForm] = Form.useForm()
  const Item = Form.Item
  const { QueryStrategy, AddStrategy } = StorageStrategyDesigner
  const [headerData, setHeaderData] = useState({})
  const [strategyList, setStrategyList] =useState([])
  const [activeTab, setActiveTab] = useState(0)
  const getStrategy = (projectId, areaId) => {
    QueryStrategy(projectId, areaId).then(res => {
      let { success, data, errMsg } = res
      if(success){
        if(data){
          setStrategyList(data)
          setActiveTab(data[0].id)
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
            <div className={style.changeTab}>

            </div>
          </div>
          <div className={style.right}>
            <div className={style.itemTitle}>充放策略详细设置</div>
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
