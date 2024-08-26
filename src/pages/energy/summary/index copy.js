import React, { useEffect, useState, memo, useRef } from "react";


import Titlelayout from "@com/titlelayout";
import styled from "styled-components";
import CustContext from "@com/content.js";
import moment from "moment";
import { CloseOutlined } from "@ant-design/icons"
import { Form, Image, Progress, Typography, Spin, Tag } from "antd";
import imgurl from "./icon";
import { EnergyOverView, UpdateEnergyImage, HomeRuntime, EnergyArea } from "@api/api.js";
import { useSelector } from "react-redux";
import Ichart from '@com/useEcharts/Ichart';
import Ctip from './Ctip'
import Pagecount from "@com/pagecontent";
import { Cspin } from "@com/comstyled"
import { isObject } from "@com/usehandler"
import {
  selectProjectId,
  selectOneLevelDefaultId,
} from "@redux/systemconfig.js";

const { QueryEnergyAreaMonth } = EnergyArea
import { useRequest } from "ahooks";

const { Paragraph, Text } = Typography;

const Ctag = styled(Tag)`
  &&{
    position: absolute;
    left: ${props => props.left + 'px'};
    top: ${props => props.top + 12 + 'px'};
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
`

const Title = styled.div`
    &&{
     border: 1px solid #d7d7d7;
     padding: 10px 16px;
     border-radius: 4px;
     background-color: #fff;
     height: 48px;
     margin-bottom: 16px;
     .text {
      display: inline-block;
      border-left: 4px solid ${props => props.theme.primaryColor};
      color: #515151;
      padding-left: 16px;
     }
    
      }
   
`
const Content = styled.div` 
  && {
    flex: 1;
    display: grid;
    grid-template-columns: 1216px 1fr;
    column-gap: 16px;
    .right {
      display: grid;
      grid-template-rows: repeat(3, 120px) 1fr;
      row-gap: 16px;
    }
 }
`


const Itembox = styled.div`
  background-color: #f0f9ff;
  border-radius: 4px;
  border: 1px solid #c9e9ff;
  display: flex;
  padding: 10px 16px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  .desc {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    align-items: center;
    justify-items: flex-end;
    .num {
      font-size: 14px;
      display: block;
      font-weight: 500;
    }
  }
  .desc2 {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    align-items: center;
    justify-items: flex-end;
    .num {
      font-size: 16px;
      display: block;
      line-height: 1;
    }
  }
`;
const Cp = styled(Paragraph)`
  && {
    margin-bottom: 0;
    width: 100%;
    text-align: right;
  }
`;

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
const labels = {
  totalInstalledCapacity: "总装机容量(MWh)", //装机容量
  totalInstalledPower: "总装机功率(MW)", //装机功率
  totalOutElectric: "总放电量(GWh)", //总放电量
  totalInElectric: "总充电量(GWh)", //总充电量
  curPower: "0.00",
  curRadiance: "当前辐射度", //当前辐射度
  todayElectricProduct: "当日发电量(kwh)", //当日发电
  totalElectricProduct: "累计发电量(kWh)", //总发电
  todayElectricConsume: "今日用电量(kwh)", //当日用电
  todayElectricConsumePay: "今日电费(元)", //今日电费
  curMonthElectricConsume: "本月用电量(kwh)", //本月用电
  curMonthElectricConsumePay: "本月累计电费(元)", //本月电费
  curYearElectricConsume: "年度总用电量(kwh)", //今年用电
  curYearElectricConsumePay: "本年累计电费", //今年电费
  curLoad: "当前负荷(kw)", //当前负荷
  curLoadPercent: "当前负荷率(%)", //当前负荷率
  curMonthMaxLoad: "本月最大负荷(kw)", //本月最大负荷
  curMonthAvgLoad: "本月平均负荷(kwh)", //本月平均负荷
  curPF: "功率因素", //功率因素
  curMonthAvgPF: "月平均功率因素", //月平均功率因素
};

const TitP = styled.div`
  && {
    min-width: 176px;
    min-height: 244px;
    border: 1px solid #fff;
    border-radius: 4px;
    left: ${props => props.left + 'px'};
    top: ${props => props.top + 32 + 'px'};
    position: absolute;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    .title {
      background-color: #0c3;
      color: #fff;
      height: 24px;
      padding: 2px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .contentbox {
      background-color: rgba(255,255,255,0.6);
      padding: 16px 2px 16px 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex:1;
      .content {
        .key{
          font-size: 14px;
          line-height: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-right: 16px;
        }
        .value{
          font-size: 18px;
          line-height: 1;
        }
      }
    }
  }
`

const Imgbg = memo(({ projectId, areaVos }) => {
  const [energyImage, setEnergyImage] = useState()
  const [spinning, setSpinning] = useState(false)
  const [build, setBuild] = useState()
  const [info, setInfo] = useState()
  const getbuild = async ({ buildingId, x, y }) => {
    try {
      let { data, success } = await EnergyOverView.QueryImageBuilding(projectId, buildingId)
      if (success && isObject(data)) {
        setInfo({ ...data, x, y })
      } else {
        setInfo(null)
      }
    } catch (error) {

    }

  }
  const map = build?.length > 0 ? build.map(l => <Ctag left={l.x} top={l.y} key={l.buildName} onClick={() => getbuild(l)} >{l.buildName}</Ctag>) : null
  const queryimg = async () => { //获取图片
    try {
      setSpinning(true)
      let { success, data } = await UpdateEnergyImage.query(projectId)
      if (success && isObject(data)) {
        let { fileImage, imageBuildingCoordinateVos } = data
        if (Array.isArray(imageBuildingCoordinateVos) && imageBuildingCoordinateVos.length > 0) {
          setBuild(imageBuildingCoordinateVos)
        } else {
          setBuild(null)
        }

        setSpinning(false)
        setEnergyImage(fileImage)
      } else {
        setBuild(null)
        setSpinning(false)
      }
    } catch (error) {
      setSpinning(false)
      setEnergyImage(imgurl.engeryBg)
    }
  }
  useEffect(() => {
    if (!projectId) return
    queryimg()
  }, [projectId])
  return (
    <Cspin spinning={spinning} tip="图片下载中……">
      <div style={{ position: "relative", width: "1216px", height: "771px" }}>
        <img src={energyImage || imgurl.engeryBg} usemap="#building" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        {map}
        {info && <TitP left={info.x} top={info.y}>
          <h5 className="title">{info.buildingName} <CloseOutlined onClick={() => setInfo(null)} /> </h5>
          <div className="contentbox">
            <div className="content">
              <p className="key">今日能耗 <span>(kWh)</span></p>
              <p className="value">{info.todayElectricity}</p>
            </div>
            <div className="content">
              <p className="key">今日费用 <span>(元)</span></p>
              <p className="value">{info.todayCost}</p>
            </div>
            <div className="content">
              <p className="key">今日碳排<span>(kg)</span></p>
              <p className="value">{info.todayCarbon}</p>
            </div>
            <div className="content">
              <p className="key">实时功率<span>(kW)</span></p>
              <p className="value">{info.curPower}</p>
            </div>
          </div>
        </TitP>}
        <Ctip areaVos={areaVos} />
      </div>
    </Cspin>
  )

})
const nf = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
export default function Index() {
  //const [form] = Form.useForm();
  const [energyValue, setEnergyValue] = useState({});
  const projectId = useSelector(selectProjectId);
  // const oneLevelDefaultId = useSelector(selectOneLevelDefaultId);

  let areaVos = energyValue.areaVos || {}
  const [options, setOptions] = useState({
    type: 3,
    pieData: {
      data: [], total: "100%", radius: ["40%", "50%"], center: ['50%', '50%'], labelLine: {
        length: 5,
        length2: 1,
      }
    },
    legend: {
      bottom: 5,
      top: 'auto'
    },
    /*   grid: {
        containLabel: true,
        left: 10,
        right: 10,
      } */
  })

  const getDataEnergy = async () => {
    try {

      let date = moment().format("yyyy-MM-DD")
      let { success, data } = await HomeRuntime.EnergyProportion(projectId, date)
      console.log(data)
      if (success) {
        setOptions({
          ...options, pieData: {
            ...options.pieData,
            data: data || []
          }
        })
      }
    } catch (error) {

    }


  }



  const getData = async () => {

    try {

      let { success, data } = await EnergyOverView.EnergyOverViewRuntime(projectId);
      if (success) {
        setEnergyValue({ ...energyValue, ...data });
      } else {
        setEnergyValue({});
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [energyAreaMonthData, setEnergyAreaMonthData] = useState([])
  const getEnergyAreaMonth = async () => {
    let date = moment().format("yyyy-MM-01")
    const querys = {
      areaId: 0,
      projectId,
      meterType: 1,
      type: 2,
      date: date
    }
    const params = [0]
    try {
      let { success, data } = await QueryEnergyAreaMonth(querys, params);
      if (success) {
        setEnergyAreaMonthData(data.map(d => d.total))
      } else {
        setEnergyAreaMonthData([]);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const sort = energyAreaMonthData.sort((a, b) => parseFloat(b.e) - parseFloat(a.e))
  useEffect(() => {
    getData();
    getDataEnergy()
    getEnergyAreaMonth()
  }, [projectId]);
  return (
    /*    <CustContext.Provider > */
    <Pagecount bgcolor="transparent" pd="0">

      <Title>
        <span className="text">园区概述</span>
      </Title>
      <Content>
        <Imgbg projectId={projectId} areaVos={areaVos} />
        <div className="right">
          <Itembox key="today">
            <Image
              src={imgurl["e01"]}
              preview={false}
              width={56}
              height={56}
            />
            <div className="desc">
              <span>今日能耗 (kWh)</span>
              <Text className="num" ellipsis>
                {energyValue.todayElectricConsume}
              </Text>
              <span style={{ marginTop: '10px' }}>今日电费 (元)</span>

              <Cp ellipsis className="num">
                {energyValue.todayElectricConsumePay}
              </Cp>
            </div>
            <div className="desc">
              <span>标煤 (t)</span>
              <Text className="num" ellipsis>
                {energyValue.todayElectricConsume}
              </Text>
              <span style={{ marginTop: '10px' }}>碳排量 (t)</span>

              <Cp ellipsis className="num">
                {energyValue.todayElectricConsumePay}
              </Cp>
            </div>
          </Itembox>
          <Itembox key="month">
            <Image
              src={imgurl["e02"]}
              preview={false}
              width={56}
              height={56}
            />
            <div className="desc">
              <span>本月用电量(kWh)</span>
              <Text className="num" ellipsis>
                {energyValue.curMonthElectricConsume}
              </Text>
              <span style={{ marginTop: '10px' }}>本月累计电费(元)</span>

              <Cp ellipsis className="num">
                {energyValue.curMonthElectricConsumePay}
              </Cp>
            </div>
            <div className="desc">
              <span>标煤 (t)</span>
              <Text className="num" ellipsis>
                {energyValue.todayElectricConsume}
              </Text>
              <span style={{ marginTop: '10px' }}>碳排量 (t)</span>

              <Cp ellipsis className="num">
                {energyValue.todayElectricConsumePay}
              </Cp>
            </div>
          </Itembox>
          <Itembox key="totalY">
            <Image
              src={imgurl["e03"]}
              preview={false}
              width={56}
              height={56}
            />
            <div className="desc">
              <span>年度总用电量(kWh)</span>
              <Text className="num" ellipsis>
                {energyValue.curYearElectricConsume}
              </Text>
              <span style={{ marginTop: '10px' }}>本年累计电费(元)</span>

              <Cp ellipsis className="num">
                {energyValue.curYearElectricConsumePay}
              </Cp>
            </div>
            <div className="desc">
              <span>标煤 (t)</span>
              <Text className="num">
                {energyValue.todayElectricConsume}
              </Text>
              <span style={{ marginTop: '10px' }}>碳排量 (t)</span>

              <Cp ellipsis className="num">
                {energyValue.todayElectricConsumePay}
              </Cp>
            </div>
          </Itembox>

          {/* <Titlelayout title="分类能耗占比" layout="flex">
            <Ichart {...options} />
          </Titlelayout> */}
          <Titlelayout title="本月区域能耗排名" key='sort' className="rdown">
            <Sdiv>
              <div className="sort">
                {sort[0] && <>
                  <Image style={{ width: "40px" }} src={imgurl.a01} preview={false}></Image>
                  <div className="data">
                    <Text ellipsis >{sort[0]?.name}</Text>
                    <div> <Text style={{ fontSize: "16px" }} ellipsis>{nf.format(sort[0]?.e)}</Text>&nbsp;<span>kWh</span></div>
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
                        <div><Text style={{ fontSize: "16px" }} ellipsis>{nf.format(sort[1]?.e)}</Text>&nbsp;<span>kWh</span> </div>
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
                        <div> <Text style={{ fontSize: "16px" }} ellipsis>{nf.format(sort[2]?.e)}</Text>&nbsp;<span>kWh</span> </div>
                      </div>
                    </>
                  }
                </div>
              </div>
            </Sdiv>
          </Titlelayout>
        </div>
      </Content>

    </Pagecount>

    /*   </CustContext.Provider> */
  );
}
