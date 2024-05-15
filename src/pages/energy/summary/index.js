import React, { useEffect, useState, memo } from "react";

 
import Titlelayout from "@com/titlelayout";
import styled from "styled-components";
 import moment from "moment";
import CustContext from "@com/content.js";
import { Form, Image, Progress, Typography, Spin } from "antd";
import imgurl from "./icon";
import { EnergyOverView, UpdateEnergyImage, HomeRuntime} from "@api/api.js";
import { useSelector } from "react-redux";
import Ichart  from '@com/useEcharts/Ichart';
import Ctip from './Ctip'
import Pagecount from "@com/pagecontent";
import {Cspin} from "@com/comstyled"
import {
  selectProjectId,
  selectOneLevelDefaultId,
} from "@redux/systemconfig.js";
import { useRequest } from "ahooks";
 
const { Paragraph, Text } = Typography;
 
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
    grid-template-columns: 1368px 292px;
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
  display: grid;
  grid-template-columns: 56px 138px;
  padding: 10px 16px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  .desc {
    display: grid;
    grid-template-rows: repeat(4, 1fr);
    align-items: center;
    justify-items: flex-end;
    .num {
      font-size: 18px;
      display: block;
      line-height: 1;
    }
  }
  .desc2 {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    align-items: center;
    justify-items: flex-end;
    .num {
      font-size: 18px;
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



const Imgbg = memo(({projectId, areaVos}) => {
  const [energyImage, setEnergyImage]= useState()
  const [spinning, setSpinning] = useState(false)
  const queryimg =async () => { //获取图片
    try {
      setSpinning(true)
     let {success, data} = await  UpdateEnergyImage.query(projectId)
     if(success && data) {
        setSpinning(false)
         setEnergyImage(data)
     } else {
      setSpinning(false)
     }
    } catch (error) {
      setSpinning(false)
       setEnergyImage(imgurl.engeryBg)
    }
  }      
  useEffect(() => {
     if(!projectId) return
     queryimg()
  }, [projectId])
  return    (
    <Cspin spinning={spinning} tip="图片下载中……">
    <div style={{position: "relative"}}>
        <img src={energyImage || imgurl.engeryBg}   />
        <Ctip areaVos={areaVos} />
    </div>
    </Cspin>
    )

})
export default function Index() {
  //const [form] = Form.useForm();
  const [energyValue, setEnergyValue] = useState({});
  const projectId = useSelector(selectProjectId);
 // const oneLevelDefaultId = useSelector(selectOneLevelDefaultId);

 let areaVos = energyValue.areaVos || {}
 const [options, setOptions] = useState({
  type: 3,
  pieData: { data: [], total: "100%", radius: ["40%",  "50%"],  center: ['50%', '50%'], labelLine: {
    length: 5,
    length2: 1,
  } },
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
   let {success, data} =  await HomeRuntime.EnergyProportion(projectId, date)
   console.log(data)
    if (success) {
      setOptions({...options, pieData: {
       ...options.pieData,
       data: data || []
      }})
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
 
  useEffect(() => {
    getData();
    getDataEnergy()
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
                  <span>今日用电量(kwh)</span>
                  <Text className="num" ellipsis>
                    {energyValue.todayElectricConsume}
                  </Text>
                  <span>今日电费(元)</span>

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
                  <Text>本月用电量（kWh）</Text>
                  <Text className="num" ellipsis>
                    {energyValue.curMonthElectricConsume}
                  </Text>
                  <Text>本月累计电费（元）</Text>

                  <Cp ellipsis className="num">
                    {energyValue.curMonthElectricConsumePay}
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
                  <Text ellipsis>年度总用电量(kWh)</Text>
                  <Text className="num" ellipsis>
                    {energyValue.curYearElectricConsume}
                  </Text>
                  <Text ellipsis>本年累计电费(元)</Text>

                  <Cp ellipsis className="num">
                    {energyValue.curYearElectricConsumePay}
                  </Cp>
                </div>
              </Itembox>

              <Titlelayout title="分类能耗占比" layout="flex">
                   <Ichart {...options} />
              </Titlelayout>
              </div>
           </Content>
        
        </Pagecount>
       
  /*   </CustContext.Provider> */
  );
}
