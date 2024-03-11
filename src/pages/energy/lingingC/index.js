import React, { useState,  useRef } from 'react'
 
import {  QuestionCircleFilled, RightOutlined, LeftOutlined } from '@ant-design/icons';
import {   Button, Image,   message, Space } from 'antd';
import styled from 'styled-components';
import Titlelayout from '@com/titlelayout'
import Custmodl from '@com/useModal'
import imgurl from './img/index.js'
import { useRequest } from "ahooks";
 
import Ichart  from '@com/useEcharts/Ichart'; 
import { energyDesigner } from '@api/api.js'
import {CustButton} from '@com/useButton'
import {useOutletContext} from 'react-router-dom'  
import Pagecount from "@com/pagecontent";
import {Cspin, Serach, Cdivider} from '@com/comstyled'
import {getTime} from '@com/usehandler'

const Mainbox = styled.div`
&& {
    flex: 1 1;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    flex-direction: column;
    row-gap: 16px;
    color: #515151;
    .maintop {
      flex: 1 1 328px;
      display: flex;
      justify-content: space-between;
      column-gap: 16px;
      .chart {
        display: flex;
        flex: 1 1 1264px;
        background-color: #fff;
        padding: 16px;
      }
      .right {
        display: flex;
        flex: 1 1 400px;
        .airEnergy {
          flex: 1;
          display: flex;
          justify-content: space-between;
          column-gap: 16px;
          padding: 16px;
          .imgborder {
            margin-top: 16px;
            height: 68px;
            width: 68px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid ${props => props.theme.primaryColor};
            border-radius: 50%;
          }
          .imgbox {
            border-radius: 50%;
             width: 60px;
             height: 60px;
              background-color: ${props => props.theme.primaryColor};
             
              
          }
          .airEnergyData {
            flex: 1;
            display: flex;
            flex-direction: column;
            row-gap: 32px;
            height: 100px;
            justify-content: space-around;
            .line {
              display: inline-flex;
              column-gap: 64px;
              .myoy { 
                display: flex;
                align-items: center;
                column-gap: 8px;
              }
            }
          }
        }
      }
    }
    .mainbottom {
      background-color: #fff;
      padding: 16px;
      flex: 1 1 456px;
      display: flex;
      flex-direction: column;
      row-gap: 16px;
      .mainbottomcenter{
        display: flex;
        justify-content: space-between;
        align-items: center;
      .boxList {
        overflow-x: hidden;
        flex: 1 1 1570px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        .aribox {
          width:160px;
          height: 360px;
          background: linear-gradient(180deg, #0033cc 0%, #0033cc 0%, #33ccff 100%, #33ccff 100%);
          margin-right: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-direction: column;
          padding: 16px;
         
          .title{
            color: #fff;
          }
          .airState {
            display: inline-flex;
            align-items: center;
          }
          .airBtn {
                background-color: rgba(0, 51, 102, 1);
                border: none;
                width: 132px;
                border-radius:32px;
                span {
                    color: #fff;
                }
            }

            .airBtnOff.airBtn {
                background-color: rgba(0, 51, 102, 0.5);
                border: none;

                span {
                    color: rgba(255, 255, 255, 0.5);
                }
            }
        }
      }
      .pageBtn {
        flex: 1 1 55px;
        height: 100%; 
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-direction: column;
      }
    }
    }
} 
`

export default function Index(props) {
 
  let {exparams} = useOutletContext()
  let {view, areaId, date, type:dateType,  projectId} = exparams 
  const {
    queryPublicLights,
    querOverviewLight,
    lineOnLight,
    lineOffLight
  } = energyDesigner
  const [loading, setLoading] = useState(false);
  const aref = useRef()
  const sref = useRef()
  const elref = useRef(null)
  const [changeTag, setChangeTag] = useState('')
  let [lightDate, setlightDate] = useState('');
  let title = lightDate.slice(0,2)
  let [lightDateYesterday, setlightDateYesterday] = useState('');
  let [state, setstate] = useState('开启');
  let charts = ['本年（kWh）', '去年（kWh）']
  let [operateState, setoperateState] = useState(true);
  const [Ctitle, setCtitle] = useState({});
  let [numfirst, setnumfirst] = useState(0);
  let [numlast, setnumlast] = useState(9);
  let [airList, setairList] = useState([]);
  let [changeState, setchangeState] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [total, setTotal] = useState({})
  const [options, setOptions] = useState({
    series: [{ type: "bar",  seriesLayoutBy: 'row' }, { type: "bar",  seriesLayoutBy: 'row' }],  
    grid: { 
      left: "0px",
      right: "0",
      top: "30px",
      bottom: "0px",
      containLabel: true,
    },
    legend: {
      top: 0,  
    },
    dataset: {}
  })
  const getData = () => {//图表和能耗详情值
    if (Object.values(exparams)?.length <5 ) return
    let time = getTime(date, dateType)
    return querOverviewLight(projectId, dateType, areaId, time).then(res => {
      let { success, data } = res
      if (success && Object.prototype.toString.call(data).slice(8,-1) =='Object') {
        let {total, detail  } = data

        let {x=[], y=[], y1= []} = detail || {}        
        setTotal(total)    
        let cur = ['本日（kWh）','本日（kWh）', '本月（kWh）','本年（kWh）'][dateType]
        setlightDate(cur)
        let pre =['昨日（kWh）','昨日（kWh）', '上月（kWh）','去年（kWh）'][dateType]
        setlightDateYesterday(pre)
        let dataset = {
          dimensions: [
            {name: '日期', type: 'time'},
            {name:  cur },
            {name: pre },
          ],
          source: [
            x, 
            y,
            y1,
          ],
         sourceHeader: false,
        }
      
        setOptions({...options, dataset})

     // energyInfo = data
     // console.log(energyInfo)
    } else {
        messageApi.open({
          type: 'error',
          content: res.errMsg
        })
      }
    })
  }
  const [keyword, setKeyword] = useState('')
  const getDataList = () => {//路灯列表
    if(!(isFinite(projectId) && isFinite(areaId))) return
    return queryPublicLights(projectId, keyword, areaId).then(res => {
      let { success, data } = res
      if (success && data) {
        setairList(Array.isArray(data) ?data : [])
        return Array.isArray(data) ?data : []
      } else {
        setairList([])
        messageApi.open({
          type: 'error',
          content: res.errMsg
        })
      }
    })
  
  }
 
  const { run: queryData } = useRequest(getData, {
    refreshDeps: [exparams],
   
  })
  const { run: queryDataList } = useRequest(getDataList, {
    refreshDeps: [areaId, keyword, projectId],
  })
 
 


  const onclickBtn = (e, num) => {
    console.log(e, num)
    if (e.state == 1 && num == 2 || e.state == 0 && num == 1) {
      setCtitle(e)
      aref.current.onOpen()
      if (num == 1) {//开启
        setstate('开启')
      } else {
        setstate('关闭')
      }
    }
  }//点击远程开启/关闭按钮

  const onOkAlert = () => {
    aref.current.onCancel()
    setLoading(true)
    if (state == '开启') {
      return lineOnLight(projectId, Ctitle.sn, Ctitle.controlLine).then(res => {
        let { success, data } = res
        if (success && data) {
          setLoading(false)
          setoperateState(true)
          sref.current.onOpen()
          queryDataList()
        } else {
          setLoading(false)
          setoperateState(false)
          sref.current.onOpen()
        }
      })
    } else if (state == '关闭') {
      return lineOffLight(projectId, Ctitle.sn, Ctitle.controlLine).then(res => {
        let { success, data } = res
        if (success && data) {
          setLoading(false)
          setoperateState(true)
          sref.current.onOpen()
          queryDataList()
        } else {
          setLoading(false)
          setoperateState(false)
          sref.current.onOpen()
        }
      })
    }
  }//远程控制确认
  const onOkEdit = () => {
    sref.current.onCancel()
  }//操作提示关闭按钮

  const gotoHref = () => {
    if (numlast < arr.list.length) {
      setnumfirst(++numfirst)
      setnumlast(++numlast)
      setairList(arr.list.slice(numfirst, numlast))
    } else {
      messageApi.open({
        type: 'warning',
        content: '当前已为最后一个……',
      });
    }
  }//下一个按钮
  const cometoHref = () => {
    if (numfirst > 0) {
      setnumfirst(--numfirst)
      setnumlast(--numlast)
      setairList(arr.list.slice(numfirst, numlast))
    } else {
      messageApi.open({
        type: 'warning',
        content: '当前已为第一个……',
      });
    }
  }//上一个按钮
 
 
  return (
    <Pagecount bgcolor="transparent" pd="0">
      {contextHolder}
      <Cspin size="large" spinning={loading} tip="控制命令下发中，请稍候……">
      {/*   <UseHeader {...headerProps} getValues={getFromChild}></UseHeader> */}
        <Mainbox>
          <div className="maintop">
             <div className="chart"> 
              <Ichart {...options} />
             </div>
            <div className="right">
              <Titlelayout title={lightDate + '路灯能耗 (kWh)'} layout="flex">
                <div className="airEnergy">
                  <div className='imgborder'>
                  <div className="imgbox">
                    <Image src={imgurl.light} preview={false} width={60} height={60} /> 
                  </div>
                  </div>
                  <div className="airEnergyData">
                    <div className='line'>
                    <p>{lightDate} :{total.periodValue ? total.periodValue : '0.00'}</p>
                    <div className='myoy'>同比 :{(total.mom) ? '+' + total.mom : '0.00'}
                      { parseFloat(total.mom) > 0 ? <Image src={imgurl.up} preview={false} width={11} height={22} />: <Image src={imgurl.down} preview={false} width={11} height={22} />}
                    </div>
                    </div>
                    <div className='line'>
                      <p>{lightDateYesterday}  :{total.lastMonthPeriodValue ? total.lastMonthPeriodValue : '0.00'}</p>
                      <div className='myoy'>环比 :{(total.yoy) ? '+' + total.yoy : '0.00'}
                        {parseFloat(total.yoy) ? <Image src={imgurl.up} preview={false} width={11} height={22} />  : <Image src={imgurl.down} preview={false} width={11} height={22} />}
                      </div>
                    </div>
                  </div>
                </div>
              </Titlelayout>
            </div>
          </div>
          <div className="mainbottom">
          <Space size={64} split={<Cdivider />}>
               <Space size={16}> <span>路灯控制</span><Serach   placeholder='请输入回路名称' style={{ width: '356px', }} onSearch={(v)=>setKeyword(v)} /></Space>
             
               <Space size={16}>
              <CustButton>全部开启</CustButton>
              <CustButton>全部关闭</CustButton>
              </Space>
            </Space>
           {/*  <div className={style.contentBottomTop}>

               

              <span>公共照明控制</span><Input size="middle" placeholder='请输入公共照明名称' style={{ width: '260px', marginLeft: 16 }} onChange={onChangeValue} />
              <Button style={{ width: 96 }} type='primary' size="middle" icon={<SearchOutlined />} onClick={() => { onSearchList() }}>查询</Button>
              
              <div style={{ marginLeft: 32, marginRight: 32, height: 32, borderLeft: "1px dashed #515151" }} ></div>
              <Button style={{ width: 96, height: 32 }} type='primary' size="middle" >全部开启</Button>
              <Button style={{ width: 96, height: 32, marginLeft: 16 }} type='primary' size="middle" >全部关闭</Button>
            </div> */}
            <Cdivider type="h" margin="0" />  
            <div className="mainbottomcenter">
              <div className="boxList">
                {airList.map((item, index) => {
                  return <div className="aribox" key={index}>
                    <p className="title">{item.name}</p>
                    {item.state == 1 ? <Image src={imgurl.light} preview={false} width={110} height={110}></Image> : <Image src={imgurl.light} preview={false} width={110} height={110} style={{ opacity: 0.3 }}></Image>}
                    <div className="airState">
                      {item.state == 1 ? <div style={{ width: 14, height: 14, backgroundColor: '#66FF00', borderRadius: '50%' }}></div> : <div style={{ width: 14, height: 14, backgroundColor: '#000', borderRadius: '50%' }}></div>}
                      {item.state == 1 ? <span style={{ fontSize: 12, color: '#fff', marginLeft: 5 }}>{item.state == 1 ? '开启' : '关闭'}</span> : <span style={{ fontSize: 12, color: '#003366', marginLeft: 5 }}>{item.state == 1 ? '开启' : '关闭'}</span>}
                    </div>
                    <Cdivider  type="h" color="#fff" margin="16px 0" />
                    <Button className={item.state == 1 ? 'airBt airBtnOff' : 'airBtn'} onClick={() => { onclickBtn(item, 1) }}>远程开启</Button>
                    <Button className={item.state == 1 ? 'airBtn' : 'airBtn airBtnOff'} onClick={() => { onclickBtn(item, 2) }}>远程关闭</Button>
                  </div>
                }
                )}
              </div>
              <div className="pageBtn">
                <RightOutlined style={{ fontSize: 58, color: '#a3a0a0' }} onClick={() => { gotoHref() }} /><LeftOutlined style={{ fontSize: 58, color: '#a3a0a0' }} onClick={() => { cometoHref() }} />
              </div>
            </div>
          </div>
        </Mainbox>
        <Custmodl title='远程控制' ref={aref} mold="cust" width={592} onOk={onOkAlert}>
          <div style={{ display: "flex", alignItems: "center", paddingLeft: 32 }}>
            <QuestionCircleFilled style={{ color: '#237AE4', fontSize: 48 }} />
            <p style={{ marginLeft: 32 }}>确认要远程{state}{Ctitle.name}？</p>
          </div>
        </Custmodl>
        <Custmodl title='操作提示' ref={sref}  mold="cust" width={592}   onOk={onOkEdit} type='warn'>
             {operateState ? '远程控制操作成功！' :  '远程控制操作失败，请重试!'}
        </Custmodl>
      </Cspin>
    </Pagecount>

  )
}