import React, {useEffect, useMemo, useRef, useState} from 'react'
 
 
import {useSelector} from "react-redux";
import {CustButtonT, CustButton} from '@com/useButton'
import Cupload from "@com/useUpload.js" 
import {selectProjectId} from '@redux/systemconfig.js'
import { message, Form, Input, InputNumber, Space, Select, Divider, Button, Checkbox,   Alert} from 'antd';
import {UpdateEnergyImage } from '@api/api.js'
import {Cspin,Point} from "@com/comstyled"
import {isObject} from '@com/usehandler'

import { Main} from "./style"
import {useList,useSetStreetLightImageLocation} from './api'
const options = [
   {
      label: "路灯总览", value: "012001"
   },
   {
      label: "太阳能路灯总览", value: "012007"
   }
]


export default function Index() {
   const [form] = Form.useForm();
   const [lform] = Form.useForm()
   const projectId = useSelector(selectProjectId)  
   const [ lightImage, setLlightImage]= useState({})
   const [loading, setLoading] = useState(false)
   const [spinning, setSpinning] = useState(false)
   const [area, setArea] = useState([])
   const [curarea, setCurarea] = useState(null)
   const [list, setList] = useState([])

  const page = Form.useWatch("desc", lform)  // 740*737， 1127*624
  
  const imginfo = useMemo(()=> {
   if(page) {
      return {
        "012001": {
           wpx: 1184,
           hpx: 756
        },
        "012007": {
         wpx:1138,
         hpx:624
        }
      }[page]
   }else {
      return {

      }
   }
   

  }, [page])

  const onChnage = (e) => {
     setLlightImage({
      ...lightImage,
      image:e
     })
  }

  const onSave =async () => {
    try {
        if(! lightImage?.image) return message.warning("请选择图片")

     setLoading(true)
     let locations = []
     let values =await form.validateFields();
     
     for(let [key, value] of Object.entries(values)) {
        console.log(value)
        if(value.c && value.checked) {
           let  [x, y] = value.c.split(',');
           if(parseFloat(x) && parseFloat(y)) {
            locations.push({lightId: value.lightId,lightName:value.lightName, x, y, r: value.r})
           }
        }
     }
     let body = {
      projectId,
      desc:page,
       image: lightImage?.image,
       locations,
     }

     
     let {success,errMsg} = await useSetStreetLightImageLocation({},body)
     if(success) {
        message.success('保存成功')
        setLoading(false)
        query()
     }else {
        message.warning(errMsg || '数据出错')
        setLoading(false)
     }
    } catch (error) {
        console.log(error)
        setLoading(false)
    }
    
  }
/*   const getArea =async () => {
   try {
      let {success, data} =  await UpdateEnergyImage.AeraQueryAll(projectId)
      if(success && Array.isArray(data)) {
       setArea(data)
      }else{
       setArea([])
      }
   } catch (error) {
      console.log(error)
   }

  } */
  const query =async () => {
       try {
         setSpinning(true)
        let desc = lform.getFieldValue("desc")
        if(!desc) return message.warning("没有选择设置页面")
        console.dir(desc)
        let {success, data} = await  useList({projectId, desc})

        if(success && isObject(data) ) {
           let {locations} = data;

            setLlightImage(data)
            if(Array.isArray(locations)) {
               locations.forEach(i => {
                   form.setFieldValue([i.lightId, 'c'], [i.x, i.y].join(','));
                   form.setFieldValue([i.lightId, 'r'], i.r);
                   form.setFieldValue([i.lightId, 'checked'], (i.x!==0 || i.y!==0));
                   form.setFieldValue([i.lightId, 'lightId'], i.lightId);
                   form.setFieldValue([i.lightId, 'lightName'], i.lightName);
               })
               let checked = locations.filter(i =>  i.x!==0 || i.y!==0)
               setList(checked)
            }
          
            setSpinning(false)
        }else {
            setLlightImage({})
            setSpinning(false)
        }
       } catch (error) {
          console.log(error)
          setLlightImage({})
          setSpinning(false)
       }
            
  }
  const getPoint= (e) =>{
    if(!Number.isInteger(curarea?.lightId)) return message.warning('请先勾选需要设置的区域')
    let {offsetX, offsetY} = e.nativeEvent
   let {lightId, lightName} = curarea
     let tip = {
        lightId,
        lightName,
        x: offsetX,
        y: offsetY
     }
     let arr = [...list]
     let index =  arr.findIndex(l => l.lightId == curarea.lightId)
     
    
     if(index >=0) {
       
       arr.splice(index, 1, tip)
       
     }else {
      arr = [...arr, tip]
     }
     console.log(arr)
     setList(arr)
     form.setFieldValue([curarea.lightId, 'c'], [offsetX, offsetY].join(','))
     
  }
  const onset =(f, ar) => {
     
    if(f.target.checked) {
      setCurarea(ar)
    }else {
      let  newlist = list.filter(l => l.lightId!=ar.lightId)      
      setList(newlist)
      setCurarea(null)
      form.setFieldValue([ar.lightId, 'c'], null)
    }
  }

  useEffect(() => {
    if(!projectId) return
     query()
   //  getArea()
  }, [projectId,page])
  const msg =(<div style={{color: "#515151"}}>
     <p>请先勾选，再鼠标点击获取热点中心</p>
     <p>默认热点半径40px,最小值16px,可以手动修改</p>
  </div>)
  return (
     <Cspin spinning={spinning} tip="图片下载中……">
     <Main>
        <div className='title'>
            <span className='text'>路灯图片</span>
            <CustButton onClick={onSave} loading={loading} wh="auto">保存图片及热点</CustButton>
        </div>
        <div className='set'>
           <Form layout="inline" form={lform}>
               <Form.Item label="选择要设置图片的页面" name="desc" initialValue="012001">
                  <Select options={options} style={{width: "200px"}}></Select>
               </Form.Item>
           </Form>
           <div className='imgbox'>
                <Cupload wpx={imginfo?.wpx} hpx={imginfo?.hpx} swpx={400} shpx={235} onChange={onChnage} maximum={1024} value={ lightImage?.image}  /> 
           </div>
           <div className='tip'>（图片大小为: {imginfo.wpx}*{imginfo.hpx} png或jpg 格式,不超过1M）</div>
        </div>
        <Divider>设置图片热点区域</Divider>
        <div className='setwrap'>
         
           <div className="set">
              <img src={ lightImage?.image} onClick={getPoint} className='img' />
              {list.map(l => <Point left={l.x} top={l.y} key={l.lightName} data-descr={l.lightName}></Point>)}
           </div>
           <div className='point'>
           <Form form={form}>
             {
               lightImage?.locations?.map?.(a => <Form.Item label={a.lightName} key={a.lightId}>
                 <Space><Form.Item name={[a.lightId, 'c']}  noStyle>
                     <Input style={{width: '80px'}} readOnly />
                  </Form.Item>
                  <Form.Item name={[a.lightId, 'r']} initialValue={40}  noStyle>
                     <InputNumber min={16} />
                  </Form.Item>
                  <Form.Item name={[a.lightId, 'checked']} valuePropName="checked" noStyle>
                  <Checkbox onChange={(f) =>onset(f,a) } />
                  </Form.Item>
                  <Form.Item name={[a.lightId, 'lightId']} hidden  noStyle>
                   <Input ></Input>
                  </Form.Item> 
                  <Form.Item name={[a.lightId, 'lightName']} hidden noStyle>
                   <Input ></Input>
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
     </Cspin>
  )
}
