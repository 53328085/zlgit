import React, {useState,  useEffect} from "react";

import { Form, Select,  Space, DatePicker, message,  Input,} from "antd";
import {useRequest} from 'ahooks' 
import styled from "styled-components";
import {  ExportExcel} from '@com/useButton'
import {useSelector, useDispatch} from 'react-redux'
import {levelDefaultLabel,selectProjectId,selectshifts, selectOneLevelDefaultId, selectOneLevel, setCurrentlevel, deviceStyle, getThemeColor, themeColor, setIntl} from '@redux/systemconfig.js'
import moment from "moment"; 
import 'moment/locale/zh-cn';
const { RangePicker } = DatePicker;
import {SiteManagerDesigner, PCSMonitorRuntime, StorageContainerDesigner} from '@api/api'
import {Cdivider, Radiogroup} from '@com/comstyled'


import Enery from "./enery";

const { FindContainerList } = StorageContainerDesigner  //储能柜

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
// 1.   状态中获取
export default function UseSerach(props) {
  const isprodction =  process.env.NODE_ENV !== "production"
  const {config={}, custview=null} = props  
  const themcolor = useSelector(themeColor)   
  const [color, setColor] = useState(themcolor.primaryColor)
  const {isAreaId=true, gas=true} = config
  const dispatch = useDispatch()

  console.dir(config)
  console.dir(custview)
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
  props.setAreaName(areaName)
  let shifts = useSelector(selectshifts)
  
  const [allshifts] = useState( [...shifts, {id: 0, name: "全部班次", startTime: "", endTime: ""}]) 
  const [options, setOptions] = useState([]) // 
 
  const [pcsoptions, setPcsoptions] = useState([])
  const [tankoptions, setTankoptions] = useState([])
  const deviceStyles = useSelector(deviceStyle)

  const getopti = async() => { // 站点选择
    try {
     let {success, data, errMsg} = await  SiteManagerDesigner.FindSiteList(projectId, AreaID)
     if(success&& Array.isArray(data) && data.length > 0) {
       setOptions([...data])   
      let {name: stationName, id} = data[0]
     form.setFieldValue('stationName', {label:stationName, value: id,})
     
     props.setexparams({...form.getFieldsValue(true)})
 
     if(props.config.isTank) getTank();
     if(props.config.isPcs && !props.config.isTank)  getPcs();
     }else {
       setOptions([])    
      form.setFieldsValue({
        stationName: {label: null, value: null, id: null}
       })
       props.setexparams({...form.getFieldsValue(true)})
       if(!success) return message.warning(errMsg)
       if(data?.length < 1) return message.warning("站点暂无数据")
     }
    } catch (error) {
      console.log(error)
    }
   
  }
 useEffect(() => {
    if(!props.config?.isSite) return;
    if(Number.isInteger(AreaID) && Number.isInteger(projectId)) {
      getopti();
    }
   

 }, [props.config?.isSite, AreaID, projectId])

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

const getTank = async() => { // 初始化、 站点改变时 ; 储能柜
  if(!props.config.isTank) return;
  try {
    const {areaId, stationName} = form.getFieldsValue();  
   
    if(!(Number.isInteger(areaId) && stationName?.value)) return
     let {success, data, errMsg} = await  FindContainerList(projectId,areaId, stationName?.value )
     if(success && Array.isArray(data) && data.length > 0) {
        setTankoptions(data)
     
        form.setFieldValue('containerId', {value: data[0].id, label: data[0].name})
        props.setexparams({...form.getFieldsValue(true)})
        if(props.config?.isPcs ) getPcs()
       
     }else {
      form.setFieldValue('containerId', {label: null, value: null})
      props.setexparams({...form.getFieldsValue(true)})   
      setTankoptions([])
      if(!success) return message.warning(errMsg || '数据出错')
      if(data?.length==0) return message.warning("当前站点暂无储能柜数据")
     }
  } catch (error) {
    
  }
   

}


const getPcs = async () => {
  try {
    let {areaId,stationName, containerId={value:0} } = form.getFieldsValue(true)
   let {success, data, errMsg } = await PCSMonitorRuntime.queryPCSList(projectId, areaId, stationName?.value, containerId.value) 
   if(success && Array.isArray(data) && data.length > 0) {
     setPcsoptions(data)
     
      form.setFieldsValue({
        pcsId: {value: data[0].id, label: data[0].sn}
       })
       props.setexparams({...form.getFieldsValue(true)})
   }else {
    setPcsoptions([])
     form.setFieldValue('pcsId', {label: null, value: null})
     props.setexparams({...form.getFieldsValue(true)})
    if(!success) return message.warning(errMsg || "数据出错")
    if(data?.length == 0) return message.warning('当前站点不存在PCS!')
   }
  } catch (error) {
    console.log(error)
  }
 
}


// 表计类型
const deviceStyleNode = (<Item name="deviceStyle" label="表计类型" initialValue={1}>

<Select options={deviceStyles} fieldNames={{label: "name", value: "deviceStyle"}} style={{width: '200px'}} ></Select>  
</Item>)
// 站点选择
  const site = (<Item name="stationName" label="站点"   >
              <Select options={options} onChange={getTank} fieldNames={{label: 'name', value: 'id'}} style={{width: '264px'}} labelInValue></Select>  
             </Item>)
             // 储能柜
  const tank =  (<Item name="containerId" label="储能柜" >
  <Select options={tankoptions} onChange={getPcs} fieldNames={{label: 'name', value: 'id'}} style={{width: '264px'}} labelInValue></Select>  
</Item>)
// pcs选择
  const pcs = (<Item name="pcsId" label="PCS" >
              <Select options={pcsoptions} fieldNames={{label: 'sn', value: 'id'}} style={{width: '264px'}} ></Select>  
             </Item>)








  useEffect(() => { 
    if(levelone.length < 1) message.error('当前项目尚未创建园区!')
  }, [levelone])
 
  const onValuesChange = (_, allValues) => {      
    console.log(allValues)
    props.setexparams({...allValues})
  }

  useEffect(() => {  
     if(!config.gas) {
       let v = form.getFieldValue('energytype');
       if(v==3) form.setFieldValue('energytype', 1)
     }
     props.setexparams({...form.getFieldsValue(true)})
   
  }, [props.config, projectId])

 
  return (  
  
    <Cform layout="inline"   form={form}   {...props.formprop} 
     onValuesChange={onValuesChange}      
    style={{displey: 'flex', justifyContent: 'space-between'}} >
      <Space size={64} split={ <Cdivider />}>
      {isAreaId && <Item label={varlabel} name='areaId' initialValue={AreaID}>
        <Select style={{ width: "200px" }} onChange={onChange} options={levelone}  fieldNames={{label: 'name', value: 'id', options: 'options'}}>
         
        </Select>
     
         </Item>
          }
        {props.config?.isSite && site}       
         {props.config?.isTank && tank}
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
        <Item noStyle name="projectId" initialValue={projectId}>
           <Input hidden />
        </Item>
     {
        isprodction &&  (<Input type="color" value={color}
              style={{width: '80px', marginLeft: 'auto'}}
              onChange={onColorChange}
            /> )   
       } 
    </Cform>
  
    
  );
}
