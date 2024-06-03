import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import Bluecolumn from "@com/bluecolumn"
import { Flex, Progress, Divider, Radio } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import DaySvg from '../../../assets/svg/day.svg';
import Month from '../../../assets/svg/month.svg'
import Year from '../../../assets/svg/year.svg'
import CO2 from '../../../assets/svg/CO2.svg'
import { drawEcharts } from "@com/useEcharts"

import { useTranslation } from "react-i18next"
const WrapDiv = styled.div`
    background-color:#135abd;
    padding:16px;
    overflow: auto;
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
        margin-top:16px;
        border-radius:4px;
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.349019607843137);
        font-family: '微软雅黑 Bold';
        font-weight:700;
        line-height:48px;
        padding-left:16px;
    }
    .gridlayout{
        display: grid;
        grid-template-columns:504px 1368px;
        grid-template-rows:400px 365px;
        margin-top:16px;
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
            }
        }
        .item2{
            grid-row-start:1;
            grid-row-end:3;
            grid-column-start:2;
            grid-column-end:3;
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
    justify-content:space-between;
    align-items:center;
    span{
        color: #000000D8;
        font-size:24px;
    }
    img{
        width:40px;
        height:40px;
    }
   
}
 .t2{
        text-align:center;
    }
`

export default function Index() {
    const { t } = useTranslation("quota")
    const chart = useRef()
    const [value, setValue] = useState(1);
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
        console.log(value)
        setValue(value);
    }
    useEffect(() => {
        drawEcharts(chart.current, {
            xAxis: {
                type: 'category'
            },
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: t("Today'sEnergyConsumption") + ' (kWh)',
                    type: 'bar',
                    barGap: 0,
                    emphasis: {
                        focus: 'series'
                    },
                    data: [320, 332, 301, 334, 390]
                },
                {
                    name: t("Yesterday'sEnergyConsumption") + ' (kWh)',
                    type: 'bar',
                    emphasis: {
                        focus: 'series'
                    },
                    data: [220, 182, 191, 234, 290]
                },

            ]
        })
    }, [])

    return (
        <WrapDiv>
            <div className="hd">{t("RoomEnergyConsumptionQuota")}</div>
            <div className="title">正泰物联 1号楼 105</div>
            <div className="gridlayout">
                <div className="item item1"><Bluecolumn name={t("RatedEnergyConsumption")} fontSize={16} />
                    <div className="card1title">{t("RemainingEnergyConsumptionRatio")}</div>
                    <Progress strokeColor='#21cf54' trailColor="#ebeef5" percent={80}></Progress>
                    <div className="fl">
                        <Cycle text={t("Quota")} value={2000}></Cycle>
                        <div className="normal">{t("NormalEnergyConsumption")}</div>
                    </div>
                    <div className="fl">
                        <Cycle text={t("Used")} value={400}></Cycle>
                        <Cycle text={t("Surplus")} value={1600}></Cycle>
                    </div>
                    <Divider dashed style={{ borderColor: '#d7d7d7' }}></Divider>
                    <div className="fl" >{t("ResponsiblePerson")}:张三</div>
                    <div className="fl" >{t("cellPhoneNumber")}:18909897678</div>
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
                    <div ref={chart} style={{ width: 1336, height: 700, marginTop: 35 }}></div>
                </div>
                <div className="item item3"><Bluecolumn name={t("EnergyConsumptionSituation")} fontSize={16} />
                    <div className="grid4">
                        <Card1 dateimg={DaySvg} value={18.45} percent={14} t2={t("DayOnMonthRatio")} />
                        <Card1 dateimg={Month} t1={t("ElectricityConsumptionThisMonth")} t2={t("MonthOnMonthRatio")} value={100.14} percent={15} />
                        <Card1 dateimg={Year} value="1043.78" t1={t("AnnualElectricityConsumption")} />
                        <Card1 dateimg={CO2} value="2412.28" t1={t("AnnualCarbonDioxideEmissions")} unit="kg" />
                    </div>
                </div>

            </div>
        </WrapDiv>
    )
}
