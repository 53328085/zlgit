import React, {useEffect, useState} from 'react'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import moment from 'moment'
import {Form,  Space, DatePicker, Tooltip, InputNumber, message} from 'antd'
import Usetable from "@com/useTable"
import Titlelayout from "@com/titlelayout"
import {QutoSlice,  useQuotaQuery, useEmissionQuery,
  useSaveQuotaMutation} from "./quotaslice"
import {CustButtonT} from "@com/useButton"
import {Cdivider} from "@com/comstyled"
import {useSelector} from 'react-redux'
import {selectProjectId, enterprise} from '@redux/systemconfig'
import {Carbon} from '@api/api'
const Mainbox = styled.div`
  margin-top: 16px;
    padding-top: 16px;
    border-top: 1px dotted #d7d7d7;
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex:1;
`

const Ctd = ({record,i,text,saveData,index}) => {
  
 
  const onChange = (v) => {
    console.log(i)
    console.log(v)
    
      
  }
  if(index == 1) {
     console.log(text)
   const form = Form.useFormInstance();
   form.setFieldValue(`${i}`, (typeof text == 'number') ? text : 0)
    return (<Form.Item   initialValue={text} name={`${i}`} style={{marginBottom: '0px'}} >
        <InputNumber min={0} onChange={onChange} />
    </Form.Item>)
  }else {
    return  <>{text}</>
  }

}
const columns = [
  {
      title: '年份',
      dataIndex: 'year',
      width: 180
  },
 ...Array.from({length: 12}, ( index,i) => ({
    title: i+1+'月',
    dataIndex: i+1,
    key: i+1,
    width: 80,
    align: 'center',
    render: (text,_, index) => <Ctd text={text} index={index} i={i}/>
 })),
 {
  title: "合计",
  dataIndex: 'carbonAnnualEmission',
    key: 'carbonAnnualEmission',
    align: 'center',
    width: 80,
    render: (text,_, index) => {
      
      if(index ==1) {
        return <Form.Item noStyle shouldUpdate>
          {({getFieldsValue}) => {
             let values = getFieldsValue()             
             return Object.values(values).reduce((cur,pur) => cur+pur, 0)
          }}
        </Form.Item>
      }else {
        return text;
      }
    }
 }
]
export default function Index() { 
  const [form] = Form.useForm()
  const {id:enterpriseId} = useSelector(enterprise)
  const [tableData, setTableData] = useState([])
  const lastyear =moment().subtract(1, 'year').year()
  const curyear = moment().year()
  const getCarbonQuotal = async () => {   
    let {success, data, errMsg} = await  Carbon.QueryCarbonQuota(enterpriseId)
    if(success && Array.isArray(data) && data.length > 0) {
        let lastyearData = data.find(d => d.year == lastyear)
        let curyearData = data.find(d => d.year == curyear)
        if(!lastyearData) message.warning(`${lastyear}年无数据`)
        if(!curyearData) message.warning(`${curyear}年无数据`)
        let arrdata = [];
        
        [lastyearData, curyearData].forEach(yeardata => {
          let dataobj ={}
          if(yeardata) {
            for(let [key, value] of Object.entries(yeardata)) {
               if(key !== 'monthVos') {
                dataobj[key] = value
 
               }else{
                   value.forEach(v => {
                     let {month, carbonMonthlyEmission} = v
                     dataobj[month] = carbonMonthlyEmission;
                   })
               }
            }
 
          }
          arrdata.push(dataobj)
      
        })
        console.dir(arrdata)
        setTableData(arrdata)
        
    }else {
      if(!success) message.warning(errMsg || '数据出错')
      setTableData([])
    }
   
  }
  useEffect(() => {
    if(Number.isInteger(enterpriseId)) {
      getCarbonQuotal()



    }

  }, [enterpriseId])
 
 
/*   if(isSuccess && Array.isArray(data?.data)) {
     let obj = {},curyear = {}
    data?.data?.forEach(d => {
        obj[d.month] = d.carbonEmissionAmount
        curyear[d.month] = ''
       
     })
     curyear.year = year+'碳排放量(tCo2)'
     curyear.total=''
    tableData =[obj, curyear]
  }else {
    tableData = []
  } */
  // 保存 
 
  const [saveQuota, {isLoading}] =useSaveQuotaMutation()
  const onSave = async () => {
    try {
      let values =await form.validateFields();
      console.log(values)
      let params = []
      for(let [key, value] of Object.entries(values)) {
         params.push({
          EnterpriseId:id,
          Year: year,
           Month: key,
           carbonEmissionAmount: value
         })
      }
      let {success,errMsg} = await saveQuota(params)
      if(success) {
        message.success('保存成功')
      }else {
        message.warning(errMsg || '数据出错')
      }

    } catch (error) {
      
    }
     
      
  }
  const CTitle = (
    <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
        <span>园区配额预分配</span>
        <Space>{/* <CustButtonT text="import" src='import' /><CustButtonT text="export" src='export' /> */}<CustButtonT   text="save" onClick={onSave}  /></Space>
    </div>
  )
 
  const CTitleC = (
    <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
        <span>园区目标分解测算</span>
        <Space>{/* <CustButtonT text="import" src='import' /><CustButtonT text="export" src='export' /> */}<CustButtonT   text="save" onClick={onSave}  /></Space>
    </div>
  )

  return (
    <Pagecount bgcolor="transparent" pd="0">
          <Titlelayout title={CTitle} layout="flex">
            <Mainbox> 
              <Form form={form} component={false}>             
               <Usetable columns={columns} dataSource={tableData} scroll={{x: 1648}} hbg="#ecf5ff" hbc="#515151" />
               </Form> 
             </Mainbox>
          </Titlelayout>
    </Pagecount>
  )
}
