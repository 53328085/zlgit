import React, {useState, useContext,  useEffect, useMemo} from "react";

import { Form, Select,  Space, Divider, message} from "antd";
import styled from "styled-components";
 
import {useSelector, useDispatch} from 'react-redux'
import {levelDefaultLabel,selectProjectId, selectOneLevelDefaultId, selectOneLevel, setCurrentlevel, deviceStyle} from '@redux/systemconfig.js'


import {SiteManagerDesigner, PCSMonitorRuntime} from '@api/api'
import {Cdivider} from '@com/comstyled'
import CustContext from "@com/content";

import Enery from "./enery";
const Cform = styled(Form)`
    background: #fff;
    padding: 7px 16px;
    border-top: 1px solid #dedede;
    border-bottom: 1px solid #dedede;
    height: max-content;
    display: flex;
   &&{
    .ant-form-item {
        margin: 0px;
    }
   } 
`

 

const { Item } = Form;

export const AreaSelect = ({value, onChange, ...otherProps}) => {
  const levelone = useSelector(selectOneLevel)
   return (
    <Select  {...otherProps} defaultValue={value} onChange={onChange} options={levelone} fieldNames={{label: 'name', value: 'id', options: 'options'}}>
         
    </Select>
   )

}
// 1.  全部的问题， 2. areaId 全站状态保存， 3.默认值的问题
export default function UseSerach(props) {
  const {handler, sitehandler, form: forms,  isSite=false, isPcs=false, isAreaId=true, pcshandler, custview, isEngry=false, initialValue} = useContext(CustContext) || {}
  //const {printArea, setPrintArea} = useState()
 
  const dispatch = useDispatch()
  const [form] =forms ? [forms] : Form.useForm()
  const projectId = useSelector(selectProjectId)
  const varlabel = useSelector(levelDefaultLabel) 
  const oneLevelDefaultId = useSelector(selectOneLevelDefaultId) // 选择后的值
 
  let [AreaID, setAreaid] = useState(props.isall=="visible" ? 0 : oneLevelDefaultId) 
  const levelone = useSelector(selectOneLevel)
  const levels = useMemo(() =>props.isall=="visible" ?  [...levelone, {name: `${varlabel}(全部)`, id: 0}] : levelone, [props.isall, levelone] ) 
 
  const [options, setOptions] = useState([])
  const [pcsoptions, setPcsoptions] = useState([])
  const deviceStyles = useSelector(deviceStyle)
  const onChange = (e, option) => {    
    console.log(option) 
    dispatch(setCurrentlevel(option))
    setAreaid(e)
 }
 
 
const deviceStyleNode = (<Item name="deviceStyle" label="表计类型">

<Select options={deviceStyles} fieldNames={{label: "name", value: "deviceStyle"}} style={{width: '200px'}} ></Select>  
</Item>)
  const site = (<Item name="stationName" label="站点选择" >
              <Select options={options} fieldNames={{label: 'name', value: 'name'}} style={{width: '264px'}} ></Select>  
             </Item>)
  const pcs = (<Item name="pcsId" label="PCS选择" >
              <Select options={pcsoptions} fieldNames={{label: 'sn', value: 'id'}} style={{width: '264px'}} ></Select>  
             </Item>)
  const getpcs = async () => {
    try {
      let containerId = 0
      let siteId = options[0]?.id
     let {success, data} = await PCSMonitorRuntime.queryPCSList(projectId, AreaID, siteId, containerId) 
     if(success && Array.isArray(data) && data.length > 0) {
       setPcsoptions(data)
       form.setFieldsValue({
        pcsId: data[0].id
       })
       pcshandler &&  pcshandler(data[0])
     }else {
       setPcsoptions([])
       form.setFieldsValue({
        pcsId: null
       })
       sitehandler && sitehandler({})
     }
    } catch (error) {
      console.log(error)
    }
   
  }
  useEffect(() => { 
    if(levelone.length < 1) message.error('当前项目尚未创建园区!')
  }, [])
 
 useEffect(() => {
    if(options?.length > 0 && AreaID && projectId) {
      getpcs()
    }
 }, [options, AreaID, projectId])  


  const getopti = async() => {
    try {
     let {success, data} = await  SiteManagerDesigner.FindSiteList(projectId, AreaID)
     if(success&& Array.isArray(data) && data.length > 0) {
       setOptions([...data])     
       form.setFieldsValue({
        stationName: data[0].name
       })
       sitehandler &&  sitehandler(data[0])
     }else {
      setOptions([])    
      form.setFieldsValue({
        stationName: ''
       })
       sitehandler && sitehandler({})
     }
    } catch (error) {
      console.log(error)
    }
   
  }
  useEffect(() => {
      if(projectId && AreaID && isSite) {
        getopti()
      }    
  
  }, [projectId, AreaID, isSite])
 
  const onValuesChange = (changedValues, allValues) => {   
    let key = Object.keys(changedValues)[0]
     if(key !== 'areaId') {
         props.setexparams({...changedValues})
     }   
  }
  useEffect(() => {
    if(props.config?.isdevsty) {
      form.setFieldsValue({'areaId': AreaID, 'deviceStyle': deviceStyles[0]?.deviceStyle??null})
    }else {
      form.setFieldsValue({'areaId': AreaID})
    }
   
  }, [props.config])

  useEffect(() => {
   form.setFieldsValue({
    ...initialValue,
   })
  }, [initialValue])
  return (  
  
    <Cform layout="inline"   form={form}   {...props.formprop} onValuesChange={onValuesChange} >
      <Space size={64} split={ <Cdivider />}>
      {isAreaId && <Item label={varlabel} name='areaId'>
        <Select style={{ width: "200px" }} onChange={onChange} options={levels} fieldNames={{label: 'name', value: 'id', options: 'options'}}>
         
        </Select>
     
         </Item>
          }
        {isSite && site}
        {isPcs && pcs}
        {props.config?.isdevsty && deviceStyleNode}

      </Space>
       
        {
           props.custview? props.custview : custview
        }
   
    </Cform>
  
    
  );
}
