import React, {useEffect, useState} from 'react'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import moment from 'moment'
import {Form,  Space, DatePicker, Tooltip, InputNumber, message} from 'antd'
import Usetable from "@com/useTable"
import Titlelayout from "@com/titlelayout"
import {QutoSlice,  useQuotaQuery, useEmissionQuery,useSaveTargetMutation,
  useSaveQuotaMutation} from "./quotaslice"
import {CustButtonT} from "@com/useButton"
import {Cdivider} from "@com/comstyled"
import {useSelector} from 'react-redux'
import {selectProjectId, enterprise} from '@redux/systemconfig'
import {Carbon} from '@api/api'
import {isObject} from '@com/usehandler'
const Mainbox = styled.div`
    margin-top: 16px;
    padding-top: 16px;
  
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex:1;
    .content {
      flex: 1;
      padding-top: 16px;
    }
`

const Ctd = ({i,text,index}) => {
  if(index == 1) {
   console.log(i, text);
   const form = Form.useFormInstance(); 
   form.setFieldValue(`${i}`, (typeof text == 'number') ? text : parseFloat(text))
    return (<Form.Item   initialValue={text} name={`${i}`} style={{marginBottom: '0px'}} >
        <InputNumber min={0}    />
    </Form.Item>)
  }else {
    return  <>{text}</>
  }

}
const columns = [
  {
      title: '年份',
      dataIndex: 'year',
      width: 180,
      render: (text) => <>{text}碳排放量(tCo2)</>
  },
 ...Array.from({length: 12}, ( index,i) => ({
    title: i+1+'月',
    dataIndex: i+1,
    key: i+1,
    width: 80,
    align: 'center',
    render: (text,_, index) => <Ctd text={text} index={index} i={i+1} />
 })),
 {
  title: "合计",
  dataIndex: 'carbonAnnualEmission',
    key: 'carbonAnnualEmission',
    align: 'center',
    width: 80,
    render: (text,_, index) => {
      
      if(index ==1) {
        return <Form.Item noStyle shouldUpdate >
          {({getFieldsValue}) => {
             let values = getFieldsValue()             
               return Object.values(values).reduce((cur,pur) => cur+pur, 0)?.toFixed(2)
               
              
          }}
        </Form.Item>
      }else {
        return text;
      }
    }
 }
]

const Ctdt = ({i,text,index}) => {
   const form = Form.useFormInstance();
   form.setFieldValue(`${i}`, (typeof text == 'number') ? text : 0)
    return (<Form.Item   initialValue={text} name={`${i}`} style={{marginBottom: '0px'}} >
        <InputNumber min={0}   />
    </Form.Item>)
}
const columnsT = [
  {
      title: '年份',
      dataIndex: 'year',
      width: 180,
      render: (text) => <>{text}碳排放目标值(tCo2)</>
  },
 ...Array.from({length: 12}, ( index,i) => ({
    title: i+1+'月',
    dataIndex: i+1,
    key: i+1,
    width: 80,
    align: 'center',
    render: (text,_, index) => <Ctdt text={text} index={index} i={i}/>
 })),
 {
  title: "合计",
  dataIndex: 'carbonAnnualEmission',
    key: 'carbonAnnualEmission',
    align: 'center',
    width: 80,
    render: (text,_, index) => {
        return <Form.Item noStyle shouldUpdate>
          {({getFieldsValue}) => {
             let values = getFieldsValue()             
             return Object.values(values).reduce((cur,pur) => cur+pur, 0)
          }}
        </Form.Item>
    }
 }
]
export default function Index() { 
  const [form] = Form.useForm()
  const [formt] = Form.useForm()
  const {id:enterpriseId} = useSelector(enterprise)
  const [tableData, setTableData] = useState([])
  const [targetData, setTargetData] = useState([])
  const lastyear =moment().subtract(1, 'year').year()
  const curyear = moment().year()
  const [curtal, setCurtal] = useState(0)
  const [pretal, setPretal] = useState(0)
   
 console.log(curtal)

 console.log(pretal)


  const rate = pretal != 0 ? ((curtal - pretal)/pretal*100).toFixed(2)  : 0
  const arrow =  (curtal-pretal) > 0  ? <b style={{color: "#f00"}}>&#x25B2;</b> : (curtal-pretal) < 0 ? <b style={{color: "#080"}}>&#x25BC;</b> : null
  const onValuesChange = (_, allvalue) => {
     let total = Object.values(allvalue).reduce((a, b) => a+b, 0);
     setCurtal(total)
  }

  const getCarbonQuotal = async () => {   
   // let {success, data, errMsg} = await  Carbon.QueryCarbonQuota(enterpriseId)
    try {
  
    let promise = [Carbon.QueryCarbonQuota(enterpriseId), Carbon.QueryCarbonQuotaCurYear({year:curyear, enterpriseId})]

    let [{value: {success: suc, data, errMsg: err}}, {value: {success: cursuc, data: curyearData, errMsg: cerr}}] = await Promise.allSettled(promise)
    let arrdata = [];
    let lastyearData =Array.isArray(data) ? data[0] : undefined ;
    setPretal(lastyearData?.carbonAnnualEmission??0)
    if(suc && isObject(lastyearData)) {
         let dataobj ={}
          for(let [key, value] of Object.entries(lastyearData)) {
             if(key !== 'monthVos') {
              dataobj[key] = value

             }else{
                 value.forEach(v => {
                   let {month, carbonMonthlyEmission} = v
                   dataobj[month] = carbonMonthlyEmission;
                 })
             }
          }        
        arrdata.push(dataobj)
    }else {
       if(!suc) message.warning(err || '数据出错')
       if(!lastyearData) message.warning(`${lastyear}年无数据`)
       
    }
    
   if(cursuc && Array.isArray(curyearData) && curyearData?.length >0) {
       let curobj = {}
       curyearData.forEach(c => {
          if(!curobj['year']) {
            curobj.year = c.year
          }
          curobj[c.month] = c.carbonMonthlyQuota

       })
       arrdata.push(curobj) 
       let total = curyearData.map(a => a.carbonMonthlyQuota).reduce((x,y) => parseFloat(x)+parseFloat(y), 0)
       console.log(total)
       setCurtal(total)
   }else {
    if(!cursuc) message.warning(cerr || '数据出错')
    if(!curyearData) message.warning(`${curyear}年无数据`)
    setCurtal(0)
   }
    console.log(arrdata)
    setTableData(arrdata)
       
  } catch (error) {
      console.log(error)
  }

    return 
    if(success && Array.isArray(data) && data.length > 0) {
        let lastyearData = data.find(d => d.year == lastyear)
        let curyearData = data.find(d => d.year == curyear)
        if(!lastyearData) message.warning(`${lastyear}年无数据`)
        if(!curyearData) message.warning(`${curyear}年无数据`)

       setCurtal(curyearData?.carbonAnnualEmission??0)
       setPretal(lastyearData?.carbonAnnualEmission??0)
  
      


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
  const  getTarget = async () => {
    let {success, data, errMsg} = await Carbon.QueryCarbonTarget(enterpriseId, curyear)
    if(success && Array.isArray(data) && data.length > 0) {
       let target = {}
       data.forEach(d => {
          if(!target.year) {
            target.year = d.year
          }
          target[d.month] = d.carbonMonthlyTarget

       })
       setTargetData([target])
    }else {
      if(!success) message.warning(errMsg || '数据出错')
      setTargetData([])
    }

  } 
  useEffect(() => {
    if(Number.isInteger(enterpriseId)) {
      getCarbonQuotal()
      getTarget()


    }

  }, [enterpriseId])
 
 
 
  const [saveQuota, {isLoading}] =useSaveQuotaMutation()
  const onSave = async () => {
    try {
      let values =await form.validateFields();
      console.log(values)
      let params = []
      for(let [key, value] of Object.entries(values)) {       
         params.push({
          enterpriseId:enterpriseId,
          year: curyear,
           month: parseInt(key),
           carbonMonthlyQuota: value
         })
      }
      console.log(params)
      let {success,errMsg} = await saveQuota(params).unwrap()
      if(success) {
        message.success('保存成功')
        getCarbonQuotal()
      }else {
        message.warning(errMsg || '数据出错')
      }

    } catch (error) {
      console.log(error)
    }
     
      
  }
  const [saveTarget, {isLoading: targetloading}] = useSaveTargetMutation()
  const onSavetarget = async () => {
    try {
      let values =await formt.validateFields();
      console.log(values)
      let params = []
      for(let [key, value] of Object.entries(values)) {       
         params.push({
          enterpriseId:enterpriseId,
          year: curyear,
           month: parseInt(key)+1,
           carbonMonthlyTarget: value
         })
      }
      console.log(params)
      let {success,errMsg} = await saveTarget(params).unwrap()
      if(success) {
        message.success('保存成功')
        getTarget()
      }else {
        message.warning(errMsg || '数据出错')
      }

    } catch (error) {
      console.log(error)
    }
     
      
  }
  const CTitle = (
    <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
        <Space size={64}><span>园区配额预分配</span><span>总预配额：{curtal} tCO2 与  {lastyear}年度碳排放量对比:&nbsp;<span>{rate}%</span>{arrow}</span></Space>
        <Space> <CustButtonT   text="save" onClick={onSave} loading={isLoading} /></Space>
    </div>
  )
 
  const CTitleC = (
    <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
        <span>园区目标分解测算</span>
        <Space><CustButtonT   text="save" onClick={onSavetarget} loading={targetloading}  /></Space>
    </div>
  )

  return (
    <Pagecount bgcolor="transparent" pd="0">
        <Mainbox> 
          <Titlelayout title={CTitle} layout="flex" key="quota"> 
             <div className='content'>
              <Form form={form} component={false} onValuesChange={onValuesChange}>             
               <Usetable columns={columns} dataSource={tableData} scroll={{x: 1648}} hbg="#ecf5ff" hbc="#515151" />
               </Form> 
               </div>
          </Titlelayout>
          <Titlelayout title={CTitleC} layout="flex" key="target"> 
              <div className='content'>
              <Form form={formt} component={false}>             
               <Usetable columns={columnsT} dataSource={targetData} scroll={{x: 1648}} hbg="#ecf5ff" hbc="#515151" />
               </Form> 
               </div>
          </Titlelayout>
          </Mainbox>
    </Pagecount>
  )
}
