import React, {useState, useEffect} from 'react'
import style from './style.module.less';
import * as echarts from "echarts";

export default function Index(props){
  let totalvalues = 0 ;
  console.log(props)
  props.ringData.map(item => {
    totalvalues += Number(item.value)
  })
  const drawLine = ()=>{
    console.log(123)
    let ringChart = echarts.init(document.getElementById('ringChart'))
    ringChart.setOption({
      //环形图中间文字
      title: {
        text: "总",
        subtext: totalvalues.toFixed(2),
        textStyle: {
          fontSize: 16,
          color: "rgba(0,0,0,0.65)",
          fontWeight: 400
        },
        subtextStyle: {
          fontSize: 20,
          color: "#000000",
          fontWeight: 500
        },
        textAlign: "center", //图例文字居中显示
        x: "48%",   //距离左边的距离
        y: "40%"    //距离上边的距离
      },
      tooltip:{},
      //数据的颜色设置
      // color: ["#237ae4", "#F6BD16", "#FF3B30"],
      //鼠标移入显示的文字
      //图例设置
      legend: {
        type:'scroll',
        bottom: '1%',
        left: 'center',
        icon:'circle'
      },
      series: [
        {
          radius: ["55%", "65%"], //第一个是中间圆的大小，第二个是外边圆的大小
          center: ["50%", "50%"], //左边的距离，上边的距离
          type: "pie",
          startAngle: 90,
          labelLine:{
            length:12,
            length2: 0,
            smooth:true,
          },
          data: props.ringData
        }
      ]
    }, true)
  }
  useEffect(()=>{
    drawLine()
  })
    
    return <div className={style.chartTab}>
        <div className={style.itemTitle}><span>能耗分布</span></div>
        <div style={{width:456,height:334}} id='ringChart' ></div>
    </div>
}