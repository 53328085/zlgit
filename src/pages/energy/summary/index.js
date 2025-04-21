import React, { useEffect, useState, memo, useRef } from "react";
 
 
import Titlelayout from "@com/titlelayout";
import styled from "styled-components";
 import moment from "moment";
 import {CloseOutlined} from "@ant-design/icons"
import { Form, Image, Progress, Typography, Spin, Tag } from "antd";
import imgurl, {E01,E02, E03} from "./icon";
import { EnergyOverView, UpdateEnergyImage, HomeRuntime} from "@api/api.js";
import { useSelector } from "react-redux";
import Ichart  from '@com/useEcharts/Ichart';
import Ctip from './Ctip'
import Pagecount from "@com/pagecontent";
import {Cspin, Cdivider} from "@com/comstyled"
import {isObject} from "@com/usehandler"
import {
  selectProjectId,
  themeColor,
  selectOneLevelDefaultId,
} from "@redux/systemconfig.js";
import { useRequest } from "ahooks";
 
const { Paragraph, Text,Link } = Typography;
 
const Ctag = styled(Tag)`
  &&{
    position: absolute;
    left: ${props => props.left+'px'};
    top: ${props=> props.top+12+'px'};
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
`
const  Mainbox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: stretch;
`
 
const Title = styled.div`
    &&{
     border: 1px solid #d7d7d7;
     padding: 10px 16px;
     border-radius: 4px;
     background-color: #fff;
     height: 48px;
     display: flex;
     align-items: center;
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
    grid-template-columns: 1368px 1fr;
    column-gap: 16px;
    .right {
      display: grid;
      grid-template-rows: repeat(3, 141px) 1fr;
      row-gap: 16px;
    }
 }
`
 
 
const Itembox = styled.div`
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #DDDFE6;
  padding: 14px;
  display: flex;
  align-items: flex-start;
  column-gap: 14px;
 
  .desc {
     flex:1;
     display: flex;
     flex-direction: column;
     color: #303133;
     font-size: 16px;
     justify-content: space-between;
    .num {
       color: ${props=> props.theme.primaryColor};
       font-size: 22px;
    }
    .num2 {
      font-size: 18px;
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
 
 
const TitP = styled.div`
  && {
    min-width: 176px;
    min-height: 244px;
    border: 1px solid #fff;
    border-radius: 4px;
    left: ${props => props.left+'px'};
    top: ${props=> props.top+32+'px'};
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
 
const Imgbg = memo(({projectId, areaVos}) => {
  const [energyImage, setEnergyImage]= useState()
  const [spinning, setSpinning] = useState(false)
  const [build, setBuild] = useState()
  const [info, setInfo] = useState()
  const {primaryderived, imgbgcolor} = useSelector(themeColor)
  const getbuild= async ({buildingId, x, y})=> {
      try {
       let {data, success} = await EnergyOverView.QueryImageBuilding(projectId, buildingId)
       if(success && isObject(data)) {
          setInfo({...data, x, y})
       }else {
          setInfo(null)
       }
      } catch (error) {
        
      }
     
  }
  const map = build?.length > 0 ? build.map(l => <Ctag left={l.x} top={l.y} key={l.buildName} onClick={() =>getbuild(l) } ><Link>{l.buildName}</Link></Ctag>) : null
  const queryimg =async () => { //获取图片
    try {
      setSpinning(true)
     let {success, data} = await  UpdateEnergyImage.query(projectId)
     if(success && isObject(data)) {
        let {fileImage,imageBuildingCoordinateVos} = data
        if(Array.isArray(imageBuildingCoordinateVos) && imageBuildingCoordinateVos.length >0) {
          setBuild(imageBuildingCoordinateVos)
        }else {
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
     if(!projectId) return
     queryimg()
  }, [projectId])
  return    (
    <Cspin spinning={spinning} tip="图片下载中……">
    <div style={{position: "relative", backgroundColor: imgbgcolor || "#fffffff", overflow: "hidden", border: "1px solid transparent"}} className="border_radius_8">
        <img src={energyImage || imgurl.engeryBg}  usemap="#building" style={{clipPath: "inset(1px 1px 1px 1px)"}}  />
        {map}
        {info && <TitP left={info.x} top={info.y}>
          <h5 className="title">{info.buildingName} <CloseOutlined onClick={() => setInfo(null)}  /> </h5>
          <div className="contentbox">
              <div className="content">
                  <p className="key">今日能耗 <span>(kWh)</span></p>
                  <p className="value">{info.todayElectricity}</p>
              </div>
              <div className="content">
                  <p className="key">今日费用 <span>(元)</span></p>
                  <p className="value">{info.todayCost==-1?"/":info.todayCost}</p>
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
         <Mainbox>
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
                  width={54}
                /> 
                
                <div className="desc">
                  <span>今日用电量(kWh)</span>
                  <Text className="num" ellipsis>
                    {energyValue.todayElectricConsume}
                  </Text>
                  <Cdivider type="h" margin="4px 0px" />
                  <span>今日电费(元)</span>
                  <Text ellipsis className="num num2">
                    {energyValue.todayElectricConsumePay}
                  </Text>
                </div>
              </Itembox>
              <Itembox key="month">
                <Image
                  src={imgurl["e02"]}
                  preview={false}
                  width={54}
                 
                />
                <div className="desc">
                  <Text>本月用电量(kWh)</Text>
                  <Text className="num" ellipsis>
                    {energyValue.curMonthElectricConsume}
                  </Text>
                  <Cdivider type="h" margin="4px 0px" />
                  <Text>本月累计电费(元)</Text>
 
                  <Text ellipsis className="num num2">
                    {energyValue.curMonthElectricConsumePay}
                  </Text>
                </div>
              </Itembox>
              <Itembox key="totalY">
                <Image
                  src={imgurl["e03"]}
                  preview={false}
                  width={54}
                />
                <div className="desc">
                  <Text ellipsis>年度总用电量(kWh)</Text>
                  <Text className="num" ellipsis>
                    {energyValue.curYearElectricConsume}
                  </Text>
                  <Cdivider type="h" margin="4px 0px" />
                  <Text ellipsis>本年累计电费(元)</Text>
 
                  <Text ellipsis className="num num2">
                    {energyValue.curYearElectricConsumePay}
                  </Text>
                </div>
              </Itembox>
 
              <Titlelayout title="分类能耗占比" layout="flex">
                   <Ichart {...options} />
              </Titlelayout>
              </div>
           </Content>
           </Mainbox>
        </Pagecount>
       
  /*   </CustContext.Provider> */
  );
}