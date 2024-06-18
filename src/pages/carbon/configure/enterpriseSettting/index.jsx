import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import {Form, Select, Input, message, Drawer} from 'antd'
import {useSelector, useDispatch} from 'react-redux'
import {useOutletContext} from 'react-router-dom'
import {selectProjectId, getEnterprise,enterprise} from '@redux/systemconfig'
import {
  useIndustryListQuery, 
  useSubIndustryListQuery, 
  useProvinceListQuery, 
  useNatureListQuery, 
  useEnterpriseQuery,
  useEmissionItemsQuery,
  useSaveEnterpriseMutation,
  useSaveItemsMutation, 
  useCalcFactorQuery,
  carbonSlice} from "@redux/carbon"
import Titlelayout from "@com/titlelayout"
import {Carbon} from "@api/api.js"
import {CustButtonT, i18warning, i18success} from "@com/useButton"
import TableT from "./tabletmp"
import TableC from './tablecalc'
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
  const {enterpriseId} = useOutletContext()
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
    console.log(result)
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

  const updateEmission = async (enterpriseId) => {
    let {success: suc, data: emission, errMsg:err}  = await getEmission(enterpriseId).unwrap();
    if(suc) {
    //  setOpen(true)
      setEmissions([...emission])
      emission.forEach(e => {
        saveData.current[e.categoryName] = e.subCategory.map(s => ({...s,categoryId:e.categoryId}))           
      })
       
    }else {
      i18warning(err)
    }
    return suc
  }

// 获取企业计算因子

const factorRef = useRef([])
let {isSuccess: fsuc,  data: factorData, refetch, error}  = useCalcFactorQuery(enterpriseId, {
   skip: !Number.isInteger(enterpriseId)
})


 
 
const getFactorData = (sucs, factorData) =>  {
    try {
      if(sucs && isObject(factorData)) {
        let {success, data, errMsg} = factorData
        if(success && Array.isArray(data) && data.length >0) {
           factorRef.current = data;
        }else {
           if(!success) i18warning(errMsg);
           factorRef.current = data;
        }

      }
    } catch (error) {
      
    }
}

getFactorData(fsuc, factorData);
 
  // 保存=>关闭
 const onSave =async () => {
    setOpen(false)
    /*  let params = [];
     
     for(let [key, value] of Object.entries(saveData.current)) {
            value.forEach(v => {
              params.push({ ...v,categoryName:key, enterpriseId})
            })
     }
    let {success, errMsg} = await SaveItem(params).unwrap()
    if(success) {
      i18success('save')
    
      updateEmission()
    }else {
      i18warning(errMsg)
    } */

 }

  const Title = useMemo(() => (<div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
    <span>{title}</span>
    <CustButtonT text="cancel" ns="button"   onClick={onSave} /> 
  </div>), [title])
  const saveE =async () => {  // 保存企业信息 不需要 enterpriseId ?
    
      try {
          
           let rest = await form.validateFields()
           console.log(rest)
          let params ={projectId,  ...rest}
          console.log(params)
          let title = industry.find(i => i.industryNo == rest.industryNo)?.industryName
          setTitle(title)
          if(isLoading) return;
          console.log(params)
          let {success, data, errMsg} = await  SaveEnterprise(params).unwrap()
        
          if(success) {
                let {success, data,errMsg} = await Carbon.QueryCarbonEnterprise(projectId) // 更新企业信息
                if(success && isObject(data)) {
                  dispatch(getEnterprise(data))
                  let open = await  updateEmission(data.enterpriseId)
                  setOpen(open)
                }
        
              
             
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
            i18warning(errMsg)
             // message.warning(errMsg || '数据出错')
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
                 <Item label="组织机构代码" name="creditCode" rules={rules}  >
                     <Input></Input>
                 </Item>
                 <Item label="法定代表人" name="legalRepresentative" rules={rules} >
                     <Input></Input>
                 </Item>
                 <Item label="填报负责人" name="responsiblePerson" rules={rules} >
                     <Input></Input>
                 </Item>
                 <Item label="联系人" name="contacts" rules={rules} >
                     <Input></Input>
                 </Item>
               
                 <Item name="enterpriseId" noStyle>
                     <Input type="hidden" />
                 </Item>
             </Form>
             <CustButtonT text="ok" wh="100%" onClick={saveE} loading={isLoading} />
             </div>
          </Titlelayout>
         {open && (<Titlelayout   title={Title} layout="flex"  key="value" style={{height: "833px", overflowY: "auto"}}>
                       <Tablebox>
                       {emissions?.length > 0 && emissions.map((e,index) => <TableT tabledata={e} key={e.categoryId} saveData={saveData.current} enterpriseId={enterpriseId}  /> )}

                       {factorRef.current?.length > 0 && factorRef.current.map((f,index) => <TableC key={f.categoryId}  tabledata={f} enterpriseId={enterpriseId}  /> ) }
                       </Tablebox>
          </Titlelayout>)
          }
       </Mainbox>  
    </Pagecount>
  )
}
