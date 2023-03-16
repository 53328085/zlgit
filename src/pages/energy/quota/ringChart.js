import React, {useState, useEffect, Fragment} from 'react'
import * as echarts from "echarts";

export default function Index(props){
  let { chartData } = props
  let totalvalues = 0 ;
  chartData.map(item => {
    totalvalues += Number(item.value)
  })
  useEffect(()=>{
    let ringChart = echarts.init(document.getElementById('ringChart'))
    ringChart.setOption({
      //环形图中间文字
      title: {
        text: "总",
        subtext: totalvalues.toFixed(2),
        textStyle: {
          fontSize: 12,
          color: "rgba(0,0,0,0.65)",
          fontWeight: 400
        },
        subtextStyle: {
          fontSize: 20,
          color: "#000000",
          fontWeight: 500
        },
        textAlign: "center", //图例文字居中显示
        x: "47%",   //距离左边的距离
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
          radius: ["45%", "55%"], //第一个是中间圆的大小，第二个是外边圆的大小
          center: ["50%", "50%"], //左边的距离，上边的距离
          type: "pie",
          startAngle: 90,
          labelLine:{
            length:8,
            length2: 0,
            smooth:true,
          },
          data: chartData
        }
      ]
    })
  },[])

  return <div style={{width: 288,height:256}} id='ringChart'></div>
}