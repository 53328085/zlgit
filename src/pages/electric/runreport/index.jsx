import React, { useState } from 'react'
import style from './style.module.less'
import BlueColumn from '@com/bluecolumn'
import {Select,Divider,DatePicker} from 'antd'
import { useSelector } from 'react-redux'

export default function Index() {
  const arealist = useSelector(state => state.system.onelevel)
  const [active,setActive]=useState(1)
  return (
    <div className={style.container}>
        <div className={style.leftcss}>
        <BlueColumn name={arealist[0].levelName}/>
        <Select 
        options={arealist} 
        style={{width:'100%',marginTop:32}}
        fieldNames={{label:'name',value:'id'}}
        ></Select>
        <Divider dashed style={{borderColor: '#d7d7d7'}}/>
        <BlueColumn name="运行报告"/>
        <div style={{
          width:320,
          display:'flex',
          margin:'32px 0',
          borderRadius:2,
          cursor:'pointer'
          }}>
          <div  onClick={()=>{setActive(1)}} className={active===1?style.active:''}  style={{flex:1,textAlign:'center',border:'1px solid #d7d7d7',height:40,lineHeight:'40px'}}>月份报告</div>
          <div  onClick={()=>{setActive(2)}}  className={active===2?style.active:''}  style={{flex:1,textAlign:'center',border:'1px solid #d7d7d7',marginLeft:-1,height:40,lineHeight:'40px'}}>年度报告</div>
        </div>
        <DatePicker picker={active===1?'month':'year'} style={{width:'100%'}}/>
        <Divider dashed style={{borderColor: '#d7d7d7',margin:'48px 0'}}/>
        <div className={style.btnscsss}>
          生成报告
        </div>
        <div className={style.btnscsss}>
          打印报告
        </div>
        <div className={style.btnscsss}>
          导出报告
        </div>
        </div>
        <div className={style.rightcss}>

        </div>
    </div>
  )
}
