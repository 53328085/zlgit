import React, {useEffect, useState} from 'react'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import {Form,  Space, DatePicker, Tooltip} from 'antd'
import Usetable from "@com/useTable"
import Titlelayout from "@com/titlelayout"
import {DataSlice, useEmissionUnitQuery} from "./dataslice"
import {CustButtonT} from "@com/useButton"
import {Cdivider} from "@com/comstyled"
const Mainbox = styled.div`
  margin-top: 16px;
    padding-top: 16px;
    border-top: 1px dotted #d7d7d7;
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex:1;
`
const columns = [
  {
      title: '排放单元',
      dataIndex: 'unit',
      key: 'unit',
      align: 'center',
      width: 180
  },
  {
    title: '能源消耗量',
    dataIndex: 'consumption',
    key: 'consumption',
    align: 'center',
    width: 180
 },
 ...Array.from({length: 31}, ( index,i) => ({
    title: i+1,
    dataIndex: i+1,
    key: i+1,
    width: 80,
    align: 'center'

 })),
 {
  title: "月总计",
  dataIndex: 'total',
    key: 'total',
    align: 'center',
    width: 80
 }
]
export default function Index() { 
  const [form] = Form.useForm()

  let unitDatas
  const {data:unidata, isSuccess, refetch  } =useEmissionUnitQuery({year: 2024, month: 3, enterpriseId: 1})

  if(isSuccess) {
    console.dir(unidata)
    unitDatas = unidata?.data
  }

  const [downloadTemp] = DataSlice.useLazyDownloadTempQuery()

  const onDownload =async () => {
    refetch();
    let res = await    downloadTemp({year: 2024, month: 4, enterpriseId: 1})  
    let blob = new Blob([res], {
      type: "application/x-msdownload",
    }); //你需要的类型 转化为blob对象
    console.log(blob, 1353);
    let url = window.URL.createObjectURL(blob); //将对象转化为链接
    let a = document.createElement("a");
    // 下载链接
    a.href = url;
    a.download = "集体户模板.xlsx";
    document.body.appendChild(a);
    // 点击a标签，进行下载
    a.click();
    // 移除元素
    document.body.removeChild(a);
  }
  const CTitle = (
    <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
        <span>手动数据录入</span>
        <Space><Tooltip title="下载模板"><CustButtonT text="download" onClick={onDownload} /></Tooltip><CustButtonT text="import" src='import' /> <CustButtonT text="save" src='save' /></Space>
    </div>
  )
 
  return (
    <Pagecount bgcolor="transparent" pd="0">
     
    
          <Titlelayout title={CTitle} layout="flex">
            <Mainbox>
               <Form form={form} layout="inline" colon={false} labelCol={{flex: '2.5em'}}>
                  <Form.Item name="year" label="年度">
                     <DatePicker   picker="year" />
                  </Form.Item>
                  <Form.Item name="month" label="月份">
                    <DatePicker   picker="month" />
                  </Form.Item>
               </Form>
               <Cdivider type="h" />
               <Usetable columns={columns} dataSource={[]} scroll={{x: 1648}} hbg="#ecf5ff" hbc="#515151" />
            
             </Mainbox>

          </Titlelayout>
        
    </Pagecount>
  )
}
