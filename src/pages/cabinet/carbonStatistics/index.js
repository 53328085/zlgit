import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Form, Image, message, Progress, Select, Typography } from 'antd'
import Pagecount from '@com/pagecontent'
import Card from './card'
import { isObject } from "@com/usehandler"
import { CustTransO, i18t, i18warning } from "@com/useButton"
import styled, { css } from 'styled-components'
import { Cabinets } from '@api/api.js'
import { Radiogroup, Cdivider } from "@com/comstyled"
import { enterprise, selectProjectId, adaptation } from "@redux/systemconfig"
import Titlelayout from '@com/titlelayout';
import imgsrcs from "@imgs"
import Ichart from '@com/useEcharts/Ichart'

import Table from '@com/useTable'
import { carbonSlice, useOverviewQuery, useRealTimeQuery, useRankingQuery, useMonthQuery, useRatioQuery, useProjectPhotoQuery, useEnergyQuery } from '@redux/carbon'

const { Text } = Typography
const sty = css`
.up {
  grid-template-columns: repeat(5, 1fr)  ;
}
.center {
  grid-template-columns: repeat(3, 1fr);
}
.down {
  grid-template-columns: 3fr 1fr;
}
`

const Mainbox = styled.div`
  flex:1;
  display: grid;
  grid-template-rows: 112px minmax(400px, 1fr) minmax(320px, 1fr);
  row-gap: 16px;
  overflow: hidden;
  .custTitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .chart {
    flex:1;
    display: flex;
    padding-top: 16px;
  }
  .up{
    display: grid;
    column-gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)) ;
    
  }
  .center {
     display: grid;
     grid-template-columns:656px 544px 448px;
     column-gap: 16px;
     .imgbox {
      //background-color: ${props => props.theme.primaryderived};
      display: flex;
      align-items: center;
    //  height:100%;
      img {
       max-width: 100%;
        
      }
     
     }
  }
  .down {
    display: grid;
    //grid-template-columns: 1216px 448px;
    column-gap: 16px;
   // height: 320px;
      .wrap {
        margin-top: 16px;
        height: 254px;
        width: 100%;
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;
        .content {
         min-height:254px;
         display: flex;
         flex-direction: column;
         justify-content: flex-start;
         p {
        background-color: #E4F4FF;
        display: grid;
        height: 50px;
        grid-template-columns: repeat(4, 1fr);
        justify-items: center;
        align-items: center;
        &:nth-of-type(2n) {
          background-color: #f4f7ff;
        }
      }

       }

      }
      .wrap::-webkit-scrollbar {
      display: none;
      
      }
  }
  ${props => props.laptop ? sty : null}
`
const options = [
    {
        label: i18t("comm", "month"),
        value: 2,
    },
    {
        label: i18t("comm", "year"),
        value: 3,
    },
];





/* 月，年。没有日 */
export default function Index() {
    const { enterpriseId } = useSelector(enterprise)
    let { laptop } = useSelector(adaptation)


    // 获取园区图片
    const [Quota, setQuota] = useState([])
    const [CarbonRanking, setCarbonRanking] = useState([])
    const projectId = useSelector(selectProjectId)
    let projectImg = useRef()
    const [rankparam, setRankParam] = useState({ enterpriseId, type: 2 })
    const [ratioparm, setRatioparm] = useState({ enterpriseId, type: 2 })

    // 月度碳排放
    const [montharg, setMontharg] = useState({
        enterpriseId,
        type: 2,
    })

    const QuerySiteCarbonOverview = async () => {
        try {
            const { success, data, errMsg } = await Cabinets.QuerySiteCarbonOverview(1)
            if (success && data) {
                setQuota(data)
            } else {
                setQuota([])
                if (!success) message.warning(errMsg)
            }
        } catch (error) {

        }

    }
    const QueryLineCarbonRanking = async () => {
        try {
            const { success, data, errMsg } = await Cabinets.QueryLineCarbonRanking(1, rankparam.type)
            if (success && data) {
                setCarbonRanking(data)
            } else {
                setCarbonRanking([])
                if (!success) message.warning(errMsg)
            }
        } catch (error) {

        }

    }


    // 碳排占比
    const [poptions, setPoptions] = useState({
        type: 3,
        pieData: { data: [], total: "100%", radius: ["50%", "65%"], center: ['50%', '50%'] },
        legend: {
            bottom: 5,
            top: 'auto',

        },
    })
    const QueryLineCarbonRankingPie = async () => {
        try {
            const { success, data, errMsg } = await Cabinets.QueryLineCarbonRanking(1, ratioparm.type)
            if (success && data) {
                if (success && Array.isArray(data) && data.length > 0) {
                    data.forEach(item => {
                        item.name = item.lineName;
                        item.value = item.lineCarbonEmission;
                    });
                    setPoptions({
                        ...poptions,
                        pieData: {
                            ...poptions.pieData,
                            data,
                        }
                    })
                    console.log(poptions)
                } else {
                    if (!success) i18warning(errMsg)
                    setPoptions({
                        ...poptions,
                        pieData: {
                            ...poptions.pieData,
                            data: [],
                        }
                    })
                }
            } else {
                if (!success) message.warning(errMsg)
            }
        } catch (error) {

        }

    }

    const [moption, setMoption] = useState({
        color: ["#ff7345"],
        series: [{ type: "bar", seriesLayoutBy: 'row' }],
        grid: {
            right: 0,
            left: 0,
            top: "32px",
            bottom: 0,
            containLabel: true,
        },
        legend: {
            top: "0px",
            icon: 'rect',
            right: "32px",
            data: [
                { name: i18t("comm", "time"), type: "time" },
                { name: i18t("cabinet", "CarbonEmission", { param: '(tCO₂)' }) },
            ]

        }, dataset: {}
    })

    const QuerySiteCarbonGraph = async () => {
        try {
            const { success, data, errMsg } = await Cabinets.QuerySiteCarbonGraph(1, montharg.type)
            console.log(success, data)

            if (success && data) {
                let { x, y } = data
                console.log(x, y)
                let dataset = {
                    dimensions: [
                        { name: i18t("comm", "time"), type: "time" },
                        { name: i18t("cabinet", "CarbonEmission", { param: '(tCO₂)' }) },
                        // { name: i18t("cabinet", "directe", { param: '' }) },
                        // { name: i18t("cabinet", "indirecte", { param: '' }) },
                    ],
                    source: [
                        x,
                        y,
                    ],
                    sourceHeader: false,
                }

                setMoption({
                    ...moption,
                    dataset
                })
            } else {
                if (!success) i18warning(errMsg)
                setMoption({
                    ...moption
                })
            }

        } catch (error) {

        }

    }


    // 碳排放排名

    const columnstable = [
        {
            title: i18t("comm", "index"),
            width: 80,
            render: (text, record, index) => `${index + 1}`
        },
        { title: i18t("cabinet", "CircuitName"), dataIndex: 'lineName', key: 'lineName', align: "center", },
        { title: i18t("cabinet", "CarbonEmission", { param: '(tCO₂)' }), dataIndex: 'lineCarbonEmission', key: 'lineCarbonEmission', align: "center", },
        { title: i18t("comm", "ratio"), dataIndex: 'lineCarbonEmissionRatio', key: 'lineCarbonEmissionRatio', align: "center", },
    ]


    const Rtitle = (
        <div className='custTitle'>
            <span><CustTransO text="RankingOfCarbon" ns="cabinet" /></span>
            <Radiogroup options={options}
                defaultValue={2}
                onChange={(e) => setRankParam({ ...rankparam, type: e.target.value })}
                optionType="button"
                buttonStyle="solid" />
        </div>
    )

    const Raitle = (
        <div className='custTitle'>
            <span><CustTransO text="ProportionOfCarbonEmissions" ns="cabinet" /></span>
            <Radiogroup options={options}
                defaultValue={2}
                onChange={(e) => {
                    setRatioparm({ ...ratioparm, type: e.target.value })
                }}
                optionType="button"
                buttonStyle="solid" />
        </div>
    )
    const Mtitle = (
        <div className='custTitle'>
            <span><CustTransO text={montharg.type == 2 ? 'MonthlyCarbonEmissions' : 'AnnualCarbonEmissions'} ns="cabinet" />（tCO₂）</span>
            <Radiogroup options={options}
                defaultValue={2}
                onChange={(e) => {
                    setMontharg({
                        ...montharg,
                        type: e.target.value
                    })
                }}
                optionType="button"
                buttonStyle="solid" />
        </div>
    )
    useEffect(() => {
        QuerySiteCarbonOverview()
    }, [])

    useEffect(() => {
        QueryLineCarbonRanking()
    }, [rankparam])
    useEffect(() => {
        QueryLineCarbonRankingPie()
    }, [ratioparm])
    useEffect(() => {
        QuerySiteCarbonGraph()
    }, [montharg])
    return (
        <Pagecount bgcolor="#eeeff3" pd={0}>
            <Mainbox laptop={laptop}>
                <div className='up' key="up" >
                    <Card name={<CustTransO ns="cabinet" text="Annualquota" param="(tCO₂)" />} laptop={laptop} title="" value={Quota.annualQuota} yoy={Quota.annualQuotaYoy} key="a" />
                    <Card name={<CustTransO ns="cabinet" text="Annualee" param="(tCO₂)" />} laptop={laptop} title="" value={Quota.annualEmission} yoy={Quota.annualEmissionYoy} key="b" />
                    <Card title={<CustTransO ns="cabinet" text="Annualce" param="(tCO₂)" />} laptop={laptop} value={Quota.annualResidual} yoy={Quota.annualResidualPct} key="c" />
                    {/*  <Cdivider type="h" borderColor="#bcbcbc" /> */}
                    <Card title={<CustTransO ns="cabinet" text="directe" param="(tCO₂)" />} laptop={laptop} value={Quota.dailyEmission} yoy={Quota.dailyEmissionPct} key="d" />
                    <Card title={<CustTransO ns="cabinet" text="indirecte" param="(tCO₂)" />} laptop={laptop} value={Quota.monthlyEmission} yoy={Quota.monthlyEmissionPct} key="e" />
                </div>
                <div className='center' key="center">
                    <div className='imgbox'>
                        <img src={Quota.siteImage || imgsrcs['cabinet']} alt="" />
                    </div>


                    <Titlelayout title={Rtitle} key="rank">
                        <div className='chart'>
                            <Table columns={columnstable} className="tablestyle" rowKey={(columns) => columns.key} dataSource={CarbonRanking} scroll={{
                                y: 300,
                            }} />
                        </div>

                    </Titlelayout>
                    <Titlelayout title={Raitle} layout="flex" >
                        <div className='chart'>
                            <Ichart {...poptions} />
                        </div>

                    </Titlelayout>
                </div>
                <div className='down' key="down">
                    <Titlelayout title={Mtitle} layout="flex" >
                        <div className='chart'>
                            <Ichart {...moption} />
                        </div>
                    </Titlelayout>

                    {/* <Titlelayout title={CItitle} layout="flex">
                        <div className='wrap' ref={wrapref}>
                            <div className="content" ref={contentref}>
                                {ClassEData?.map(d => (<p onMouseOver={() => hoverHandler(false)}
                                    onMouseLeave={() => hoverHandler(true)}><Text ellipsis={{ tooltip: d.name }}>{d.name}</Text><Text ellipsis={{ tooltip: d.value }}>{d.value}</Text><Text ellipsis={{ tooltip: d.unit }}>{d.unit}</Text><Text ellipsis={{ tooltip: d.proportion }}>{d.proportion}</Text></p>))}
                            </div>
                            <div className='content' ref={contentref2}></div>
                        </div>

                    </Titlelayout> */}

                </div>
            </Mainbox>
        </Pagecount>

    )
}
