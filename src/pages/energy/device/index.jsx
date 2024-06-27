import React, { useState, useRef, useEffect, useCallback } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { Form, Radio,   Space, DatePicker, Select, Pagination, } from "antd";
import styled from "styled-components";
import UserSearch from "@com/useSerach";
import CustContext from "@com/content.js";
import {useAntdTable} from 'ahooks'
import {QueryElectric, DesElectric} from "@api/api.js"
import Titlelayout from "@com/titlelayout";
import Citem from './item'
import {useSelector} from 'react-redux'
import {selectProjectId, selectOneLevelDefaultId} from '@redux/systemconfig.js'
 import moment from "moment";
 import {getTime } from "@com/usehandler"
import UseTable from "@com/useTable"
import {  ExportExcel} from '@com/useButton'
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

// 总尖峰平谷对应E,E1,E2,E3,E4

 
 
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
 
 const [params, setParams] = useState({
 projectId,
 pageNum: 1,
 pageSize: 12,
 areaId,
 type: 1,
 date: getTime(moment(), 1)
  }) 

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
      title: "总有功功率(kWh)",
      onHeaderCell: () => ({style:  headsty("#000")})
    },
    {
      dataIndex: "e2",
      title: "A相电流(kWh)",
      onHeaderCell: () => ({style:  headsty("#f33")})
    },
    {
      dataIndex: "e3",
      title: "B相电流(kWh)",
      onHeaderCell: () => ({style:  headsty("#f90")})
    },
    {
      dataIndex: "e4",
      title: "C相电流(kWh)",
      onHeaderCell: () => ({style:  headsty("#093")})
    }

  ]

 let imageKey = useRef([])


  const getData = async  () => {
 /*    let {area, date, type } = form.getFieldsValue() 
    const params = {
      type,
      projectId,
      date: getTime(date, type),
      areaId:area,
      pageNum: current,
      pageSize,
   } */

   try {
    let {success, data, total} =await QueryElectric.query({...params})
    if (success && Array.isArray(data) && data.length >0) {
    
      let  imageKeys = data.map(d => d.imageKey)
      let promises = imageKeys.map(key => DesElectric.QueryImage(key))
      let result = await Promise.allSettled(promises)
      result.forEach(r => {
        if(r.status == 'fulfilled' && r.value?.success) {
          let {data:imagedata} = r.value
         
          data.forEach(d => {
             if(d.imageKey ==imagedata.imageKey ) {
                
                 d.image=imagedata.image;
             }
          })
        }
      })
      setTotal(total)
      setTableData(data)     
     } else {
      setTotal(0)
      setTableData([])
     }

   } catch (error) {
    
   }
 
   
  }

 const [mode, setMode] = useState(1)



 const onChange = (e) => {
  setMode(e.target.value)
 }



 useEffect(() => {
  getData()
 }, [params, areaId]) 
 const tbref = useRef();
 const onExport = useCallback(() => {
 
    return QueryElectric.query({
      ...params,
      pageNum: 1,
      pageSize: total,
    }).then(res => {
      let { success, data, total } = res;
      if (success) {
        return {
          list: Array.isArray(data) ? data : [],
          total,
        };
      } else {
        message.error(res.errMsg);
        return {
          list: [],
          total: 0,
        };
      }

    }).catch()
 }, [total])
 const Title =  (
      <CustTitle className="t">
        重点设备分时能耗
        <Space size={32}>
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
        { mode == 2 && <ExportExcel tb={tbref} />}
         </Space>
      </CustTitle>
    );
 
 const dateChange = (e) => {
   let date = getTime(e, timetype)
    setParams({...params, date})
 }


  const timechange = (e) => {
     setTimetype(e);
     let date = getTime(moment(), e)
     
     setParams({...params, type: e, date})
  }
 const pagechange =(page, pageSize) => {
     setParams({...params, pageNum: page, pageSize})
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
          <DatePicker placeholder="请选择日期" picker={picker} onChange={dateChange} style={{width: '160px'}} />
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
     handler:  (e) => {
       setParams({...params,areaId: e})
     },
        value,
        setvalue,
      }}
    >

      <Mainbox>
      <UserSearch></UserSearch>
     
        <Titlelayout title={Title} layout="flex">
        <Laybox  >
            
             {
                 mode == 1 ? items : <UseTable  dataSource={tableData} columns={columns} key={nanoid()} ref={tbref} sheetName="重点设备" onExport={onExport} />
             }  
           
             <Pagination showTotal={showTotal}  defaultPageSize={12} defaultCurrent={1} total={total} size="small" style={{marginLeft: "auto"}} onChange={pagechange}></Pagination>
           </Laybox>
        </Titlelayout>
    
      </Mainbox>
    </CustContext.Provider>
  );
}
