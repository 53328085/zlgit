import React, { useEffect, useState, memo } from "react";

 
import Titlelayout from "@com/titlelayout";
import styled from "styled-components";
 import moment from "moment";
import CustContext from "@com/content.js";
import { Form, Image, Progress, Typography } from "antd";
import imgurl from "./icon";
import { EnergyOverView, UpdateEnergyImage, HomeRuntime} from "@api/api.js";
import { useSelector } from "react-redux";
import Ichart  from '@com/useEcharts/Ichart';
import {
  selectProjectId,
  selectOneLevelDefaultId,
} from "@redux/systemconfig.js";
import { useRequest } from "ahooks";
const { Paragraph, Text, Title } = Typography;
 

const Content = styled.div`
  display: grid;
  grid-template-rows: 48px 800px;
  row-gap: 16px;
  .title {
     border: 1px solid #d7d7d7;
     padding: 10px 16px;
     border-radius: 4px;
     background-color: #fff;
     .text {
      display: inline-block;
      border-left: 4px solid #237ae4;
      color: #515151;
      padding-left: 16px;
     }
    
      
  }
  .main {
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

const Mainbox = styled.div`
  display: grid;
  color: #515151;
  grid-template-rows: 1fr 152px;
  row-gap: 12px;
  justify-content: flex-end;
  .up {
    display: grid;
    grid-template-columns: 1fr 512px;
    .right {
      display: grid;
      grid-template-rows: 208px 1fr;
      row-gap: 32px;
      .rup {
        display: grid;
        grid-template-columns: 248px 248px;
        grid-template-rows: 96px 96px;
        gap: 16px;
      }
      .rdown {
        display: grid;
        grid-template-columns: 248px 248px;
        grid-template-rows: 96px 152px;
        gap: 16px;
      }
    }
  }
  .down {
    display: grid;
    grid-template-columns: repeat(6, 248px);
    grid-template-rows: 152px;
    column-gap: 16px;
  }
`;
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



const Imgbg = memo(({projectId}) => {
  const [energyImage, setEnergyImage]= useState(imgurl.engeryBg)
  
  const queryimg =async () => { //获取图片
    try {
     let {success, data} = await  UpdateEnergyImage.query(projectId)
     if(success && data) {
         setEnergyImage(data)
     } 
    } catch (error) {
       setEnergyImage(imgurl.engeryBg)
    }
  }      
  useEffect(() => {
     if(!projectId) return
     queryimg()
  }, [projectId])
  return    <Image src={energyImage} preview={false} />
})
export default function Index() {
  //const [form] = Form.useForm();
  const [energyValue, setEnergyValue] = useState({});
  const projectId = useSelector(selectProjectId);
 // const oneLevelDefaultId = useSelector(selectOneLevelDefaultId);

 
 const [options, setOptions] = useState({
  type: 3,
  pieData: { data: [], total: "100%", radius: ["55%",  "65%"] },
  legend: {
    bottom: 5,
    top: 'auto'
  },
  grid: {
    containLabel: true,
    left: 0,
    right: 0,
  }
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
    <CustContext.Provider >
       
        <Content>
           <div className="title">
               <span className="text">园区概述</span>
           </div>
           <div className="main">
              <Imgbg projectId={projectId} />
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
                    {energyValue.curMonthElectricConsum}
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
            {/*   <Itembox key="current">
                <Image
                  src={imgurl["e04"]}
                  preview={false}
                  width={56}
                  height={56}
                />
                <div className="desc">
                  <Text>当前负荷(kW)</Text>
                  <Text className="num" ellipsis>
                    {energyValue.curLoad}
                  </Text>
                
                </div>
              </Itembox>
              <Itembox key={nanoid()}>
                <Image
                  src={imgurl["e05"]}
                  preview={false}
                  width={56}
                  height={56}
                />
                <div className="desc">
                  <Text>本月最大负荷(kW)</Text>
                  <Text className="num" ellipsis>
                    {energyValue.curMonthMaxLoad}
                  </Text>
                  <Text>本月平均负载(kWh)</Text>
                  <Text className="num" ellipsis>
                    {energyValue.curMonthAvgLoad}
                  </Text>
              
                </div>
              </Itembox>
              <Itembox key="curPF">
                <Image
                  src={imgurl["e06"]}
                  preview={false}
                  width={56}
                  height={56}
                />
                <div className="desc">
                  <Text>功率因数</Text>
                  <Text className="num" ellipsis>
                    {energyValue.curPF}
                  </Text>
                  <Text>月平均功率因数</Text>
                  <Text className="num" ellipsis>
                    {energyValue.curMonthAvgPF}
                  </Text>
                
                </div>
              </Itembox> */}
              </div>
           </div>
        </Content>
       {/*  <Titlelayout title="能源概述">
          <Mainbox>
            <div className="up">
              <Image src={imgurl.engeryBg} preview={false} />
              <div className="right">
                <div className="rup">
                  <Itembox key={nanoid()}>
                    <Image
                      src={imgurl["e07"]}
                      preview={false}
                      width={56}
                      height={56}
                    />
                    <div className="desc2">
                      <Text>总装机功率(MW)</Text>
                      <Cp ellipsis className="num">
                        {energyValue.totalInstalledPower}
                      </Cp>
                    </div>
                  </Itembox>

                  <Itembox key={nanoid()} style={{gridRow: 2}}>
                    <Image
                      src={imgurl["e09"]}
                      preview={false}
                      width={56}
                      height={56}
                    />
                    <div className="desc2">
                      <Text>总放电量(GWh)</Text>
                      <Cp ellipsis className="num">
                        {energyValue.totalOutElectric}
                      </Cp>
                    </div>
                  </Itembox>
                  <Itembox key={nanoid()} style={{gridRow: 2, gridColumn: 2}}>
                    <Image
                      src={imgurl["e10"]}
                      preview={false}
                      width={56}
                      height={56}
                    />
                    <div className="desc2">
                      <Text>总充电量(GWh)</Text>
                      <Cp ellipsis className="num">
                        {energyValue.totalInElectric}
                      </Cp>
                    </div>
                  </Itembox>
                </div>
                <div className="rdown">
                  <Itembox key={nanoid()}>
                    <Image
                      src={imgurl["e11"]}
                      preview={false}
                      width={56}
                      height={56}
                    />
                    <div className="desc2">
                      <Text>总装机容量(MWh)</Text>
                      <Cp
                        ellipsis={{
                          rows: 1,
                          tooltip: energyValue.totalInstalledCapacity,
                        }}
                        className="num"
                      >
                        {energyValue.totalInstalledCapacity}
                      </Cp>
                    </div>
                  </Itembox>
                  <Itembox key={nanoid()}>
                    <Image
                      src={imgurl["e12"]}
                      preview={false}
                      width={56}
                      height={56}
                    />
                    <div className="desc2">
                      <Text>当前辐照度（w/m²）</Text>
                      <Cp ellipsis className="num">
                        {energyValue.curRadiance}
                      </Cp>
                    </div>
                  </Itembox>

                  <Itembox key={nanoid()}>
                    <Image
                      src={imgurl["e13"]}
                      preview={false}
                      width={56}
                      height={56}
                    />
                    <div className="desc">
                      <Text>当日发电量（kWh）</Text>
                      <Text className="num" ellipsis>
                        {energyValue.todayElectricProduct}
                      </Text>
                      <Text>发电金额（元）</Text>

                      <Cp ellipsis className="num">
                        {energyValue.todayElectricConsumePay}
                      </Cp>
                    </div>
                  </Itembox>
                  <Itembox key={nanoid()}>
                    <Image
                      src={imgurl["e14"]}
                      preview={false}
                      width={56}
                      height={56}
                    />
                    <div className="desc">
                      <Text>累计发电量（kWh）</Text>
                      <Text className="num" ellipsis>
                        {energyValue.totalElectricProduct}
                      </Text>
                      <Text>累计发电金额（元）</Text>

                      <Cp ellipsis className="num">
                        {energyValue.todayElectricConsumePay}
                      </Cp>
                    </div>
                  </Itembox>
                </div>
              </div>
            </div>

            <div className="down">
              <Itembox key={nanoid()}>
                <Image
                  src={imgurl["e01"]}
                  preview={false}
                  width={56}
                  height={56}
                />
                <div className="desc">
                  <Text>今日用电量(kwh)</Text>
                  <Text className="num" ellipsis>
                    {energyValue.todayElectricConsume}
                  </Text>
                  <Text>今日电费(元)</Text>

                  <Cp ellipsis className="num">
                    {energyValue.todayElectricConsumePay}
                  </Cp>
                </div>
              </Itembox>
              <Itembox key={nanoid()}>
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
              <Itembox key={nanoid()}>
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
              <Itembox key={nanoid()}>
                <Image
                  src={imgurl["e04"]}
                  preview={false}
                  width={56}
                  height={56}
                />
                <div className="desc">
                  <Text>当前负荷(kW)</Text>
                  <Text className="num" ellipsis>
                    {energyValue.curLoad}
                  </Text>
                
                </div>
              </Itembox>
              <Itembox key={nanoid()}>
                <Image
                  src={imgurl["e05"]}
                  preview={false}
                  width={56}
                  height={56}
                />
                <div className="desc">
                  <Text>本月最大负荷(kW)</Text>
                  <Text className="num" ellipsis>
                    {energyValue.curMonthMaxLoad}
                  </Text>
                  <Text>本月平均负载(kWh)</Text>
                  <Text className="num" ellipsis>
                    {energyValue.curMonthAvgLoad}
                  </Text>
              
                </div>
              </Itembox>
              <Itembox key={nanoid()}>
                <Image
                  src={imgurl["e06"]}
                  preview={false}
                  width={56}
                  height={56}
                />
                <div className="desc">
                  <Text>功率因数</Text>
                  <Text className="num" ellipsis>
                    {energyValue.curPF}
                  </Text>
                  <Text>月平均功率因数</Text>
                  <Text className="num" ellipsis>
                    {energyValue.curMonthAvgPF}
                  </Text>
                
                </div>
              </Itembox>
            </div>
          </Mainbox>
        </Titlelayout> */}
       
    </CustContext.Provider>
  );
}
