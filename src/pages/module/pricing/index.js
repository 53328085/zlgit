import React, { useState } from 'react'
import { Tabs, Input, Button, Modal, Form, Select, DatePicker } from 'antd'
import style from './style.module.less'
import styled from 'styled-components'
import DashLine from '@imgs/dashed.png'
import Solution from './solution'
import WaterSolution from './watersolution'
import FireSolution from './firesolution'
import CoalSolution from './coalsolution'
import BlueColumn from '@com/bluecolumn'


const Tabsbox = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 0px;
   .ant-tabs-nav-list {
    .ant-tabs-tab {
        border-radius: 4px 4px 0 0;
        height: 36px;
        width: 144px;
        justify-content: center;
        font-size: 14px;
        background-color: #fff;
        border:1px solid #ccc;      
        &:hover {
            background-color: var(--ant-primary-color);
            color: #fff;
        }
    }
    .ant-tabs-tab-active {
        background-color: var(--ant-primary-color);
       
        .ant-tabs-tab-btn {
            color:#fff;
            transition: color 100ms;
        }
    }
   }  
 
}
`
const { Search } = Input
const { Item } = Form
const { Option } = Select
export default function Index() {
  const [addPlan, setAddPlan] = useState(false)
  const [key, setKey] = useState(1)

  const tabs = [{ label: "电", key: 1 }, { label: '水', key: 2 }, { label: "燃气", key: 3 }, { label: '煤炭', key: 4 }]
  const onChange = (v) => {
    setKey(v)
  }
  const TabsEl = () => {
    if (!tabs) return null
    return (
      <Tabsbox
        onChange={onChange}
        defaultActiveKey={key}
        animated
        tabBarGutter={16}
        type="card"
        items={tabs}
      >

      </Tabsbox>
    )
  }
  const solutionPropsList = [
    {
      name: '电价方案1',
      date: '2022-05-16',
      basePrice: '基准价',
      priceType: 'step',
      type: '阶梯费率'
    },
    {
      name: '电价方案2',
      date: '2022-05-17',
      basePrice: '复费率',
      priceType: 'even',
      type: '复费率'
    },
    {
      name: '电价方案3',
      date: '2022-05-18',
      basePrice: '基准价',
      priceType: 'odd',
      type: '单费率'
    },
  ]
  
  return (
    <div className={style.pricing}>
      <TabsEl></TabsEl>

      <div className={style.content}>
        <div className={style.searcHeader}>
          <div className={style.plan}>
            <span style={{ paddingRight: 16 }}>方案查询</span>
            <Search enterButton={<div style={{ width: 66 }}>查询</div>} style={{ width: 538 }} />
          </div>
          <Button type='primary' size='default' onClick={() => { setAddPlan(true); }}>新增方案</Button>
        </div>
        <img src={DashLine} style={{ margin: '0 auto', display: 'block' }}></img>
        <div className={style.lists}>
          {key === 1 ? solutionPropsList.map((item, index) => {
            return <Solution {...item} key={index}></Solution>
          }) : key === 2 ? <WaterSolution /> : key === 3 ? <FireSolution /> : <CoalSolution />}
        </div>
      </div>
      <AddModal addPlan={addPlan} setAddPlan={setAddPlan} />
    </div>
  )
}

const AddModal = ({ addPlan, setAddPlan }) => {
  const [form] = Form.useForm()
  const elecType = Form.useWatch('Electric', form)
  const labcol1 = {span:4, offset: 0};
  const labcol2 = {span:5,offset:0}
  console.log('elecType', elecType)
  const BasePeice = (<Item label="基准价(元/度)" name="BasePeice">
  <Input style={{ width: 112 }}></Input>
</Item>)
  return (
    <Modal
      centered
      destroyOnClose
      
      forceRender={true}
      closable={false}
      open={addPlan}
      title={<BlueColumn name="定价方案" />}
      onCancel={() => { setAddPlan(false); }}
      onOk={() => { console.log(form.getFieldValue()) }}
    >
      <Form
        labelCol={elecType!=='2'?labcol2:labcol1}
        labelAlign="left"
        size="middle"
        preserve={false}
        form={form}
        initialValues={{ Electric: '1' }}
        className={style.addPlanForm}
      >
        <Item label="方案名称" name="Plan">
          <Input ></Input>
        </Item>
        <Item label="电价类型" >
         <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
         <Item noStyle name="Electric">
          <Select style={{ width: 112 }} >
            <Option value="1">单费率</Option>
            <Option value="2">复费率</Option>
            <Option value="3">阶梯费率</Option>
            <Option value="4">混合费率</Option>
          </Select>
          </Item>
          {elecType==='2'?( <div style={{marginRight:105}}>复费率(元/度)</div>):null}
         </div>
          
        </Item>

        {
          elecType == '1' ?
          BasePeice
            : elecType == '2' ?
              <div className={style.elecPrice} >
                <div className={style.flexContainer}>
                  <Item  label="尖电价" labelCol={5} name="tip "><Input style={{width:112,marginLeft:22}}/></Item>
                  <Item  label="峰电价"  labelCol={5} name="peak"><Input style={{width:112,marginLeft:22}}/></Item>
                </div>
                <div className={style.flexContainer}>
                  <Item  label="平电价" labelCol={5} name="plain "><Input style={{width:112,marginLeft:22}}/></Item>
                  <Item  label="谷电价"  labelCol={5} name="valley"><Input style={{width:112,marginLeft:22}}/></Item>
                </div>
              </div>
            : elecType == '3'?(
              <>
              {BasePeice}
              <Item>
                <div style={{ display: 'flex', }}>
              <div style={{ width: 288 }}>
                  <div>阶梯值(kWh)</div>
                  <div>
                      <span style={{ paddingRight: 16 }}>第二档</span>
                      <Input style={{ width: 112, marginTop: 16 }} size="default"></Input>
                  </div>
                  <div>
                      <span style={{ paddingRight: 16 }}>第三档</span>
                      <Input style={{ width: 112, marginTop: 16 }} size="default"></Input>
                  </div>
              </div>
              <div style={{ width: 288 }}>
                  <div>阶梯价(元/度)</div>
                  <div>
                      <span style={{ paddingRight: 16 }}>第二档</span>
                      <Input style={{ width: 112, marginTop: 16 }} size="default"></Input>
                  </div>
                  <div>
                      <span style={{ paddingRight: 16 }}>第三档</span>
                      <Input style={{ width: 112, marginTop: 16 }} size="default"></Input>
                  </div>
              </div>
          </div>
              </Item>
              </>
              
              
              
            ) : []
        }

        <Item label="生效日期" name="Birth">
          <DatePicker style={{ width: 112 }} suffixIcon={null}></DatePicker>
        </Item>
      </Form>
    </Modal>
  )
}
