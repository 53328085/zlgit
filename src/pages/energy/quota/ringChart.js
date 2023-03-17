import React from 'react'
import { Pie, measureTextWidth } from '@ant-design/plots';
import { cloneDeep } from 'lodash';
export default function Index(props){
    const ringData = cloneDeep(props.chartData)
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
            customHtml: (container, view, datum) => {
              const { width, height } = container.getBoundingClientRect();
              const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
              const text ='总';
              return renderStatistic(d, text, {
                fontSize: 16,
              });
            },
          },
          content: {
            offsetY: 4,
            style: {
              fontSize: '16px',
            },
            customHtml: (container, view, datum, data) => {
              const { width } = container.getBoundingClientRect();
              const text =` ${data.reduce((r, d) => r + d.value, 0)}`;
              return renderStatistic(width, text, {
                fontSize: 16,
              });
            },
          },
        },
      };
    return <Pie style={{width:288,height:256}} {...config} />
}