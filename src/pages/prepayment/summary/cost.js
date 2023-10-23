import React from 'react'
import {nanoid} from "@reduxjs/toolkit"
import {Typography, Image} from 'antd'
import imgurl from './icon'
 
const {Text} = Typography

export default function Cost({data}) {
 
 const  { arrearAmount, 
    arrearsCustomer,
    totalCustomer,
    walletBalance,    
    yesterdayEnergyChargeAmount,
    yesterdayPropertyChargeAmount} = data
const datas = [
    {
        icon: "home5",
        text: "账户余额",
        num:  walletBalance,
      },
    {
        icon: "home1",
        text: "昨日能源充值",
        num:  yesterdayEnergyChargeAmount,
      },
      {
        icon: "home2",
        text: "昨日物业充值",
        num:  yesterdayPropertyChargeAmount,
      },
      {
        icon: "home3",
        text: "客户数量",
        num:  totalCustomer,
      },
      {
        icon: "home4",
        text: "欠费客户数",
        num: arrearsCustomer,
      },
     
      {
        icon: "home6",
        text: "欠费总计",
        num: arrearAmount,
      }, 
      ];
  const Item =  ({icon, text, num}) => {
    return (
        <div className='item'>
        <div className='imgBox'><Image src={imgurl[icon]} preview={false} width={64} height={64} ></Image></div>
        <div className='descBox'> <span>{text}</span>
         <Text strong ellipsis>{num}</Text></div>
       </div>
    )
  }
  return (
    <>
     {
        datas.map(d=>  <Item {...d} key={nanoid()}/>)
     }
    </>
  )
}

