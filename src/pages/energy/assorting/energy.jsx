import React,{useCallback,useState,useEffect} from 'react'
import style from './style.module.less'
import Bluecolumn from '@com/bluecolumn';
import {Divider} from 'antd'
import icon1 from './imgs/icon1.png'
import icon2 from './imgs/icon2.png'
import icon3 from './imgs/icon3.png'
import icon4 from './imgs/icon4.png'
import uppng from './imgs/up.png'
import downpng from './imgs/down.png'
export default function Energy() {
  const card1props={
    title:'空调能耗',
    icon:icon2,
    arrow:uppng
  }
  const card2props={
    title:'公共照明',
    icon:icon3,
    arrow:uppng
  }
  const card3props={
    title:'园区路灯',
    icon:icon4,
    arrow:downpng
  }

  return (
    <div className={style.gridstyle}>
        <div className={style.bdcolor} >
          <div className={style.bgclass}>
            <div style={{display:'flex',alignItems:'center'}}>
              <div style={{width:4,height:32,backgroundColor:'#237ae4'}}></div>
              <div style={{fontSize:12,color:'#666'}}><span style={{fontSize:14,color:'#000',fontWeight:'bold',padding:'0 16px'}}>用户能耗</span>(吨标煤)</div>
            </div>
          </div>
          <div className={style.textstyle} style={{backgroundColor:'#a0cede'}} >
              <div>本月:<span className={style.pdlf16}>200.21</span></div>
              <div>环比:<span className={style.pdlf16}>200.21</span></div>
              <div>上月:<span className={style.pdlf16}>200.21</span></div>
              <div>同比:<span className={style.pdlf16}>200.21</span></div>
          </div>
          <div style={{display:'flex',justifyContent:'center',padding:16}}>
          <Charts/>
          </div>
          
        </div>
        <div className={style.bdcolor}>
        <div className={style.bgclass+' '+ style.bg1class}>
            <div style={{display:'flex',alignItems:'center'}}>
              <div style={{width:4,height:32,backgroundColor:'#237ae4'}}></div>
              <div style={{fontSize:12,color:'#666'}}><span style={{fontSize:14,color:'#000',fontWeight:'bold',padding:'0 16px'}}>公共照明</span>(吨标煤)</div>
            </div>
          </div>
          <div className={style.textstyle} style={{backgroundColor:'#afdb92'}} >
              <div>本月:<span className={style.pdlf16}>200.21</span></div>
              <div>环比:<span className={style.pdlf16}>200.21</span></div>
              <div>上月:<span className={style.pdlf16}>200.21</span></div>
              <div>同比:<span className={style.pdlf16}>200.21</span></div>
          </div>
          <div style={{display:'flex',justifyContent:'center',padding:16}}>
          <Charts/>
          </div>
        </div>
        <div className={style.bdcolor}>
        <div className={style.bgclass+' '+ style.bg2class}>
            <div style={{display:'flex',alignItems:'center'}}>
              <div style={{width:4,height:32,backgroundColor:'#237ae4'}}></div>
              <div style={{fontSize:12,color:'#666'}}><span style={{fontSize:14,color:'#000',fontWeight:'bold',padding:'0 16px'}}>公共照明</span>(吨标煤)</div>
            </div>
          </div>
          <div className={style.textstyle} style={{backgroundColor:'#a0cede'}} >
              <div>本月:<span className={style.pdlf16}>200.21</span></div>
              <div>环比:<span className={style.pdlf16}>200.21</span></div>
              <div>上月:<span className={style.pdlf16}>200.21</span></div>
              <div>同比:<span className={style.pdlf16}>200.21</span></div>
          </div>
          <div style={{display:'flex',justifyContent:'center',padding:16}}>
          <Charts/>
          </div>
        </div>
        <div className={style.bdcolor}>
        <div className={style.bgclass+' '+style.bg3class}>
            <div style={{display:'flex',alignItems:'center'}}>
              <div style={{width:4,height:32,backgroundColor:'#237ae4'}}></div>
              <div style={{fontSize:12,color:'#666'}}><span style={{fontSize:14,color:'#000',fontWeight:'bold',padding:'0 16px'}}>园区路灯</span>(吨标煤)</div>
            </div>
          </div>
          <div className={style.textstyle} style={{backgroundColor:'#afdb92'}} >
              <div>本月:<span className={style.pdlf16}>200.21</span></div>
              <div>环比:<span className={style.pdlf16}>200.21</span></div>
              <div>上月:<span className={style.pdlf16}>200.21</span></div>
              <div>同比:<span className={style.pdlf16}>200.21</span></div>
          </div>
          <div style={{display:'flex',justifyContent:'center',padding:16}}>
          <Charts/>
          </div>
        </div>
        <div style={{display: 'flex',flexDirection: 'column',justifyContent: 'space-between'}}>
          <div className={style.piestyle}>
             <Bluecolumn name="分类能耗占比" />
             <div style={{width:368,height:360,marginTop:16}}>
             <PieCharts></PieCharts>
             </div>
            
          </div>
          <div className={style.sorts}> 
              <Bluecolumn name={<span>分类能耗<span style={{fontSize:12,color:'#666',paddingLeft:8,}}>(吨标煤)</span></span>} />
              <Divider style={{margin:"16px 0",borderColor:'#d7d7d7'}} dashed/>
              <div style={{height:237,display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
              <Card/>
              <Card {...card1props}/>
              <Card {...card2props}/>
              <Card {...card3props}/>
              </div>
              
          </div>
        </div>
    </div>
  )
}




const data =[
  {
    "timePeriod": "2006 Q3",
    "value": 1
  },
  {
    "timePeriod": "2006 Q4",
    "value": 1.08
  },
  {
    "timePeriod": "2007 Q1",
    "value": 1.17
  },
  {
    "timePeriod": "2007 Q2",
    "value": 1.26
  },
  {
    "timePeriod": "2007 Q3",
    "value": 1.34
  },
  {
    "timePeriod": "2007 Q4",
    "value": 1.41
  },
  {
    "timePeriod": "2008 Q1",
    "value": 1.52
  },
  {
    "timePeriod": "2008 Q2",
    "value": 1.67
  },
  {
    "timePeriod": "2008 Q3",
    "value": 1.84
  },
  {
    "timePeriod": "2008 Q4",
    "value": 2.07
  },
  {
    "timePeriod": "2009 Q1",
    "value": 2.39
  },
  {
    "timePeriod": "2009 Q2",
    "value": 2.71
  },
  {
    "timePeriod": "2009 Q3",
    "value": 3.03
  },
  {
    "timePeriod": "2009 Q4",
    "value": 3.33
  },
  {
    "timePeriod": "2010 Q1",
    "value": 3.5
  },
  {
    "timePeriod": "2010 Q2",
    "value": 3.37
  },
  {
    "timePeriod": "2010 Q3",
    "value": 3.15
  },
  {
    "timePeriod": "2010 Q4",
    "value": 3.01
  },
  {
    "timePeriod": "2011 Q1",
    "value": 2.8
  },
  {
    "timePeriod": "2011 Q2",
    "value": 2.8
  },
  {
    "timePeriod": "2011 Q3",
    "value": 2.84
  },
  {
    "timePeriod": "2011 Q4",
    "value": 2.75
  },
  {
    "timePeriod": "2012 Q1",
    "value": 2.64
  },
  {
    "timePeriod": "2012 Q2",
    "value": 2.55
  },
  {
    "timePeriod": "2012 Q3",
    "value": 2.46
  },
  {
    "timePeriod": "2012 Q4",
    "value": 2.45
  },
  {
    "timePeriod": "2013 Q1",
    "value": 2.57
  },
  {
    "timePeriod": "2013 Q2",
    "value": 2.68
  },
  {
    "timePeriod": "2013 Q3",
    "value": 2.8
  },
  {
    "timePeriod": "2013 Q4",
    "value": 2.89
  },
  {
    "timePeriod": "2014 Q1",
    "value": 2.85
  },
  {
    "timePeriod": "2014 Q2",
    "value": 2.73
  },
  {
    "timePeriod": "2014 Q3",
    "value": 2.54
  },
  {
    "timePeriod": "2014 Q4",
    "value": 2.32
  },
  {
    "timePeriod": "2015 Q1",
    "value": 2.25
  },
  {
    "timePeriod": "2015 Q2",
    "value": 2.33
  },
  {
    "timePeriod": "2015 Q3",
    "value": 2.53
  },
  {
    "timePeriod": "2015 Q4",
    "value": 2.74
  },
  {
    "timePeriod": "2016 Q1",
    "value": 2.76
  },
  {
    "timePeriod": "2016 Q2",
    "value": 2.61
  },
  {
    "timePeriod": "2016 Q3",
    "value": 2.35
  },
  {
    "timePeriod": "2016 Q4",
    "value": 2.11
  },
  {
    "timePeriod": "2017 Q1",
    "value": 2.08
  },
  {
    "timePeriod": "2017 Q2",
    "value": 2.2
  },
  {
    "timePeriod": "2017 Q3",
    "value": 2.38
  },
  {
    "timePeriod": "2017 Q4",
    "value": 2.59
  },
  {
    "timePeriod": "2018 Q1",
    "value": 2.63
  },
  {
    "timePeriod": "2018 Q2",
    "value": 2.67
  },
  {
    "timePeriod": "2018 Q3",
    "value": 2.64
  },
  {
    "timePeriod": "2018 Q4",
    "value": 2.5
  },
  {
    "timePeriod": "2019 Q1",
    "value": 2.31
  },
  {
    "timePeriod": "2019 Q2",
    "value": 2.04
  },
  {
    "timePeriod": "2019 Q3",
    "value": 1.83
  },
  {
    "timePeriod": "2019 Q4",
    "value": 1.71
  },
  {
    "timePeriod": "2020 Q1",
    "value": 1.65
  },
  {
    "timePeriod": "2020 Q2",
    "value": 1.59
  },
  {
    "timePeriod": "2020 Q3",
    "value": 1.58
  }
]
import { Area,Pie } from '@ant-design/plots';
let Charts =()=>{
  const config = {
    data,
    width:272,
    height:448,
    autoFit:false,
    
    xField: 'timePeriod',
    yField: 'value',
    smooth:true,
    legend:{
      title:{
        title:'吨标煤'
      },
      position:'top'
    }
    // xAxis: {
    //   range: [0, 1],
    // },
  };
  return (
    <Area {...config} />
  )
}


let PieCharts =()=>{
     const data = [
            {
                type: '尖占比',
                value: 27,
            },
            {
                type: '峰占比',
                value: 25,
            },
            {
                type: '平占比',
                value: 18,
            },
            {
                type: '谷占比',
                value: 15,
            }
        ];
  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.75,
    legend:{
        position: 'bottom',
        offsetY: 0
    },
    label:{
        type:'outer',
        formatter:useCallback((v)=>{
            return v.value+'%'
        },[])
    },
    statistic: {
        title: false,
        content: {
            style: {
                whiteSpace: 'pre-wrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: 'normal',
                fontSize: '16px'
            },
            content: `${data.length>0?'总100':''}`,
        },
    },
};
return (<Pie {...config}/>)
}


let Card =({title="用户能耗",icon=icon1,arrow=uppng})=>{
  return (
    <div  style={{border:'1px solid #d7d7d7',padding:1,display:'flex',justifyContent:'space-between'}}>
      <div style={{display:'flex'}}>
        <img src={icon} alt="" style={{width:54,height:42}}/>
        <div style={{marginLeft:24}}>
          <div style={{fontSize:12,color:'#666'}}>{title}</div>
          <div style={{fontSize:18,color:'#333',lineHeight:'18px'}}>152.24</div>
        </div>
      </div>
      <div style={{marginRight:16,display:'flex',alignItems:'center'}}>
        <img src={arrow} alt="" style={{width:14,height:19}}/>
        <span style={{fontSize:18,lineHeight:'18px',padding:'0 16px'}}>+7.88</span>
        <span>%</span>
      </div>
    </div>
  )
}