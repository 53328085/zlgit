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
//  查询获得的数据组装
const splitarr = (arr) => {  
  if( Array.isArray(arr) && arr.length > 0) {
  // 先获取当前的月份
   let date =moment(arr[0].date, "YYYY-MM-DD hh:mm:ss") 
   let days = date.daysInMonth()  //数组最后一项为总计
   let month= date.month()
   let year = date.year()
  
 
  let obj = {}
  arr.forEach(u => {
   let key = `${u.carbonUnitName}${u.subCategoryName}`
   if(!obj[key]) {
     obj[key]= []
     obj[key].push(u)
   }else {
     obj[key].push(u)
   }
  })
  let tableData = []
  for(let arrs of Object.values(obj)) {
      let consumption = Array.from({length: days}, (_, i) => i).fill(0)
      let {carbonUnitName, subCategoryName} = arrs[0]
      let unit = {
        carbonUnitName,
        subCategoryName,
        day: days,
        consumption,
      }
      arrs.forEach(item => {
        let index =  moment(item.date, "YYYY-MM-DD hh:mm:ss").day() -1
        if(item.consumption!==0)  unit.consumption.splice(index, 1, item.consumption)
      })
      let total = unit.consumption.reduce((a, b) => a+b, 0);
      unit.consumption.push(total);
      tableData.push(unit)
  }
  
  return  [tableData, year, month]
  }else {
    return [[], null, null]
  }
 }
 const Ctd = ({record,i,text,saveData,index}) => {
 
  let {carbonUnitName, subCategoryName} = record;
  const form = Form.useFormInstance();
  form.setFieldValue([`${carbonUnitName}-${subCategoryName}`, i], text)
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

export default function Index() { 
  const {id:enterpriseId} = useSelector(enterprise)
  const [form] = Form.useForm()
  const [tbform] = Form.useForm()
  const ref = useRef()
  const saveData = useRef();
  const [tableData, setTableData] = useState([])

 
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

// 表格列设置函数
const formartcol = (data) => {
  try {
    
 
  if(Array.isArray(data) && data.length > 0) {
    saveData.current = _.cloneDeep(data)
    
    data.forEach(d => {
       let {consumption} = d
        for(let [index, value] of consumption.entries()){
            d[index] = value
        }
     })
    let day = data[0]?.day
    let col =  columns.slice(0,2)

    let cols = Array.from({length: day}, ( v,i) => ({
      title: i+1,
      dataIndex: i,
      key: i,
      width:98,
      align: 'center',
      render: (text, record, index) =><Ctd record={record} i={i} text={text} index={index} saveData={saveData.current} /> 
   }))
   let endcol = {
     title: "月总计",
    dataIndex: day,
      key: day,
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
  } else{
     setTableData([])
  }
} catch (error) {
  console.log(error)
}
}


 // 查询   实时查询和延迟查询冲突 解决方案1： 添加条件

 /*  const [init, setInit] = useState(false)
  let unitDatas
  let yvalue = moment().year()-1
  let mvalue = moment().month()+1
  const {data:unidata, isSuccess} =useEmissionUnitQuery({year: yvalue, month:mvalue, enterpriseId}, {
    skip: !Number.isInteger(enterpriseId) || init,
    refetchOnMountOrArgChange: true
  })   
  if(isSuccess) {
    unitDatas = unidata?.data    
    let [tableData] = splitarr(unitDatas)
    formartcol(tableData)
    setInit(true)
  }else {
    console.log('error')
  }
  const [queryEmission, result] = DataSlice.useLazyEmissionUnitQuery() rtk query 暂时不用 */
 

const onQuery = async () => { 
    let month = form.getFieldValue('month').month() + 1
    let year = form.getFieldValue('year').year()
     let {data, success,errMsg} = await  Carbon.onQueryEmission({year,month, enterpriseId})
     if(success && Array.isArray(data) && data.length > 0) {
        let [tableData] = splitarr(data)
         
        formartcol(tableData)
     }else {
       setTableData([])
        if(!success) {
          message.warning(errMsg)
        }
     }
  }

 useEffect(() => {
   if(Number.isInteger(enterpriseId)) {
      onQuery()
   }

 }, [enterpriseId])


  // 下载模板

  const onDownload =async () => { 
    try {
      let month = form.getFieldValue('month').month() + 1
      let year = form.getFieldValue('year').year()
      let res = await Carbon.DownloadTemplate({year, month, enterpriseId})     
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
        formartcol(data)      
        message.success("文件导入成功")
        ref.current.onCancel()
      } else{
        if(!success) message.warning(errMsg || '数据出错')
         setTableData([])
      }
    } catch (error) {
      console.log(error)
    }
   
  }


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
       let {data: {success, errMsg}} = await onSaveData(params)
       if(success) {
        message.success("保存成功")
     //   saveData.current ={}
        onQuery()
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
          <CustButtonT text="save" src='save' onClick={onSave} loading={isLoading} />
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
                     <DatePicker   picker="year" onChange={onQuery} />
                  </Form.Item>
                  <Form.Item name="month" label="月份">
                    <DatePicker   picker="month" onChange={onQuery} />
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
