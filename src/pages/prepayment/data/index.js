import React, {useState, useEffect, useRef} from 'react'
import {useSelector} from 'react-redux'
import {useAntdTable, usePagination} from 'ahooks'
import {Form, Select, Space, DatePicker, Input, Button} from 'antd'
import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import UserCard from '@com/useCard'
import {Meter} from '@api/api.js'
import {selectCurProject} from '@redux/user.js'
import CustContext from '@com/content.js'
import styled from 'styled-components'
import { drawEcharts } from "@com/useEcharts"
const Maibox = styled.div`
  display: grid;
  grid-template-rows: 121px 540px;
  row-gap: 32px;
  .serach {
    border-bottom: 1px dotted #dedede;
    display: grid;
    grid-template-rows: 36px 36px;
    row-gap: 16px;
    padding-bottom: 32px;
  }
  .chart {
    display: grid;
    grid-template-columns: 1076px 518px;
    column-gap: 16px;
   
    .draw {
     display: grid;
     grid-template-rows: 36px 488px;
     row-gap: 16px;
    } 
  }
`
export default function Index() {
  const [form] = Form.useForm()
  const [pageform] = Form.useForm()
  const {Item} = Form
  const {Option} = Select
  const [formparams, setFormparams] = useState(form.getFieldValue())
  const [value, setvalue] = useState('electric')
  const projectId = useSelector(selectCurProject)?.id 
  const stref = useRef(null)
  const pref = useRef(null)
  const meterType = {
    electric: 1,
    water: 2,
    gas: 3
  }
  const datasetMonth = {
    dimensions: ["time", "能耗费", "物业费"],
    source: [
      { time: "2022-01", "能耗费": 5600, "物业费": 9600 },
      { time: "2022-02", "能耗费": 4600, "物业费": 3644 },
      { time: "2022-03", "能耗费": 3600, "物业费": 4644 },
      { time: "2022-04", "能耗费": 5611, "物业费": 9655 },
      { time: "2022-05", "能耗费": 5644, "物业费": 3677 },
      { time: "2022-06", "能耗费": 4677, "物业费": 3633 },
      { time: "2022-07", "能耗费": 3688, "物业费": 4655 },
      { time: "2022-08", "能耗费": 5088, "物业费": 2644 },
      { time: "2022-09", "能耗费": 6677, "物业费": 2641 },
      { time: "2022-10", "能耗费": 5866, "物业费": 5641 },
      { time: "2022-11", "能耗费": 4677, "物业费": 7645 },
      { time: "2022-12", "能耗费": 1877, "物业费": 2645 },
    ],
  };
  const pieData = [
    { value: 65, name: "能耗费" },
    { value: 35, name: "物业费" },
 
  ];
  const tabs = [
    {label: '营收汇总', key: '1'},
    {label: '能耗汇总', key: '2'},
    {label: '物业费汇总', key: '3'},
    {label: '公共能耗分析', key: '4'},
    {label: '客户对账明细', key: '5'},
    {label: '客户能耗分析', key: '6'},
    {label: '客户物业费分析', key: '7'},
  ]
  
  let params = {
    projectId: projectId,
    meterType: meterType[value],
    lineStatus: 0,
    bindStatus: 0,   
  }

  const getCardData = ({current, pageSize}) => {  
    params = Object.assign({}, params, {pageNum: current, pageSize}, formparams)
    return  Meter.Overview(params).then(res => {
      let {success, data, totalNum} = res
      if (success && Array.isArray(data?.data)) {
        return {
          total: totalNum,
          list: data.data
        }
      
      }else {
        return {
          total: 0,
          list: []
        }
      }
    })
  }

   const {data, pagination} = usePagination(getCardData, {
    refreshDeps: [projectId, value, formparams],
    defaultPageSize: 12,

   })
  const propsData ={
    tabs,
    value,
    setvalue,
    form,    
  }
  const initialValues = {
    RegionId: '',
    BuildingId: '',
    FloorId: '',
    time: 'month',
    timeDate: ''
  }

  const submit = (e) => {
    console.log(e)
  }
  const [picker, setPicker] = useState('day')
  const changeTime = (v) => {
    setPicker(v)
  }
  useEffect(() => {
    drawEcharts(stref.current, {
    dataZoom: [{
      height:15,
      bottom: 0
    }],
    dataset: datasetMonth,
    series: [{ type: "bar",  stack: 'total', barWidth:40}, { type: "bar",  stack: 'total', barWidth:40}],
    grid: {
      top: '10px',
      bottom: "50px",
      right: '0px',
      left: '0px',
      containLabel: true,
    },
    legend: {   
      top: 'auto',
      bottom: 25
    },
   
  
  })
  drawEcharts(pref.current,  {pieData: {data: pieData, total: 100}, type: 3, legend: {
    top: 'auto',
    bottom: 0,
   
 }}) 

  })
  return (
    <CustContext.Provider value={propsData}>
    <Pagecount pd="32px 32px 16px 32px">   
        <Maibox>
       
            <Form layout="inline" className='serach'  form={pageform} initialValues={{initialValues}}  >
          
           <Space size={32}>
            <Item label="统计区域">
              <Space size={16}>
               <Item noStyle name='RegionId'>
                  <Select style={{ width: "160px" }} onChange={submit} allowClear placeholder="区域选择">
                    <Option value={1}>正泰园区</Option>
                  </Select>
              </Item>
              <Item noStyle name='BuildingId'>
                <Select   placeholder="建筑选择" style={{ width: "160px" }}>
                  <Option value={2}>1号楼</Option>
                </Select>
              </Item>
              <Item noStyle  name='FloorId' placeholder="楼层选择">
                <Select onChange={submit} allowClear style={{ width: "160px" }}>
                  <Option value={3}>7楼</Option>
                </Select>
              </Item>
              </Space>
            </Item>
               <Item label="统计周期">
                       <Space size={16}>
                       <Item noStyle name='time'>
                          <Select style={{ width: "124px" }} onChange={changeTime} allowClear placeholder="时间类型">
                            <Option value={'day'}>日</Option>
                            <Option value={'month'}>月</Option>
                            <Option value={'year'}>年</Option>
                          </Select>
                       </Item>
                       <Item noStyle>
                          <DatePicker name='timeData' onChange={submit} picker={picker} style={{ width: "124px" }} /> 
                       </Item>
                       </Space>
               </Item>
            </Space>
          
           
            <Space size={16}>
              <Item label="营收总额">
                  <Input style={{width: '160px'}}></Input>
              </Item>
              <Item label="能耗费累计">
                  <Input style={{width: '160px'}}></Input>
              </Item>
              <Item label="物业费累计">
                  <Input style={{width: '160px'}}></Input>
              </Item>
              <Item label="累计充值">
                  <Input style={{width: '160px'}}></Input>
              </Item>
              <Item label="累计退费">
                  <Input style={{width: '160px'}}></Input>
              </Item>
              <Item label="累计欠费">
                  <Input style={{width: '160px'}}></Input>
              </Item>
            </Space>
            
            </Form>
             <div className='chart'>
                <div className='draw'>
                   <div>
                    <Space size={16}>
                      <Button type="primary">营收情况</Button>
                      <Button  >充值退费</Button>
                    </Space>
                   </div>
                   <div ref={stref}></div>
                </div>
                 <div className="draw">
                        <div>
                          营收类别
                        </div>
                        <div ref={pref}></div>
                 </div> 
             </div>
        </Maibox>
      
    </Pagecount>
    </CustContext.Provider>
  )
}
