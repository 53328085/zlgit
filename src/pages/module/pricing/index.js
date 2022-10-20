import React, { useEffect, useState } from 'react'
import { Tabs, Input, Button, Modal, Form, Select, DatePicker,Pagination,message  } from 'antd'
import style from './style.module.less'
import styled from 'styled-components'
import DashLine from '@imgs/dashed.png'
import Solution from './solution'
import WaterSolution from './watersolution'
import FireSolution from './firesolution'
import CoalSolution from './coalsolution'
import BlueColumn from '@com/bluecolumn'
import { usePagination } from 'ahooks';
import { PriceSolution } from '@api/api.js'

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
  const [solutionPropsList,setSolutionPropsList] = useState([])
  const [searchPlan,setSearchPlan] = useState('') 
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
  const getPriceSolution = async (name='')=>{
      const res = await PriceSolution.GetEnablePriceSolution(name,1)
      if(res.success){
        setSolutionPropsList(res.data.elerticPriceSolution)
      }else{
        message.error(res.errMsg)
      }
  }
  const changePlanInp = (e)=>{setSearchPlan(e.target.value)}
  useEffect(()=>{
    getPriceSolution()
  },[])
  return (
    <div className={style.pricing}>
      <TabsEl></TabsEl>

      <div className={style.content}>
        <div className={style.searcHeader}>
          <div className={style.plan}>
            <span style={{ paddingRight: 16 }}>方案查询</span>
            <Search 
            enterButton={<div style={{ width: 66 }}>查询</div>} 
            style={{ width: 538 }} 
            value={searchPlan} 
            onChange={changePlanInp} 
            onSearch={()=>{getPriceSolution(searchPlan)}}/>
          </div>
          <Button type='primary' size='default' onClick={() => { setAddPlan(true); }}>新增方案</Button>
        </div>
        <img src={DashLine} style={{ margin: '0 auto', display: 'block' }}></img>
        <div className={style.lists}>
          {key === 1 ? solutionPropsList.map((item, index) => {
            return <Solution {...item} key={index} getPriceSolution={getPriceSolution}></Solution>
          }) : key === 2 ? <WaterSolution /> : key === 3 ? <FireSolution /> : <CoalSolution />}
        </div>
      </div>
      <AddModal addPlan={addPlan} setAddPlan={setAddPlan} />
    </div>
  )
}

const AddModal = ({ addPlan, setAddPlan }) => {
  const [form] = Form.useForm()
  const elecType = Form.useWatch('Electric', form)//电价类型
  const labcol1 = {span:4, offset: 0};
  const labcol2 = {span:5,offset:0}
  const inpStyle1 = {
    width: 112, 
    marginTop: 16,
    marginLeft: 60,
 }
 const inpStyle2 = {
  width:112,
  marginLeft:39
 }
 const itemStyle = {
  paddingBottom:16,
  borderBottom:'1px dashed #d7d7d7'
 }
 const BasePeice = (
  <Item label={<strong>基准价(元/度)</strong>} name="BasePeice" style={elecType!=='1'?itemStyle:{}}>
  <Input style={{ width: 112 }}></Input>
  </Item>)

  return (
    <Modal
      centered
      destroyOnClose
      width={elecType==='4'?1114:614}
      forceRender={true}
      closable={false}
      open={addPlan}
      title={<BlueColumn name="定价方案" />}
      onCancel={() => { setAddPlan(false); form.resetFields()}}
      cancelButtonProps={{ style: { width: 96, height: 36, fontSize: 14 } }}
      onOk={() => { console.log(form.getFieldValue()) }}
      okButtonProps={{ style: { width: 96, height: 36, fontSize: 14 } }}
    >
      <div style={elecType==='4'?{display:'flex',borderBottom: '1px dashed #d7d7d7'}:{}}>
      <Form
        labelCol={elecType!=='2'?labcol2:labcol1}
        labelAlign="left"
        size="middle"
        preserve={true}
        form={form}
        initialValues={{ Electric: '1' }}
        className={style.addPlanForm}
      >
        <Item label={<strong>方案名称</strong>} name="Plan" style={itemStyle}>
          <Input ></Input>
        </Item>
        <Item label={<strong>电价类型</strong>} >
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
            <Item style={{borderBottom:'1px dashed #d7d7d7'}}>
              <div className={style.elecPrice} >
                <div className={style.flexContainer}>
                  <Item  label="尖电价" labelCol={5} name="tip "><Input style={inpStyle2}/></Item>
                  <Item  label="峰电价"  labelCol={5} name="peak"><Input style={{width:112,marginLeft:22}}/></Item>
                </div>
                <div className={style.flexContainer}>
                  <Item  label="平电价" labelCol={5} name="plain "><Input style={inpStyle2}/></Item>
                  <Item  label="谷电价"  labelCol={5} name="valley"><Input style={{width:112,marginLeft:22}}/></Item>
                </div>
              </div>
            </Item>
              
            : elecType == '3'?(
              <>
              {BasePeice}
              <Item style={itemStyle}>
                <div style={{ display: 'flex', }}>
              <div style={{ width: 288 }}>
                  <strong>阶梯值(kWh)</strong>
                  <div>
                      <span style={{ paddingRight: 16 }}>第二档</span>
                      <Input style={inpStyle1} size="default"></Input>
                  </div>
                  <div>
                      <span style={{ paddingRight: 16 }}>第三档</span>
                      <Input style={inpStyle1} size="default"></Input>
                  </div>
              </div>
              <div style={{ width: 288 }}>
                  <strong>阶梯价(元/度)</strong>
                  <div>
                      <span style={{ paddingRight: 16 }}>第二档</span>
                      <Input style={{width:112,marginTop: 16,}} size="default"></Input>
                  </div>
                  <div>
                      <span style={{ paddingRight: 16 }}>第三档</span>
                      <Input style={{width:112,marginTop: 16,}} size="default"></Input>
                  </div>
              </div>
          </div>
              </Item>
              </>  
            ) : (
              <>
              {BasePeice}
              <Item style={{  borderBottom: '1px dashed #d7d7d7', paddingBottom: 16 }}>
                        <div style={{ display: 'flex', }}>
                            <div style={{ width: 288 }}>
                                <div>复费率(元/度)</div>
                                <div>
                                    <span style={{ paddingRight: 16 }}>尖电价</span>
                                    <Input style={inpStyle1} size="default"></Input>
                                </div>
                                <div>
                                    <span style={{ paddingRight: 16 }}>平电价</span>
                                    <Input style={inpStyle1} size="default"></Input>
                                </div>
                            </div>
                            <div style={{ width: 288 }}>
                                <div style={{height:22}}></div>
                                <div>
                                    <span style={{ paddingRight: 16 }}>峰电价</span>
                                    <Input style={{ width: 112, marginTop: 16 }} size="default"></Input>
                                </div>
                                <div>
                                    <span style={{ paddingRight: 16 }}>谷电价</span>
                                    <Input style={{ width: 112, marginTop: 16 }} size="default"></Input>
                                </div>
                            </div>
                        </div>

                    </Item>
                    <Item style={{ display: 'flex',...itemStyle }}>
                        <div style={{ display: 'flex', }}>
                            <div style={{ width: 288 }}>
                                <div>阶梯值(kWh)</div>
                                <div>
                                    <span style={{ paddingRight: 16 }}>第二档</span>
                                    <Input style={inpStyle1} size="default"></Input>
                                </div>
                                <div>
                                    <span style={{ paddingRight: 16 }}>第三档</span>
                                    <Input style={inpStyle1} size="default"></Input>
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
            )
        }

        <Item label={<strong>生效日期</strong>} name="Birth" style={elecType!=='4'?itemStyle:{}}>
          <DatePicker style={{ width: 112 }} suffixIcon={null}></DatePicker>
        </Item>
      </Form>
      {
        elecType==='4'?(<div style={{marginLeft:64,backgroundColor:'#f2f2f2',borderRadius:4,padding:16,width:472,marginBottom: 16}}>
        <strong style={{fontSize:16}}>计算公式：</strong>
        <p style={{marginTop:16}}>总电量＝峰时段电量+平时段电量+谷时段电量</p>
        <p style={{marginTop:16}}>总电费＝分时电费＋第二档增量电费＋第三档增量电费</p>
        <p style={{marginTop:16}}>分时电费＝峰时段电量×峰时段电价+平时段电量×平时段电价+谷时段电量×谷时段电价</p>
        <p style={{marginTop:16}}>第二档增量电费＝第二档用电量×第二档加价标准</p>
        <p style={{marginTop:16}}>第三档增量电费＝第三档用电量×第三档加价标准</p>
        <p style={{marginTop:16}}>"电费先分时后阶梯”即先按照峰谷各时段用电量和分时电价标准计算全部电量的电费，再按照第二档、第三档递增电价标准，分别计算第二档、第三档电量的递增电费，三部分电费之和即为该居民用户的总电费。</p>
        <p style={{marginTop:16}}> 阶梯式电价是阶梯式递增电价或阶梯式累进电价的简称，也称为阶梯电价，是指把户均用电量设置为若干个阶梯分段或分档次定价计算费用。</p>
       
    </div>):null
      }
      </div>
    
      
    </Modal>
  )
}
