import React, { Fragment, useEffect, useState } from "react";
import style from './style.module.less'
import styled from "styled-components";
import { message } from "antd";
import warningPoint from '@imgs/warningPoint.png'
import { StorageMonitorRuntime } from '@api/api.js'
import envirTitle from './imgs/envirTitle.png'
import envirValue from './imgs/envirValue.png'
import packHover from './imgs/packHover.png'
import packNormal from './imgs/packNormal.png'
import { range } from "lodash";
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons'
export default function Index(props) {
    const TitleBox = styled.div`
        width: 156px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-left: 50%;
        transform: translateX(-78px);
        .littleSquare{
            width: 24px;
            height: 11px;
            border: 1px solid #d7d7d7;
            border-radius: 2px;
            border-bottom: none;
            margin:0 24px;
        }
        .bigSquare{
            width: 156px;
            height: 64px;
            border: 1px solid #d7d7d7;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            .titleItem{
                width: 128px;
                height: 28px;
                background-color: #039;
                text-align: center;
                line-height: 28px;
                color: #3f0;
            }
        }
    `
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

    const LeftButton = styled(CaretLeftOutlined)`
    font-size: 64px;
    position: absolute;
    left: 12px;
    top: 520px;
    color: #3c3c62;
    cursor: pointer;
    &:hover{
        color: #f2f2f2;
    }
    `
    const RightButton = styled(CaretRightOutlined)`
    font-size: 64px;
    position: absolute;
    right: 12px;
    top: 520px;
    color: #3c3c62;
    cursor: pointer;
    &:hover{
        color: #f2f2f2;
    }
    `

    const PackItem = styled.div`
        width: 132px;
        height: 504px;
        background-image: url(${packNormal});
        background-size: 100% 100%;
        background-repeat: no-repeat;
        margin-right: 21px;
        color: #a1a1a1;
        cursor: pointer;
        &:hover{
            background-image: url(${packHover});
            color: #3f0;
        }
        .dataItem{
            width: 132px;
            height: 348px;
            margin-top: 156px;
            padding: 12px 3px;
            .dataName{
                text-align: center;
                width: 126px;
                font-size: 14px;
                margin-bottom: 20px;
                word-wrap: break-word;
                line-height: 14px;
                height: 28px;
            }
            .dataTitle{
                width: 126px;
                height: 24px;
                line-height: 24px;
                font-size: 12px;
                color: #fff;
                text-align: center;
                background-color: #135abd;
            }
            .dataValue{
                width: 126px;
                height: 24px;
                line-height: 24px;
                font-size: 12px;
                color: #fff;
                text-align: center;
                background-color: #006;
                margin-bottom: 8px;
            }
        }
    `

    let { projectId, batteryCluster } = props.batteryData
    const { queryBatteryClusterInfo, queryBatteryPackInfo, queryBatteryClusterWarning } = StorageMonitorRuntime
    const TitleImg = props => {
        return <TitleBox>
            <div className="littleSquare"></div>
            <div className="littleSquare"></div>
            <div className="bigSquare">
                <div className="titleItem">{props.state}</div>
            </div>
        </TitleBox>
    }
    const MonitorItem = props => {
        return <div className={style.monitorItem}>
            <div className={style.monitorHeader}></div>
            <div className={style.pack}>
                <div className={style.packName}>{props.batteryPackNo}</div>
                <div className={style.packData}>
                    <div className={style.packItem} style={{ backgroundColor: props.voltage > '3.3' ? '#c00' : '#06f' }}>
                        {/* <span>电压</span> */}
                        <span>{props.v}</span>
                        <span>(V)</span>
                    </div>
                    <div className={style.packItem} style={{ backgroundColor: props.temperature < '20' ? '#c00' : '#06f' }}>
                        {/* <span>温度</span> */}
                        <span>{props.temp}</span>
                        <span>(℃)</span>
                    </div>
                </div>
            </div>
        </div>
    }

    const BatteryPackItem = props => {
        return <PackItem onClick={() => showBatteryPackPage(props.data)}>
            <div className="dataItem">
                <div className="dataName">{props.data.batteryPackNo}</div>
                <div className="dataTitle">极柱正极温度</div>
                <div className="dataValue">{props.data.negativeTemp + ' (℃)'}</div>
                <div className="dataTitle">极柱负极温度</div>
                <div className="dataValue">{props.data.negativeTemp + ' (℃)'}</div>
            </div>
        </PackItem>
    }

    const showBatteryPackPage = (item) => {
        props.getshowPack({
            pageName: 'batteryPackPage',
            batteryItem: item,
        })
    }

    const toWarning = () => {
        navigate('/index/runtimeStorage/alarmMessage', {
            state: { type: 'index', primary: 'runtimeStorage', title: '告警信息', nested: 'alarmMessage' }
        })
    }
    const WarningCard = props => {
        return <div className={style.warningItem}>
            <div className={style.leftImg}>
                <img src={warningPoint} className={style.warningPoint}></img>
            </div>
            <div className={style.warningData}>
                <div className={style.warningtop}>
                    <span className={style.time}>{props.data.warningTime}</span>
                    {/* <span className={style.sn}>{props.data.sn}</span> */}
                </div>
                <div className={style.warningbottom}>
                    <span className={style.description}>{props.data.content}</span>
                    <span className={style.level} style={{ color: '#c00' }}>{props.data.level}</span>
                </div>
            </div>
        </div>
    }

    //电池列表数据
    const [singleList, setSingleList] = useState([])
    const [nameState, setNameState] = useState({})
    const getBatteryList = (batteryCluster) => {
        setNameState({
            name: batteryCluster.name,
            chargeState: batteryCluster.chargeState
        })
        queryBatteryPackInfo(projectId, batteryCluster.id).then(res => {
            if (res.success) {
                if (res.data) {
                    setSingleList(res.data)
                } else {
                    setSingleList([])
                }
            } else {
                message.error(res.errMsg)
            }
        })
    }

    //电池簇状态
    const [batteryStatus, setBatterStatus] = useState({})
    const getBatterStatus = (batteryCluster) => {
        queryBatteryClusterInfo(projectId, batteryCluster.id).then(res => {
            let { success, data } = res
            if (success) {
                if (data) {
                    setBatterStatus(data)
                } else {
                    setBatterStatus({})
                }
            } else {
                message.error(res.errMsg)
            }
        })
    }

    //告警信息
    const [warningData, setWarningData] = useState({ batteryWarnings: [] })
    const getwarningData = (batteryCluster) => {
        queryBatteryClusterWarning(projectId, batteryCluster.id).then(res => {
            if (res.success) {
                if (res.data) {
                    setWarningData(res.data)
                } else {
                    setWarningData({ batteryWarnings: [] })
                }
            } else {
                message.error(res.errMsg)
            }
        })
    }

    //切换电池组
    const [count, setCount] = useState(0)
    const preData = () => {
        if ((count) <= 0) return;
        setCount(count - 1)
    }
    const nextData = () => {
        if ((count + 8) >= singleList.length) return;
        setCount(count + 1)
    }

    useEffect(() => {
        getBatteryList(batteryCluster)
        getwarningData(batteryCluster)
        getBatterStatus(batteryCluster)
    }, [])


    return (
        <div className={style.batteryContent}>
            <div className={style.singleMonitor} style={{ position: 'relative' }}>
                <div className={style.cardTitle} style={{ color: '#fff', margin: 16 }}>
                    <span>电池簇</span>
                </div>
                <div className={style.batteryName}>{nameState.name}</div>
                <TitleImg state={nameState.chargeState}></TitleImg>
                <LeftButton onClick={() => preData()}></LeftButton>
                <RightButton onClick={() => nextData()}></RightButton>
                <div className={style.verticalLine}></div>
                <div className={style.normalLine}></div>
                <div className={style.transformList}>
                    <div className={style.transformItem} style={{ width: (parseInt(singleList.length / 8) + 1) * 100 + '%', left: (-(count * 153)) }}>
                        {
                            singleList.map((item, index) => {
                                return <BatteryPackItem data={item} key={index}></BatteryPackItem>
                            })
                        }
                    </div>
                </div>
                {/* <div className={style.monitorList}>
                    {singleList.map((item, index) => {
                        return <MonitorItem {...item} key={index}></MonitorItem>
                    })}
                </div> */}
            </div>
            <div className={style.singleWarning}>
                <div style={{ height: 512, backgroundColor: '#fff', borderRadius: 4, width: 288, padding: 16 }}>
                    <div className={style.cardTitle}>电池簇</div>
                    <EnvirBox>
                        <div className='titleBox'>总电压 (V)</div><div className='valueBox'>{batteryStatus.v}</div>
                        <div className='titleBox'>总电流 (A)</div><div className='valueBox'>{batteryStatus.i}</div>
                        <div className='titleBox'>SOC (‰)</div><div className='valueBox'>{batteryStatus.soc}</div>
                        <div className='titleBox'>SOH (‰)</div><div className='valueBox'>{batteryStatus.soh}</div>
                        <div className='titleBox'>绝缘值 (KΩ)</div><div className='valueBox'>{batteryStatus.insulationValue}</div>
                        <div className='titleBox'>负极绝缘值 (KΩ)</div><div className='valueBox'>{batteryStatus.negativeInsulationValue}</div>
                        <div className='titleBox'>最高电池电压 (V)</div><div className='valueBox'>{batteryStatus.maxBatteryV}</div>
                        <div className='titleBox'>最低电池电压 (V)</div><div className='valueBox'>{batteryStatus.minBatteryV}</div>
                        <div className='titleBox'>平均电压 (V)</div><div className='valueBox'>{batteryStatus.avgV}</div>
                        <div className='titleBox'>最高电池温度 (℃)</div><div className='valueBox'>{batteryStatus.maxBatteryTemp}</div>
                        <div className='titleBox'>最低电池温度 (℃)</div><div className='valueBox'>{batteryStatus.minBatteryTemp}</div>
                        <div className='titleBox'>平均温度 (℃)</div><div className='valueBox'>{batteryStatus.avgBatteryTemp}</div>
                    </EnvirBox>
                </div>
                <div className={style.newWarning}>
                    <div className={style.cardTitle}>告警信息</div>
                    <span className={style.toWarning} onClick={() => toWarning()}>查看详情</span>
                    <div className={style.warningDetails}>
                        {warningData.batteryWarnings.map((item, index) => {
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