import React, {useEffect, useState} from 'react'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import {Form, Select, Input, message, Drawer} from 'antd'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig'
import {
  useIndustryListQuery, 
  useSubIndustryListQuery, 
  useProvinceListQuery, 
  useNatureListQuery, 
  useEnterpriseQuery,
  useEmissionItemsQuery,
  useSaveEnterpriseMutation,
  useSaveItemsMutation, carbonSlice} from "@redux/carbon"
import Titlelayout from "@com/titlelayout"

import {CustButtonT} from "@com/useButton"
 
const {Item} = Form
const Mainbox = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 352px 1fr ;
  column-gap: 16px;
  .formbox {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px dotted #d7d7d7;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex:1;
  }
  .ant-form {
    flex: 1;
    .ant-form-item {
    margin-bottom: 16px;
  }
  }
 
`
export default function Index() { 
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const projectId = useSelector(selectProjectId)
  console.log(projectId)
  const [trigger, result, lastPromiseInfo] =carbonSlice.useLazySubIndustryListQuery()
  console.log(carbonSlice)
 // let [naturehander] =carbonSlice.useLazyEnterpriseQuery()

  const [SaveEnterprise, {isLoading}] =useSaveEnterpriseMutation()

  const {data:subindustry} = result?.data || {}
 
 
  const {data: {data: industry}} = useIndustryListQuery();

  const  {data: {data: province}} = useProvinceListQuery()
  const provinceList = Array.isArray(province) ? province.map(p => ({label:p, value:p})) : []

  const {data:{data:nature} } = useNatureListQuery()
  const natureList = Array.isArray(nature) ? nature.map(n => ({label:n, value:n})) : []
  const rules = [
    {required: true}
  ]
  const onchange = (no) => {
    trigger(no)
    
  }
  const {data: {data:enterprise} } = useEnterpriseQuery(projectId, { // 查询企业信息
    skip: !Number.isInteger(projectId),    
  })

  const [getEmission] = carbonSlice.useLazyEmissionItemsQuery()
  const saveE =async () => {  // 保存企业信息
      try {
          let values = await form.validateFields()
          if(isLoading) return;
          let {success, data, errMsg} = await  SaveEnterprise(values).unwrap()
          if(success) {
             let {id} = data;
             console.log(id)
             getEmission(id)
          //  refetch()
          }else {
             message.warning(errMsg || '数据出错')
          }
          console.log(data)
      } catch (error) {
        
      }
  }
   useEffect(() => {
    if(enterprise) {
       let {industryNo,subIndustryNo} = enterprise 
       if(Boolean(subIndustryNo)) trigger(industryNo)
       form.setFieldsValue({...enterprise})
       
    }
       
    }, [enterprise])  
  return (
    <Pagecount bgcolor="transparent" pd="0">
    
    <Mainbox>
          <Titlelayout title="企业基本信息" layout="flex">
            <div className='formbox'>
             <Form form={form} layout="vertical">
                 <Item label="所属行业" name="industryNo" rules={rules}  >
                     <Select options={industry} fieldNames={{label: "industryName", value: "industryNo"}} onChange={onchange} /> 
                 </Item>
             {(Array.isArray(subindustry) && subindustry?.length > 0) && <Item label="二级细分行业" name="subIndustryNo" rules={rules}  >
                     <Select options={subindustry} fieldNames={{label: "subIndustryName", value: "subIndustryNo"}} /> 
                 </Item>}
                 <Item label="所属区域" name="province" rules={rules} >
                     <Select options={provinceList}></Select>
                 </Item>
                 <Item label="企业名称" name="enterpriseName" rules={rules} >
                     <Input></Input>
                 </Item>
                 <Item label="单位性质" name="nature" rules={rules}  >
                     <Select options={natureList}></Select>
                 </Item>
                 <Item label="组织机构代码" name="creditcode"  >
                     <Input></Input>
                 </Item>
                 <Item label="法定代表人" name="legalRepresentative"  >
                     <Input></Input>
                 </Item>
                 <Item label="填报负责人" name="responsiblePerson"  >
                     <Input></Input>
                 </Item>
                 <Item label="联系人" name="contacts"  >
                     <Input></Input>
                 </Item>
                 <Item name="projectId" noStyle>
                    <Input type="hidden" />
                 </Item>
              
             </Form>
             <CustButtonT text="ok" wh="100%" onClick={saveE} loading={isLoading} />
             </div>
          </Titlelayout>
          <Drawer size={1304} open={open}>
            
          </Drawer>
       </Mainbox> 
    </Pagecount>
  )
}
