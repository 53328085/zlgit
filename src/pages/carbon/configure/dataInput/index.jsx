import React, {useEffect, useState, useRef} from 'react'
import styled from 'styled-components'
import moment from 'moment'
import {Form,  Space, DatePicker, Tooltip, Upload, Typography, message} from 'antd'
import Pagecount from '@com/pagecontent'
import Modal from '@com/useModal'

import Usetable from "@com/useTable"
import Titlelayout from "@com/titlelayout"
import upload from "@imgs/upload.png"
import {DataSlice, useEmissionUnitQuery,useImportDataMutation} from "./dataslice"
import {Carbon} from "@api/api.js"
import {CustButtonT} from "@com/useButton"
import {Cdivider} from "@com/comstyled"
const { Dragger } = Upload;
const {Link} = Typography
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
  const ref = useRef()
  console.log(upload)
  let unitDatas
  const {data:unidata, isSuccess, refetch  } =useEmissionUnitQuery({year: 2024, month: 4, enterpriseId: 1})

  if(isSuccess) {
    console.dir(unidata)
    unitDatas = unidata?.data
  }

  // 下载模板

  const onDownload =async () => {
    try {
      let month = form.getFieldValue('month').month() + 1
      let res = await Carbon.DownloadTemplate({year: 2024, month: 4, enterpriseId: 1})     
      let blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }); 
     
      let url = window.URL.createObjectURL(blob); 
      let a = document.createElement("a");
      a.href = url;
      a.download = `${month}月份数据录入.xlsx`;
      document.body.appendChild(a);
      a.click();
     
      document.body.removeChild(a);
    } catch (error) {
      console.log(error)
    }

  }

  // 数据导入
  let flies
  const beforeUpload = (file, fileList) =>{
    console.log(file, fileList)
    flies = [...fileList]
    return false
  }
 //  const [onupload] = useImportDataMutation()
  const onImport =() => {
    ref.current.onOpen()

  }
  const uploadOk = async () => {
    try {
      let formData = new FormData()
      formData.append("file", flies[0])
      let {success,errMsg} = await Carbon.OnImport(formData)
      if(success) {
        message.success("文件导入成功")
      } else{
        message.warning(errMsg || '数据出错')
      }
    } catch (error) {
      console.log(error)
    }
   
  }

  // end
  const CTitle = (
    <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
        <span>手动数据录入</span>
        <Space><Tooltip title="下载模板后录入数据，可以直接导入上传数据"><CustButtonT text="download" onClick={onDownload} /></Tooltip><CustButtonT text="import" src='import' onClick={onImport} /> <CustButtonT text="save" src='save' /></Space>
    </div>
  )
 
  return (
    <Pagecount bgcolor="transparent" pd="0">
     
    
          <Titlelayout title={CTitle} layout="flex" >
            <Mainbox>
               <Form form={form} layout="inline" colon={false} labelCol={{flex: '2.5em'}} 
               initialValues={{
            year: moment(),
            month: moment()
          }}>
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
          <Modal mold='cust' ref={ref}   title='数据模板导入' onOk={uploadOk}>
      {/* <BlueColumn name={name} styled={{ padding: '24px 0px' }}></BlueColumn> */}
      <Dragger accept=".xlsx" maxCount={1} beforeUpload={beforeUpload}>
        <img src={upload}></img>
        <p style={{ margin: '32px 0', fontSize: 16 }}>将文件拖到此处，或<Link>点击上传</Link></p>
       
      </Dragger>  
    </Modal>
    </Pagecount>
  )
}
