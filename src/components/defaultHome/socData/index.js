import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectCurProject} from '@redux/user.js'
import Titlelayout from '@com/titlelayout';
import {Liquid} from "@ant-design/charts"

const fs = {
  hv: '24px',
  fc: '#333'
}



export default function DefaultHome(){
  const curProject = useSelector(selectCurProject)
  const DemoLiquid = () => {
    const config = {
      percent: 0.56,
      outline: {
        border: 2,
        distance: 2,
      },
      wave: {
        length: 128,
      },
    
        statistic: {
          title: {
            formatter: () => 'SOC',
            style: {
              fontSize: 32,
              color: '#515151',
              
            }
          },
          
          content: {
            style: {
              fontSize: 32,
              color: '#515151'
            },
            customHtml: () => {
              return <span>56.00%</span>
            }
          }
        }
     
    };
    return <Liquid {...config} />;
  };

  
  return (
    <Titlelayout title='站点SOC' {...fs}>
        <div style={{width: '424px', height: '338px'}}>
              <DemoLiquid></DemoLiquid>
              
          </div>
    </Titlelayout>
  )
}
