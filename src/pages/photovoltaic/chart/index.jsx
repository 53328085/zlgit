import React, { useRef, useEffect, useState, useMemo } from 'react'
import { CloseOutlined } from "@ant-design/icons"
import Pagecount from '@com/pagecontent'
import { isObject } from "@com/usehandler"

import { useOutletContext } from "react-router-dom"
import { useOverview, useDetail } from "./api"
import imgurl from './imgs'
import { custsty, Mainwrap, TitP } from './style'
import Ichart from "@com/useEcharts/Ichart"
import { Point } from "@com/comstyled"
import { message } from 'antd'
let timedata = Array.from({ length: 10 }, (_, index) => `0${index}:0${index}`)
let randData = Array.from({ length: 10 }, (_, index) => Math.round(Math.random() * 100))
let randData2 = Array.from({ length: 10 }, (_, index) => Math.round(Math.random() * 100))

export default function Index() {
  const [datas, setDatas] = useState({})

  const { projectId } = useOutletContext()
  const [info, setInfo] = useState()
  const [lineopt, baropt, createopt, incomeopt] = useMemo(() => { // 亮灯率 ， 市电，绿电, 发电量
    let {
      lightRates,
      useds,
      creates,
      incomes,

    } = isObject(datas) ? datas : {}

    const comm = {
      grid: {
        left: "0px",
        right: "0",
        top: "40px",
        bottom: "0px",
        containLabel: true,
      },
      legend: {
        top: "0px",
        textStyle: {
          color: "#fff"
        }
      },
      xAxis: {
        axisLabel: {
          showMaxLabel: true,
          hideOverlap: true,
          interval: "auto",
          fontSize: "10px",
          color: "#fff"
        }
      },
    }
    let lopt = {  // 亮灯率
      series: [{ type: "line", seriesLayoutBy: 'row', smooth: false, symbolSize: 8, showSymbol: true }],
      ...comm,
      color: ["#1098FF"],
      dataset: {
        dimensions: [
          {
            name: "时间", type: "time"
          },
          "金额"
        ],
        source: [

          lightRates?.x,
          lightRates?.y
        ],
        sourceHeader: false,
      },

    }
    let bopt = { // 用电量
      series: [{ type: "bar", seriesLayoutBy: 'row', stack: "ec" }, { type: "bar", seriesLayoutBy: 'row', stack: "ec" }],
      ...comm,
      color: ["#5372FF", "#47DC73"],
      dataset: {
        dimensions: [
          {
            name: "时间", type: "time"
          },
          "市电",
          "绿电"
        ],
        source: [
          useds?.x,
          useds?.y,
          useds?.y1,
        ],
        sourceHeader: false,
      },

    }
    let copt = { // 发电量
      series: [{ type: "bar", seriesLayoutBy: 'row' }],
      ...comm,
      color: ["#47DC73", "#5372FF"],
      dataset: {
        dimensions: [
          {
            name: "时间", type: "time"
          },
          "发电量",

        ],
        source: [
          Array.isArray(creates?.x) ? creates?.x : [],
          Array.isArray(creates?.y) ? creates?.y : [],
          /*  timedata,
           randData */
        ],
        sourceHeader: false,
      },

    }
    let inopt = {  // 发电收益
      series: [{ type: "line", seriesLayoutBy: 'row', smooth: false, symbolSize: 8, showSymbol: true }],
      ...comm,
      color: ["#05C06E"],
      dataset: {
        dimensions: [
          {
            name: "时间", type: "time"
          },
          "金额"
        ],
        source: [
          Array.isArray(incomes?.x) ? incomes?.x : [],
          Array.isArray(incomes?.y) ? incomes?.y : [],
        ],
        sourceHeader: false,
      },

    }
    return [lopt, bopt, copt, inopt]
  }, [datas])


  const getData = async () => {
    try {
      let { success, data } = await useOverview({ projectId })
      if (success && isObject(data)) {
        setDatas(data)
      } else {
        setDatas({})
      }

    } catch (error) {

    }
  }
  const getpoint = async (rid, x, y) => {
    try {
      if (!Number.isInteger(Number.parseInt(rid))) return message.warning("路灯Id无效")
      let { success, data, errMsg } = await useDetail({ rid, projectId })
      if (success && isObject(data)) {
        setInfo({ x, y, ...data })
      } else {
        setInfo({ x, y })
        if (!success) message.warning(errMsg || "数据出错")
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (Number.isInteger(projectId)) {
      getData()
    }

  }, [projectId])
  const tref = useRef()
  useEffect(() => {
    console.log(tref)
  }, [])
  const onMouseDown = (event) => {
    try {
      let ball = tref.current
      let shiftX = event.clientX - tref.current.getBoundingClientRect().left;
      let shiftY = event.clientY - tref.current.getBoundingClientRect().top;
      moveAt(event.pageX, event.pageY);

      // 移动现在位于坐标 (pageX, pageY) 上的球
      // 将初始的偏移考虑在内
      function moveAt(pageX, pageY) {
        ball.style.left = pageX - shiftX + 'px';
        ball.style.top = pageY - shiftY + 'px';
      }

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
      }

      // 在 mousemove 事件上移动球
      document.addEventListener('mousemove', onMouseMove);

      // 放下球，并移除不需要的处理程序
      ball.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        ball.onmouseup = null;
      };
    } catch (error) {
      console.log(error)
    }

  }
  const onMouseMove = (e) => {
    // console.log(e)
  }
  return (
    <Pagecount custsty={custsty} bgcolor="none">
      <Mainwrap>
        <div className="contentBox">
          <div className="left">
            <div className="left1">
              <div className="info">
                <div className='infoBox'>
                  <div className="item">
                    <img src={imgurl?.["lineNum"]}></img>
                    <div className='data'>
                      <span className='label'>光伏电站(个)</span>
                      <span className='value'>{datas?.loopNum}</span>
                    </div>
                  </div>
                  <div className="item">
                    <img src={imgurl?.["lightNum"]}></img>
                    <div className='data'>
                      <span className='label'>总表数(个)</span>
                      <span className='value'>{datas?.highPoleNum}</span>
                    </div>
                  </div>
                </div>
                <div className='infoBox'>
                  <div className="item">
                    <img src={imgurl?.["sun"]}></img>
                    <div className='data'>
                      <span className='label'>逆变器数(个)</span>
                      <span className='value'>{datas?.solarNum}</span>
                    </div>
                  </div>
                  <div className="item">
                    <img src={imgurl?.["sun"]}></img>
                    <div className='data'>
                      <span className='label'>逆变器在线率</span>
                      <span className='value'>21% <span>(2/8)</span></span>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="chartWrap">
                <Ichart {...lineopt} />
              </div>
              <div className='chartTitle mt-4'>近7日用电量(kWh)</div>
              <div className="chartWrap">
                <Ichart {...baropt} />
              </div> */}

            </div>

            <div className='left2'>
              <div className="topInfo">
                <div className="item">
                  <img src={imgurl?.["sun"]}></img>
                  <div className='data'>
                    <span className='label'>今日发电量</span>
                    <span className='value'>121</span>
                  </div>
                </div>
                <div className="item">
                  <img src={imgurl?.["sun"]}></img>
                  <div className='data'>
                    <span className='label'>本月发电量</span>
                    <span className='value'>121</span>
                  </div>
                </div>
                <div className="item">
                  <img src={imgurl?.["sun"]}></img>
                  <div className='data'>
                    <span className='label'>本年发电量</span>
                    <span className='value'>121</span>
                  </div>
                </div>
                <div className="item">
                  <img src={imgurl?.["sun"]}></img>
                  <div className='data'>
                    <span className='label'>累计发电量</span>
                    <span className='value'>121</span>
                  </div>
                </div>
              </div>
              <div className="chartWrap">
                <Ichart {...createopt} />
              </div>
            </div>
          </div>
          <div className="middler">
            {/* src={datas?.image} */}
            <img src={imgurl?.["photovoltaic"]} className='img' onClick={() => { }} />
            {
              datas?.locationInfos?.map(l => <Point left={l.x} top={l.y} key={l.lightName} data-descr={l.lightName} onClick={() => getpoint(l.lightId, l.x, l.y)}></Point>)
            }
            {info && <TitP left={info.x} top={info.y} onDrag={() => false} ref={tref}>
              <h5 className="title">{info.name} <CloseOutlined style={{ color: "#2AFAFF", position: "absolute", top: "4px", right: "4px" }} onClick={() => setInfo(null)} /> </h5>
              <div className="contentbox">
                {

                  info?.fields?.map(i => (<div className="content">
                    <p className="key">{i.name}</p>
                    <p className="value">{i.value}</p>
                  </div>))

                }
              </div>
            </TitP>}
          </div>
          <div className="right">
            <div className="right1 rightAll">
              <div className="item">
                <img src={imgurl?.["sun"]}></img>
                <div className='data'>
                  <span className='label'>天气状态</span>
                  <span className='value'>晴（26℃）</span>
                </div>
              </div>
              <div className="item">
                <img src={imgurl?.["sun"]}></img>
                <div className='data'>
                  <span className='label'>环境温湿度</span>
                  <span className='value'>35℃/12.5%</span>
                </div>
              </div>
              <div className="item">
                <img src={imgurl?.["sun"]}></img>
                <div className='data'>
                  <span className='label'>风向</span>
                  <span className='value'>西南</span>
                </div>
              </div>
            </div>

            <div className="right2 rightAll">
              <div className="item">
                <img src={imgurl?.["sun"]}></img>
                <div className='data'>
                  <span className='label'>告警总数</span>
                  <span className='value'>11</span>
                </div>
              </div>
              <div className='alarmBox'>
                <div className="item">
                  <div className='data'>
                    <div className='level'>
                      <span className='circle1 circle'></span>
                      <span className='label'>一级告警</span>
                    </div>
                    <span className='value1'>3</span>
                  </div>
                </div>
                <div className="item">
                  <div className='data'>
                    <div className='level'>
                      <span className='circle2 circle'></span>
                      <span className='label'>二级告警</span>
                    </div>
                    <span className='value2'>3</span>
                  </div>
                </div>
                <div className="item">
                  <div className='data'>
                    <div className='level'>
                      <span className='circle3 circle'></span>
                      <span className='label'>三级告警</span>
                    </div>
                    <span className='value3'>5</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="right3 rightAll">
              <div className="item">
                <img src={imgurl?.["sun"]}></img>
                <div className='data'>
                  <span className='label'>本日等效碳排</span>
                  <span className='value'>12123m³</span>
                </div>
              </div>
              <div className="item">
                <img src={imgurl?.["sun"]}></img>
                <div className='data'>
                  <span className='label'>本月等效碳排</span>
                  <span className='value'>12123m³</span>
                </div>
              </div>
              <div className="item">
                <img src={imgurl?.["sun"]}></img>
                <div className='data'>
                  <span className='label'>本年等效碳排</span>
                  <span className='value'>12123m³</span>
                </div>
              </div>
            </div>
            <div className="right4">
              <div className="topInfo">
                <div className="item">
                  <img src={imgurl?.["sun"]}></img>
                  <div className='data'>
                    <span className='label'>今日折算收益</span>
                    <span className='value'>121</span>
                  </div>
                </div>
                <div className="item">
                  <img src={imgurl?.["sun"]}></img>
                  <div className='data'>
                    <span className='label'>本月折算收益</span>
                    <span className='value'>121</span>
                  </div>
                </div>
                <div className="item">
                  <img src={imgurl?.["sun"]}></img>
                  <div className='data'>
                    <span className='label'>本年折算收益</span>
                    <span className='value'>121</span>
                  </div>
                </div>
                <div className="item">
                  <img src={imgurl?.["sun"]}></img>
                  <div className='data'>
                    <span className='label'>累计折算收益</span>
                    <span className='value'>121</span>
                  </div>
                </div>
              </div>
              <div className="chartWrap">
                <Ichart {...lineopt} />
              </div>
            </div>
          </div>
        </div>
      </Mainwrap>

    </Pagecount>
  )
}

