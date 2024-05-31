import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import {Form, Select, Input, message, Drawer} from 'antd'
import {useSelector, useDispatch} from 'react-redux'
import {selectProjectId, getEnterprise,enterprise} from '@redux/systemconfig'
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
import TableT from "./tabletmp"
import {isObject} from "@com/usehandler"
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
const Tablebox = styled.div`
  flex:1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 16px;
  padding-top: 16px;
  overflow-y: auto;
`
 
export default function Index() { 
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const projectId = useSelector(selectProjectId)
  const [emissions, setEmissions] = useState([])
  let saveData =useRef({})

  
 // 保存企业信息

  const [SaveEnterprise, {isLoading}] =useSaveEnterpriseMutation()
  
  const [SaveItem, {isLoading: itemloading}] = useSaveItemsMutation()

  // 所属行业

  let industry = []; 
  const {data:industryData, isSuccess} = useIndustryListQuery();
  if(isSuccess) {
    industry= industryData?.data ?? []
    
  }
   
    // 二级行业

    const [trigger, result, lastPromiseInfo] =carbonSlice.useLazySubIndustryListQuery()
    
    const {data:subindustry, success} = result?.data || {}
 
    useEffect(() => {
      if(success && Array.isArray(subindustry) && subindustry.length >0) {
        form.setFieldValue('subIndustryNo', subindustry[0].subIndustryNo)
      }
    }, [subindustry])

  // 所属地区

  let provinceList = []
  const  {data: provinceData, isSuccess: prsuc}= useProvinceListQuery()
  if(prsuc) {
    provinceList = provinceData?.data?.map(p => ({label:p, value:p})) ?? []
  }
 
 // 单位性质

  let natureList = []
  const  {data:natureData, isSuccess: nasuc}  = useNatureListQuery()  
  if(nasuc) {
    natureList =natureData?.data?.map(n => ({label:n, value:n})) ?? []
  }
 
  const rules = [
    {required: true}
  ]
  const onchange = (no) => {
    setOpen(false)
    setEmissions([])
    trigger(no)
    
  }

  // 查询企业信息

  const Enterprise = useSelector(enterprise)

 
  //  获取企业碳排项信息
  const [getEmission] = carbonSlice.useLazyEmissionItemsQuery()

  const updateEmission = async () => {
    let {success: suc, data: emission, errMsg:err}  = await getEmission(Enterprise.id).unwrap();
    if(suc) {
    //  setOpen(true)
      setEmissions([...emission])
      emission.forEach(e => {
        saveData.current[e.categoryName] = e.subCategory.map(s => ({...s,categoryId:e.categoryId}))           
      })
       
    }else {
      message.warning(err || "数据出错")
    }
    return suc
  }
 
  // 保存
 const onSave =async () => {
     let params = [];
     
     for(let [key, value] of Object.entries(saveData.current)) {
            value.forEach(v => {
              params.push({ ...v,categoryName:key, enterpriseId: Enterprise.id})
            })
     }
    let {success, errMsg} = await SaveItem(params).unwrap()
    if(success) {
      message.success("保存成功")
      updateEmission()
    }else {
      message.warning(errMsg || '数据出错')
    }

 }

  const Title = useMemo(() => (<div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
    <span>{title}</span>
    <CustButtonT text="save" ns="button" loading={itemloading} onClick={onSave} /> 
  </div>), [title])
  const saveE =async () => {  // 保存企业信息 不需要 enterpriseId ?
      try {
          let {id, ...rest} = await form.validateFields()
          let params ={enterpriseId:id, ...rest}
          let title = industry.find(i => i.industryNo == rest.industryNo)?.industryName
          setTitle(title)
          if(isLoading) return;
          let {success, data, errMsg} = await  SaveEnterprise(params).unwrap()
          if(success && isObject(data)) {
     
              let {enterpriseId, ...post} = data 
              dispatch(getEnterprise({id:enterpriseId, ...post})) // 更新企业信息
              let open = await  updateEmission()
              setOpen(open)
           /*  let {success: suc, data: emission, errMsg:err}  = await getEmission(id).unwrap();
            if(suc) {
              setOpen(true)
              setEmissions([...emission])
              emission.forEach(e => {
                saveData.current[e.categoryName] = e.subCategory.map(s => ({...s,categoryId:e.categoryId}))           
              })
               
            }else {
              message.warning(err || "数据出错")
            } */
          
          }else {
            dispatch(getEnterprise({}))
             message.warning(errMsg || '数据出错')
          }
         
      } catch (error) {
        console.log(error)
      }
  }
 
    useEffect(() => {
    if(Enterprise) {
       let {industryNo,subIndustryNo} = Enterprise 
       if(Boolean(subIndustryNo)) trigger(industryNo)
       form.setFieldsValue({...Enterprise})
       
    }
       
    }, [Enterprise]) 
  return (
    <Pagecount bgcolor="transparent" pd="0">
    
    <Mainbox >
         <Titlelayout title="企业基本信息" layout="flex" key="info">
            <div className='formbox'>
             <Form form={form} layout="vertical">
                 <Item label="所属行业" name="industryNo" rules={rules}  >
                     <Select options={industry} fieldNames={{label: "industryName", value: "industryNo"}} onChange={onchange}  /> 
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
                 <Item label="组织机构代码" name="creditCode"  >
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
                 <Item name="id" noStyle>
                     <Input type="hidden" />
                 </Item>
             </Form>
             <CustButtonT text="ok" wh="100%" onClick={saveE} loading={isLoading} />
             </div>
          </Titlelayout>
         {open && (<Titlelayout   title={Title} layout="flex"  key="value">
                       <Tablebox>
                       {emissions?.length > 0 && emissions.map((e,index) => <TableT tabledata={e} key={e.categoryId} saveData={saveData.current} /> )}
                       </Tablebox>
          </Titlelayout>)
          }
       </Mainbox>  
    </Pagecount>
  )
}
