import React from 'react'
import imgurl from './icon'
import styled from 'styled-components'
import {Image, Typography, Descriptions} from 'antd'
const {Paragraph} = Typography
const Itembox = styled.div`
  background-image:   url(${imgurl.itembg}) ;
  outline: 1px solid rgba(215,215,215,1);
  outline-offset: 1px ;
  display: grid;
  padding: 8px;
  grid-template-rows: 128px 140px;
  row-gap: 16px;
  align-content: end;
  .upper{
     display: grid;
     grid-template-columns: 172px 1fr;
     column-gap: 8px;
     padding: 0 4px;
     .pic {
       background-color: rgba(97,113,152,1);
       border-radius: 8px;
       display: flex;
       align-items: center;
       justify-content: center;
     }
     .info {
      .ant-typography {
        color: #fff;
        line-height: 1.2;
      }
     
     }
  }
  .below {
     outline: 1px solid #fff;
     outline-offset: 1px;
     display: grid;
     grid-template-columns: 86px 132px 80px 80px;
     grid-template-rows: repeat(5, 1fr);
     div {
      display: flex;
      color: #fff;
      align-items: center;
      justify-content: center;
      padding: 0 8px;
     }
     .title {
      background-color: #135abd;
      border-right: 1px solid #fff;
      justify-content: center;
      &:last-of-type{
        border-right: none;
      }
     }
     .topborder {
      border-top: 1px solid #fff;
     }
     .back {
      border-top: 1px solid #fff;
       background-color: #000;
     }
     .red {
      border-top: 1px solid #fff;
      background-color: #ff3333;
     }
     .yellow {
      border-top: 1px solid #fff;
       background-color: #ffcc00;
     }
     .green {
      border-top: 1px solid #fff;
      background-color: #093;;
     }
     .com { 
      background-color: #fff;
      border-right: 1px solid #d7d7d7;
      border-bottom: 1px solid #d7d7d7 ;
      &:last-of-type {
        border-right: none;
      }
     }
     .bold {
      color: #515151;
      font-weight: bold;
      justify-content: end;
     }
    
     .rose {
      color: #f00;
     }
     .decing {
       color: #090;
       
     } 
  }
`
const list = (arr, str,sty) => {
 const title =  <div className={sty}>{str}</div>
 let lists =  Object.entries(arr).map(vs => {
    let [key, value] = vs
    if(key == "value") {
     return <div className='com bold'>{value}</div>
    }else {
      return <div className={ value > 0 ? "com rose" : "com decing"}>
       {value > 0 ? "+" : null}{value}%
      </div>
    }
 })
 lists.unshift(title);
 return lists;
}
export default function Item(props) {
  let {type, name, sn, address, total,peak,avg,low} = props
  
  return (
    <Itembox>
       <div className='upper'>
           <div className='pic'>
              <Image src={imgurl[`a${type}`]} preview={false} ></Image>
           </div>
           <div className='info'>
             <Paragraph ellipsis={{tooltip: name}}>{name}</Paragraph>
             <Paragraph ellipsis={{tooltip: sn, rows: 2}}>SN:{sn}</Paragraph>
             <Paragraph ellipsis={{tooltip: address, rows: 3}}>{address}</Paragraph>
           </div>
       </div>
       <div className='below'>
           {["分类", "能耗(kwh)","同比", "环比"].map(e => <div className='title'>{e}</div>)}
           
           {
              list(total, "总能耗", "back")
           }
           {
            list(peak, "峰能耗", "red")
           }
           {
            list(avg, "平能耗", "yellow")
           }
            {
            list(avg, "谷能耗", "green")
           }
       </div>
    </Itembox>
  )
}
