import React, { useState, useRef, useEffect, useMemo } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { Form, Radio, Button, Progress, Image, Space, DatePicker, Select, Tabs, Typography} from "antd";
import styled from "styled-components";
import UserSearch from "@com/useSerach";
import CustContext from "@com/content.js";
import { drawEcharts } from "@com/useEcharts";
import { EnergyArea} from "@api/api.js"
import Titlelayout from "@com/titlelayout";
 
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import moment from 'moment';
import imgurl from "./icon";
import UseTable from "@com/useTable"
import {numberformat } from "@com/usehandler"
 const {QueryEnergyAreaDay, QueryEnergyAreaMonth, QueryEnergyAreaYear} = EnergyArea
const {Text, Paragraph} = Typography
const Laybox = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: 1240px 424px;
  column-gap: 16px;
  .right {
    display: grid;
    grid-template-rows: 512px 272px;
    row-gap: 16px;
  }
 
 
 
`;
const CustTitle = styled.div`
  font-size: 14px;
  color: #515151;
  display: flex;
  justify-content: space-between;

`;

 
 
 


  

const Radiogroup = styled(Radio.Group)`
  && {
    .ant-radio-button-wrapper.ant-radio-button-wrapper-in-form-item {
      width: 96px;
      text-align: center;
      &:first-child {
        border-radius: 16px 0 0 16px;
      }
     &:last-child {
      border-radius: 0 16px 16px 0;
     }
    }
  }

`
const Sdiv = styled.div` 
  && {
    height: 100%;
    padding-top: 16px;
    display: grid;
    grid-template-rows: 1fr 1fr;
    row-gap: 16px;
    .down {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 16px;
    }
    .sort {
      background-color: #f4f8ff;
      padding: 8px 16px;
      display: grid;
      grid-template-columns: 40px 1fr;
      column-gap: 16px;
      align-items: center;
      .data {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
      }
    }
  }
`
 
 
const nf = new Intl.NumberFormat("en-US", {maximumFractionDigits: 2});
export default function Index() {   
  const projectId = useSelector(selectProjectId);
  const [tableData, setTableData] = useState([])
  const [form] = Form.useForm();
  const {Item} = Form
 
  const [timetype, setTimetype] = useState(1) // 日、月、年 1,2,3
 
  const [dataSet, setDataSet] = useState({
    dimensions: [],
    source: []
  })
  let length = dataSet.source?.length - 1
  const piedata = tableData.map(t => ({value: t.e, name: t.name}))
  const sort = tableData.sort((a, b) => parseFloat(a.e) -parseFloat(b.e) < 0).slice(0, 3)
  const barconfig = {
    type: "bar",
    stack: "count",
    seriesLayoutBy: 'row',
    
  //  barWidth: 30, 
  //  barCategoryGap: "5%"
  // barGap: "30%", 
  // barCategoryGap: "10%"
  }
  let series = Array.from({length}, () => barconfig)
  const picker= ['', 'date', 'month', 'year'][timetype];
   

  const columns = [
    {
      dataIndex: "name",
      title: "区域名称",
    },
    {
      dataIndex: "e",
      title: "用电量（kwh）",
    },
    {
        dataIndex: "mom",
        title: "环比",
        render: (text) =>  numberformat(text),
    },
    {
      dataIndex: "yoy",
      title: "同比",
      render: (text) =>  numberformat(text)
  }

  ]

  const getData = async () => {
    try {
    const {area, date, type, meterType} = form.getFieldsValue() || {}
    if(isNaN(type)) return;
    let hander = ['',QueryEnergyAreaDay, QueryEnergyAreaMonth, QueryEnergyAreaYear][type]
    let time
    if(type == 1) {
        time=date.format('YYYY-MM-DD')
    }else if(type == 2) {
        time = date.startOf("month").format('YYYY-MM-DD')
    }else if(type == 3) {
        time = date.startOf("year").format('YYYY-MM-DD')
    }
    const querys = {
        areaId: area,
        projectId,
        meterType,
        type,
        date: time
     }
    const params = [area]
    let {success, data} = await hander(querys, params)
    if(success && Array.isArray(data) && data.length > 0) {
           setTableData(data.map(d => d.total))
      let dimensions = data[0].detail.map(i => i.dot.toString())
      console.log(dimensions)
       let source =  data.map(item => {
           let {detail, total} = item
          
          let name = total.name
          let list = detail.map(i => i.e)
            
           
          return [name, ...list]
        })
       setDataSet({
        source: [ ["name", ...dimensions] , ...source]
       })
    }else {
        setDataSet({
          dimensions: [],
          source: []
        })
    }
    } catch (error) {
        console.log(error)    
    }
  }
 

 const [mode, setMode] = useState(1)
 const stack = useRef()
 const pieref = useRef()

useEffect(() => {
  drawEcharts(
     stack.current, {
      dataset: {
       ...dataSet, 
      },
      
      series: series,
      tooltip: {
       // formatter:  ' {a}'
      }
    }
  )
  drawEcharts(pieref.current, {
    pieData: { data: piedata, total: 100 },
    type: 3,
    legend: {
      type: "scroll",
    //  orient: 'vertical',
      bottom: 0,
      top: 'auto',
      itemGap: 5
    },
    grid: {
      bottom: 20
    }
  });
},[dataSet, mode] )

 const onChange = (e) => {
  setMode(e.target.value)
 }



 useEffect(() => {
   getData()
 }, [projectId]) 
 const Title =  (
      <CustTitle className="t">
        区域能耗趋势
        <Radiogroup options={[
          {
          label: "图表模式",
          value: 1
          },
          {
            label: "列表模式",
            value: 2
            }
        ]}
        optionType="button"
        buttonStyle="solid"
        onChange={onChange}
        value={mode}
        ></Radiogroup>
      </CustTitle>
    );
 
 


  const timechange = (e) => {
     setTimetype(e);
     getData()
  }
  const opchange = (e) => {   
     console.log(typeof e.target.value) 
     setOp(e.target.value)
    // form.resetFields()
     getData()
  }
  const CustView = () => {
   const viewstyle = {
      display: 'flex',
       justifyContent: "space-between",
       flex: 1,
       'marginLeft': '32px',
      'paddingLeft': '32px',
      'borderLeft': '1px dotted #d7d7d7',
    }
    return (
      <div style={viewstyle}>
       <Item  label="能源类型"   initialValue={1} name="meterType">
        <Select
        onChange={getData}   
        style={{width: "112px"}}
        options={[
          {
            label: '电力',
            value: 1,
          },
          {
            label: '用水',
            value: 2,
          }]}
         />
        </Item>
      <Space size={16}>
        <Item  name="type" initialValue={1}>
           <Select style={{width: '80px'}}   options={[
            {value: 1, label: '日'},
            {value: 2, label: '月'},
            {value: 3, label: '年'},
           ]}
           onChange={timechange}
           ></Select>
        </Item>

        <Item nostyle name="date"  initialValue={moment(new Date(), 'YYYY-MM-DD')}>
          <DatePicker placeholder="请选择日期" picker={picker} onChange={getData} style={{width: '160px'}} />
        </Item>       
      </Space>
      </div>
    )
  }
  
 


  return (
    <CustContext.Provider
      value={{
        form,
        custview: <CustView />,
        handler: getData,
       
      }}
    >

      <div style={{display: 'grid', gridTemplateRows: '48px 1fr', rowGap: '16px', flex: 1}}>
      <UserSearch></UserSearch>
      <Laybox  >
        <Titlelayout title={Title} key={nanoid()}>
           <div style={{paddingTop: "16px", height: "100%", display: "flex"}}>
             {
              mode == 1 ? <div style={{flex: 1}} ref={stack} key="echart"></div> : <UseTable dataSource={tableData} columns={columns} key="table" />
             }  
           
           </div>
        </Titlelayout>
        <div className="right">
           <Titlelayout title="今日能耗占比" key='pie'>
              <div ref={pieref} style={{width: "392px", height: "432px"}}></div>
           </Titlelayout>
           <Titlelayout title="区域能耗排名" key='sort'>
              <Sdiv>
              <div className="sort">
                    {sort[0] && <>
                    <Image style={{width: "40px"}} src={imgurl.a01} preview={false}></Image>
                     <div className="data">
                        <Text  ellipsis >{sort[0]?.name}</Text>
                        <div> <Text style={{fontSize: "16px"}} ellipsis>{nf.format(sort[0]?.e)}</Text>&nbsp;<span>kwh</span></div>
                     </div>
                     </>
                     }
                 </div>

                 <div className="down">
                    <div className="sort">
                      {
                   sort[1] &&  <> 
                   <Image style={{width: "40px"}} src={imgurl.a02} preview={false}></Image>
                     <div className="data">
                        <Text ellipsis>{sort[1]?.name}</Text>
                        <div><Text style={{fontSize: "16px"}} ellipsis>{nf.format(sort[1]?.e)}</Text>&nbsp;<span>kwh</span> </div>
                     </div>
                     </>
                    }
                    </div>
                    <div className="sort">
                      {
                        sort[2] &&
                    <> 
                    <Image style={{width: "40px"}} src={imgurl.a03} preview={false}></Image>
                     <div className="data">
                        <Text ellipsis>{sort[2]?.name}</Text>
                       <div> <Text style={{fontSize: "16px"}} ellipsis>{nf.format(sort[2]?.e)}</Text>&nbsp;<span>kwh</span> </div>
                     </div>
                     </>
                     }
                    </div>
                 </div>
              </Sdiv>
           </Titlelayout>
        </div>
     
      </Laybox>
      </div>
    </CustContext.Provider>
  );
}
