import React, {useRef,useEffect, useState} from "react";
import {Row, Col, Grid,InputNumber, Form, Input,Alert,Radio, Button, Typography} from "antd"
import GridLayout, {Responsive, WidthProvider}  from "react-grid-layout"; 
import styled from "styled-components";
import CModal from '@com/useModal'
import "./drag.css"
const {useBreakpoint} = Grid
const {Text} = Typography
const ResponsiveLayout = WidthProvider(Responsive)
 const Box = styled.div`
   border: 1px solid #dedede;
   width: 50px;
   display: inline-flex;
 `

/**
 * This example illustrates how to let grid items lay themselves out with a bootstrap-style specification.
 */
 const colso = {lg: 12, md: 12, sm: 12, xs: 12, xxs: 12}
 function   generateLayouts() {
  const times = [...Array(21)];
  const widths = {lg: 3, md: 4, sm: 6, xs: 12, xxs: 12};
  return Object.keys(widths).reduce((memo, breakpoint) => {
    const width = widths[breakpoint];
    const cols =  colso[breakpoint];
    memo[breakpoint] = [
      // You can set y to 0, the collision algo will figure it out.
      ...times.map((_, i) => ({x: i % cols, y: 0, w: 1, h: 1, i: String(i)}))
    ];
    return memo;
  }, {});
}
 const Bootlayout = function() {
   const [form] = Form.useForm()
   const [boxheight, setBoxHeight] = useState(0)
   const Ref = useRef()
   const boxref=useRef()
   let layout = generateLayouts()
   //console.log(layout)

   const onLayoutChange =(v)=> {
    console.log("onLayoutChange")
    console.log(v)
   }
   const onResize=(a, b)=> {
    console.log(a, b)
   }
   useEffect(()=> {
    if(boxref.current) {
      console.dir(boxref.current.elementRef.current.offsetHeight
      )
    }
   
     
   }, [])
  const onClick=()=> {
    Ref.current.onOpen()
    setBoxHeight( boxref.current.elementRef.current.offsetHeight)
  }
  const onDragStop=(a, b)=> {
    console.log("onDragStop")
    console.log(a)
    console.log(b)
  }
  const onDropDragOver=(a, b)=> {
    console.log("onDropDragOver")
    console.log(a)
    console.log(b)
  }
  return (
    <div style={{position: "relative", flex: 1, display: "flex", flexDirection: "column"}} >
    <div>
      <Button onClick={onClick}>设置</Button>
    </div>
    <ResponsiveLayout  
    className="layout"
     ref={boxref}
     layouts={layout} 
    breakpoints={{ lg: 1400, md: 1200, sm: 768, xs: 480, xxs:0}}
     cols={{ lg: 12, md: 8, sm: 6, xs: 4, xxs:2}}  
     margin={[10, 10]}
     onResizeStart={onResize}
     onResizeStop={onResize} 
     onDragStop={onDragStop}
     onDropDragOver={onDropDragOver}
     onLayoutChange={onLayoutChange}
    // containerPadding={[5, 5]}
  //   width={1300}
     >
         {
          [...Array(21)].map((_,  i)=> <div key={i} style={{border: "1px solid #dedede"}}>{i}</div>)
         }
      
    </ResponsiveLayout>
    <CModal title="设置布局"       width={832} mold="cust"    ref={Ref}>
        <Alert message="为了设置与显示保持一致，请确保1.显示器100%比例，2.浏览器页面缩放100% ，3.浏览器最大化。不要拉伸、缩放浏览器,4.显示器如改变可能需重新设置" type="warning"> </Alert>
        <Text>当前可设置高度{boxheight}</Text>
        <Form form={form} labelAlign="left" labelCol={{flex: "7em"}} preserve={false}>
          <Form.Item label="设置列数" name="cols">
             <InputNumber min={1} max={8} placeholder="请输入列数1~8" ></InputNumber>
          </Form.Item>
          <Form.Item label="行高设置方式" name="type" initialValue={1}>
            <Radio.Group options={[
              {label: "行数", value: 1},
              {label: "固定高度", value: 2}
            ]}></Radio.Group>
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(cur, pre)=>cur.type!=pre.type}>
            {
              ({getFieldValue})=> {
                  let type = getFieldValue("type")
                  if(type==1) {
                      return (
                        <Form.Item label="设置行数" name="rowLight">
                        <InputNumber min={1} addonAfter="px" placeholder=" 最小一行"></InputNumber>
                        </Form.Item>
                      )
                  }else if(type==2) {
                    return (
                      <Form.Item label="设置行高" name="rowLight">
                      <InputNumber min={1} addonAfter="px" placeholder=" 最小一行"></InputNumber>
                      </Form.Item>
                    )
                  }
              }
            }
          </Form.Item>
        
        </Form>
       </CModal>
    </div>
  )
 }

export default Bootlayout