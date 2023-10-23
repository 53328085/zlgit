import React, { useState, useRef, useEffect, useMemo } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { Form, Radio, Button, Progress, Image, Space, DatePicker, Select, Tabs, Typography,Pagination, message} from "antd";
import styled from "styled-components";
import UserSearch from "@com/useSerach";
import CustContext from "@com/content.js";
import {useAntdTable} from 'ahooks'
import {QueryElectric} from "@api/api.js"
import Titlelayout from "@com/titlelayout";
import Citem from './item'
import {useSelector} from 'react-redux'
import {selectProjectId, selectOneLevelDefaultId} from '@redux/systemconfig.js'
 import moment from "moment";
 import {getTime } from "@com/usehandler"
import UseTable from "@com/useTable"
 
const Mainbox = styled.div`
display: grid;
 grid-template-rows: 48px 1fr;
  row-gap: 16px;
   flex: 1;
 
  
`
const Laybox = styled.div`
  display: grid;
  
  flex: 1;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dotted #d7d7d7;
  grid-template-rows: 1fr 24px;
  row-gap: 16px;
  .card {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(4, 394px);
    grid-template-rows: repeat(2, 316px);
    row-gap: 16px;
 //   gap: 16px;
    justify-content: space-between;
  }
 
 
 
`;
const CustTitle = styled.div`
  font-size: 14px;
  color: #515151;
  display: flex;
  justify-content: space-between;
  align-items: center;

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

 
 
 const headers = ["1#压缩机", "21#压缩机", "3#压缩机", "4#压缩机", "5#压缩机", "6#压缩机", "7#压缩机"]

// 总尖峰平谷对应E,E1,E2,E3,E4

 const datas = headers.map((n, index) => (
  {
    name: n,
    sns: [Math.random().toString().slice(2,12)].join(),
    address:   `成都市青江路145号银丽经济贸易区${index + 1}号楼${index+1}层`,
    type: index % 2,
    e: 100,
    e2: 20,
    e3: 40,
    e4: 40,
    mome: "100%",
    yoye: "100%",
    mome2: "100%",
    yoye2: "100%",
    mome3: "100%",
    yoye3: "80%",
    mome4: "-60%",
    yoye4: "70%",
  }
))
 
const nf = new Intl.NumberFormat("en-US", {maximumFractionDigits: 2});
export default function Index() {   
  const projectId = useSelector(selectProjectId);
  const areaId = useSelector(selectOneLevelDefaultId)
  const [tableData, setTableData] = useState([])
  const [form] = Form.useForm();
  const {Item} = Form
  const [value, setvalue] = useState("1");
   
  const [timetype, setTimetype] = useState(1) // 日、月、年 1， 2， 3
 
 
  const picker= ['', 'date', 'month', 'year'][timetype];

 // const {detail, total='', proportion, coalStandard, consume={}, analysisDes='', ...energyitem} = qverview;
  const [total, setTotal] = useState(0)
 
  const headsty =(bg) =>  ({
    background:bg,
    color: "#fff",
    textAlign: "center"
  })
  const columns = [
    {
      dataIndex: "name",
      title: "设备名称",
    },
    {
      dataIndex: "sns",
      title: "设备编号",
      render: (text) =>  <span>{text}</span>
    },
    {
        dataIndex: "address",
        title: "安装位置",
         
    },
    {
      dataIndex: "e",
      title: "总能耗(kWh)",
      onHeaderCell: () => ({style:  headsty("#000")})
    },
    {
      dataIndex: "e2",
      title: "峰(kWh)",
      onHeaderCell: () => ({style:  headsty("#f33")})
    },
    {
      dataIndex: "e3",
      title: "平(kWh)",
      onHeaderCell: () => ({style:  headsty("#f90")})
    },
    {
      dataIndex: "e4",
      title: "谷(kWh)",
      onHeaderCell: () => ({style:  headsty("#093")})
    }

  ]

 

  const getData =  (current=1, pageSize=14) => {
    let {area, date, type } = form.getFieldsValue() 
    const params = {
      type,
      projectId,
      date: getTime(date, type),
      areaId:area,
      pageNum: current,
      pageSize,
   }
  QueryElectric.query(params).then(res => {
     let {success, data, total} = res
     if (success && Array.isArray(data) && data.length >0) {
      setTotal(total)
      setTableData(data)
     
     } else {
      setTotal(0)
      setTableData([])
     }
   }).catch()
   
  }

 const [mode, setMode] = useState(1)



 const onChange = (e) => {
  setMode(e.target.value)
 }



 useEffect(() => {
  getData()
 }, [areaId]) 
 const Title =  (
      <CustTitle className="t">
        重点设备分时能耗
        <Radiogroup options={[
          {
          label: "卡片模式",
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
 

 const items = (<div className="card">
     {tableData.map(d => <Citem  {...d} key={nanoid()}/>)}
  </div>
 )
 const showTotal = (total) => `共${total}条记录`;
  return (
    <CustContext.Provider
      value={{
        form,
        custview: <CustView />,
       // tabs,
        handler: getData,
        value,
        setvalue,
      }}
    >

      <Mainbox>
      <UserSearch></UserSearch>
     
        <Titlelayout title={Title} layout="flex">
        <Laybox  >
            
             {
                 mode == 1 ? items : <UseTable  dataSource={tableData} columns={columns} key="table" />
             }  
           
             <Pagination showTotal={showTotal}  defaultPageSize={14} defaultCurrent={1} total={total} size="small" style={{marginLeft: "auto"}}></Pagination>
           </Laybox>
        </Titlelayout>
    
      </Mainbox>
    </CustContext.Provider>
  );
}
