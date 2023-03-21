import React, {useEffect, useState, Fragment} from 'react'
import style from './style.module.less'
import { Select, Form } from 'antd'
import * as echarts from 'echarts'
import topology from './imgs/topology_zhanwei.png'
import { Pie } from '@ant-design/plots';
import warningPoint from '@imgs/warningPoint.png'
import { useNavigate } from 'react-router-dom'

export default function Index() {
  const navigate = useNavigate()
  const voltageData = {
    x:["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", ],
    y:[732.25, 758.32, 721.39, 701.54, 723.45, 720.15, 718.96, 728.36, 714.32, 701.36, 704.96, 724.36, 718.32 ]
  }
  const currentData = {
    x:["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", ],
    y:[9.84, 9.15, 9.98, 10.25, 10.01, 10, 9.87, 9.98, 9.99, 9.84, 9.15, 9.98, 10.25]
  }
  const powerData = {
    x:["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", ],
    y:[7321.25, 7158.32, 7214.39, 7019.54, 7236.45, 7200.15, 7148.96, 7285.36, 7148.32, 7014.36, 7048.96, 7245.36, 7189.32 ]
  }
  const config = (lineId, color, Unit, lineData)=> {
    let chart = echarts.init(document.getElementById(lineId));
    chart.setOption({
      color:[color],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        top: '0',
        left: 'center'
      },
      grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisTick:{
          alignWithLabel:true
        },
        data: lineData.x
      },
      yAxis: {
        type: 'value',
        // min: 24
        scale: true, //自适应
      },
      series: [
        {
          name: Unit,
          data: lineData.y,
          type: 'line',
          symbol:'none', 
          smooth: true,
          areaStyle: {}
        }
      ]
    })
  }
  const WarningItem = props => {
    return <div className={style.item}>
      <div className={style.itemTitle}>{props.title}</div>
      <span className={style.itemCount}>{props.count}</span>
    </div>
  }

  //告警等级
  const warningLevelData = [
    {
      name: '一级告警',
      value: 2,
    },
    {
      name: '二级告警',
      value: 2,
    },
    {
      name: '三级告警',
      value: 5,
    }
  ];
  const pieConfig = {
    appendPadding: 10,
    data: warningLevelData,
    angleField: 'value',
    colorField: 'name',
    color:['#ff4e0d', '#26b391', '#4a738b'],
    radius: 1,
    // 设置圆弧起始角度
    startAngle: Math.PI,
    endAngle: Math.PI * 1.5,
    legend:{
      layout: 'horizontal',
      position: 'bottom',
      flipPage: false,
      itemSpacing: 2
    },
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{value}',
      style: {
        fontSize: 18,
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    pieStyle: {
      lineWidth: 0,
    },
  };

  const WarningCard = props => {
    return <div className={style.warningItem}>
      <div className={style.leftImg}>
        <img src={warningPoint} className={style.warningPoint}></img>
      </div>
      <div className={style.warningData}>
        <div className={style.warningtop}>
          <span className={style.time}>{props.data.time}</span>
          <span className={style.description}>{props.data.description}</span>
        </div>
        <div className={style.warningbottom}>
          <span className={style.sn}>{props.data.sn}</span>
          <span className={style.level}>{props.data.level == 1? '一级告警' : props.data.level == 2? '二级告警' :'三级告警'}</span>
        </div>
      </div>
    </div>
  }
  const warningData = [
    {
      time:'13:48:23',
      description:'1#电池簇  低电压告警',
      sn:'1#1_1_42',
      level:2
    },{
      time:'13:20:23',
      description:'1#电池簇  低SOC告警',
      sn:'1#1_1_42',
      level:2
    }
  ]
  const toWarning = () => {
    navigate('/index/runtimeStorage/alarmMessage',{
      state: { type: 'index', primary: 'runtimeStorage', title: '告警信息',  nested: 'alarmMessage' } 
    })
  }

  useEffect(()=>{
    config('totalVoltage', '#237ae4','总电压 (V)', voltageData)
    config('totalCurrent', '#ff6701','总电流 (A)', currentData)
    config('totalPower', '#1ba41b','总功率 (kW)', powerData)
  },[])
  return (
    <div>
      <div className={style.bmsContent}>
        <div className={style.left}>
          <div className={style.leftCard}>
            <div className={style.cardTitle}>总电压 (V)</div>
            <div className={style.cardChart} id='totalVoltage'></div>
          </div>
          <div className={style.leftCard}>
            <div className={style.cardTitle}>总电流 (A)</div>
            <div className={style.cardChart} id='totalCurrent'></div>
          </div>
          <div className={style.leftCard}>
            <div className={style.cardTitle}>总功率 (kW)</div>
            <div className={style.cardChart} id='totalPower'></div>
          </div>
        </div>
        <div className={style.middle}>
          <img src={topology} className={style.zhanwei}></img>
          <div></div>
        </div>
        <div className={style.right}>
          <div className={style.topCard}>
            <div className={style.cardTitle}>告警信息</div>
            <div className={style.warningMessage}>
              <WarningItem title='告警总数' count={9}></WarningItem>
              <WarningItem title='今日告警' count={2}></WarningItem>
            </div>
            <div className={style.cardTitle} style={{marginTop: 27}}>告警等级</div>
            <Pie {...pieConfig} style={{width: 272, height: 272}} />
          </div>
          <div className={style.newWarning}>
          <div className={style.cardTitle}>最新告警</div>
            <span className={style.toWarning} onClick={()=>toWarning()}>查看详情</span>
            <div className={style.warningDetails}>
              {warningData.map((item, index) => {
                return <Fragment key={index}>
                  <WarningCard data={item} ></WarningCard>
                  {warningData.length > (index + 1) ? <div className={style.dashed} style={{marginTop: 21, marginBottom: 21}}></div> : null }
                </Fragment>
              } )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
