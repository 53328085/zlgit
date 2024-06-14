import React, {useState, useRef, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import styled from 'styled-components'
import {Switch,Form, InputNumber} from 'antd'
import Usetable from '@com/useTable'
import {CustLink, i18success, i18warning} from '@com/useButton'
import CModal from "@com/useModal"
import {useEnableCarbonMutation, useUpdateFactorMutation} from "@redux/carbon"
const Tablebox = styled.div`
  flex:1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 16px;
  padding-top: 16px;
  overflow-y: auto;
`
export default function Index({tabledata,saveData, enterpriseId}) { 
  const {t} = useTranslation(['button', 'comm'])
  const [form] = Form.useForm()
  const ref = useRef()
  const {categoryName, categoryId,    subCategory} = tabledata
  const title = `编辑${categoryName}因子数值`;
  let fixedrow ={categoryName,subCategoryName:'排放类型', unit: '单位',carbonEmissionFactor: '数值', option: t("comm:Operation")}   
  const [datas, setDatas] =useState([fixedrow,...subCategory.map((c) => ({categoryName,categoryId, ...c}))])

  
  const recordRef = useRef()
  const indexref = useRef()
  const onChange = (record, index) => {
     recordRef.current = record
     indexref.current = index
    form.setFieldValue('pre', record.carbonEmissionFactor);
    ref.current.onOpen()
  }
  const [onEanble] =useEnableCarbonMutation()
  const swichange = async (v, index,record) => {
    try {
      let {categoryId, subCategoryId,enabled} = record
      let params = {
        categoryId,
        SubCategoryId: subCategoryId,
        enabled,
        enterpriseId:enterpriseId
      }
      let {success, errMsg} = await  onEanble(params).unwrap()
    
      if(success) {
           i18success("modify")
      }else {
        i18warning(errMsg)
      }
      let newDatas = datas.slice().map(d => ({...d}))
      newDatas[index].enabled= Number(v);
      setDatas(newDatas)
      saveData[categoryName]=newDatas.slice(1)
    } catch (error) {
      
    }
     
  }

  const [onUpdateFactor] = useUpdateFactorMutation()
  const onOk = async () => {
   
    try {
      let value = form.getFieldValue('cur')
      let {categoryId, subCategoryId} = recordRef.current
      let params = {
        categoryId,
        SubCategoryId: subCategoryId,
        carbonEmissionFactor:value,
        enterpriseId:enterpriseId
      }
    //  let data = await onUpdateFactor(params).unwrap() 没有发布
       
      let newDatas = datas.slice().map(d => ({...d}))
      newDatas[indexref.current].carbonEmissionFactor = value;
      setDatas(newDatas)
      saveData[categoryName]=newDatas.slice(1)
      ref.current.onCancel()
    } catch (error) {
      console.log(error)
    }
     
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
      onCell: (_, index) => {      
      if(index == 0) {
       return  ({ rowSpan: subCategory?.length + 1 , style: {backgroundColor: "#e7effd"}})
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
      
      title: '数值',
      dataIndex: 'carbonEmissionFactor',
      key: 'carbonEmissionFactor',
      align: 'center',
      onCell: showOncell
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
      key: 'enabled',
      align: 'center',
      onCell: showOncell,
      render: (text, record,index) => {        
        return  index> 0 ? <Switch checkedChildren={t("button:enable")} unCheckedChildren={t("button:disable")} defaultChecked={record.enabled==1} onChange={(v)=> swichange(v, index, record)} /> : '是否启用'
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      onCell: showOncell,
      render: (_, record, index) => index>0 ? <CustLink text="Modificationfactor" onClick={() => onChange(record, index)} /> :  t("comm:Operation")
    }

  ]
 
  
  return (
    <div>
    <Usetable columns={columns} dataSource={datas} showHeader={false} />  
     <CModal title={title} ref={ref} mold="cust" onOk={onOk} width={480}>
        <Form form={form}   preserve={false}>
           <Form.Item label="原数值" name="pre">
                <InputNumber min={0} style={{width: '100%'}} disabled/>
           </Form.Item>
           <Form.Item label="新数值" name="cur">
                <InputNumber min={0} style={{width: '100%'}} step={0.01} />
           </Form.Item>
        </Form>

     </CModal>
    </div>
  )
}
