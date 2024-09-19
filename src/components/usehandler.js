import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {message} from 'antd'
import {getOnelevel} from '@redux/systemconfig.js'
import { useDispatch} from 'react-redux'
import { Area } from "@api/api.js";
import md5 from 'js-md5';
export const custMsg = ({success=true, type='success', content='', duration=0.1, onClose= () => {}} = {}) => {   
    if (!['success','error', 'warning'].includes(type)) return ;  
     message[success ? 'success' : 'error']({
        content,
        duration,
        onClose,
       })
}

export function useWinSize(projectId, update) {    
    const dispatch = useDispatch()
    const uplevel = async () => {
      try {
        let {success, data}  = await Area.QueryAll({projectId,level: 1,parentId: 0})
        if (success && Array.isArray(data)){ 
           dispatch(getOnelevel(data))
        }else {
            dispatch(getOnelevel([]))
        }
      } catch (error) {
        console.log(error)
      }
    
    }
    useEffect(() => {
        uplevel()
    }, [update])
    return null 
 }
 
export function numberformat(n){
  let num = parseFloat(n)
  if(num > 0) {
   return <div style={{display: "inline-block", color: "#515151"}}><span style={{color: "#f00"}}>&#9650;&nbsp;</span><span>&#43;{n}</span></div>
  }else if(num < 0) {
   return <div style={{display: "inline-block",  color: "#515151"}}><span style={{color: "#090"}}>&#9660;&nbsp;</span><span>{n}</span></div>
  }else {
   return <span>{n}</span>
  }

}
export function getTime(date, type){
  try {
    let time
      if(type == 1) {
        time=date.format('YYYY-MM-DD')
    }else if(type == 2) {
        time = date.startOf("month").format('YYYY-MM-DD')
    }else if(type == 3) {
        time = date.startOf("year").format('YYYY-MM-DD')
    }
  return time
  } catch (error) {
    console.log(error)
  }
  
}

export function cipher(name, pwd){
   
  return md5(`chint_${name}_${pwd}_wulian`)
   
}
export function getdays(){ // 获取当前月份的天数
   return new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
}
export  const Statebox = styled.div`
  position: absolute;
  top: ${props => props.top};
  right: ${props => props.right};
  transform: rotate(45deg);
  background-color: ${props => props.bgColor || "#096"};
  color: #fff;
  width: ${props => props.width};
  text-align: center;
  font-size: 14px;
`
 
 export  function handlermenu(Meundata,  lang){
   
   
  let data = Meundata.filter(d => d.languageName==lang);     
     if(data?.length ==0) return message.warning("没有设置相应的菜单栏，请联系管理员")
     const setMenus = data.filter(m => ['0101', '0102', '0103'].includes(m.no));
     const runMenus = data.filter(m => m.parentNo == '01' && m.select == 1).filter(m => !['0101', '0102', '0103'].includes(m.no)) // 运行功能 菜单
   //  const allRunMenus = data.filter(m => m.parentNo == '01').filter(m => !['0101', '0102', '0103'].includes(m.no)) 
     const designerMenus = data.filter(m => m.parentNo == '02' && m.select == 1) // 设置
   
     const comSet = data.filter(m => m.parentNo=="0201") // 公共设置
   
     let exclude = ['01','02','0101','0102', '0103', '0104'] // 排除  项目概述, 数据大屏， 项目设置， 平台配置,
    
     const sidermenu = data.filter(m => m.parentNo !='01').filter(m => m.parentNo !='02').filter(m => !exclude.includes(m.no));    
     
     const siderRunMenus = {}; // 运行功能 选择的子菜单
    
     runMenus.forEach(item => {
      let {no, key, parentNo} = item 
      if (!exclude.includes(item.no)) { 
         siderRunMenus[key] = sidermenu.filter(m => m.parentNo == no && m.select == 1).sort((a, b) => a.index - b.index)
        
      }   
     }) 
     const siderDesignerMenus = {};
     designerMenus.forEach(item => {
      let {no, key, parentNo} = item 
      if (!exclude.includes(item.no)) {
        siderDesignerMenus[key] = sidermenu.filter(m => m.parentNo == no)?.sort((a, b) => a.index - b.index)
      }   
     }) 
     const menus =  {
      fullmenu: Meundata,
      designerMenus, 
      siderDesignerMenus,
      runMenus,
      siderRunMenus, 
      setMenus,  
      comSet,   
     }
     return menus
    }
 

    export const isObject = (obj) => {
       return Object.prototype.toString.call(obj).slice(8,-1) === 'Object'
    }
    export const encode=(text) => {
       if(text && text?.trim()) {
          return window.encodeURIComponent(text?.trim())
       }
    }
    export const filterProps = {
      showSearch: true,
      optionFilterProp: 'children',
      filterOption(input, option) {
        try {
          let values = Object.values(option) 
          return  values.some(v => {
            if(typeof v == 'string') {
              return v?.toLowerCase()?.includes(input?.toLowerCase())
            }else if(typeof v == 'number')
             return  v==input
          })
        } catch (error) {
           console.log(error)
        }
      
      },
      filterSort(a, b){
        try {
          let value1 = Object.values(a)[0];
          let value2 = Object.values(b)[0];
          if(typeof value1 == 'string' && typeof value2 == 'string') {
            return  value1.toLowerCase().localeCompare(value2.toLowerCase())
          }else if(typeof value1 == 'number' && typeof value2 == 'number') {
            return value1 > value2
          }
        } catch (error) {
          
        }
  
       
    }
    }
    export const detectZoom = () => {
      let ratio = 0,
        screen = window.screen,
        ua = navigator.userAgent.toLowerCase();
      if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
      } else if (~ua.indexOf('msie')) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
          ratio = screen.deviceXDPI / screen.logicalXDPI;
        }
      } else if (
        window.outerWidth !== undefined &&
        window.innerWidth !== undefined
      ) {
        ratio = window.outerWidth / window.innerWidth;
      }
      if (ratio) {
        ratio = Math.round(ratio * 100);
      }
      return ratio;
    }
 