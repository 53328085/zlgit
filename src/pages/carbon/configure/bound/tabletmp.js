import React, {useState, useRef, useEffect, useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import styled from 'styled-components'
import {Switch,Form, InputNumber, Radio, message} from 'antd'
import Usetable from '@com/useTable'
import {CustLink,} from '@com/useButton'
import CModal from "@com/useModal"

const Tablebox = styled.div`
  flex:1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 16px;
  padding-top: 16px;
  overflow-y: auto;
`
export default function Index({tabledata,saveData,projectId,enterpriseId,displaydraw}) { 
  const {t} = useTranslation(['button', 'comm'])
  const [form] = Form.useForm()
  const ref = useRef()
  const {categoryName, dataSubCategoryVos=[],categoryId} = tabledata
  const rowspan = Array.isArray(dataSubCategoryVos) ?dataSubCategoryVos.length + 1 : 1
  const title = `编辑${categoryName}因子数值`;
  let fixedrow ={categoryName,subCategoryName:'参数类型', dataSource: '',  option: '', categoryId}   
  // const [datas, setDatas] =useState([fixedrow,...dataSubCategoryVos.map((c) => ({categoryName, categoryId,...c}))])
  const datas = useMemo(() => {
    const {dataSubCategoryVos=[]} = tabledata
    return [fixedrow,...dataSubCategoryVos.map((c) => ({categoryName, categoryId,...c}))]
  }, [tabledata])
  console.log(datas)
 
 // 配置
 
 
  const onConfig = async (record, index) => {     
     let {categoryId,subCategoryId} = record
     let params = {
      projectId,
      enterpriseId,
      subCategoryId,
      carbonBoundaryId:categoryId
     }
     displaydraw(params)

  }
  const indexref = useRef()
/*   const onChange = (record, index) => {
     indexref.current = index
    form.setFieldValue('pre', record.carbonEmissionFactor);
    ref.current.onOpen()
  } */
  const radioChange = (v, index) => {
     try {
      let newDatas = datas.slice().map(d => ({...d}))
      newDatas[index].dataSource= Number(v);
    //  setDatas(newDatas)
      console.log(newDatas)
      let arr = newDatas.slice(1).map(d => ({subCategoryId: d.subCategoryId, subCategoryName: d.subCategoryName, dataSource: d.dataSource}))
      saveData[categoryName]= {
       dataSubCategoryVos: arr,
       categoryId, 
       categoryName,
      }
     } catch (error) {
       console.log(error)
     }
    
  }
  const onOk = () => {
   
    try {
      let value = form.getFieldValue('cur')      
      let newDatas = datas.slice().map(d => ({...d}))
      newDatas[indexref.current].carbonEmissionFactor = value;
     // setDatas(newDatas)
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
       return  ({ rowSpan: rowspan, style: {backgroundColor: "#e7effd"}})
      }else {
        return {rowSpan: 0}
      }
     
    }
    },
    {
      title: '参数类型',
      dataIndex: 'subCategoryName',
      key: 'subCategoryName',
      align: 'center',
      onCell: showOncell
    },
    {
      title: '',
      dataIndex: 'dataSource',
      key: 'dataSource',
      align: 'center',
      onCell: showOncell,
      render: (text, record,index) => {
         console.log(text)
        return  index> 0 ?  <Radio.Group onChange={(e) => radioChange(e.target.value, index)} defaultValue={text} style={{display: 'flex', justifyContent: "space-around"}}>
        <Radio value={2}>自动采集</Radio>
        <Radio value={1}>手动录入</Radio>
        <Radio value={0}>无数据录入</Radio>
      </Radio.Group> : ''
      }
    },
    {
      title: '',
      dataIndex: 'option',
      key: 'option',
      onCell: showOncell,
      render: (_, record, index) => index>0 ? <CustLink text="configure" disabled={record.dataSource!==2} onClick={() => onConfig(record, index)} /> :  ''
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
