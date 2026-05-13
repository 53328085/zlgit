import React, {useEffect, useRef, useContext,useImperativeHandle,forwardRef} from 'react'
import {useSelector} from "react-redux"
import {isObject} from '@com/usehandler'
import {drawEcharts} from './index'
import {intl} from "@redux/systemconfig"
import Cempty from '@com/useEmpty'
import custcontext from "@com/content"
const contidtion = (a) => {
   
    const b  =  Array.isArray(a) || isObject(a)
    if(!b) return false;
    let f;
    if(Array.isArray(a)) {  // 二维数组/数组对象
      const isAry = a.some(a => Array.isArray(a) && a?.length > 0)
      const isobj = a.some(a => Object.prototype.toString.call(a).slice(8,-1)==="Object" && Object.values(a)?.length >0)
      f = isAry || isobj

    }
    if(isObject(a)) { // 对象
      f = Object.values(a).length > 0
    }
    return f;
}
 function Ichart(props={},ref) {
 
  const cref = useRef()
  const {change} = useContext(custcontext)
 // const langch = useSelector(intl)
  let {dataset={}, type=1, pieData, custoption, tip='', xAxis={}, series} = props 
  
  let typechart = custoption?.type || type
 
  let info = `${tip} 暂无数据` 
  let instance = useRef()
useImperativeHandle(ref, () =>({
   dispatchAction: (params) => {
    instance.current?.dispatchAction(params)
  },
  on:(event, callback) => {
    instance.current?.on(event, callback)
  },
}))
  useEffect(() => {  
     let f = Array.isArray(series) && series?.length>0 && series.some?.(s => Array.isArray(s?.data) && s?.data?.length >0)
     let contions = [
      typechart == 1 && contidtion(dataset?.source),
      typechart == 3 && pieData?.data?.length > 0,
      typechart == 5 && custoption?.series?.[0]?.data?.length > 0,
      typechart == 2 && Array.isArray(xAxis?.data) && xAxis?.data?.length > 0  && f,
      typechart == 4 && Array.isArray(props?.liuqiu?.series?.data) && props?.liuqiu?.series?.data?.length,
      typechart == 6 && Array.isArray(custoption?.graphic)
     ]

     if(contions.some(c => c)) {
       instance.current= drawEcharts(cref.current, {...props})
    }

/*     if(typechart == 1 && contidtion(dataset?.source)) {
      
       drawEcharts(cref.current, {...props})
    }else if(typechart == 3 && pieData?.data?.length > 0) {
       drawEcharts(cref.current, {...props})
    }
    if(typechart == 5 && custoption?.series?.[0]?.data?.length > 0) {         
        drawEcharts(cref.current, {...props})
    }
    let f = Array.isArray(series) && series?.length>0 && series.some?.(s => Array.isArray(s?.data) && s?.data?.length >0)
    if(typechart == 2 && Array.isArray(xAxis?.data) && xAxis?.data?.length > 0  && f) {
      drawEcharts(cref.current, {...props})
    }
    if(typechart == 4 && Array.isArray(props?.liuqiu?.series?.data) && props?.liuqiu?.series?.data?.length) { // liuqiu      
      drawEcharts(cref.current, {...props})
    }
   if(typechart == 6 && Array.isArray(custoption?.graphic)) {        
        drawEcharts(cref.current, {...props})
    } */
  }, [props, change]) // intl 语言切换时图表需要重绘
  if(typechart == 1) {
    if(!contidtion(dataset?.source)) {
      return <Cempty tip={info} />
    }
  }
  if(typechart == 2) {
    let f = Array.isArray(series) && series?.length>0 && series?.every(s => Array.isArray(s?.data) && s?.data?.length >0)
   
    if(!Array.isArray(xAxis.data) || (Array.isArray(xAxis.data) && xAxis.data?.length ===0) || !f) {
      return <Cempty tip={info} imgStyle={props.emptyStyle} />
    }
  }
  if(typechart == 3) {
    if(!Array.isArray(pieData.data) || (Array.isArray(pieData.data) && pieData.data?.length ===0)) {
      return <Cempty tip={info} imgStyle={props.emptyStyle} />
    }
  }
  if(typechart==5) {   
    if(!Array.isArray(custoption?.series) || (Array.isArray(custoption?.series?.[0]?.data) && custoption?.series?.[0]?.data?.length ===0)) {
      return <Cempty tip={info} imgStyle={props.emptyStyle}  />
    }
  }
  if(typechart==4) {   
    if(!Array.isArray(props?.liuqiu?.series?.data) || props?.liuqiu?.series?.data?.length==0 || props?.liuqiu?.series?.data?.every(d => typeof parseFloat(d) !== "number")) {
      return <Cempty tip={info} imgStyle={props.emptyStyle} />
    }
  }
  return (
     <div style={{flex:1, height: "100%"}}  ref={cref} className='ichartmap'>
      
    </div>
  )
}
export default forwardRef(Ichart)