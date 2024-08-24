import React, {useState, useRef, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import styled from 'styled-components'
import {Space,Form, InputNumber, Table, Checkbox, Input, Typography} from 'antd'
import Usetable from '@com/useTable'
import {CustLink,i18success, i18warning, CustButton} from '@com/useButton'
import CModal from "@com/useModal"
import {Carbon} from "@api/api.js"
import {isObject} from "@com/usehandler"
import {useSaveCalculationFactorValueMutation, useDeleteCalculationFactorMutation, useFactorListQuery, useAddFactorMutation} from "@redux/carbon"
const {Text} = Typography;
export default function Index({tabledata={},enterpriseId}) { 
  const {t} = useTranslation(['button', 'comm'])
  const [form] = Form.useForm()
  const ref = useRef()
  const {categoryName, categoryNo,    subCategoryFactor=[], mark} = tabledata   // mark 1是直接显示，0是加上增删改
  
  let fixedrow ={categoryName,categoryNo,subCategoryName: `${categoryName}排放类型`,factorName: '计算因子类型',parameterValue: '数值', unit: '单位', option: t("comm:Operation")}  
  let formartData = [fixedrow]
  let categorySpan=1
  subCategoryFactor.forEach(tb => {
     let {subCategoryName, categoryCalculationFactor} = tb
     let rowspan = categoryCalculationFactor.length;
     categorySpan+=rowspan;
     let items = categoryCalculationFactor.map((cate,index) => {
       if(rowspan > 1 )  {
         return index == 0  ? ({subCategoryName,categoryName, categoryNo, ...cate,[subCategoryName]:rowspan}) :({categoryNo, ...cate})
       }else if(rowspan == 1) {
        return  ({subCategoryName,categoryName, categoryNo, ...cate,[subCategoryName]:rowspan})
       }
    })
     formartData = [...formartData,...items]

  })

 

  const [datas, setDatas] =useState([])
  const [labelunit, setLabelUnit] = useState({
    label:'',
    unit: ''
  })
  
  // 修改
  const idRef = useRef()
  const onChange = (record, index) => {
     let {unit,factorName, parameterValue,id} = record
     idRef.current = id;
     setLabelUnit({
      label: factorName,
      unit,
     })
    form.setFieldValue('parameterValue', parameterValue);
    ref.current.onOpen()
  }
 
  const [saveFactor] = useSaveCalculationFactorValueMutation()
  const onOk =async () => {
   
    try {
      let {parameterValue} = await form.validateFields()


      let {data} = await  saveFactor({id: idRef.current, parameterValue})
      console.log(data)
      let {success , errMsg} = data || {}
      if(success ) {
         
        i18success("modify")
      //  refetch()
      }else {
        i18warning(errMsg)
      }
       
      ref.current.onCancel()
    } catch (error) {
      console.log(error)
    }
     
  }

 // 删除
  const [deleteCalcu] = useDeleteCalculationFactorMutation()
  const delIdRef = useRef()
  const wref = useRef()
  const onDlete =({id}) => {
      delIdRef.current = id;
      wref.current.onOpen()
  }
   const onDelOK =  async () => {
      try {
        let {data:{success, errMsg}} = await deleteCalcu(delIdRef.current);
       if(success) {
         wref.current.onCancel()
         i18success('delete')
       
       }else {
         i18warning(errMsg)
       }
      } catch (error) {
        console.log(error)
      }
      
   }


  const showOncell = (_,index) => {
    if(index == 0) {
      return  ({style: {backgroundColor: "#e7effd"}})
     }
  }

// 新增因子
const [nform] = Form.useForm()
const nwref = useRef()
 
const [listItem ,setlistItem] = useState([])
/*  const {isSuccess, data:listData} = useFactorListQuery(params, {
   skip: !(Number.isInteger(params.enterpriseId) && params.categoryNo)
 }) */

const params = useRef()
const getListData = async (categoryNo ) => {
 params.current = {
  enterpriseId, 
  categoryNo,
  
 } 
 try {
  let {success, data,errMsg} = await  Carbon.QueryAddCarbonCalculationFactor(params.current)
  if(success && isObject(data)) {
    let {calculationFactors} = data;
    if(Array.isArray(calculationFactors)) {
      setlistItem(calculationFactors)
    }else {
      setlistItem([])
    }
   
    nwref.current.onOpen()
  }else {
   if(!success) i18warning(errMsg)
   setlistItem([])
  }
 } catch (error) {
   console.log(error)
 }


}

 

const [addfactor] = useAddFactorMutation()
const onAddOk = async () => {
    try {
      const calculationFactors = [];
      const {subCategoryName, ...rest} = await nform.validateFields();
      for(let [key, obj] of Object.entries(rest)) {
         let {factorName, parameterValue} = obj
         if(factorName && parameterValue) {
           calculationFactors.push({factorName: key, parameterValue})
         }
      }
      if(calculationFactors.length <1) return i18warning('请选择计算因子类型并输入值')
      let body = {
        ...params.current,
        subCategoryName,
        calculationFactors,
      }
      let {data: {success, errMsg}} = await addfactor(body)
      if(success) {
         i18success("new")
       //  nwref.current.onCancel();
      }else {
        i18warning(errMsg)
      }
    } catch (err) {
      
    }
 // addfactor()
}

 

  const columns =mark == 0 ? [
    {
      title:categoryName,
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 200,      
      onCell: (_, index) => {      
      if(index == 0) {
       return  ({ rowSpan: categorySpan , style: {backgroundColor: "#e7effd"}})
      }else {
        return {rowSpan: 0}
      }
     
    }
    },
    {
      title: '排放类型',
      dataIndex: 'subCategoryName',
      key: 'subCategoryName',
      align: 'center',
      width: 178,
      onCell:(record, index) => {
        let {subCategoryName} = record || {}
        if(index == 0) {
          return {
            style: {backgroundColor: "#e7effd"}
          }
        }else if(index > 0 ) {
          return  subCategoryName ? {
             rowSpan: record[subCategoryName]
          }: {
            rowSpan:0
          }
        } 
         

      } 
    },
    {
      title: '计算因子',
      dataIndex: 'factorName',
      key: 'factorName',
      align: 'factorName',
      onCell: showOncell,
      width:270,
    },
    {
      
      title: '数值',
      dataIndex: 'parameterValue',
      key: 'parameterValue',
      align: 'center',
      onCell: showOncell,
      width:125,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      align: 'center',
      onCell: showOncell,
      width:280,
    },
   
     
  {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      onCell: showOncell,
      render: (_, record, index) => index>0 ?  <Space size={32}>
        <CustLink text="modify"   onClick={() => onChange(record, index)} />
        <CustLink text="delete"   type="danger" onClick={() => onDlete(record)} />
      </Space>
      :  t("comm:Operation")
    } 

  ] : [
    {
      title:categoryName,
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 200,      
      onCell: (_, index) => {      
      if(index == 0) {
       return  ({ rowSpan: categorySpan , style: {backgroundColor: "#e7effd"}})
      }else {
        return {rowSpan: 0}
      }
     
    }
    },
    {
      title: '排放类型',
      dataIndex: 'subCategoryName',
      key: 'subCategoryName',
      align: 'center',
      width: 178,
      onCell:(record, index) => {
        let {subCategoryName} = record || {}
        if(index == 0) {
          return {
            style: {backgroundColor: "#e7effd"}
          }
        }else if(index > 0 ) {
          return  subCategoryName ? {
             rowSpan: record[subCategoryName]
          }: {
            rowSpan:0
          }
        } 
         

      } 
    },
    {
      title: '计算因子',
      dataIndex: 'factorName',
      key: 'factorName',
      align: 'factorName',
      onCell: showOncell,
      width:386,
    },
    {
      
      title: '数值',
      dataIndex: 'parameterValue',
      key: 'parameterValue',
      align: 'center',
      onCell: showOncell,
      width:160,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      align: 'center',
      onCell: showOncell
    }
  ]
 
  
  return (
    <div>
  {mark == 0 ?  <Usetable columns={columns} dataSource={formartData} showHeader={false}  summary={(pageData) =>{       
      let {subCategoryName, categoryNo } = (Array.isArray(pageData) && pageData.length > 0) ? pageData[0] : {}
      return (
        <Table.Summary >
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={6}>
                <div style={{display: 'flex', justifyContent: "center"}}>
                <CustButton src="new"   wh="auto" onClick={() => getListData(categoryNo, subCategoryName)}   >{subCategoryName}</CustButton>
                </div>
              
          </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      )}} />  
      : <Usetable columns={columns} dataSource={formartData} showHeader={false}   />  
}
     <CModal title="编辑计算因子" ref={ref} mold="cust" onOk={onOk} width={480}>
        <Form form={form}   preserve={false}>
           <Form.Item label={labelunit.label} name="parameterValue">
                <InputNumber min={0} style={{width: '100%'}} addonAfter={labelunit.unit} />
           </Form.Item>
        </Form>

     </CModal>

     <CModal title="新增排放类型" ref={nwref} mold="cust" onOk={onAddOk} width={480} custft >
        <Form form={nform}   preserve={false} layout="vertical">
           <Form.Item label="生产过程排放类型名称" name="subCategoryName" rules={[{required: true}]}>
                <Input   style={{width: '100%'}}   />
           </Form.Item>
           <Form.Item label="选择计算因子类型">
                {
                listItem.length> 0  ? listItem.map(item => {
                    const {factorName, unit} = item
                    return (<div style={{display: 'flex', justifyContent: "space-between", marginBottom: "22px"}}>
                         <Form.Item name={[`${factorName}`, 'factorName']} valuePropName="checked" noStyle>
                             <Checkbox  >{factorName}</Checkbox>
                         </Form.Item>
                         <div style={{flexBasis: "250px"}}>
                         <Form.Item name={[`${factorName}`, 'parameterValue']} noStyle>
                              <InputNumber min={0}   addonAfter={unit} style={{width: "100%"}} />
                         </Form.Item>
                         </div>
                      </div>)
                  }) :  <Text type="warning">没有计算因子类型</Text>
                }
           </Form.Item>
        </Form>

     </CModal>

     <CModal title="删除" onOk={onDelOK} mold="cust" type="warn" ref={wref}>
     确认删除该类型计算因子？
     </CModal>
    </div>
  )
}
