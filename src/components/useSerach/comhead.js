import React, {useState,  useEffect} from "react";

import { Form, Select,  Space, DatePicker, message,  Input, Button,Dropdown} from "antd";
import {GlobalOutlined} from "@ant-design/icons"
import styled from "styled-components";
import {  ExportExcel} from '@com/useButton'
import {useSelector, useDispatch} from 'react-redux'
import {levelDefaultLabel,selectProjectId,selectshifts, selectOneLevelDefaultId, selectOneLevel, setCurrentlevel, deviceStyle, getThemeColor, themeColor, setIntl} from '@redux/systemconfig.js'
import moment from "moment";
import {useTranslation, Trans, Translation} from 'react-i18next';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
 
import 'moment/locale/zh-cn';
const { RangePicker } = DatePicker;
import {SiteManagerDesigner, PCSMonitorRuntime} from '@api/api'
import {Cdivider, Radiogroup} from '@com/comstyled'


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

const langs = [
   {label: "中文(简体)", key: 'zh-cn'},
   {label: "English (US)", key: 'en'}
]

const langpack = {
  en: {
    label: 'English (US)',
    lang: enUS
  },
  'zh-cn': {
    label: '中文(简体)',
    lang: zhCN,
  }
}

export const AreaSelect = ({value, onChange, ...otherProps}) => {
  const levelone = useSelector(selectOneLevel)
   return (
    <Select  {...otherProps} defaultValue={value} onChange={onChange} options={levelone} fieldNames={{label: 'name', value: 'id', options: 'options'}}>
         
    </Select>
   )

}
// 1.   状态中获取
export default function UseSerach(props) {
  const {config={}, custview=null} = props
  let i18lang = localStorage.getItem('i18nextLng')
  let packlng = i18lang== 'zh' ? 'zh-cn' : i18lang
  const langName = langpack[packlng]?.label || '中文(简体)'
  const themcolor = useSelector(themeColor)   
  const {i18n} = useTranslation()
  const [color, setColor] = useState(themcolor.primaryColor)
  const {isAreaId=true, gas=true} = config
  const dispatch = useDispatch()
  const onColorChange = (e) => {
       let val = e.target.value;
       setColor(val)
       
       dispatch(getThemeColor({primaryColor: val}))
    
     /*  ConfigProvider.config({
        theme: {
          primaryColor: val
        }
      }) */
  }


  const [form] = Form.useForm()
  const projectId = useSelector(selectProjectId)
  const varlabel = useSelector(levelDefaultLabel)  
  const oneLevelDefaultId = useSelector(selectOneLevelDefaultId) // 选择后的值 
  let [AreaID, setAreaid] = useState(oneLevelDefaultId) 
  const levelone = useSelector(selectOneLevel)  
  const areaName = levelone?.find(l => l.id == AreaID)?.name;
  let shifts = useSelector(selectshifts)
  
  const [allshifts] = useState( [...shifts, {id: 0, name: "全部班次", startTime: "", endTime: ""}]) 
  const [options, setOptions] = useState([]) // 
  //const [sitId, setSitId] = useState(null) 
  const sitId = options[0]?.id        // 站点选择
  const [pcsoptions, setPcsoptions] = useState([])
  const deviceStyles = useSelector(deviceStyle)

  const swithcLang =(e) => {   // moment 语言环境设置 antd 组件国际化 中文 zh-cn, 英文 en， echart图表国际化 中文 ZH， 英文 EN， 页面中自定义的文字国际 i18 中文 zh, 英文 en 
      let {key} = e;
      console.log(key);
      let {label, lang} = langpack[key]
      moment(key)
      if(key == 'zh-cn')  {
        i18n.changeLanguage('zh')
      }else {
        i18n.changeLanguage(key)
      }
      dispatch(setIntl({lang, locale: key}))
  }

  const onChange = (e, option) => {  
      dispatch(setCurrentlevel(option))
      setAreaid(e)
 }
 
const dateselect = (
  <Space size={16}>
  <Item   name="type" initialValue={1}>
     <Select style={{width: '80px'}}   options={[
      {value: 1, label: '日'},
      {value: 2, label: '月'},
      {value: 3, label: '年'},
     ]}
    
     ></Select>
  </Item>

  <Item noStyle  shouldUpdate={(pre,cur) => pre.type!=cur.type}  >
      {
        ({getFieldValue}) => {
          let type = ['date', 'date', 'month', 'year'][getFieldValue('type')] 
         return (
          <Item name="date" initialValue={moment(new Date(), 'YYYY-MM-DD')}> 
             <DatePicker placeholder="请选择日期" picker={type}   style={{width: '160px'}} />
         </Item>
         )
      }
     }
  </Item>
 {!props.config?.shiftNo  && <Item   name="shiftNo" initialValue={0}>
     <Select style={{width: '100px'}}   options={allshifts} fieldNames={{label: 'name', value: 'id'}}
       
     ></Select>
  </Item>
    }
</Space>

)

const carbonDateY = (
   <Item label="考核年度" name=""  >
      <DatePicker   picker="year" />
   </Item>
)
const carbonDateR = (
  <Item label="" name="">
     <RangePicker />
  </Item>
)
const viewtype = (<Item name="view" initialValue={1} >
  <Radiogroup
        options={[
          {
            label: '能耗',
            value: 1,
          },
          {
            label: '费用',
            value: 2,
          }]}
        optionType="button"
        buttonStyle="solid"
         />
        </Item>
 )
 // 能源类型

 const energyoptions = gas ?  [{
  label: '电',
  value: 1
}, {
  label: '水',
  value: 2
}, {
  label: '燃气',
  value: 3
}] : [{
  label: '电',
  value: 1
}, {
  label: '水',
  value: 2
}]
const energytype = (
  <Item label="能源类型"  name="energytype" initialValue={1}>
        <Select style={{ width: 112 }} options={energyoptions}></Select>
  </Item>
)

// 表计类型
const deviceStyleNode = (<Item name="deviceStyle" label="表计类型" initialValue={1}>

<Select options={deviceStyles} fieldNames={{label: "name", value: "deviceStyle"}} style={{width: '200px'}} ></Select>  
</Item>)
// 站点选择
  const site = (<Item name="stationName" label="站点选择"   >
              <Select options={options} fieldNames={{label: 'name', value: 'name'}} style={{width: '264px'}} ></Select>  
             </Item>)
// pcs选择
  const pcs = (<Item name="pcsId" label="PCS选择" >
              <Select options={pcsoptions} fieldNames={{label: 'sn', value: 'id'}} style={{width: '264px'}} ></Select>  
             </Item>)
  const getpcs = async () => {
    try {
      let containerId = 0
     let {success, data} = await PCSMonitorRuntime.queryPCSList(projectId, AreaID, sitId, containerId) 
     if(success && Array.isArray(data) && data.length > 0) {
       setPcsoptions(data)
       form.setFieldsValue({
        pcsId: data[0].id
       })
       
     }else {
       setPcsoptions([])
       form.setFieldsValue({
        pcsId: null
       })
     //  sitehandler && sitehandler({})
     }
    } catch (error) {
      console.log(error)
    }
   
  }
  useEffect(() => { 
    if(levelone.length < 1) message.error('当前项目尚未创建园区!')
  }, [levelone])
 
 useEffect(() => {
    if(Number.isFinite(projectId) && Number.isFinite(AreaID) && Number.isFinite(sitId) && props.config?.isPcs) {
      getpcs()
    }
 }, [sitId, AreaID, projectId, props.config?.isPcs])  


  const getopti = async() => { // 站点选择
    try {
     let {success, data} = await  SiteManagerDesigner.FindSiteList(projectId, AreaID)
     if(success&& Array.isArray(data) && data.length > 0) {
       setOptions([...data])   
      let stationName = data[0].name
     form.setFieldValue('stationName', stationName)
     props.setexparams({...form.getFieldsValue(true), projectId,areaName, stationName,})
     //  sitehandler &&  sitehandler(data[0])
     }else {
      setOptions([])    
      form.setFieldsValue({
        stationName: null
       })
       props.setexparams({...form.getFieldsValue(true), projectId,areaName, stationName: null,})
      // sitehandler && sitehandler({})
     }
    } catch (error) {
      console.log(error)
    }
   
  }
  useEffect(() => {
     
      if(Number.isFinite(projectId) && Number.isFinite(AreaID) && props.config?.isSite) {
        getopti()
      }    
  
  }, [projectId, AreaID, props.config?.isSite])
 
  const onValuesChange = (_, allValues) => {      
    console.log(allValues)
    props.setexparams({...allValues, projectId, areaName})
  }
 
  useEffect(() => {  
     
     props.setexparams({...form.getFieldsValue(true), projectId, areaName})
   
  }, [props.config, projectId])

 
  return (  
  
    <Cform layout="inline"   form={form}   {...props.formprop} 
    onValuesChange={onValuesChange}  
    style={{displey: 'flex', justifyContent: 'space-between'}} >
      <Space size={64} split={ <Cdivider />}>
      {isAreaId && <Item label={varlabel} name='areaId' initialValue={AreaID}>
        <Select style={{ width: "200px" }} onChange={onChange} options={levelone} fieldNames={{label: 'name', value: 'id', options: 'options'}}>
         
        </Select>
     
         </Item>
          }
        {props.config?.isSite && site}
        {props.config?.isPcs && pcs}

        {props.config?.isdevsty && deviceStyleNode}  
        {props.config?.isview && viewtype}  
        {props.config?.energytype && energytype}
      </Space>
         {
           props.config?.isdate && dateselect
         }
        {
           props.config?.custview && custview
        }
        {
          props.config?.export ? <ExportExcel /> : null
        }
        {
          props.config?.dateY && carbonDateY // 碳排管理--碳排考核跟踪
        }
        {
          props.config?.dateR && carbonDateR // 碳排管理-- 碳排分析
        }
        <Space>
       <Input type="color" value={color}
              style={{width: '80px', marginLeft: 'auto'}}
              onChange={onColorChange}
            /> 
             <Dropdown
      menu={{
        items: langs,
        onClick: swithcLang,
      }}
      
    >
       <span>{langName}<GlobalOutlined /></span> 
      </Dropdown>
      </Space>
    </Cform>
  
    
  );
}
