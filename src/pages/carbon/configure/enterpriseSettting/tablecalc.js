import React, {useState, useRef, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import styled from 'styled-components'
import {Space,Form, InputNumber, Table} from 'antd'
import Usetable from '@com/useTable'
import {CustLink,i18success, i18warning} from '@com/useButton'
import CModal from "@com/useModal"
import {useSaveCalculationFactorValueMutation, useDeleteCalculationFactorMutation} from "@redux/carbon"
const Tablebox = styled.div`
  flex:1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 16px;
  padding-top: 16px;
  overflow-y: auto;
`
export default function Index({tabledata={},refetch}) { 
  const {t} = useTranslation(['button', 'comm'])
  const [form] = Form.useForm()
  const ref = useRef()
  const {categoryName, categoryNo,    subCategoryFactor=[]} = tabledata
  
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
      let data = await deleteCalcu(delIdRef.current);
      console.log(data)
   }


  const showOncell = (_,index) => {
    if(index == 0) {
      return  ({style: {backgroundColor: "#e7effd"}})
     }
  }
  const columns = [
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
      width: 150,
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
      onCell: showOncell
    },
    {
      
      title: '数值',
      dataIndex: 'parameterValue',
      key: 'parameterValue',
      align: 'center',
      onCell: showOncell
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      align: 'center',
      onCell: showOncell
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

  ]
 
  
  return (
    <div>
    <Usetable columns={columns} dataSource={formartData} showHeader={false}  summary={(pageData) =>{ 
      console.log(pageData)
      return (
        <Table.Summary >
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={6}>This is a summary content</Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      )}} />  
     <CModal title="编辑计算因子" ref={ref} mold="cust" onOk={onOk} width={480}>
        <Form form={form}   preserve={false}>
           <Form.Item label={labelunit.label} name="parameterValue">
                <InputNumber min={0} style={{width: '100%'}} addonAfter={labelunit.unit} />
           </Form.Item>
        </Form>

     </CModal>
     <CModal title="删除" onOk={onDelOK} mold="cust" type="warn" ref={wref}>
     确认删除该类型计算因子？
     </CModal>
    </div>
  )
}
