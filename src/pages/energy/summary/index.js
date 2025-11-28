import React, { useEffect, useState, memo, useRef, useMemo } from "react";

import Titlelayout from "@com/titlelayout";
import Usetable from '@com/useTable'
import moment from "moment";
import { CloseOutlined } from "@ant-design/icons";
import { useOutletContext } from "react-router-dom";
import {  Image,  Typography, Tabs} from "antd";
import imgurl from "./icon";
import { EnergyOverView, UpdateEnergyImage, HomeRuntime } from "@api/api.js";
import { useSelector } from "react-redux";
import Ichart from "@com/useEcharts/Ichart";
import Ctip from "./Ctip";
import Pagecount from "@com/pagecontent";
import { Cspin, Cdivider,Tabsbox } from "@com/comstyled";
import { isObject } from "@com/usehandler";
import { 
  themeColor, 
  energyType,
} from "@redux/systemconfig.js";
import { useRequest } from "ahooks";
import { Mainbox, Ctag, TitP } from "./style";
import {useQueryEnergyInfoOverview} from "./api"
const { Paragraph, Text, Link } = Typography;

const Imgbg = memo(({ projectId, areaVos }) => {
  const [energyImage, setEnergyImage] = useState();
  const [spinning, setSpinning] = useState(false);
  const [build, setBuild] = useState();
  const [info, setInfo] = useState();

  console.log(info)
  const { primaryderived, imgbgcolor } = useSelector(themeColor);
  const getbuild = async ({ buildingId, x, y }) => {
    try {
      let { data, success } = await EnergyOverView.QueryImageBuilding(
        projectId,
        buildingId
      );
      if (success && Array.isArray(data?.datas)) {
        setInfo({datas: data.datas, x, y,buildingName:data.buildingName });
      } else {
        setInfo({datas: [], x, y,buildingName:data.buildingName });
      }
    } catch (error) {}
  };
  const map =
    build?.length > 0
      ? build.map((l) => (
          <Ctag
            left={l.x}
            top={l.y}
            key={l.buildName}
            onClick={() => getbuild(l)}
          >
            <Link>{l.buildName}</Link>
          </Ctag>
        ))
      : null;
  const queryimg = async () => {
    //获取图片
    try {
      setSpinning(true);
      let { success, data } = await UpdateEnergyImage.query(projectId);
      if (success && isObject(data)) {
        let { fileImage, imageBuildingCoordinateVos } = data;
        if (
          Array.isArray(imageBuildingCoordinateVos) &&
          imageBuildingCoordinateVos.length > 0
        ) {
          setBuild(imageBuildingCoordinateVos);
        } else {
          setBuild(null);
        }

        setSpinning(false);
        setEnergyImage(fileImage);
      } else {
        setBuild(null);
        setSpinning(false);
      }
    } catch (error) {
      setSpinning(false);
      setEnergyImage(imgurl.engeryBg);
    }
  };
  useEffect(() => {
    if (!projectId) return;
    queryimg();
  }, [projectId]);
  return (
    <Cspin spinning={spinning} tip="图片下载中……">
      <div
        style={{
          position: "relative",
          backgroundColor: imgbgcolor || "#fffffff",
          overflow: "hidden",
          border: "1px solid transparent",
        }}
        className="border_radius_8"
      >
        <img
          src={energyImage || imgurl.engeryBg}
          usemap="#building"
          style={{ clipPath: "inset(1px 1px 1px 1px)" }}
        />
        {map}
        {info && (
          <TitP left={info.x} top={info.y}>
            <h5 className="title">
              {info.buildingName}
              <CloseOutlined onClick={() => setInfo(null)}      /> 
            </h5>
            <div className="contentbox">
{
  info.datas?.map((item, index) =>(<div className="tipcontent" key={item.name}>
    <span>{item.name}</span><span>{item.value}</span>
  </div>)  )
}
              
            </div>
          </TitP>
        )}
        <Ctip areaVos={areaVos} />
      </div>
    </Cspin>
  );
});
export default function Index() {
  //const [form] = Form.useForm();
   let { exparams } = useOutletContext()
   
   const { areaId, projectId } = exparams || {};

  const [energyValue, setEnergyValue] = useState({});
  
  const EnergyType = useSelector(energyType);
  const defaultvalue = EnergyType?.[0]?.type
  // const oneLevelDefaultId = useSelector(selectOneLevelDefaultId);
  const [meterType, setMeterType] = useState(defaultvalue);
  const unit ={
    1:'kWh',
    2:"m³",
    3:"m³",
    7:"m³",
    8:"m³",
  }[meterType]
  const tableTitle = {
    1:'用电量',
    2:"用水量",
    3:"用气量",
    7:"用水量",
    8:"用气量",
  }[meterType]

  const items = useMemo(()=>{
    return EnergyType?.map(item=>{
      return {
        label: item.name,
        key: item.type,
        children: null
      }
    })

  },[EnergyType])

  let areaVos = energyValue.areaVos || {};
  const options = useMemo(() =>{
    const proportion = Array.isArray(energyValue?.proportion) ? energyValue?.proportion?.map(item=>({...item,  
      labelLine: {
        length:2,
        length2:2
      }
    })) : []
    const total = proportion.reduce((a,b)=> a+ parseFloat(b.value),0)?.toFixed(2)
    return{
    type: 3,
    pieData: {
      data: proportion,
      total,
      radius: ["40%", "60%"],
      center: ["50%", "50%"],
      
    },    
    legend: {
      top: "bottom",
      type: 'scroll',
      
    },
    /*   grid: {
    containLabel: true,
    left: 10,
    right: 10,
  } */
  }
}, [energyValue]);
const rank = energyValue?.rank?.sort((a, b) => parseInt(b.value) - parseInt(a.value))
const columns = [
  {
    title: "序号",
    render: (text, record, index) =>  {
       if(index<3) {
        return <img src={imgurl[`a0${index + 1}`]} style={{ width: "22px", height: "22px" }} /> 
       }else {
        return index+1

       }
    },
  },
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
  },  
  {
    title: tableTitle + unit,
    dataIndex: "value",
    key: "value",
  },

  
]

 

  const getData = async () => {
    try {
      let { success, data } = await useQueryEnergyInfoOverview({projectId, areaId,meterType},{});
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
    if([projectId,areaId,meterType].every(item=>Number.isInteger(parseInt(item)))) {
      getData();
    }
  
  
  }, [projectId,areaId,meterType]);
  const onChange = (e) => {
    console.log('radio checked', e);
    setMeterType(e)
  };
  return (
   
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>
        <div className="content">
          <Imgbg projectId={projectId} areaVos={areaVos} />
          <div className="right">
            
               <Tabsbox type="card" tabwidth="72px" radius="0" tabBarGutter={0} items={items} value={meterType} onChange={onChange}></Tabsbox>

            
           <div className="itembox" key="today">
              <div className="up">
                  <Image src={imgurl[meterType]} preview={false} width={54} />
                  <div className="desc">
                    <span>今日用电量(kWh)</span>
                    <Text className="num" ellipsis>
                      {energyValue.todayElectricConsume}
                    </Text>
                    <span className="num2">日同比：{(energyValue.yoy*100)?.toFixed(2)}%</span>
                  </div>
              </div>
              <Cdivider type="h" margin="4px 0px" />  
              <div className="down">
                <span>本月({unit})：{energyValue.curMonthElectricConsume}</span>
                <span>本年({unit})：{energyValue.curYearElectricConsume}</span>
              </div>

            </div>
            <Titlelayout title="分类能耗占比" layout="flex" key="chart">
              <Ichart {...options} />
            </Titlelayout>
            <Titlelayout title="分类能耗排名" layout="flex" key="table">
              <Usetable columns={columns} dataSource={rank} scroll={{ y: 220} }></Usetable>
            </Titlelayout>
              {/*
            <div className="itembox" key="month">
              <Image src={imgurl["e02"]} preview={false} width={54} />
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
            </div>
            <div className="itembox" key="totalY">
              <Image src={imgurl["e03"]} preview={false} width={54} />
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
            </div>

            <Titlelayout title="分类能耗占比" layout="flex">
              <Ichart {...options} />
            </Titlelayout> */}
          </div>
        </div>
      </Mainbox>
    </Pagecount>

   
  );
}
