import React, {useEffect, useMemo, useRef, useState} from 'react'
 
import _ from 'lodash' 
import {useSelector} from "react-redux";
import {CustButtonT, CustButton} from '@com/useButton'
import Cupload from "@com/useUpload.js" 
import {selectProjectId} from '@redux/systemconfig.js'
import { message, Form, Input, InputNumber, Space, Select, Divider, Button, Checkbox,TreeSelect, Tag,  Alert} from 'antd';
 
import {Cspin,AirPoint} from "@com/comstyled"
import {isObject} from '@com/usehandler'
import Pagecount from '@com/pagecontent' 
import { Main} from "./style"
import {useAreas,useList, useSetAirConditionerImageLocation,useQuerySpaceTrees,useDelete} from './api'
 
// 1 开，2 关
 
export default function Index() {
   const [form] = Form.useForm();
 
   const projectId = useSelector(selectProjectId)  
   const [ airConditioner, setAirConditioner]= useState({})
   const [loading, setLoading] = useState(false)
   const [spinning, setSpinning] = useState(false)
   const [areas, setAreas] = useState([])
   const [curarea, setCurarea] = useState(null)
   const [list, setList] = useState([])
   const [treeId, setTreeID]=useState(null)
   
   const [tabs, setTabs] = useState([])
   
 
 const onClose=async(key)=> {
     try {
       console.log(key)
       let {success,errMsg} =   await  useDelete({projectId, desc:key})
       if(success) {
         message.success("删除成功")
         getTabs()
       }
     } catch (error) {
      console.log(error)
      message.warning(errMsg || "删除失败")
     }
 }
 
 const clickTag=(key)=> {
   setTreeID(key)
    
 }
  const tags = useMemo(()=> {
    return  tabs?.map(t => <Tag color={t.key==treeId ? "processing" : "default"}  key={t.key} onClick={()=> clickTag(t.key)}   closable onClose={()=>onClose(t.key)}>{t.label}</Tag>)

  },[tabs, treeId])




  const getArea =async () => { 
   try { 
      const {success, data} =  await useQuerySpaceTrees({projectId, areaId:0, areaName:""})
      if(success && Array.isArray(data) && data.length>0) {
         setAreas(data)
      }else{
         setAreas([])
      }
   } catch (error) {
      setAreas([])
   }
  }
 const getTabs = async()=> {
   try {
    let {success, data} =  await useAreas({projectId})
    if(success&&isObject(data) && Object.keys(data)?.length){
       const value=Object.keys(data)[0]
       let Tabs =[]
       for (const [key, value ] of Object.entries(data)) {
           Tabs.push({label: value, key:key?.toString()})
       }
      
       setTabs(Tabs)
       if(!treeId) {
         setTreeID(value)
       }
       
    }

   } catch (error) {
      
   }
 }
  
  const imginfo ={
   wpx:1720,
   hpx:892
  }  

  const onChnage = (e) => {
   if(!e){
      setList([])
   }
   setAirConditioner({
      ...airConditioner,
      image:e
     })
  }
 const treeOnchage =(e)=> {
   setTreeID(e)
   setCurarea(null)
 }
//conditionerId: 5, airConditionerName
  const onSave =async () => {
    try {
        if(!airConditioner?.image) return message.warning("请选择图片")
        if(!treeId) return message.warning("请选择区域")
     setLoading(true)
     let locations = []
     let values =await form.validateFields();
     
     for(let [key, value] of Object.entries(values)) {
         const {x, y} =value
        if(x && y && value.checked && value.desc) {
           
           if(parseFloat(value.x) && parseFloat(value.y)) {
            locations.push({conditionerId: value.conditionerId,airConditionerName:value.airConditionerName, x, y, r: value.r, desc:value.desc})
           }
        }
     }
     let body = {
      projectId,
      desc:treeId?.toString(),
       image: airConditioner?.image,
       locations,
     }

     
     let {success,errMsg} = await useSetAirConditionerImageLocation({},body)
     if(success) {
        message.success('保存成功')
        setLoading(false)
        query()
        getTabs()
     }else {
        message.warning(errMsg || '数据出错')
        setLoading(false)
     }
    } catch (error) {
        console.log(error)
        setLoading(false)
    }
    
  }
 
  const query =async () => {
       try { 
         setSpinning(true)  
        let {success, data} = await  useList({projectId, desc:treeId}) 
        if(success && isObject(data) ) {
           let {locations} = data; 
           setAirConditioner(data)
            if(Array.isArray(locations)) {
               locations.forEach(i => {
                   form.setFieldValue([i.conditionerId, 'x'], i.x);
                   form.setFieldValue([i.conditionerId, 'y'], i.y);
                   form.setFieldValue([i.conditionerId, 'r'], i.r);
                   form.setFieldValue([i.conditionerId, 'checked'], (i.x!==0 || i.y!==0));
                   form.setFieldValue([i.conditionerId, 'conditionerId'], i.conditionerId);
                   form.setFieldValue([i.conditionerId, 'airConditionerName'], i.airConditionerName);
                   form.setFieldValue([i.conditionerId, 'desc'], i.desc);
               })
               let checked = locations.filter(i =>  i.x!==0 || i.y!==0)
               setList(checked)
            }
          
            setSpinning(false)
        }else {
         setAirConditioner({})
            setSpinning(false)
        }
       } catch (error) {
          console.log(error)
          setAirConditioner({})
          setSpinning(false)
       }
            
  }
  useEffect(()=> {
   if(Number.isInteger(parseInt(treeId))) {
      query()
   }

  },[treeId])
  const getPoint= (e) =>{
   console.log(curarea)
   let {conditionerId} = curarea || {}
    if(!Number.isInteger(parseInt(conditionerId))) return message.warning('请先勾选需要设置的区域')
    let {desc, x, y} = form.getFieldValue(conditionerId) 
    let contion=x>0 || y>0
    if(!Number.isInteger(parseInt(desc))) {
      return message.warning('请输入数字编号')
    } 
    
    let {offsetX, offsetY} = e.nativeEvent  
    const xv = contion ? x : offsetX
    const yv = contion ? y :  offsetY
     let tip = {
      conditionerId,
      desc,
        x: xv,
        y: yv
     }
     let arr = [...list]
     let index =  arr.findIndex(l => l.conditionerId == curarea.conditionerId)
     
    
     if(index >=0) {
       
       arr.splice(index, 1, tip)
       
     }else {
      arr = [...arr, tip]
     }
    
     setList(arr)
     form.setFieldValue([curarea.conditionerId, 'x'], xv)
     form.setFieldValue([curarea.conditionerId, 'y'], yv)
     
  }
  const onset =(f, ar) => {
   
    if(f.target.checked) {
     let {x,y, desc} = form.getFieldValue(ar.conditionerId)
      if((x>0 || y>0) && desc) {
         setList([...list, {conditionerId:ar.conditionerId, x, y, desc}])
      }
      if(!desc) return message.info("请先输入编号")
      setCurarea({...ar,desc})
    }else {
      let  newlist = list.filter(l => l.conditionerId!=ar.conditionerId)      
      setList(newlist)
      setCurarea(null)
    //  form.setFieldValue([ar.conditionerId, 'x'], null)
    //  form.setFieldValue([ar.conditionerId, 'y'], null)
     // form.setFieldValue([ar.conditionerId, 'desc'], null)
    }
  }
  const positionChange =(v, a,type)=>{
   try {
     // let checked = form.getFieldValue(a.conditionerId)?.checked
    //  if(!checked) message.info("请先勾选")
      const {conditionerId} = a
      let list2 =_.cloneDeep(list)
      let idx = list2.findIndex(c => c.conditionerId == conditionerId)
      if(idx<0) return
      list2[idx][type]=v
      setList(list2)
   } catch (error) {
      console.log(error)
   }
 
  }
 
  useEffect(() => {
    if(!projectId) return
    // query()
     getTabs()
     getArea()
  }, [projectId])
  const msg =(<div style={{color: "#515151"}}>
     <p>请先勾选，再鼠标点击获取热点中心</p>
     <p>默认热点半径40px,最小值16px,可以手动修改</p>
  </div>)
  return (
     <Cspin spinning={spinning} tip="图片下载中……">
    <Pagecount pd="0" bgcolor="none">
     <Main>
        <div className='title'>
           <Space size={16}>
            <span className='text'>区域选择</span>
            <TreeSelect
               showSearch
               style={{ width: 200 }}
               value={treeId}
               dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
               placeholder="请输入区域名称"
               allowClear
               treeDefaultExpandAll
               fieldNames={{label: 'name', value: 'areaId', children: 'nodes'}}
               onChange={treeOnchage}
               treeData={areas}
            />
             <CustButtonT  text="save"  onClick={onSave} loading={loading} /> 
            </Space>
           
        </div>
        
        <div className="tags">
         {tags}
        </div>
        <div className='set'>
          {/*  <Form layout="inline" form={lform}>
               <Form.Item label="选择要设置图片的页面" name="desc" initialValue="012001">
                  <Select options={options} style={{width: "200px"}}></Select>
               </Form.Item>
           </Form> */}
           <div className='imgbox'>
                <Cupload wpx={imginfo?.wpx} hpx={imginfo?.hpx} swpx={400} shpx={235} onChange={onChnage} maximum={800} value={airConditioner?.image}  /> 
           </div>
           <div className='tip'>（图片大小为: {imginfo.wpx}*{imginfo.hpx} png或jpg 格式,不超过800kb）</div>
        </div>
        <Divider>设置图片热点区域</Divider>
        <div className='setwrap'>
         
           <div className="set">
              <img src={ airConditioner?.image} onClick={getPoint} className='img' />
              {list.map(l => <AirPoint left={l.x} top={l.y} key={l.conditionerId}>{l.desc}</AirPoint>)}
           </div>
           <div className='point'>
            <div className="desc">
               <span>编号</span>
               <span>X坐标</span>
               <span>Y坐标</span>
               <span>热区半径</span>
            </div>
           <Form form={form} labelWrap>
             {
               airConditioner?.locations?.map?.(a => <Form.Item labelCol={{flex:"88px"}}     label={a.airConditionerName} key={a.conditionerId}>
                 <Space size={8}>
                 <Form.Item name={[a.conditionerId, 'desc']} rules={[{
                  whitespace: true
                 }]}  noStyle>
                     <Input style={{width: '80px'}}   />
                  </Form.Item>
                  <Form.Item name={[a.conditionerId, 'x']}  noStyle>
                     <InputNumber style={{width: '60px'}} onChange={(x)=> positionChange(x,a,'x')}  />
                  </Form.Item>
                  <Form.Item name={[a.conditionerId, 'y']}  noStyle>
                     <InputNumber style={{width: '60px'}} onChange={(y)=> positionChange(y,a,'y')}  />
                  </Form.Item>
                  <Form.Item name={[a.conditionerId, 'r']} initialValue={40}  noStyle>
                     <InputNumber min={16} style={{width: "64px"}} />
                  </Form.Item>
                  <Form.Item name={[a.conditionerId, 'checked']} valuePropName="checked" noStyle>
                  <Checkbox onChange={(f) =>onset(f,a) } />
                  </Form.Item>
                  <Form.Item name={[a.conditionerId, 'conditionerId']}  noStyle>
                   <Input hidden></Input>
                  </Form.Item> 
                  <Form.Item name={[a.conditionerId, 'airConditionerName']}  noStyle>
                   <Input hidden></Input>
                  </Form.Item>     
                  </Space>
               </Form.Item>)
             }
             <Form.Item >
                <Alert type="info" message={msg}></Alert>
             </Form.Item>
           </Form>
           </div>
        </div>
        
     </Main>
     </Pagecount>
     </Cspin>
  )
}
