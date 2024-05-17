import React, {useEffect, useState, useRef, useMemo} from 'react'
import styled from 'styled-components'
import moment from 'moment'
import {Form,  Space, DatePicker, Tooltip, Upload, Typography, message,InputNumber} from 'antd'
import {useSelector} from 'react-redux'
import Pagecount from '@com/pagecontent'
import Modal from '@com/useModal'
import _ from 'lodash'
import Usetable from "@com/useTable"
import Titlelayout from "@com/titlelayout"
import upload from "@imgs/upload.png"
import {DataSlice, useEmissionUnitQuery,useImportDataMutation, useSaveDataMutation} from "./dataslice"
import {Carbon} from "@api/api.js"
import {CustButtonT} from "@com/useButton"
import {Cdivider} from "@com/comstyled"
import { enterprise} from '@redux/systemconfig'
const { Dragger } = Upload;
const {Link} = Typography
const Mainbox = styled.div`
   && {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px dotted #d7d7d7;
    display: flex;
    flex-direction: column;
    gap: 16px;
    width:1652px;
    .ant-form-item {
      margin-bottom: 0px;
    }
   } 
`

export default function Index() { 
  const {id:enterpriseId} = useSelector(enterprise)
  const [form] = Form.useForm()
  const [tbform] = Form.useForm()
  const ref = useRef()
   
  const [tableData, setTableData] = useState([])
  const Ctd = ({record,i,text,saveData,index}) => {
    let {carbonUnitName, subCategoryName} = record;
   
    const onChange = (v) => {
      
      try {
        saveData[index]?.consumption.splice(i,1,v)
      } catch (error) {
        console.log(error)
      }
        
    }
    return (<Form.Item   initialValue={text} name={[`${carbonUnitName}-${subCategoryName}`, i]} >
        <InputNumber min={0} onChange={onChange} />
     </Form.Item>)
  }
  const curdays = moment().get('date')
  
  console.dir(curdays)
  const [columns, setColumns] =useState([
      {
          title: '排放单元',
          dataIndex: 'carbonUnitName',
          key: 'carbonUnitName',
          align: 'center',
          width: 180,
          fixed: 'left',
          ellipsis: true,
      },
      {
        title: '能源消耗量',
        dataIndex: 'subCategoryName',
        key: 'subCategoryName',
        align: 'center',
        width: 180,
        fixed: 'left',
        ellipsis: true,
     },
    ...Array.from({length: 30}, ( v,i) => ({
        title: i+1,
        dataIndex: i,
        key: i,
        width: 98,
        align: 'center',
        render: (text, record, index) =><Ctd record={record} i={i} text={text} /> 
     })),
    {
      title: "月总计",
      dataIndex: 30,
        key: 30,
        align: 'center',
        width: 80,
        fixed: 'right',
     }]
 )
  let unitDatas
  const {data:unidata, isSuccess, refetch  } =useEmissionUnitQuery({year: 2024, month:3, enterpriseId}, {
    skip: !Number.isInteger(enterpriseId)
  })

  if(isSuccess) {
    unitDatas = unidata?.data
  }else {
    console.log('error')
  }

  // 下载模板

  const onDownload =async () => {
    try {
      let month = form.getFieldValue('month').month() + 1
      let res = await Carbon.DownloadTemplate({year: 2024, month, enterpriseId})     
      let blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }); 
     
      let url = window.URL.createObjectURL(blob); 
      let a = document.createElement("a");
      a.href = url;
      a.download = `${month}数据录入.xlsx`;
      document.body.appendChild(a);
      a.click();
     
      document.body.removeChild(a);
    } catch (error) {
      console.log(error)
    }

  }

  // 数据导入
  const saveData = useRef();
  let flies
  const beforeUpload = (file, fileList) =>{
    flies = [...fileList]
    return false
  }
  
  const onImport =() => {
    ref.current.onOpen()

  }
  const uploadOk = async () => {
    try {
      let formData = new FormData()
      formData.append("file", flies[0])
      let {success,errMsg, data} = await Carbon.OnImport(formData)

      if(success && Array.isArray(data) && data.length > 0) {
        saveData.current = _.cloneDeep(data)
        
        data.forEach(d => {
           let {consumption} = d
            for(let [index, value] of consumption.entries()){
                d[index] = value
            }
         })
        let day = data[0]?.consumption.length ?? 30
        let col =  columns.slice(0,2)

        let cols = Array.from({length: day-1}, ( v,i) => ({
          title: i+1,
          dataIndex: i,
          key: i,
          width:98,
          align: 'center',
          render: (text, record, index) =><Ctd record={record} i={i} text={text} index={index} saveData={saveData.current} /> 
       }))
       let endcol = {
         title: "月总计",
        dataIndex: day-1,
          key: day-1,
          align: 'center',
          width: 80,
          fixed: 'right',
          ellipsis: true,
          render: (_, record) => {

             return <Form.Item noStyle shouldUpdate>{
              ({getFieldValue}) => {
                  let {carbonUnitName, subCategoryName} = record;
                  let values = getFieldValue(`${carbonUnitName}-${subCategoryName}`)

                return values?.reduce((a, b) => a+b, 0)
              }
             }</Form.Item>
          }
       }
        setColumns([...col,...cols,endcol])
        setTableData([...data])
        message.success("文件导入成功")
        ref.current.onCancel()
      } else{
        if(!success) message.warning(errMsg || '数据出错')
         
         setTableData([])
        message.warning(errMsg || '数据出错')
      }
    } catch (error) {
      console.log(error)
    }
   
  }

  // end

  //  保存

 const [onSaveData, {isLoading}] =useSaveDataMutation()


  const onSave = async () => {
    try {
       let {year, month} = form.getFieldsValue()
       let params = {
          year: year.year(),
          month: month.month() + 1,
          enterpriseId,
          body: saveData.current

       }
       let {success,errMsg} = await onSaveData(params)
       if(success) {
        message.success("保存成功")
       }else {
        message.warning(errMsg || '数据出错')
       }
      
    } catch (error) {
      
    }

  }

  const CTitle = (
    <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
        <span>手动数据录入</span>
        <Space>
          <Tooltip title="下载模板后录入数据，可以直接导入上传数据">
          <CustButtonT text="download" onClick={onDownload} /></Tooltip>
          <CustButtonT text="import" src='import' onClick={onImport} /> 
          <CustButtonT text="save" src='save' onClick={onSave} />
          </Space>
    </div>
  )

  const Ctitle = () => {
    let month = form.getFieldValue('month').month()
    return <><span style={{color: "#f00"}}>{month+1}月份</span>数据模板导入</>
  }
 
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
               <Form form={tbform} component={false}>  
                  <Usetable columns={columns} dataSource={tableData} scroll={{x: 1620,y:658}}  hbg="#ecf5ff" hbc="#515151" sticky />
               </Form>
             </Mainbox>

          </Titlelayout>
          <Modal mold='cust' ref={ref}   title={<Ctitle />} onOk={uploadOk}>
     
      <Dragger accept=".xlsx" maxCount={1} beforeUpload={beforeUpload}>
        <img src={upload}></img>
        <p style={{ margin: '32px 0', fontSize: 16 }}>将文件拖到此处，或<Link>点击上传</Link></p>
       
      </Dragger>  
    </Modal>
    </Pagecount>
  )
}
