import React, { useEffect, useRef } from "react";
import Titlelayout from "@com/titlelayout";
import { Space, Select, DatePicker, Form } from "antd";
import UseTable from "@com/useTable";
import { ExportExcel, CustButtonT } from "@com/useButton";
import styled from "styled-components";
import moment from "moment";
import {useRequest} from 'ahooks'
import {DistributionRoomRuntime} from '@api/api.js'
const Ctitle = styled.div`
  && {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .time {
      padding-right: 64px;
      color: #515151;
    }
  }
`;
 
const options = [
  { value: 1, label: "功率" },
  { value: 2, label: "电流" },
  { value: 3, label: "相电压" },
  { value: 4, label: "线电压" },
  { value: 5, label: "不平衡度" },
  { value: 6, label: "电压谐波" },
  { value: 7, label: "电流谐波" },
];
const colfn =(name, key) => ({
  title:  name,
  children: [
    {
      title: "最大值",
      children: [
        {
          title: "最大值",
          dataIndex: key+"Max",
          key: key+"Max",
          width: 90,
        },
        {
          title: "发生时间",
          dataIndex: key+"MaxTime",
          key: key+"MaxTime",
          width: 90,
        },
      ],
    },
    {
      title: "最小值",
      children: [
        {
          title: "最小值",
          dataIndex: key+"Min",
          key: key+"Min",
          width: 90,
        },
        {
          title: "发生时间",
          dataIndex: key+"MinTime",
          key: key+"MinTime",
          width: 90,
        },
      ],
    },
    {
      title: "平均值",
      dataIndex: key+"Avg",
      key: key+"Avg",
      width: 75,
      render(text) {
        <span>{text?.toFixd(2)}</span>
      }
    },
  ],
})
export default function Electric({lineIds, projectId}) {
  const tbref = useRef();
  const [form] = Form.useForm();
 

  const getData =async() => {
    try {
      if(!Number.isInteger(parseInt(projectId))&& !Array.isArray(lineIds)) return
      let values =await form.validateFields()
      values.Day = values.TimeType == 1 ? values.Day.format("YYYY-MM-DD") : values.Day.format('m')
      let body ={
        lineIds,
        projectId,
        ...values
      }
      let {success, data} =  await DistributionRoomRuntime.ExtremumReport(body)
      if(success && Array.isArray(data)) {
        return data
      }else {
        return []
      }

    } catch (error) {
       return Promise.reject(error)
    }
    
  }
  const {data, run, loading} = useRequest(getData, {
    refreshDeps: [projectId, lineIds]
  })
  
  let titles = []
  let columns = [ {
    title: "回路名称",
    dataIndex: "name",
    key: "name",
    width: 100,
    fixed: "left",
  }]
  
 data?.forEach(d => {
    let {items} = d;
     items?.forEach(i => {
        try {
          let name = Object.values(i)[0]
          let [key] = Object.keys(i)[0].split('_');
          if(!titles.includes(name)) {
              let coy = colfn(name, key+'_')
              columns.push(coy)
              titles.push(name)
          }
        } catch (error) {
          
        }
       
     })

  })

  console.log(columns)
  const tableData = data?.map(d => {
    let {name, items} =d
    let obj = {}
    items.forEach(i => {
      obj = {...obj,...i}
    }) 
    return {name, ...obj}
  })
  console.log(tableData)
  const CusTitle = (
    <Form
      form={form}
      layout="inline"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <Space>
        <Form.Item label="数据类别" name="type" initialValue={1}>
          <Select options={options} style={{ width: "200px" }} />
        </Form.Item>
        <Space size={8}>
          <Form.Item name="TimeType" initialValue={1}>
             <Select options={[{label: '日报', value: 1},{label: '月报', value: 2}]} style={{width: 96}} /> 
          </Form.Item>
        <Form.Item  noStyle shouldUpdate={(cur, per) => cur.TimeType !=per.TimeType } >
          {
             ({getFieldValue}) => {
               let key = getFieldValue('TimeType')
               let type = {
                1: 'date',
                2: 'month'
               }[key] ?? 'date'
               let info = {
                1: '点击选择日期（默认当日）',
                2: '点击选择日期（默认当月）'
               }[key]
               console.log(info)
               return <Form.Item name="Day" initialValue={moment()}>
               <DatePicker type={type} placeholder={info} style={{width: 220}}></DatePicker>
               </Form.Item>
             }
            }
        </Form.Item>
        <Form.Item noStyle>
        <CustButtonT text="search" src="search" onClick={getData} />
        </Form.Item>
        </Space>
      </Space>
     
      <ExportExcel single={true} tb={tbref} />
    </Form>
  );
  return (
    <Titlelayout
      title={CusTitle}
      layout="flex"
      bordered="none"
      pv="0"
      bodypad="16px 0 0 0"
      bl="none"
    >
      <UseTable
        columns={columns}
        dataSource={tableData}
        hbg="#ecf5ff"
        hbc="#515151"
        ref={tbref}
        sheetName="电力极值报表"
        scroll={{ y: 470, x: "calc(700px + 50%)" }}
      ></UseTable>
    </Titlelayout>
  );
}
