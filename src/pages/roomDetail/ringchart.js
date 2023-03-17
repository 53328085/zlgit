// import React, {useState, useEffect} from 'react'
// import style from './style.module.less';
// import * as echarts from "echarts";
// import { cloneDeep } from 'lodash';

// export default function Index(props){
//   let totalvalues = 0 ;
//   props.ringData.map(item => {
//     totalvalues += Number(item.value)
//   })
//   const ringId = 'ringChart'
  
//   const drawLine = ()=>{
//     let ringChart = echarts.init(document.getElementById(ringId))
//     ringChart.clear()
//     ringChart.setOption({
//       //环形图中间文字
//       title: {
//         text: "总",
//         subtext: totalvalues.toFixed(2),
//         textStyle: {
//           fontSize: 16,
//           color: "rgba(0,0,0,0.65)",
//           fontWeight: 400
//         },
//         subtextStyle: {
//           fontSize: 20,
//           color: "#000000",
//           fontWeight: 500
//         },
//         textAlign: "center", //图例文字居中显示
//         x: "48%",   //距离左边的距离
//         y: "40%"    //距离上边的距离
//       },
//       tooltip:{},
//       //数据的颜色设置
//       // color: ["#237ae4", "#F6BD16", "#FF3B30"],
//       //鼠标移入显示的文字
//       //图例设置
//       legend: {
//         type:'scroll',
//         bottom: '1%',
//         left: 'center',
//         icon:'circle'
//       },
//       series: [
//         {
//           radius: ["55%", "65%"], //第一个是中间圆的大小，第二个是外边圆的大小
//           center: ["50%", "50%"], //左边的距离，上边的距离
//           type: "pie",
//           startAngle: 90,
//           labelLine:{
//             length:12,
//             length2: 0,
//             smooth:true,
//           },
//           data: props.ringData
//         }
//       ]
//     }, true)
//   }
//   useEffect(()=>{
//     drawLine()
//   },[props.ringData])
    
    // return <div className={style.chartTab}>
    //     <div className={style.itemTitle}><span>能耗分布</span></div>
    //     <div style={{width:456,height:334}} id={ringId} ></div>
    // </div>
// }

import React from 'react'
import style from './style.module.less';
import { Pie, measureTextWidth } from '@ant-design/plots';
import { cloneDeep } from 'lodash';
export default function Index(props){
    const ringData = cloneDeep(props.ringData)
    ringData.map(item => {
      item.value = parseFloat(item.value)
    })
    const  renderStatistic = (containerWidth, text, style) => {
      const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
      const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2
  
      let scale = 1;
  
      if (containerWidth < textWidth) {
        scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
      }
  
      const textStyleStr = `width:${containerWidth}px;`;
      return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`;
    }
    
    const config = {
        appendPadding: 10,
        data:ringData,
        // data: props.chartData,
        angleField: 'value',
        colorField: 'name',
        radius: 0.8,
        innerRadius: 0.8,
        legend: {
            layout: 'horizontal',
            position: 'bottom',
            itemSpacing:4
          },
        label: {
          type: 'outer',
          offset: '-50%',
          content:'{name}',
          style: {
            textAlign: 'center',
            fontSize: 14,
          },
        },
        interactions: [
          {
            type: 'element-selected',
          },
          {
            type: 'element-active',
          },
        ],
        statistic: {
          title: {
            offsetY: -4,
            style: {
              fontSize: '32px',
            },
            customHtml: (container, view, datum) => {
              const { width, height } = container.getBoundingClientRect();
              const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
              const text ='总';
              return renderStatistic(d, text, {
                fontSize: 32,
              });
            },
          },
          content: {
            offsetY: 4,
            style: {
              fontSize: '32px',
            },
            customHtml: (container, view, datum, data) => {
              const { width } = container.getBoundingClientRect();
              const text =` ${data.reduce((r, d) => r + d.value, 0)}`;
              return renderStatistic(width, text, {
                fontSize: 32,
              });
            },
          },
        },
      };
    return <div className={style.chartTab}>
    <div className={style.itemTitle}><span>能耗分布</span></div>
    <Pie style={{width:456,height:334}} {...config} />
</div>
}