import React, {useState, useEffect} from 'react'
import dayjs from 'dayjs'
import styled, {css} from 'styled-components'
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
   return <div style={{display: "inline-block",  color: "#515151"}}><span style={{color: "#090"}}>&#9660;&nbsp;</span><span> {n}</span></div>
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
    export const isDate =(value) => {
      return value instanceof Date && !isNaN(value)
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


   
    export const media = {  
      desktop:(...args)=>
      { 
       return css`@media screen and (min-device-width:1537px) and (max-device-width:1920px){
         ${css(...args)}
       }`
       },
      laptop:(...args)=>{ // 笔记本缩放适配125%，150%，175%
      return  css`@media screen  and (max-device-width:1536px){
         ${css(...args)}
     
       }`
       }
      }
      function getBrightness(hexColor) {
        // 确保输入是有效的十六进制颜色代码（例如：#FFFFFF 或 #FFF）
        try {
          hexColor = hexColor.replace(/^#/, '');
          if (hexColor.length === 3) {
              hexColor = hexColor.split('').map(hex => hex + hex).join('');
          }
       
          // 将十六进制颜色转换为RGB分量
          const bigint = parseInt(hexColor, 16);
          const r = (bigint >> 16) & 255;
          const g = (bigint >> 8) & 255;
          const b = bigint & 255;
       
          // 计算亮度
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
          return brightness;
        } catch (error) {
          return 0
        }
      
    }
   export  function hextodec(hex) { // 16进制转10进制 rgb
        let rgbcolor=[255,255,255] 
         try {
          let Hex=hex.replace(/^#/,'')          
          if(Hex.length==3){
           rgbcolor = Hex.split('').map(hex => parseInt(hex + hex, 16) );
            return rgbcolor
          }else if(Hex.length==6){
            rgbcolor = Hex.match(/.{1,2}/g).map(hex => parseInt(hex,16))
            return rgbcolor
          }
         } catch (error) {
           
          return rgbcolor
         }
       
        
        
        
    }
   export function isLightColor(hexColor, threshold = 100) {
        const brightness = getBrightness(hexColor);
        return brightness > threshold;
    }
   export function getprimarycolors(){
     try {
      let primarycolor = window.getComputedStyle(document.documentElement);
      let colors =[]
      for(let i=1; i<11; i++) {
        let key =`--ant-primary-${i}`
        let value = primarycolor.getPropertyValue(key);
        colors.push({label: `主题色${i}`, value})
      }
      
      return colors
     } catch (error) {
       console.log(error)
       return []
     }
 
   }
   export function chunkArray(array, size) { // 拆分数组
    const result = [];
    let index = 0;
  
    while (index < array.length) {
      result.push(array.slice(index, index + size));
      index += size;
    }
  
    return result;
  }
  export function divide(num1, num2) {
    console.log(num1, num2)
    const num1Digits = (num1.toString().split('.')[1] || '').length;
    const num2Digits = (num2.toString().split('.')[1] || '').length;
    
    
    const factor = Math.pow(10, Math.max(num1Digits, num2Digits));
    console.log(factor)
    console.log((num1 * factor) ,(num2 * factor),(num1 * factor) / (num2 * factor))
    return (num1 * factor) / (num2 * factor);
}
export function disabledDate(current){
  // Can not select days before today and today
  return current && current > dayjs().endOf('day');
};

export   function useGetY(props){
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const calculateHeight = () => {
     
      const el = document.querySelector(props.selector);
      if (!el) return;

      // 2. 计算表头距离视口顶部的距离
     // console.log(el.getBoundingClientRect())
      const headerTop = el.getBoundingClientRect().top;

      // 3. 计算可用高度：窗口高度 - 表头顶部距离 - 底部额外高度(如分页器)
      const extraHeight = props.extraHeight || 16; // 底部元素的高度
      const height = window.innerHeight - headerTop - extraHeight;
      
      setScrollY(height);
    };

    // 页面加载完成后计算一次
    calculateHeight();
    
    // 监听窗口大小变化，实时更新
    window.addEventListener('resize', calculateHeight);

    // 组件卸载时清理事件监听
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  return scrollY;
};