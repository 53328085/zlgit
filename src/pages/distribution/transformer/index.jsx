import React, { useState, useRef ,useMemo, useEffect } from 'react'
import { Select ,Form,Divider,DatePicker,Radio, Button } from 'antd'
import styled from 'styled-components'
import {useSelector,  } from 'react-redux'
import style from './style.module.less'
import TranCard from './transcard'
import UseTable from '@com/useTable'
import { columns,devicecolumns } from './columns'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import BlueColumn from '@com/bluecolumn'
import { drawEcharts } from "@com/useEcharts"
import SelectHeader from './selectHeader'

const MainDiv =styled.div`
background-color: #fff;
flex: 1;
padding: 16px;
display: flex;
flex-direction: column;
.trancss{
  display: flex;
  .ant-table-thead .ant-table-cell{
    padding: 3px;
  }
  .ant-table-tbody .ant-table-placeholder .ant-table-cell{
    padding: 3px
  }
  .ant-empty-normal{
    margin: 0;
  }
  .ant-empty{
    .ant-empty-image{
      height: 20px;
    }
    .ant-empty-description{
      font-size: 10px;
    }
    
  }
}
.datastyle{
  flex: 1;
  .filters{
    display: flex;
    justify-content: space-between;
    background-color: #f9f9f9;
    height: 63px;
    padding:0 12px;
    .title{
      display: flex;
      align-items: center;
    }
  }
  .filterdate{
    display: flex;
    align-items: center;
    width: 550px;
    justify-content: space-between;
  }
}
`
const chartOpt= {
  title: {
    // text: 'Stacked Line'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    top:'2%',
    icon:'roundRect',
    itemHeight:2,
    itemWidth:16,
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
  },
  grid: {
    left: '1%',
    right: '1%',
    bottom: '3%',
    top:'8%',
    containLabel: true
  },
  //保存图片
  toolbox: {
    // feature: {
    //   saveAsImage: {}
    // }
  },
  xAxis: {
    type: 'category',
    axisLine:{
      lineStyle:{
        color:"#D8D8D8",
      }
    },
    axisLabel:{
      color:"#333"
    },
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      lineStyle:{
        width:1
      },
      symbol:'circle',
      symbolSize: 6,
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      lineStyle:{
        width:1
      },
      symbol:'circle',
      symbolSize: 6,
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      lineStyle:{
        width:1
      },
      symbol:'circle',
      symbolSize: 6,
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      lineStyle:{
        width:1
      },
      symbol:'circle',
      symbolSize: 6,
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      lineStyle:{
        width:1
      },
      symbol:'circle',
      symbolSize: 6,
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
};
export default function Index() {
  const [form] = Form.useForm() 
  const chartRef =useRef()
  const oneLevel = useSelector(state => state.system.onelevel)
  const areaOptions =oneLevel.length>0? useMemo(() => ([{ name: oneLevel[0].levelName+'(全部)', id: 0 }, ...oneLevel]), [oneLevel]):[]
  const [pattern,setPattern]=useState(1)
  const [tabs,setTabs] =useState([
    {key: '0',label: '1#变压器'},
    {key: '1',label: '2#变压器'},
    {key: '2',label: '3#变压器'},
  ])
  const [value, setvalue] =useState()
  const dataprop={
    tabs,
    setTabs,
    value,
    setvalue
  }
  const changeArea =()=>{}
  const changeRadio=(e)=>{
    setPattern(e.target.value)
  }

  useEffect(()=>{
    drawEcharts(chartRef.current,{...chartOpt,type:2})
  },[pattern])

  return (
    <>
    <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '8px 16px', marginBottom: 16, border: '1px solid #d7d7d7', borderRadius: 4 }}>
          <Form
            form={form}
            colon={false}
            layout="inline"
          >
            <Form.Item label={oneLevel[0]?.levelName} name="area" style={{ marginBottom: 0 }}>
              <Select style={{ width: 200 }} options={areaOptions} fieldNames={{ label: 'name', value: 'id' }} onChange={changeArea} defaultValue={oneLevel.length>0?0:null}></Select>
            </Form.Item>
            <Form.Item>
            <Divider dashed type="vertical" style={{borderColor: "#999",height:'30px'}}></Divider>
            </Form.Item>
           <Form.Item>
              <Select style={{ width: 240 }}></Select>
           </Form.Item>
          </Form>
        </div>  
    <CustContext.Provider value={dataprop}>
       <Pagecount bgcolor="#eeeff3" pd="0px" > 
       <MainDiv>
        <div className='trancss'>
        <TranCard  />
        <UseTable columns={columns} bordered className={style.transformerTable} ></UseTable>
        </div>
        <Divider dashed style={{borderColor:"#e4e4e4"}}></Divider>
        <div className="datastyle">
          <div className="filters">
            <div className='title'>
            <BlueColumn  name="数据趋势" styled={{fontSize: '16px'}}></BlueColumn>
            {
                pattern===1?<Select style={{width:180,marginLeft:32}}></Select>:null
            }
            </div>
            <div className='filterdate'>
              <Select style={{width:80}}></Select>
              <DatePicker style={{width:160}}></DatePicker> 
              <Button>数据导出</Button>
                  <Radio.Group defaultValue={pattern}   buttonStyle="solid" onChange={changeRadio}>
                    <Radio.Button value={1}>趋势模式</Radio.Button>
                    <Radio.Button value={2}>列表模式</Radio.Button>
                  </Radio.Group>
            </div>
          </div>
          {
            pattern===1?(<div ref={chartRef} style={{height:'calc(100% - 63px)'}}></div>):( <UseTable columns={devicecolumns} bordered  ></UseTable>)
          }
        </div>
       </MainDiv>
    {/* <div className={style.transform}>
      <div className={style.transformheader}>
        <span className={style.areachoose}>区域选择</span>
        <Select defaultValue="" style={{ width: 330 }} size="default">
          <Option value="1">Jack</Option>
          <Option value="2">Lucy</Option>
        </Select>

        <span className={style.areachoose}>配电房</span>
        <Select defaultValue="" style={{ width: 330 }} size="default">
          <Option value="1">Jack</Option>
          <Option value="2">Lucy</Option>
        </Select>
      </div>
      <div className={style.transformContent} >
        <div className={style.transformList}>
          {
            list.map((item, index) => <TranCard message={item} key={index} {...TranCardProps} index={index} />)
          }
        </div>
        <div className={style.chatrts}>
          <div className={style.table}>
            <UseTable columns={columns} bordered className={style.transformerTable}></UseTable>
          </div>
          <div className={style.chartArea}>
            <SelectHeader type={type}/>
            <SelectHeader type={[{name:'变压器温度',value:0}]}/>
          </div>
        </div>


      </div>
    </div> */}
    </Pagecount>
    </CustContext.Provider>
    </>
    
  )
}