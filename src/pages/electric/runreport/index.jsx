import React, { useState } from 'react'
import style from './style.module.less'
import BlueColumn from '@com/bluecolumn'
import {Select,Divider,DatePicker} from 'antd'
import { useSelector } from 'react-redux'
import logo from '@imgs/chintlog.png'

export default function Index() {
  const arealist = useSelector(state => state.system.onelevel)
  const [active,setActive]=useState(1)
  return (
    <div className={style.container}>
        <div className={style.leftcss}>
        <BlueColumn name={arealist[0]?.levelName}/>
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
            <div className={style.report}>
              <div style={{padding:16}}>
                <img src={logo} alt="" style={{width:77,height:58,marginRight:16}}/>
                <span style={{fontSize:20}}>正泰综合能源服务平台</span>
              </div>
              <div style={{display:'flex',flexDirection:'column',justifyContent: 'center',alignItems: 'center',}}>
                <p style={{fontSize:32,color:'#515151',fontWeight:'bold',marginBottom:32}}>电气安全运行分析报告</p>
                <div style={{
                  width:431,
                  height:136,
                  background:'#f2f2f2',
                  border:'1px solid #ccc',
                  padding:'16px',
                  display:'flex',
                  flexDirection:'column',
                  fontSize:18
                  }}>
                  <p style={{flex:1}}>项目名称:</p>
                  <p style={{flex:1}}>项目地址:</p>
                  <p style={{flex:1}}>报告日期:</p>
                </div>
              </div>
              <div className={style.bgimage}></div>
            </div>
        </div>
    </div>
  )
}
