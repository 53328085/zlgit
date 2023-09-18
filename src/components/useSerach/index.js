import React, {useState, useContext,  useEffect} from "react";

import { Form, Select,  Space, Divider, message} from "antd";
import styled from "styled-components";
 
import {useSelector, useDispatch} from 'react-redux'
import {levelDefaultLabel,selectProjectId, selectOneLevelDefaultId, selectOneLevel, setCurrentlevel} from '@redux/systemconfig.js'


import {SiteManagerDesigner, PCSMonitorRuntime} from '@api/api'

import CustContext from "@com/content";

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

export default function UseSerach(props) {
  const {handler, sitehandler, form: forms,  isSite=false, isPcs=false, pcshandler, custview, initialValue} = useContext(CustContext) || {}
  //const {printArea, setPrintArea} = useState()
  const dispatch = useDispatch()
  const [form] =forms ? [forms] : Form.useForm()
  const projectId = useSelector(selectProjectId)
  const varlabel = useSelector(levelDefaultLabel) 
  const oneLevelDefaultId = useSelector(selectOneLevelDefaultId)
  let [AreaID, setAreaid] = useState(oneLevelDefaultId)
  const levelone = useSelector(selectOneLevel)
  
  const [options, setOptions] = useState([])
  const [pcsoptions, setPcsoptions] = useState([])

  const onChange = (e, option) => {
    dispatch(setCurrentlevel(option))
    setAreaid(e)
    if (typeof handler == 'function') {       
       handler(e)
    }
 }
 const sitechange = (e,options) => {
   
    if (typeof sitehandler == 'function') {
      sitehandler(options)
    }
     
 }
 const pcschange = (e,options) => {
   
  if (typeof pcshandler == 'function') {
    pcshandler(options)
  }
   
}
  const site = (<Item name="stationName" label="站点选择" >
              <Select options={options} fieldNames={{label: 'name', value: 'name'}} style={{width: '264px'}} onChange={sitechange}></Select>  
             </Item>)
  const pcs = (<Item name="pcsId" label="PCS选择" >
              <Select options={pcsoptions} fieldNames={{label: 'sn', value: 'id'}} style={{width: '264px'}} onChange={pcschange}></Select>  
             </Item>)
  const getpcs = async () => {
    try {
      let containerId = 0
      let siteId = options[0]?.id
     let {success, data} = await PCSMonitorRuntime.queryPCSList(projectId, AreaID, siteId, containerId) 
     if(success && Array.isArray(data)) {
       setPcsoptions(data)
       form.setFieldsValue({
        pcsId: data[0].id
       })
       pcshandler &&  pcshandler(data[0])
     }else {
       setPcsoptions([])
       form.setFieldsValue({
        pcsId: ''
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
 
  return (  
  
    <Cform layout="inline"   form={form} initialValues={{area: levelone> 0 ? oneLevelDefaultId : null, ...initialValue}} {...props}>
      <Space size={64} split={ <Divider style={{margin: '0px',  height: '32px'}} type="vertical" />}>
      <Item label={varlabel} name='area'>
        <Select style={{ width: "200px" }} onChange={onChange} options={levelone} fieldNames={{label: 'name', value: 'id', options: 'options'}}>
         
        </Select>
      </Item>
        {isSite && site}
        {isPcs && pcs}
      </Space>

        {
           props.custview? props.custview : custview
        }
   
    </Cform>
  
    
  );
}
