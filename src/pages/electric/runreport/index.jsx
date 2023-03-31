import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import style from './style.module.less'
import BlueColumn from '@com/bluecolumn'
import {Select,Divider,DatePicker} from 'antd'
import UseTable from '@com/useTable'
import logo from '@imgs/chintlog.png'
import PageComp from './pagecomp.jsx'
import {safeElectric} from '@api/api'
import moment from 'moment'
import { Pie } from '@ant-design/plots';

export default function Index() {
  const projectId = useSelector(state=>state.system.menus.projectId)
  const arealist = useSelector(state => state.system.onelevel)
  const [active,setActive]=useState(1)
  const columns1=[
    {title:'',dataIndex:'name',width:100},
    {title:'',dataIndex:'message'}
  ]
 
  let projectMes=[
    {
      name:'项目名称',
      message:'',
      align:'center'
    },
    {
      name:'项目地址',
      message:''
    }
  ]
  //月度报告
  const getMonthReport=async()=>{
    const res = await safeElectric.MonthReport({
      projectId,
      date:moment().format('YYYY-MM'),
    })
  }
  useEffect(()=>{
    getMonthReport()
  },[])
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
            <PageComp>
              <div style={{marginBottom:24}}>
              <p style={{marginBottom:6}}>1.项目情况</p>
              <UseTable columns={columns1} dataSource={projectMes} showHeader={false}/>
              </div>
              <div style={{marginBottom:24}}>
              <p style={{marginBottom:6}}>2.电气安全详情</p>
                  <div className={style.gridcss}>
                    <div style={{backgroundColor: '#ff6600',color:'#fff'}}>总报警次数</div>
                    <div style={{backgroundColor: '#ff6600',color:'#fff'}}>最大电流</div>
                    <div style={{backgroundColor: '#ff6600',color:'#fff'}}>最大电压</div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div style={{backgroundColor: '#ff6600',color:'#fff'}}>剩余电流</div>
                    <div style={{backgroundColor: '#ff6600',color:'#fff'}}>最高温度</div>
                    <div style={{backgroundColor: '#ff6600',color:'#fff'}}>烟雾报警</div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
              </div>
              <div style={{marginBottom:24}}>
                <p style={{marginBottom:6}}>2.1告警类型分布</p>
                <PieCharts/>
              </div>
            </PageComp>
       
            
        </div>
       
    </div>
  )
}

let PieCharts=()=>{
  const data = [
    {
      type: '分类一',
      value: 27,
    },
    {
      type: '分类二',
      value: 25,
    },
    {
      type: '分类三',
      value: 18,
    },
    {
      type: '分类四',
      value: 15,
    },
    {
      type: '分类五',
      value: 10,
    },
 
  ];
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    width:512,
    height:360,
    label: {
      type: 'outer',
    },
    legend:{
      position: 'bottom',
      flipPage:false,
      itemSpacing:15
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  return <Pie {...config} />;
}