import React, { useState, useRef, useEffect, } from "react";

import { Radio, Image, Typography, message } from "antd";
import styled from "styled-components";


import { EnergyArea } from "@api/api.js"
import Titlelayout from "@com/titlelayout";


import imgurl from "./icon";
import UseTable from "@com/useTable"
import { numberformat } from "@com/usehandler"
import { useOutletContext } from 'react-router-dom'
import Pagecount from "@com/pagecontent";

import { getTime } from '@com/usehandler'
import Ichart from '@com/useEcharts/Ichart';
const { QueryEnergyAreaDay, QueryEnergyAreaMonth, QueryEnergyAreaYear } = EnergyArea
const { Text, Paragraph } = Typography
const Laybox = styled.div`
  display: flex;
  flex: 1;
  column-gap: 16px;
  .left {
    flex: 1 1 1240px;
    
  }
  .right {
    display: flex;
    flex: 1 1 424px;
    flex-direction: column;
  
    row-gap: 16px;
    .rup {
       flex: 1 1 512px;
    }
    .rdown {
      flex: 1 1 272px;
      
    }
  }
 
 
 
`;
const CustTitle = styled.div`
  font-size: 14px;
  color: #515151;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;








const Radiogroup = styled(Radio.Group)`
  && {
    .ant-radio-button-wrapper.ant-radio-button-wrapper-in-form-item {
      width: 96px;
      text-align: center;
      &:first-child {
        border-radius: 16px 0 0 16px;
      }
     &:last-child {
      border-radius: 0 16px 16px 0;
     }
    }
  }

`
const Sdiv = styled.div` 
  && {
    height: 100%;
    padding-top: 16px;
    display: grid;
    grid-template-rows: 1fr 1fr;
    row-gap: 16px;
    .down {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 16px;
    }
    .sort {
      background-color: #f4f8ff;
      padding: 8px 16px;
      display: grid;
      grid-template-columns: 40px 1fr;
      column-gap: 16px;
      align-items: center;
      .data {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
      }
    }
  }
`


const nf = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
export default function Index() {
  let { exparams } = useOutletContext()
  let { energytype, areaId, date, type: dateType, projectId } = exparams

  const chartTitle = ["用电量 (kWh)", "用电量 (kWh)", '用水量 (m³)', '用气量 (m³)'][energytype] || "用电量 (kWh)"
  const unit = ["kWh", "kWh", "m³"][energytype] || "kWh"
  const [tableData, setTableData] = useState([])
  const [boptions, setOptions] = useState({
    series: [],
    grid: {
      left: "0px",
      right: "0",
      top: "46px",
      bottom: "0px",
      containLabel: true,
    },
    legend: {
      top: 0,
      type: "scroll"
    },
    dataset: {
      dimensions: [],
      source: []
    }
  })
  let poptions = useRef({
    pieData: {
      data: [], total: '100%', radius: ["40%", "70%"], series: {
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
      },
    },
    type: 3,

    legend: {
      type: "scroll",
      icon: "rect",
      bottom: 0,
      top: 'auto',
      itemGap: 5
    },
    grid: {
      bottom: 20
    }
  })

  //let length = dataSet.source?.length - 1

  poptions.current.pieData.data = tableData.map(t => ({ value: t.e, name: t.name }))
  const sort = tableData.sort((a, b) => parseFloat(b.e) - parseFloat(a.e))
  const columns = [
    {
      dataIndex: "name",
      title: "区域名称",
    },
    {
      dataIndex: "e",
      title: chartTitle,
    },
    {
      dataIndex: "mom",
      title: "环比",
      render: (text) => numberformat(text),
    },
    {
      dataIndex: "yoy",
      title: "同比",
      render: (text) => numberformat(text)
    }

  ]

  const getData = ({ energytype, areaId, date, dateType, projectId }) => {

    // const {area, date, type, meterType} = form.getFieldsValue() || {}
    // if(isNaN(type)) return;

    let hander = ['', QueryEnergyAreaDay, QueryEnergyAreaMonth, QueryEnergyAreaYear][dateType]
    let time = getTime(date, dateType)
    const querys = {
      areaId,
      projectId,
      meterType: energytype,
      type: dateType,
      date: time
    }
    const params = [areaId]
    hander(querys, params).then(res => {
      let { success, data, errMsg } = res;

      if (success && Array.isArray(data) && data.length > 0) {
        setTableData(data.map(d => d.total))


        let source = []
        let dimensions = [
          { name: '时间', type: 'time' }
        ]
        let x = data[0].detail.map(i => i.dot.toString())
        source.push(x)
        data.forEach(item => {
          let { detail, total } = item
          let name = total.name
          let list = detail.map(i => i.e)
          source.push(list)
          dimensions.push({ name })
        })
       
        setOptions({
          ...boptions,
          series: Array.from({ length: data.length }, () => ({ type: "bar", seriesLayoutBy: 'row', stack: 'x' })),
          dataset: {
            dimensions,
            source,
            sourceHeader: false,
          }
        })
      } else {
        setTableData([])
        setOptions({
          ...boptions,
          dataset: {
            dimensions: [],
            source: [],
            sourceHeader: false,
          }
        })
        if (!success) message.warning(errMsg || '数据出错')
      }
    })
  }


  const [mode, setMode] = useState(1)

  const onChange = (e) => {
    setMode(e.target.value)
  }



  useEffect(() => {
    let f = [energytype, areaId, dateType, projectId].every(v => Number.isInteger(v)) && date
    if (f) {
      getData({ energytype, areaId, date, dateType, projectId })
    }

  }, [energytype, areaId, date, dateType, projectId])
  const Title = (
    <CustTitle className="t">
      区域能耗趋势
      <Radiogroup options={[
        {
          label: "图表模式",
          value: 1
        },
        {
          label: "列表模式",
          value: 2
        }
      ]}
        optionType="button"
        buttonStyle="solid"
        onChange={onChange}
        value={mode}
      ></Radiogroup>
    </CustTitle>
  );

  return (


    <Pagecount bgcolor="transparent" pd="0">

      <Laybox  >
        <Titlelayout title={Title} key="up" layout="flex" className="left">
          <div style={{ paddingTop: "16px", flex: 1, display: "flex", justifyContent: "center" }}>
            {
              mode == 1 ? <Ichart {...boptions} /> : <UseTable dataSource={tableData} columns={columns} key="table" />
            }

          </div>
        </Titlelayout>
        <div className="right">
          <Titlelayout title={dateType == 1 ? '今日能耗占比' : dateType == 2 ? '本月能耗占比' : dateType == 3 ? '本年能耗占比' : '能耗占比'} key='pie' layout="flex" className="rup">
            <div style={{ flex: 1, display: 'flex' }}>
              <Ichart {...poptions.current} />
            </div>
          </Titlelayout>
          <Titlelayout title="区域能耗排名" key='sort' className="rdown">
            <Sdiv>
              <div className="sort">
                {sort[0] && <>
                  <Image style={{ width: "40px" }} src={imgurl.a01} preview={false}></Image>
                  <div className="data">
                    <Text ellipsis >{sort[0]?.name}</Text>
                    <div> <Text style={{ fontSize: "16px" }} ellipsis>{nf.format(sort[0]?.e)}</Text>&nbsp;<span>{sort[0]?.e && unit}</span></div>
                  </div>
                </>
                }
              </div>

              <div className="down">
                <div className="sort">
                  {
                    sort[1] && <>
                      <Image style={{ width: "40px" }} src={imgurl.a02} preview={false}></Image>
                      <div className="data">
                        <Text ellipsis>{sort[1]?.name}</Text>
                        <div><Text style={{ fontSize: "16px" }} ellipsis>{nf.format(sort[1]?.e)}</Text>&nbsp;<span>{sort[1]?.e && unit}</span> </div>
                      </div>
                    </>
                  }
                </div>
                <div className="sort">
                  {
                    sort[2] &&
                    <>
                      <Image style={{ width: "40px" }} src={imgurl.a03} preview={false}></Image>
                      <div className="data">
                        <Text ellipsis>{sort[2]?.name}</Text>
                        <div> <Text style={{ fontSize: "16px" }} ellipsis>{nf.format(sort[2]?.e)}</Text>&nbsp;<span>{sort[2]?.e && unit}</span> </div>
                      </div>
                    </>
                  }
                </div>
              </div>
            </Sdiv>
          </Titlelayout>
        </div>

      </Laybox>
    </Pagecount>
  );
}
