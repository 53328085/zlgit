import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import Bluecolumn from "@com/bluecolumn"
import {useLocation} from 'react-router-dom'
import { Flex, Progress, Divider, Radio } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import DaySvg from '../../../assets/svg/day.svg';
import Month from '../../../assets/svg/month.svg'
import Year from '../../../assets/svg/year.svg'
import CO2 from '../../../assets/svg/CO2.svg'
import { drawEcharts } from "@com/useEcharts"
import imgurl from '@imgs';
import Ichart from "@com/useEcharts/Ichart"
import {energyQuota} from "@api/api"
import { useTranslation } from "react-i18next"
import { isObject } from '@com/usehandler';
const WrapDiv = styled.div`
    background-color:#135abd;
    padding:16px;
    overflow: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    .hd{
        font-size:16px;
        height:60px;
        background-color:#3366cc;
        color:#fff;
        box-shadow:0px 2px 2px rgba(0, 0, 0, 0.349019607843137);
        border-radius:4px;
        padding-left:16px;
        line-height:60px;
    }
    .title{
        background-color:#fff;
        font-size:18px;
        color:#515151;
        height:48px;
       
        border-radius:4px;
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.349019607843137);
        font-family: '微软雅黑 Bold';
        font-weight:700;
        line-height:48px;
        padding-left:16px;
    }
    .gridlayout{
        display: grid;
        grid-template-columns: minmax(504px, 1fr) minmax(1368px, 1fr) ;
        grid-template-rows: minmax(400px, 1fr) minmax(365px, 1fr) ;
        flex: 1;
        grid-gap:16px;
        font-size:14px;
        .item{
            background-color:#fff; 
            padding:16px;
            box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.349019607843137);
            border-radius:4px;
        }
        .item1{
            .card1title{
                margin: 16px 0;
                padding-left:8px;
                font-size:14px;
            }
            .fl{
                display: flex;
                width:440px;
                margin:0 auto;
                justify-content: space-between;
                align-items: center;
                margin-top:16px;
                .normal{
                    padding: 0px 5px;
                    height:28px;
                    line-height:28px;
                    text-align:center;
                    background-color:#ccffb3;
                    border:1px solid #80cc80;
                    color:#339900;
                    border-radius:2px;
                }
                .LowStatus {
                    padding: 0px 5px;
                    height: 28px;
                    line-height: 28px;
                    border: 1px solid #FF3333;
                    color: #FF3333;
                    background-color: #ffcccc;
                    text-align: center;
                    display: inline-block;
                    border-radius: 2px;
                }
            }
        }
        .item2{
            grid-row-start:1;
            grid-row-end:3;
            grid-column-start:2;
            grid-column-end:3;
            display: flex;
            flex-direction: column;
            row-gap: 16px;
            .ant-radio-group{
                width: 240px;
                height:32px;
                display: flex;
                .ant-radio-button-wrapper{
                    flex: 1;
                    text-align:center;
                }
            }
        }
        .item3 .grid4{
            display: grid;
            grid-template-rows:130px 148px;
            grid-template-columns:repeat(2,220px);
            grid-gap:16px;
            margin-top:10px;
            margin-left:10px;
        }
        .ant-progress{
            text-align:center;
            position: relative;
            .ant-progress-outer{
            width: 490px;
           
            .ant-progress-inner{
            width: 440px;
            height:20px;
            border:1px solid rgb(204,204,204);
            .ant-progress-bg{
                height: 20px !important;
            }
            }
            }
            .ant-progress-text{
                position: absolute;
                left:50%;
                top:5px;
                transform:translateX(-60%);
            }
        }
        
        
    }
`
const Cycle = ({ text, value = "" }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid #237ae4', padding: 2 }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#237ae4', textAlign: 'center', lineHeight: 3, color: '#fff' }}>{text}</div>
            </div>
            <div style={{ marginLeft: 42, fontSize: 16 }}>{value}kWh</div>
        </div>

    )
}
const CardWrap = styled.div`
border:1px solid #e9e9e9;
border-radius:2px;
padding:12px;
display:flex;
flex-direction:${(props) => props.order};
justify-content:${(props) => props.content};
.t1{
    font-size:14px;
}
.flexval{
    display: flex;
    flex-direction: row-reverse;
    justify-content:space-between;
    align-items:center;
    span{
        color: #000000D8;
        font-size:24px;
    }
    img{
        width:40px;
    }
   
}
 .t2{
        text-align:center;
    }
`
const Cardyear = styled.div`
    border:1px solid #e9e9e9;
    border-radius:2px;
    padding:12px;
    display:flex;
    align-items: center;
    justify-content:space-evenly;
     
    color: #515151;
    img {
            width: 40px;
        }
    .info {
       
        .num {
            font-size: 18px;
            line-height: 1.5;
        }  
    }
`
export default function Index() {
    const { t } = useTranslation("quota")
    const {search} = useLocation()
    
    const [value, setValue] = useState(1);
    const [datas, setDatas] = useState({})
    const {quotaAreaValue, energyConsumption={}, detail} = isObject(datas) ?datas : {}
    const {quotaRoom={}} = isObject(quotaAreaValue) ? quotaAreaValue : {}
    const params = useRef({})
    const QueryRoomQuotaDetail = async() => {
        try {
          let {success, data} =  await energyQuota.QueryRoomQuotaDetail(params.current)
          if(success && isObject(data)) {
            setDatas(data)
          }
        } catch (error) {
            
        }
       
    }

    useEffect(() => {
        let obj = new URLSearchParams(search)
            if(Array.from(obj.values())?.length < 3) return
            
            for(let [key, value] of obj.entries()) {
                params.current[key] = value
            }
        QueryRoomQuotaDetail()
    }, [search])

    const Card1 = ({ t1 = t("ElectricityConsumptionToday"), t2 = "", value = 0.00, percent = 0, dateimg = '', unit = "kWh" }) => {

        return (
            <CardWrap order={'column'} content={'space-between'}>
                <div className="t1">{t1} &nbsp;({unit})</div>
                <div className="flexval">
                    <img src={dateimg} alt="" />
                    <span>{value}</span>
                </div>
                <div className="t2" style={{ opacity: t2 ? 1 : 0 }}>{t2} <CaretDownOutlined style={{ color: "#f5222d" }} /> {percent}%</div>
            </CardWrap>
        )
    }

    const options = [
        { label: t("Day"), value: 1 },
        { label: t("Month"), value: 2 },
        { label: t("Year"), value: 3 },
    ];
    const onChange = ({ target: { value } }) => {
        
        setValue(value);
        params.current.type = value
        QueryRoomQuotaDetail()
    }
    const charttext = {
        1: ['本日','昨日'],
        2: ['本月', '上月'],
        3: ['今年','去年']
    }[value]
   
    const baroption = {
        series: [{type: 'bar'}, {type: "bar"}],
        dataset: {
            dimensions: [
                {name: 'x', type: "time"},
                {name: 'y', displayName: charttext[0]+'能耗（kWh）'},
                {name: 'y1', displayName:  charttext[1]+'能耗（kWh）'}
            ],
            source: detail,
            sourceHeader:false,
        },
      
    }
   

    return (
        <WrapDiv>
            <div className="hd">{t("RoomEnergyConsumptionQuota")}</div>
            <div className="title">{quotaRoom?.areaName}</div>
            <div className="gridlayout">
                <div className="item item1"><Bluecolumn name={t("RatedEnergyConsumption")} fontSize={16} />
                    <div className="card1title">{t("RemainingEnergyConsumptionRatio")}</div>
                    <Progress strokeColor={quotaRoom?.status == 0 ? '#21cf54' : '#f00'} trailColor="#ebeef5" percent={parseFloat(quotaRoom?.areaRemainRate)}></Progress>
                    <div className="fl">
                        <Cycle text={t("Quota")} value={quotaRoom?.areaQuotaValue}></Cycle>
                        <div className={quotaRoom.status == 0 ? "normal" : 'LowStatus'}>{quotaRoom.status == 0 ? t("NormalEnergyConsumption") : t("InsufficientMargin")}</div>
                    </div>
                    <div className="fl">
                        <Cycle text={t("Used")} value={quotaRoom?.areaConsumptionValue}></Cycle>
                        <Cycle text={t("Surplus")} value={quotaRoom?.areaRemainValue}></Cycle>
                    </div>
                    <Divider dashed style={{ borderColor: '#d7d7d7' }}></Divider>
                    <div className="fl" >{t("ResponsiblePerson")}: {quotaAreaValue?.responsiblePerson}</div>
                    <div className="fl" >{t("cellPhoneNumber")}:{quotaAreaValue?.phoneNumber}</div>
                </div>
                <div className="item item2">
                    <Bluecolumn name={t("EnergyConsumptionTrendb")} fontSize={16} >
                        <div style={{ marginLeft: 'auto' }}>
                            <Radio.Group
                                options={options}
                                onChange={onChange}
                                value={value}
                                optionType="button"
                                buttonStyle="solid"

                            />
                        </div>
                    </Bluecolumn>
                    <div   style={{ display: 'flex',  flex: 1}}>
                        <Ichart {...baroption} /> 
                    </div>
                </div>
                <div className="item item3"><Bluecolumn name={t("EnergyConsumptionSituation")} fontSize={16} />
                    <div className="grid4">
                        <Card1 dateimg={DaySvg} value={energyConsumption?.consumptionDay} percent={energyConsumption?.mom_Day} t2={t("DayOnMonthRatio")} />
                        <Card1 dateimg={Month} t1={t("ElectricityConsumptionThisMonth")} t2={t("MonthOnMonthRatio")} value={energyConsumption?.consumptionMonth} percent={energyConsumption?.mom_Month} />
                       
                        <Cardyear>
                            <img src={Year} /> 
                            <div className='info'>
                                <div className='num'>{energyConsumption?.consumptionYear}&nbsp;kWh </div>
                                <div>{t("AnnualElectricityConsumption")}</div>
                            </div>
                        </Cardyear>
                        <Cardyear>
                            <img src={imgurl.co2} /> 
                            <div className='info'>
                                <div className='num'>{energyConsumption?.cO2}&nbsp;kg </div>
                                <div>{t("AnnualCarbonDioxideEmissions")}</div>
                            </div>
                        </Cardyear> 
                    </div>
                </div>

            </div>
        </WrapDiv>
    )
}
