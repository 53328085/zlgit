import React, { useEffect, useState, useRef, useMemo } from 'react'
import { Radio, DatePicker, Form, Select, message } from 'antd';
import { useSelector } from 'react-redux'
import BlueColumn from '@com/bluecolumn'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import * as echarts from 'echarts'
import { useReactive  } from 'ahooks';
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
`
export default function Index() {
  const [form] = Form.useForm()
  const oneLevel = useSelector(state => state.system.onelevel)
  const areaOptions = oneLevel.length > 0 ? useMemo(() => ([{ name: oneLevel[0].levelName + '(全部)', id: 0 }, ...oneLevel]), [oneLevel]) : []
  const changeArea = () => {

  }
  const datelist = [{
    label: '今日',
    value: 1
  }, {
    label: '本月',
    value: 2
  }, {
    label: '本年',
    value: 3
  }]
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
  const initecharts =()=>{

   const charts =  echarts.init(sankeyref.current)
   chartsOpts && charts.setOption(chartsOpts);
  }
  useEffect(()=>{
    initecharts()
  },[])
  return (
    <div style={{ flex: 1, display: "flex", justifyContent: 'center', alignContent: 'center' }}>
      <Pagecount bgcolor="#eeeff3" pd={0}>
        <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '8px 16px', marginBottom: 16, border: '1px solid #d7d7d7', borderRadius: 4 }}>
          <Form
            form={form}
            colon={false}
            layout='inline'
          >
            <Form.Item label={oneLevel[0]?.levelName} style={{ marginBottom: 0 }}>
              <Select style={{ width: 200 }} options={areaOptions} fieldNames={{ label: 'name', value: 'id' }} onChange={changeArea} defaultValue={oneLevel.length > 0 ? 0 : null}></Select>
            </Form.Item>
          </Form>
        </div>
        <div>

        </div>
        <Tablediv>
          <div className='header'>
            <BlueColumn>碳排管理</BlueColumn>
            <div>
              <span style={{ paddingRight: 16 }}>时间</span>
              <Select options={datelist} style={{ width: 96 }} defaultValue={1}></Select>
            </div>
          </div>
          <div ref={sankeyref} className='sankey'></div>
        </Tablediv>

      </Pagecount>
    </div>
  )
}
