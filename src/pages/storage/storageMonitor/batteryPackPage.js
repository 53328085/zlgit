import React, { useEffect,Fragment } from "react";
import style from './style.module.less'
import styled from "styled-components";
import envirTitle from './imgs/envirTitle.png'
import envirValue from './imgs/envirValue.png'
import warningPoint from '@imgs/warningPoint.png'
import batteryTopo from './imgs/batteryTopo.png'
import { StorageMonitorRuntime } from '@api/api.js'
import shortLine from './imgs/shortLine.png'
import { useReactive } from "ahooks";
import { message } from "antd";

export default function Index(props) {
    let { batteryItem } = props.batteryPackData
    const { queryBatteryWarning } = StorageMonitorRuntime
    console.log(props)
    const EnvirBox = styled.div`
        margin-top: 16px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        width: 260px;
        font-size: 14px;
        color: #fff;
        .titleBox{
        width: 142px;
        height: 36px;
        background-image: url(${envirTitle});
        background-size: 100% 100%;
        background-repeat: no-repeat;
        line-height: 36px;
        padding-left: 12px;
        }
        .valueBox{
        width: 114px;
        height: 36px;
        background-image: url(${envirValue});
        background-size: 100% 100%;
        background-repeat: no-repeat;
        line-height: 36px;
        padding-left: 12px;
        }
    `
    const BatteryTopo = styled.div`
        display: flex;
        align-items: center;
        .batteryPack{
            margin-left: 32px;
            width: 132px;
            height: 348px;
            background-image: url(${batteryTopo});
            background-size: 100% 100%;
            background-repeat: no-repeat;
            padding-top: 16px;
            padding: 16px 4px;
            .packName{
                word-wrap: break-word;
                text-align: center;
                font-size: 14px;
                line-height: 14px;
                color: #41a4b9;
                background-color: #003;
            }

        }
        .shortLine{
            margin-left: 6px;
            width: 40px;
            height: 6px;
            background-image: url(${shortLine});
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }
        .largeLine{
            margin-left: -1px;
            width: 0px;
            height: 703px;
            border-left: 2px solid #41a4b9;

        }
    `

    const MonitorItem = props => {
        return <div className={style.monitorItem}>
            <div className={style.monitorHeader}></div>
            <div className={style.pack}>
                <div className={style.packName}>{props.no}</div>
                <div className={style.packData}>
                    <div className={style.packItem}>
                        <span>{props.v}</span>
                        <span>(V)</span>
                    </div>
                    <div className={style.packItem}>
                        <span>{props.temp}</span>
                        <span>(℃)</span>
                    </div>
                </div>
            </div>
        </div>
    }

    const WarningCard = props => {
        return <div className={style.warningItem}>
            <div className={style.leftImg}>
                <img src={warningPoint} className={style.warningPoint}></img>
            </div>
            <div className={style.warningData}>
                <div className={style.warningtop}>
                    <span className={style.time}>{props.data.warningTime}</span>
                    <span className={style.description}>{props.data.name}</span>
                </div>
                <div className={style.warningbottom}>
                    <span className={style.description}>{props.data.content}</span>
                    <span className={style.level} style={{ color: '#c00' }}>{props.data.level}</span>
                </div>
            </div>
        </div>
    }

    const toWarning = () => {
    navigate('/index/runtimeStorage/alarmMessage',{
      state: { type: 'index', primary: 'runtimeStorage', title: '告警信息',  nested: 'alarmMessage' } 
    })
  }

  const state = useReactive({
    alarmData: []
  })
  const getAlarmData = () => {
    queryBatteryWarning(props.batteryPackData.projectId, batteryItem.id).then(res => {
        if(res.success){
            if(res.data){
                state.alarmData = res.data
                console.log(state.alarmData)
            }else{
                state.alarmData = []
            }
        }else{
            message.error(res.errMsg)
        }
    }).catch(e => {
        console.log(e)
    })
  }

  useEffect(()=> {getAlarmData()},[])

    return (
        <div className={style.batteryContent}>
            <div className={style.singleMonitor} style={{ position: 'relative' }}>
                <div className={style.cardTitle} style={{ color: '#fff', margin: 16 }}>
                    <span>电池组</span>
                </div>
                <BatteryTopo>
                    <div className="batteryPack">
                        <div className="packName">{batteryItem.batteryPackNo}</div>
                    </div>
                    <div className="shortLine"></div>
                    <div className="largeLine"></div>
                    {
                        batteryItem.packs ? 
                        <div className={style.monitorList}>
                        {batteryItem.packs.map((item, index) => {
                                return <MonitorItem {...item} key={index}></MonitorItem>
                            })}
                        </div> : <div className={style.monitorList}></div>

                    }
                </BatteryTopo>
                
                
            </div>
            <div className={style.singleWarning}>
                <div style={{ height: 152, backgroundColor: '#fff', borderRadius: 4, width: 288, padding: 16 }}>
                    <div className={style.cardTitle}>电池组</div>
                    <EnvirBox>
                        <div className='titleBox'>极柱正极温度 (℃)</div><div className='valueBox'>{batteryItem.positiveTemp}</div>
                        <div className='titleBox'>极柱负极温度 (℃)</div><div className='valueBox'>{batteryItem.negativeTemp}</div>
                    </EnvirBox>
                </div>
                <div className={style.newWarning} style={{height: 636}}>
                    <div className={style.cardTitle}>告警信息</div>
                    <span className={style.toWarning} onClick={() => toWarning()}>查看详情</span>
                    <div className={style.warningDetails} style={{height: 500}}>
                        {state?.alarmData?.map((item, index) => {
                            return <Fragment key={index}>
                                <WarningCard data={item} ></WarningCard>
                            </Fragment>
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}