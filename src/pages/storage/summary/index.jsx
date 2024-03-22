import React, { Fragment, useState, useEffect, useRef } from 'react'
import style from './style.module.less'
import { useNavigate, useOutletContext} from 'react-router-dom'
 
import { SiteSummaryRuntime, StorageAlarmRuntime, SiteManagerDesigner } from '@api/api.js'
import { message, Typography, Empty} from 'antd'
import Ichart  from '@com/useEcharts/Ichart'; 
import { range } from 'lodash'
import imgurl from './imgs'
 
import styled from 'styled-components'
 
import Pagecount from "@com/pagecontent";
 
import Titlelayout from "@com/titlelayout";
import Cempty from '@com/useEmpty'
const {Link, Paragraph, Text} = Typography
const  Mainbox = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: 360px 1fr ;
  column-gap: 16px;
  align-content: stretch;
  .left {
    display: grid;
    grid-template-rows: 236px 548px;
    row-gap: 16px;
    .info {
      display: grid;
      grid-template-columns: 208px 1fr;
      place-content:flex-end;;
      color: #666;
      column-gap: 16px;
      img {
        width: 208px;
        height: 156px;
      }
      .dtl {
        display: grid;
        grid-template-rows: repeat(3, 1fr);
        row-gap: 6px;
      }
    }
  }
  .right {
     display: grid;
     grid-template-rows: 88px 696px;
     row-gap: 16px;
     .rightup {
        display: flex;
        justify-content: space-between;
        .tips {
           display: flex;           
           padding: 12px;
           align-items: center;
           color: #fff;
           .tipsdown {
             font-size: 20px;
             color: #fff;
           }
        }
     }
     .rightdown {
       display: grid;
       grid-template-columns: 752px minmax(536px, auto);
       column-gap: 16px;
       .topology {
         position: relative;
         .zhanwei{
                    width: 752px;
                    height: 696px;
                }
                .storageMeter{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-direction: column;
                    position: absolute;
                    left: 223px;
                    top: 367px;
                    padding: 6px 12px;
                    width: 164px;
                    height: 80px;
                    border: 1px solid #41A4B9;
                    background-color: #003;
                   
                }
                .transformer{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-direction: column;
                    position: absolute;
                    right: 130px;
                    top: 163px;
                    padding: 4px 12px;
                    width: 164px;
                    height: 80px;
                    border: 1px solid #41A4B9;
                    background-color: #003;
                   
                }
                .batterys{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-direction: column;
                    position: absolute;
                    right: 176px;
                    top: 367px;
                    padding: 4px 12px;
                    width: 164px;
                    height: 80px;
                    border: 1px solid #41A4B9;
                    background-color: #003;
                }
                .meterData{
                        display: flex;
                        align-items: center;
                        span{
                            display: inline-block;
                            text-align: right;
                            height: 20px;
                            line-height: 20px;
                            font-size: 12px;
                            color: #fff;
                        }
                        span:first-child{
                            width: 38px;
                            text-align: left;
                        }
                        span:nth-child(2){
                            width: 67px;
                            font-size: 14px;
                        }
                        span:last-child{
                            width: 32px;
                            color: #c9c9c9;
                        }
                    }
                .transPlaceholder{
                    position: absolute;
                    width: 136px;
                    height: 136px;
                    left: 76px;
                    top: 364px;
                    cursor: pointer;
                }
                .batteryPlaceholder{
                    position: absolute;
                    width: 136px;
                    height: 136px;
                    left: 76px;
                    top: 549px;
                    cursor: pointer;
                }
       }
       .rightdownright {
         display: grid;
         grid-template-rows: repeat(2, 340px);
         row-gap: 16px;
       }
     }
  }
`
const CircleDiv = styled.div`
margin-top: 4px;
margin-right: 16px;
width: 16px;
height: 16px;
border: 1px solid ${props=>props.level===1?'#ff7070':props.level===2?'#ffb726':'#b07ef9'};
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
.warningPoint {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color:${props=>props.level===1?'#ff7070':props.level===2?'#ffb726':'#b07ef9'};
  }
`
const { querySiteInfo,
  queryStorageIncome,
  queryStorageWarning,
  queryTopologyDiagramInfo,
  queryChargeETrends } = SiteSummaryRuntime
export default function Index() {
  const TransDiv = styled.div`
  padding-top: 18px;
  animation: movetop ${props => {return props.speed}}s infinite linear;
  &:hover{
    animation-play-state: paused;
  }

  @keyframes movetop{
    from{
        transform: translateY(0);
    }
    to{
        transform: translateY(-${props =>{        
          if(!props.dmheight || props.dmheight<445)return 0
          if(props.dmheight){
            return props.dmheight
          }
         } }px );
          /* return (props.children[0].length-4)*116} }px ); */
    }
}
`
  let {exparams} = useOutletContext()
 
  let {areaId, stationName,  projectId} = exparams
  console.log(exparams)
  const navigate = useNavigate()
  const [cardData, setCardData] = useState(null)//卡片数据
  const [warningData, setWarningData] = useState([])//最新告警
  const [topologyData, setTopologyData] = useState({
    loadDevice: {},
    onGridDevice: {},
    storageDevice: {}
  }) //接线图数据

  useEffect(() => {
    
    if(!(Number.isFinite(areaId) && Number.isFinite(projectId) && stationName && isFinite(stationName))) return
   
    querySiteInfo(projectId, areaId, stationName).then(res => {
      const {success, data} = res
      if (success && Object.prototype.toString.call(data).slice(8,-1)=="Object") {
        setCardData(res.data)
      } else {
        setCardData(null)
       //message.error(res.errMsg)
      }
    }).catch()

    queryStorageIncome(projectId,  areaId, stationName).then(res => {
      let { success, data } = res
      if (success) {
        if (Object.prototype.toString.call(data).slice(8, -1) === 'Object') {
          let {x, y, y1, y2} = data
        setOptions({...options,  dataset: {
            dimensions: [
              {
                name: 'x',
                type: 'time'
              },
              {
                name: 'y',
                displayName: '充电金额(元)'
              },
              {
                name: 'y1',
                displayName: '放电金额(元)'
              },
              {
               name: 'y2',
               displayName: '收益(元)'
             }
            ],
            source: [x, y, y1, y2],
            sourceHeader: false,
           },
          }
        )
        } else {
          setOptions({...options,  dataset: {
            dimensions: [],
             source: [],
            sourceHeader: false,
           },
          }
        )
        }
      } else {
        setOptions({...options,  dataset: {
          dimensions: [],
           source: [],
          sourceHeader: false,
         },
        }
      )
        message.error(res.errMsg)
      }
    }).catch

    queryStorageWarning(projectId,  areaId, stationName).then(res => {
      let { success, data } = res
      if (success) {
        if (data) {
          setWarningData(data)
        } else {
          setWarningData([])
        }
      } else {
        message.error(res.errMsg)
      }
    }).catch()

    queryTopologyDiagramInfo(projectId,  areaId, stationName).then(res => {
      if (res.success) {
        if (res.data) {
          setTopologyData(res.data)
        } else {
          setTopologyData({
            loadDevice: {},
            onGridDevice: {},
            storageDevice: {}
          })
        }
      } else {
        setTopologyData({
          loadDevice: {},
          onGridDevice: {},
          storageDevice: {}
        })
        //message.error(res.errMsg)
      }
    }).catch()


    queryChargeETrends(projectId,  areaId, stationName).then(res => {
      let {success, data} = res
      if (success) {
        if (Object.prototype.toString.call(data).slice(8,-1)=="Object") {
           let {x, y, y1} = data

           setLoptions({...loptions, dataset: {
            dimensions: [
              {
                name: 'x',
                type: 'time'
              },
              {
                name: 'y',
                displayName: '充电电量(kWh)'
              },
              {
                name: 'y1',
                displayName: '放电电量(kwh)'
              }
            ],
            source: [x, y, y1],
            sourceHeader: false,
           
           }})
        } else {
          setLoptions({...loptions, dataset: {
            dimensions: [],
            source: [],
            sourceHeader: false,
           
           }})
        }
      } else {
        setLoptions({...loptions, dataset: {
          dimensions: [],
          source: [],
          sourceHeader: false,
         
         }})
       // message.error(res.errMsg)
      }
    }).catch()


  }, [exparams])
  const Tips = props => {
    return <div className="tips"style={{ backgroundColor: props.bgcolor, width: props.width || 240 }}>
      <img src={props.imgUrl} className={style.tipImg}></img>
      <div style={{paddingLeft: "16px"}}> 
        <Paragraph style={{color: "#fff"}}>{props.title}</Paragraph >
        <Text className="tipsdown" ellipsis={{tooltip: props.value}}>{props.value}</Text>
      </div>
    </div>
  }
  
  const CustomProgress = props => {
    let { dischargeData, chargeData } = props
    let total = parseFloat(dischargeData) + parseFloat(chargeData)
    let dischargeCount = parseFloat(dischargeData) == 0 ? 0 : parseInt(((parseFloat(dischargeData) * 100) / total) / (100 / 65)) + 1
    let chargeCount = parseFloat(chargeData) == 0 ? 0 : parseInt(((parseFloat(chargeData) * 100) / total) / (100 / 65)) + 1
    let chargelist = range(chargeCount)
    let dischargeList = range(dischargeCount)
    const progressStyle = {
      width: 328,
      height: 36,
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      overFlow: 'hidden',
      paddingLeft: 1,
      border: '1px solid #d7d7d7'
    }
    return <div style={progressStyle}>
      {dischargeList.map(item => {
        return <div style={{ width: 4, height: 32, backgroundColor: "#4370ff", marginRight: 1 }} key={item}></div>
      })}
      {chargelist.map(item => {
        return <div style={{ width: 4, height: 32, backgroundColor: "#f93", marginRight: 1 }} key={item}></div>
      })}
    </div>
  }
  const StateCard = props => {
    const customStyle = props.styles ? props.styles : null
    return <div className={style.stateCard} style={{ width: props.width }}>
      <div className={style.stateTitle} style={customStyle}>{props.title}</div>
      <div className={style.stateValue}>{props.value}</div>
    </div>
  }
  const WarningCard = props => {
    const mapobj = new Map([[1,{color:'#ff7070',text:'一级告警'}],[2,{color:'#ffb726',text:'二级告警'}],[3,{color:'#b07ef9',text:'三级告警'}]])
    return <div className={style.warningItem}>
      {/* <div className={style.leftImg}>
        <img src={warningPoint} className={style.warningPoint}></img>
      </div> */}
      <CircleDiv level={props.data?.level}>
        <div className='warningPoint'></div>
      </CircleDiv>
      <div className={style.warningData}>
        <div className={style.warningtop}>
     
            <span className={style.time}>{props.data.warningTime}</span>
            <span className={style.level} style={{ color:mapobj.get(props.data.level).color,fontSize:12 }}>{
                     mapobj.get(props.data.level).text
                    } </span>
        
        </div>
        <div style={{ fontSize: 12, color: '#6b6b6b', marginTop: 6,wordBreak: 'break-all' }} >{props.data.alarmEvent}</div>
        <div className={style.warningbottom}>
          <span className={style.sn}>{props.data.name}</span>
        </div>
        <div style={{ fontSize: 12, color: '#6b6b6b', marginTop: 6 }}>{props.data.address}</div>
      </div>
    </div>
  }
  const toPage = (key, label) => {
    navigate(`/index/runtimeStorage/${key}`, {
      state: { type: 'index', primary: 'runtimeStorage', title: label, nested: key }
    })
  }
  const [domheight,setDomHeight] =useState(0)
  const [speed,setSpeed]=useState(0)
  useEffect(()=>{
    if(document.getElementById('warn')&&warningData.length>0){
      const warndom = document.getElementById('warn')
      setDomHeight(warndom.getBoundingClientRect().height)
      setSpeed(warndom.getBoundingClientRect().height/60)
    }
  },[warningData.length])
 
  const [options, setOptions] = useState({
    series: [{ type: "bar",  seriesLayoutBy: 'row' }, { type: "bar",  seriesLayoutBy: 'row' },  { type: "line", seriesLayoutBy: 'row' },],  
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
  const [loptions, setLoptions] = useState({
    series: [{ type: "line",  seriesLayoutBy: 'row' }, { type: "line",  seriesLayoutBy: 'row' }],  
    grid: { 
      left: "0px",
      right: "0",
      top: "30px",
      bottom: "0px",
      containLabel: true,
    },
    legend: {
      icon: 'circle'
     },
    dataset: {}
  })

  return (
    <Pagecount  pd={0} bgcolor='transparent'  >    
      <Mainbox>
        <div className="left">
          <Titlelayout title='站点信息' layout="flex">
          {cardData ? (<div className="info">
              <img src={cardData.image || imgurl.zhandian} className='siteImg' /> 
            
              <div className="dtl">
                   <div key="1">
                  <Text>站点容量</Text>
                     <Text ellipsis={{tooltip: cardData?.storageCapacity}}>{cardData?.storageCapacity} &nbsp;kVA</Text>
                  </div>
                  <div key="2">
                  <Text>实时充电功率</Text>
                  <Text ellipsis={{tooltip: cardData?.runtimeChargeP}}> {cardData?.runtimeChargeP}&nbsp;kW</Text>
                  </div>
                  <div key="3">
                  <Text>投运时间</Text>
                  <Text ellipsis={{ tooltip: cardData?.useDate}}>{cardData?.useDate}</Text>
                  </div>
              </div> 
            
              </div>)
              :  <Cempty tip="未查询到站点信息！" />
           }
           
          </Titlelayout>
          {/* <CardItem title='充放电统计' height='136px'>
            <div className={style.stateItems}>
              <StateCard width={'156px'} title={'储能总充电量'} value={'500.00 kWh'} styles={{ backgroundColor: '#237ae4', color: '#fff' }}></StateCard>
              <StateCard width={'156px'} title={'储能总放电量'} value={'500.00 kWh'} styles={{ backgroundColor: '#237ae4', color: '#fff' }}></StateCard>
            </div>
          </CardItem> */}
          <Titlelayout title='最新告警' height='548px' extra={<Link underline onClick={() => toPage('alarmMessage', '告警信息')}>查看详情</Link>}>
              <TransDiv   dmheight={domheight} speed={speed}>
                  <div id='warn'>
                    {warningData.map((item, index) => {
                    return <Fragment key={index}>
                      <WarningCard data={item} ></WarningCard>
                      <div className={style.division} style={{ margin: '10px 0' }}></div>
                      {/* {warningData.length > (index + 1) ? <div className={style.division} style={{ margin: '10px 0' }}></div> : null} */}
                    </Fragment>
                     })
                  }
                  </div>
                 
                  {
                    warningData.length>4?warningData.slice(0, 4).map((item, index) => {
                      return <Fragment key={index}>
                        <WarningCard data={item} ></WarningCard>
                        <div className={style.division} style={{ margin: '10px 0' }}></div>
                        {/* {warningData.length > (index + 1) ? <div className={style.division} style={{ margin: '10px 0' }}></div> : null} */}
                      </Fragment>
                    }):null
                  }
                
              </TransDiv>            
          </Titlelayout>
        </div>
        <div className="right">
          <div className="rightup">
            <Tips imgUrl={imgurl.totalCharge} title={'总充电量 (kWh)'} value={cardData?.chargingCapacity} bgcolor={'#56b653'}></Tips>
            <Tips imgUrl={imgurl.totalDischarge} title={'总放电电量 (kWh)'} value={cardData?.disChargingCapacity} bgcolor={'#4370ff'}></Tips>
            <Tips imgUrl={imgurl.totalChargeCost} title={'总充电金额 (元)'} value={cardData?.chargingAmount} bgcolor={'#fea526'}></Tips>
            <Tips imgUrl={imgurl.totalDischargeCost} title={'总放电金额 (元)'} value={cardData?.disChargingAmount} bgcolor={'#ff6642'}></Tips>
            <Tips imgUrl={imgurl.totalIncome} title={'储能总收益 (元)'} value={cardData?.storageIncome} bgcolor={'#9951fe'} width={'280px'}></Tips>
          </div>
          <div className="rightdown" >
            <div className="topology">
              <img src={imgurl.zhanwei} className={style.zhanwei}></img>
              {/* 储能总表 */}
              <div className='storageMeter'>
                <div className='meterData'>
                  <span>电压:</span>
                  <span>{topologyData?.storageDevice.v}</span>
                  <span>(V)</span>
                </div>
                <div className='meterData'>
                  <span>电流:</span>
                  <span>{topologyData?.storageDevice.i}</span>
                  <span>(A)</span>
                </div>
                <div className='meterData'>
                  <span>功率:</span>
                  <span >{topologyData?.storageDevice.p}</span>
                  <span>(kW)</span>
                </div>
              </div>
              {/*并网总表器*/}
              <div className='transformer'>
                <div className='meterData'>
                  <span >电压:</span>
                  <span>{topologyData?.onGridDevice.v}</span>
                  <span>(V)</span>
                </div>
                <div className='meterData'>
                  <span>电流:</span>
                  <span>{topologyData?.onGridDevice.i}</span>
                  <span>(A)</span>
                </div>
                <div className='meterData'>
                  <span>功率:</span>
                  <span>{topologyData?.onGridDevice.p}</span>
                  <span>(kW)</span>
                </div>
              </div>
              {/*负载总表*/}
              <div className='batterys'>
                <div  className='meterData'>
                  <span>电压:</span>
                  <span>{topologyData?.loadDevice.v}</span>
                  <span>(V)</span>
                </div>
                <div  className='meterData'>
                  <span >电流:</span>
                  <span  >{topologyData?.loadDevice.i}</span>
                  <span >(A)</span>
                </div>
                <div  className='meterData'>
                  <span>功率:</span>
                  <span>{topologyData?.loadDevice.p}</span>
                  <span>(kW)</span>
                </div>
              </div>
              <div className='batteryPlaceholder' onClick={() => toPage('BMSMonitor', 'BMS监控')}></div>
            </div>
            <div className="rightdownright">
              <Titlelayout title='能耗收益统计' layout="flex">               
                 <div   style={{flex: 1, display: 'flex', paddingTop: '16px'}}>
                    <Ichart {...options} />
                 </div>
             
              </Titlelayout>
              <Titlelayout title='储能充放电趋势' layout="flex">
             
                <div style={{flex: 1, display: 'flex', paddingTop: '16px'}}>
                       <Ichart {...loptions}/>
                </div>
              </Titlelayout>
            </div>
          </div>
        </div>
      </Mainbox>
    </Pagecount>
   
  )
}
