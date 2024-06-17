import React, {useEffect, useRef, useState} from 'react'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import {Form,  Space, DatePicker, Tooltip, InputNumber, Input, Select, message, Switch} from 'antd'
import Usetable from "@com/useTable"
import Titlelayout from "@com/titlelayout"
 import {  useDeleteStrategyMutation,
  useEnableStrategyMutation,
  useInsertStrategyMutation,
  useStrategyAllQuery,
  useUpdateStrategyMutation,} from "@redux/carbon"
import {CustButtonT,CustLink,CustTransO,i18warning, i18success} from "@com/useButton"
 
import {Cdivider} from "@com/comstyled"
import {useSelector} from 'react-redux'
import {selectProjectId, enterprise} from '@redux/systemconfig'
import CModal from "@com/useModal"
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

export default function Index() { 


  
  const [form] = Form.useForm()
  const {id} = useSelector(enterprise)

  const [title, setTitle] = useState('')
  const isadd = useRef()
  const [tableData, setTableData] = useState([])
  const ref= useRef()
/*   const {isSuccess, data} = useStrategyAllQuery()
  let tableData = []
  if(isSuccess && Array.isArray(data?.data)) {
     console.log(data?.data)
  }else {
    tableData = []
  }  
  */
const enableAdd = useRef()
const disabledId = useRef()
const getData = async () => {
   let {success, errMsg, data} = await  Carbon.QueryStrategyAll()
   if(success && Array.isArray(data) && data.length >0) {
     setTableData(data)
     enableAdd.current = data.length >= 2
     if(data.length == 1) {
       disabledId.current = data[0].expectedPeriod
     }
   }else {
     if(!success)  i18warning(errMsg)
     setTableData([])
    if(success && data?.length ==0) disabledId.current=NaN
   }
}
useEffect(() => {
  getData()
}, [])

const SwitchC =({text, ruleId}) => {
 
  const [changeEnable] =  useEnableStrategyMutation()
  const onChange = async (checked) => {    
    let {success, errMsg} = await  changeEnable({ruleId, enabled: Number(checked)}).unwrap()
    if(success) {
       let msg = checked ? 'enable' : 'stop'
       getData()
       i18success(msg)
    }else {
      i18warning(errMsg)
      //message.warning(errMsg || '数据出错')
    }
  }

  return  <Switch defaultChecked={text==1} checkedChildren={<CustTransO ns="button" text="enable" />}  unCheckedChildren={<CustTransO ns="button" text="disable" />} onChange={onChange} />
}
const columns = [
  {
      title: <CustTransO ns="comm" text="index" />,
      dataIndex: 'index',
       key: 'index',
       render: (text, record, index) => <>{index +1}</>
  },
 
    {
      title: <CustTransO ns="carbon" text="rulename" />,
      dataIndex: 'ruleName',
       key: 'ruleName'
   },
   {
    title:  <CustTransO ns="carbon" text="Expectedcycle" />,
    dataIndex: 'expectedPeriod',
     key: 'expectedPeriod',
     render: (text) => <>{['月','年'][text]??''}</>
 },
 {
  title: <CustTransO ns="carbon" text="Mlimits" />,
  dataIndex: 'calculation',
   key: 'calculation',
   render: (text) => <>{text==0 ? '百分比' : null}</>
}, 
{
title: '限值及等级',
dataIndex: 'limitsAndLevels',
 key: 'limitsAndLevels',
 render: (text) => {    
   if(Array.isArray(text)) {
     let level1 = text.find(t => t.level == 1)
     let level2 = text.find(t => t.level == 2)
     let level3 = text.find(t => t.level == 3)
     return (<div>
       <span>紧急: ≥{level1?.limitValueMin}%</span>&nbsp;
       <span>严重：{level2?.limitValueMin}%</span>-<span>{level2?.limitValueMax}%</span>&nbsp;
       <span>一般：≤0-{level3?.limitValueMax}%</span>
     </div>)

   }else {
    return null
   }

 }
}, 
{
title: '是否启用',
dataIndex: 'enabled',
 key: 'enabled',
 render: (text, record) => <SwitchC text={text} ruleId={record.ruleId}  />
}, 
 {
  title: "操作",
  dataIndex: 'total',
    key: 'total',
    align: 'center',
    render: (text,record) => {
      return <Space size={32}><CustLink text="edit" onClick={() => onedit(record) } /><CustLink text="delete" type="danger" onClick={() => ondel(record) } /></Space>
    }
 }
]

// 删除 
const wref = useRef()
const recordRef = useRef()
const [ruleName, setRuleName] = useState()
const [DeleteStrategy] = useDeleteStrategyMutation()
const ondel = (record) => {
   recordRef.current = record;
   setRuleName(record.ruleName)
   wref.current.onOpen();
   
}
const onDelOK = async () => {
    try {
      let {success, errMsg} = await DeleteStrategy(recordRef.current.ruleId).unwrap()
      if(success) {
        message.success('删除成功')
        wref.current.onCancel();
        getData()
      }else {
        message.warning(errMsg || '数据出错')
      }
    } catch (error) {
      
    }
   

}



//  编辑, 新增
const ruleIdRef = useRef({})
const onedit =(record) => {
    ruleIdRef.current = record.ruleId
    isadd.current=false
   let {ruleName,expectedPeriod, limitsAndLevels} = record;
   let arg =new Map()
   console.log(limitsAndLevels)
   limitsAndLevels.forEach(data => {

     arg.set([data.level.toString(), 'LimitValueMin'], data.limitValueMin)
     arg.set([data.level.toString(), 'LimitValueMax'], data.limitValueMax)

   })
  
  for(let [key, value] of arg) {
    console.log(key)
    form.setFieldValue(key, value)
  }

  setTitle(`编辑${ruleName}`)

  form.setFieldsValue({
    expectedPeriod: {label:ruleName, value: expectedPeriod },
   
  })
  ref.current.onOpen()
}






 const onAdd =() => {
  isadd.current=true
  setTitle('新增预警策略配置')
   ref.current.onOpen()
 }
  const CTitle = (
    <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
        <span>预警策略配置</span>
        <Space><CustButtonT text="new" onClick={onAdd} disabled={enableAdd.current}   /></Space>
    </div>
  )
 
  let [insertStrategy] = useInsertStrategyMutation()
  let [updateStrategy] = useUpdateStrategyMutation()

  const onOk = async () => {
      try {
        let values =  await form.validateFields()
        let {expectedPeriod: obj, ...rest} = values
        let {label,value} = obj;
         let limitsAndLevels = []
         for(let [key, values] of Object.entries(rest)) {
           let {LimitValueMin,LimitValueMax} = values
           let obj = {
             level: parseInt(key),
             limitValueMin: parseFloat(LimitValueMin),
             limitValueMax: parseFloat(LimitValueMax)
           }
           limitsAndLevels.push(obj)

         }
        let params =isadd.current ? {
          ruleName: label,
          expectedPeriod: value,
          enabled: 1,
          calculation: 0,
          limitsAndLevels,
        } : {
          ruleId: ruleIdRef.current,
          limitsAndLevels
        }
        let handler = [updateStrategy, insertStrategy][Number(isadd.current)]
        let {success, errMsg} = await handler(params).unwrap()
        if(success) {
          getData()
          ref.current.onCancel()
        }else {
          message.warning(errMsg || '数据出错')
        }
      } catch (error) {
        console.log(error)
      }
  }
  const rules = [
    {
      required: true
    }
  ]
  const onChange = (v) => {
    let max = (v-0.01).toFixed(2)
    form.setFieldValue(['2', 'LimitValueMax'],max)
  }
  const onChangel = (v) => {
    let max = (v+0.01).toFixed(2)
    form.setFieldValue(['2', 'LimitValueMin'],max)
  }
  return (
    <Pagecount bgcolor="transparent" pd="0">
     
    
          <Titlelayout title={CTitle} layout="flex">
            <Mainbox>               
               <Usetable columns={columns} dataSource={tableData} scroll={{x: 1648}} hbg="#ecf5ff" hbc="#515151" />
            
             </Mainbox>

          </Titlelayout>
    <CModal title={title} ref={ref} mold="cust" onOk={onOk} width={424} >
        <Form form={form}   preserve={false} labelCol={{span: 5}} labelAlign='left'>
        {isadd.current &&  <Form.Item label="预警类型" name="expectedPeriod"  initialValue={{label: disabledId.current == 0 ? '年度碳排放预警' : '月度碳排放预警', value: disabledId.current == 0 ? 1 : 0}}>
            <Select labelInValue>
                 <Select.Option value={0} disabled={disabledId.current == 0}>月度碳排放预警</Select.Option>
                 <Select.Option value={1} disabled={disabledId.current == 1}>年度碳排放预警</Select.Option>
              </Select>
          </Form.Item> }
           <Form.Item label="紧急  ≥" >
              <Space>
                <Form.Item name={['1', 'LimitValueMin']} rules={rules}>
                   <InputNumber min={0} style={{width: '100px'}} max={99.99} step={0.01} onChange={onChange} />
                </Form.Item>
                <strong>%</strong>
                <Form.Item name={['1', 'LimitValueMax']} noStyle initialValue={100}>
                   <InputNumber   type="hidden" style={{border: "none"}} />
                </Form.Item>
              </Space>  
           </Form.Item>
           <Form.Item label="严重"   >
                      <Space>
                         <Form.Item name={['2', 'LimitValueMin']} rules={rules}>
                             <InputNumber  style={{width: '100px'}} step={0.01} disabled />
                         </Form.Item>
                         <p>% ~</p>
                         <Form.Item name={['2', 'LimitValueMax']} >
                             <InputNumber  style={{width: '100px'}} step={0.01} disabled />
                         </Form.Item>
                      </Space>
           </Form.Item>
           <Form.Item label="一般  ≤" shouldUpdate>
            {
             ({getFieldValue}) => {
              let init = (getFieldValue(['2', 'LimitValueMax']) -0.02).toFixed(2)
               
               return (
                <Space>
                <Form.Item name={['3', 'LimitValueMax']} noStyle>
                     <InputNumber   style={{width: '100px'}} min={0.01} max={init} onChange={onChangel} />
                 </Form.Item>
                 <strong>%</strong>
                 <Form.Item name={['3', 'LimitValueMin']} noStyle initialValue={0}>
                     <InputNumber type="hidden" style={{border: "none"}} />
                 </Form.Item>                        
                </Space>
               )


             }


            }
                     
           </Form.Item>
           <Form.Item >
              <p style={{color: "#f00"}}>注：输入的值为已排放量占配额的百分比</p>
           </Form.Item>
        </Form>

     </CModal>
     <CModal title="删除预警策略" onOk={onDelOK} mold="cust" type="warn" ref={wref}>
     是否要删除{ruleName}策略？
     </CModal>
    </Pagecount>
  )
}
