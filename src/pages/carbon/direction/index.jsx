import React, { useEffect, useState, useRef, useMemo } from 'react'
import { Radio, DatePicker, Form, Select, message } from 'antd';
import { useSelector } from 'react-redux'
import BlueColumn from '@com/bluecolumn'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import * as echarts from 'echarts'
import { useReactive } from 'ahooks';
import { Cspin, Serach, Cdivider } from '@com/comstyled'
const Tablediv = styled.div`
border: 1px solid #d7d7d7;
border-radius: 4px;
padding: 16px;
background-color: #fff;
flex: 1;
display: flex;
flex-direction: column;
.header{
  display: flex;
  justify-content: space-between;
}
.sankey{
  flex: 1;
}
.sankeyInfo{
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  width: 1335px;
  margin-left: 35px;

div{
  width: 120px;
 .name{
  color: ${props => props.theme.primaryColor} ;
  }
  .triangle{
    border-color: ${props => props.theme.primaryColor}  #fff #fff #fff;
    border-style: solid;
    border-width: 7px 7px 0 7px;
    height: 0;
    width: 0;
    margin:5px auto 0px;
  }
}
 
}
`
export default function Index() {
  const sankeyref = useRef()
  const chartsOpts = useReactive({

    series: {
      type: 'sankey',
      layout: 'none',
      emphasis: {
        focus: 'adjacency'
      },
      data: [
        {
          name: 'a'
        },
        {
          name: 'b'
        },
        {
          name: 'a1'
        },
        {
          name: 'a2'
        },
        {
          name: 'b1'
        },
        {
          name: 'c'
        }
      ],
      links: [
        {
          source: 'a',
          target: 'a1',
          value: 5
        },
        {
          source: 'a',
          target: 'a2',
          value: 3
        },
        {
          source: 'b',
          target: 'b1',
          value: 8
        },
        {
          source: 'a',
          target: 'b1',
          value: 3
        },
        {
          source: 'b1',
          target: 'a1',
          value: 1
        },
        {
          source: 'b1',
          target: 'c',
          value: 2
        }
      ]
    }
  })
  const initecharts = () => {

    const charts = echarts.init(sankeyref.current)
    chartsOpts && charts.setOption(chartsOpts);
  }
  useEffect(() => {
    initecharts()
  }, [])
  return (
    <div style={{ flex: 1, display: "flex", justifyContent: 'center', alignContent: 'center' }}>
      <Pagecount bgcolor="#eeeff3" pd={0}>

        <Tablediv>
          <div className='header'>
            <BlueColumn>碳排流向</BlueColumn>
          </div>
          <Cdivider type="h" margin="16px 0" />
          <div className='sankeyInfo'>
            <div>
              <p className='name'>报告主体</p>
              <p className='triangle'></p>
            </div>
            <div>
              <p className='name'>核算单位</p>
              <p className='triangle'></p>
            </div>
            <div>
              <p className='name'>排放单位</p>
              <p className='triangle'></p>
            </div>
          </div>
          <div ref={sankeyref} className='sankey'></div>
        </Tablediv>

      </Pagecount>
    </div>
  )
}
