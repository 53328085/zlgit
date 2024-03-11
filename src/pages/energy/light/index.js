import React, { useState, useEffect, useRef } from 'react' 
import { SearchOutlined, QuestionCircleFilled, RightOutlined, LeftOutlined, CheckCircleFilled, WarningFilled } from '@ant-design/icons';
import {   Button, Image, Empty, message,Space } from 'antd';
import styled from 'styled-components';
import Titlelayout from '@com/titlelayout'
import Ichart  from '@com/useEcharts/Ichart';
import Custmodl from '@com/useModal'
import imgurl from './img/index.js'
import { useRequest } from "ahooks";
import { drawEcharts } from "@com/useEcharts";
import {CustButton} from '@com/useButton'
import { energyDesigner } from '@api/api.js'
 
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
  const [keyword, setKeyword] = useState('')
  const toMainPage = () => {
    let display = false;
    props.sendToIndex(display);
  }
  const [messageApi, contextHolder] = message.useMessage();
  
 
  let [state, setstate] = useState('开启');
  let [operateState, setoperateState] = useState(true);
  const [Ctitle, setCtitle] = useState({});
  const [loading, setLoading] = useState(false);
  let [numfirst, setnumfirst] = useState(0);
  let [numlast, setnumlast] = useState(9);
  const [changeTag, setChangeTag] = useState('')
  //let [airList, setairList] = useState([]);
 
  const [lightDate, setlightDate] = useState('');
  let title = lightDate.slice(0,2)
  const [lightDateYesterday, setlightDateYesterday] = useState('');
 
  const aref = useRef()
  const elref = useRef(null)
  const sref = useRef()
  const {
    queryStreetLights,
    querOverview,
    lineOn,
    lineOff
  } = energyDesigner
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
    return querOverview(projectId, dateType, areaId, time).then(res => {
      let { success, data } = res
      if (success && Object.prototype.toString.call(data).slice(8,-1) =='Object') {
          let {total, detail  } = data

          let {x=[], y=[], y1= []} = detail || {}
          console.log(detail)
          console.log(x)
          setTotal(total)

          // ['本日（kWh）', '昨日（kWh）'] : data.type == 'month' ? ['本月（kWh）', '上月（kWh）'] : ['本年（kWh）', '去年（kWh）']
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
  const [airList, setairList] = useState([])
  const getDataList = () => {//路灯列表
    if(!(isFinite(projectId) && isFinite(areaId))) return
    return queryStreetLights(projectId, keyword, areaId).then(res => {
      let { success, data } = res
      if (success && data) {
        setairList(data)
        return Array.isArray(data) ?data : []
      } else {
        setairList([])
        messageApi.open({
          type: 'error',
          content: res.errMsg
        })
       return []
      }
    })
  }
   useRequest(getData, {
    refreshDeps: [exparams],
   // manual: true,
  })
 
  const { run: queryDataList } = useRequest(getDataList, {
    refreshDeps: [areaId, keyword, projectId],
   // manual: true,
  })
 
 
 
  const onclickBtn = (e, num, index) => {//点击远程操作按钮
    console.log(e, num, index)
    if (e.state == 1 && num == 2 || e.state == 0 && num == 1) {
      setCtitle(e)
      //setLightIndex(index)
      aref.current.onOpen()
      if (num == 1) {//开启
        setstate('开启')//弹窗文案
      } else {
        setstate('关闭')
      }
    }
  }

  const onOkAlert = () => {//执行远程开启/关闭操作
    aref.current.onCancel()
    setLoading(true)
    if (state == '开启') {
      return lineOn(projectId, Ctitle.sn, Ctitle.controlLine).then(res => {
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
      return lineOff(projectId, Ctitle.sn, Ctitle.controlLine).then(res => {
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



  }
  const onOkEdit = () => {//关闭操作提示反馈
    sref.current.onCancel()
  }


  const gotoHref = () => {//路灯列表后一个
    if (numlast < airList.length) {
      setnumfirst(++numfirst)
      setnumlast(++numlast)
      setairList(arr.list.slice(numfirst, numlast))
    } else {
      messageApi.open({
        type: 'warning',
        content: '当前已为最后一个……',
      });
    }
  }
  const cometoHref = () => {//路灯列表前一个
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
  }
 
  

  return (
    <Pagecount bgcolor="transparent" pd="0">
      {contextHolder}
      <Cspin size="large" spinning={loading} tip="控制命令下发中，请稍候……">
        <Mainbox>
          <div className="maintop">
            <div className="chart">
              {/* <div ref={elref} style={{ width: '100%', height: '100%', padding: 16 }}>
              </div> */}

              <Ichart {...options} />
            </div>
            <div className="right">
              <Titlelayout title={title + '路灯能耗 (kWh)'} layout="flex">
                <div className="airEnergy"   >
                 
                  <div style={{ borderRadius: '50%', width: 64, height: 64, backgroundColor: '#237AE4', marginTop: 16 }}><Image src={imgurl.logo} preview={false} width={64} height={64}></Image></div>
                  {/* </div> */}
                  <div className="airEnergyData">
                    <div className='line'>
                    <p>{lightDate} :{total?.periodValue ? total?.periodValue : '0.00'}</p>
                    <div className='myoy'>同比 :{total.mom ? total.mom : '0.00'}
                      {   parseFloat(total.mom)>0   ? <Image src={imgurl.up} preview={false} width={11} height={22} />  : <Image src={imgurl.down} preview={false} width={11} height={22} />}
                    </div>
                    </div>
                    <div className='line'>
                    <p>{lightDateYesterday}  :{total.lastMonthPeriodValue ? total.lastMonthPeriodValue : '0.00'}</p>
                    <div className='myoy'>环比 :{total.yoy ? total.yoy : '0.00'}
                      {parseFloat(total.yoy) > 0 ? <Image src={imgurl.up} preview={false} width={11} height={22} /> : <Image src={imgurl.down} preview={false} width={11} height={22} />}
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
            {/* <Divider dashed style={{ marginTop: 16, marginBottom: 16 }} /> */}
            <Cdivider type="h" margin="0" />  
            {airList?.length > 0 ? <div className="mainbottomcenter">
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
                    <Button className={item.state == 1 ? 'airBt airBtnOff' : 'airBtn'}  onClick={() => { onclickBtn(item, 1, index) }}>远程开启</Button>
                    <Button className={item.state == 1 ? 'airBtn' : 'airBtn airBtnOff'}   onClick={() => { onclickBtn(item, 2, index) }}>远程关闭</Button>
                  </div>
                }
                )}
              </div>
              {airList.length > 0 ? <div className="pageBtn">
                <RightOutlined style={{ fontSize: 58, color: '#a3a0a0' }} onClick={() => { gotoHref() }} /><LeftOutlined style={{ fontSize: 58, color: '#a3a0a0' }} onClick={() => { cometoHref() }} />
              </div> : ''}
            </div> : <Empty style={{ marginTop: 100 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          </div>
        </Mainbox>
        <Custmodl   title='远程控制' ref={aref} mold="cust" width={592} onOk={onOkAlert}>
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