import React, {useEffect, useState} from 'react'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import {Form, Select, Input} from 'antd'
import {
  useIndustryListQuery, 
  useSubIndustryListQuery, 
  useProvinceListQuery, 
  useNatureListQuery, 
  useEnterpriseQuery,
  useEmissionItemsQuery,
  useSaveEnterpriseMutation,
  useSaveItemsMutation,} from "@redux/rtkquery"
import Titlelayout from "@com/titlelayout"
import {apiSlice} from "@redux/rtkquery"
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
/*   const [form] = Form.useForm()
  const [no, setNo] = useState()
  const {data: {data: industry}} = useIndustryListQuery();
  const  {data: province, refetch} = useProvinceListQuery()
  const provinceList = Array.isArray(province) ? province.map(p => ({label:p, value:p})) : []
   
  console.log(apiSlice)
  const rules = [
    {required: true}
  ]
  const onchange = (no) => {
       setNo(no)
    
  }
  useEffect(() => {
    if(!no) return
    useSubIndustryListQuery(no)
  }, [no]) */
  return (
    <Pagecount bgcolor="transparent" pd="0">
      碳排市场
      {/*  <Mainbox>
          <Titlelayout title="企业基本信息" layout="flex">
            <div className='formbox'>
             <Form form={form} layout="vertical">
                 <Item label="所属行业" name="industryNo" rules={rules}  >
                     <Select options={industry} fieldNames={{label: "industryName", value: "industryNo"}} onChange={onchange} /> 
                 </Item>
                 <Item label="二级细分行业" name="subIndustryNo" rules={rules}  >
                     <Select options={industry} fieldNames={{label: "industryName", value: "industryNo"}} /> 
                 </Item>
                 <Item label="所属区域" name="province" rules={rules} >
                     <Select options={provinceList}></Select>
                 </Item>
                 <Item label="企业名称" name="enterpriseName" rules={rules} >
                     <Input></Input>
                 </Item>
                 <Item label="单位性质" name="nature" rules={rules} >
                     <Select></Select>
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
                
             </Form>
             <CustButtonT text="ok" wh="100%" onClick={refetch} />
             </div>
          </Titlelayout>
       </Mainbox> */}
    </Pagecount>
  )
}
