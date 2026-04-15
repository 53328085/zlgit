import React, {useEffect, useState, useRef, useMemo} from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import {Form,  Space, DatePicker, Tooltip, Upload, Typography, message,InputNumber} from 'antd'
import {useSelector} from 'react-redux'
import {useTranslation, Trans} from 'react-i18next'
import Pagecount from '@com/pagecontent'
import Modal from '@com/useModal'
import _ from 'lodash'
import Usetable from "@com/useTable"
import Titlelayout from "@com/titlelayout"
import upload from "@imgs/upload.png"
import {DataSlice, useEmissionUnitQuery,useImportDataMutation, useSaveDataMutation} from "@redux/carbon"
import {Carbon} from "@api/api.js"
import {CustButtonT, CustTransO, i18warning, i18success} from "@com/useButton"
import {Cdivider} from "@com/comstyled"
import { enterprise} from '@redux/systemconfig'
const { Dragger } = Upload;
const {Link} = Typography
const Mainbox = styled.div`
   && {
  //  margin-top: 16px;
  //  padding-top: 16px;
   // border-top: 1px dotted #d7d7d7;
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
  //  width:1652px;
    .ant-form-item {
      margin-bottom: 0px;
    }
   } 
`
//  查询获得的数据组装
const splitarr = (arr) => {  
  if( Array.isArray(arr) && arr.length > 0) {
  // 先获取当前的月份
   let date =dayjs(arr[0].date, "YYYY-MM-DD hh:mm:ss") 
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
      let {carbonUnitName, subCategoryName,unit: unittext} = arrs[0]
      let unit = {
        carbonUnitName,
        subCategoryName,
        day: days,
        consumption,
        unit: unittext
      }
      arrs.forEach(item => {
       
        let index =  dayjs(item.date, "YYYY-MM-DD hh:mm:ss").date() -1
        
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
 const Ctd = ({record,i,text,saveData,index, month}) => { 
  let {carbonUnitName, subCategoryName} = record;
  const form = Form.useFormInstance();
 
  const onChange = (v) => {
    let num = Number.isFinite(v) ? v : 0
   
    try {
      saveData[index]?.consumption.splice(i,1,num)
    } catch (error) {
      console.log(error)
    }
      
  }
  useEffect(() => {
     if(record && text) {
      form.setFieldValue([`${carbonUnitName}-${subCategoryName}-${month}`, i], text)
     }
  }, [record, text])
  return (<Form.Item   initialValue={text} name={[`${carbonUnitName}-${subCategoryName}-${month}`, i]} >
      <InputNumber min={0} onChange={onChange} />
   </Form.Item>)
}

export default function Index() { 
  const {enterpriseId} = useSelector(enterprise)
  const {t} = useTranslation()
  const [form] = Form.useForm()
  const [tbform] = Form.useForm()
  const ref = useRef()
  const saveData = useRef();
  const [tableData, setTableData] = useState([])

 
  const [columns, setColumns] =useState([
      {
          title:  <CustTransO  text="carbonUnit" ns="carbon" />,
          dataIndex: 'carbonUnitName',
          key: 'carbonUnitName',
          align: 'center',
          width: 160,
          fixed: 'left',
          ellipsis: true,
      },
      {
        title: <CustTransO  text="energyconsumption" ns="carbon" />,
        dataIndex: 'subCategoryName',
        key: 'subCategoryName',
        align: 'center',
        width: 160,
        fixed: 'left',
        ellipsis: true,
     },
    /* ...Array.from({length: 30}, ( v,i) => ({
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
     } */]
 )

// 表格列设置函数
const formartcol = (data, month) => {
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
      render: (text, record, index) =><Ctd record={record} i={i} text={text} index={index} saveData={saveData.current} month={month} /> 
   }))
   let endcol = {
     title:  <CustTransO  ns="comm" text="monthlytotal"/>,
    dataIndex: day,
      key: day,
      align: 'center',
      width: 120,
      fixed: 'right',
      ellipsis: true,
      render: (_, record) => {

         return <Form.Item noStyle shouldUpdate>{
          ({getFieldValue}) => {
              let {carbonUnitName, subCategoryName} = record;
              let values = getFieldValue(`${carbonUnitName}-${subCategoryName}-${month}`)
            
            return values?.reduce((a, b) => a+b, 0)
          }
         }</Form.Item>
      }
   }
   let unit = {
      title: <CustTransO  ns="comm" text="unit"/>,
      dataIndex: 'unit',
      key: 'unit',
      align: 'center',
      width: 80,
      fixed: 'right',
      ellipsis: true,
   }
  
    setColumns([...col,...cols,endcol, unit])
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
  let yvalue = dayjs().year()-1
  let mvalue = dayjs().month()+1
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
    try {
      let month = form.getFieldValue('month').month() + 1
    let year = form.getFieldValue('year').year()
     let {data, success,errMsg} = await  Carbon.onQueryEmission({year,month, enterpriseId})
     if(success && Array.isArray(data) && data.length > 0) {
      //  form.resetFields();
        let [tableData] = splitarr(data)
        
        formartcol(tableData, month)
     }else {
       setTableData([])
        if(!success) {
          message.warning(errMsg)
        }
     }
    } catch (error) {
      console.log(error)
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
        type: "application/x-msdownload",
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
        message.success(t("comm:Fileimportsuccessful"))
        ref.current.onCancel()
      } else{
        if(!success) i18warning(errMsg)
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
        i18success('save')
       // message.success("保存成功")
     //   saveData.current ={}
        onQuery()
       }else {
        i18warning(errMsg)
       }
      
    } catch (error) {
      
    }

  }

  const CTitle = (
    <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
        <span> <CustTransO  ns="comm" text="Manualdataentry"/></span>
        <Space>
          <Tooltip title={t("carbon:importtip")}>
          <CustButtonT text="download" onClick={onDownload} key="download" /></Tooltip>
          <CustButtonT text="import" src='import' onClick={onImport} key="import" /> 
          <CustButtonT text="save" src='save' onClick={onSave} loading={isLoading} key="save" />
          </Space>
    </div>
  )
   const Ctitle = () => {
    let month = form.getFieldValue('month').month()+1
    return <><span style={{color: "#f00"}}>{t(month, {ns: "comm"})}</span>{t("carbon:modalTitle")}</>
  }  
/* 
  const Ctitle = () => {
    let month = form.getFieldValue('month').month()+1
    return <Trans ns="carbon" i18nKey='modalTitle'>
<span style={{color: "#f00"}}>{{month}}月份</span>数据模板导入
    </Trans>

  } */
 
  return (
    <Pagecount bgcolor="transparent" pd="0">
     
    
          <Titlelayout title={CTitle} layout="flex" >
            <Mainbox>
               <Form form={form} layout="inline" colon={false} labelCol={{flex: 'auto'}} 
               initialValues={{
            year: dayjs(),
            month: dayjs()
          }}>  
          <Space size={16}>
                  <Form.Item name="year" label={<CustTransO ns="comm" text="year" param="度" />} >
                     <DatePicker   picker="year" onChange={onQuery} />
                  </Form.Item>
                  <Form.Item name="month" label={<CustTransO ns="comm" text="month" param="份" />} >
                    <DatePicker   picker="month" onChange={onQuery} />
                  </Form.Item>
                  </Space>
               </Form> 
               <Form form={tbform} component={false}>  
                  <div style={{flex:1, position: "relative"}}>
                    <div style={{position:"absolute", width: "100%"}}>
                    <Usetable columns={columns} dataSource={tableData} scroll={{x: 1620,y:658}}  hbg="#ecf5ff" hbc="#515151" sticky />
                    </div>
                  </div>
               </Form>
             </Mainbox>

          </Titlelayout>
          <Modal mold='cust' ref={ref}   title={<Ctitle />} onOk={uploadOk}>
     
      <Dragger accept=".xlsx" maxCount={1} beforeUpload={beforeUpload}>
        <img src={upload}></img>
        <p style={{ margin: '32px 0', fontSize: 16 }}>
          <Trans ns="carbon" i18nKey="uploadtip">
           将文件拖到此处，或<Link>点击上传</Link>
          </Trans>
          </p>
       
      </Dragger>  
    </Modal>
    </Pagecount>
  )
}
