import React, {memo, useState, useEffect} from 'react'
import { Form, Image, Progress, Typography, Spin, Tag } from "antd";
import styled from 'styled-components';
import { EnergyOverView, UpdateEnergyImage, HomeRuntime} from "@api/api.js"
import {Cspin} from "@com/comstyled"
import {isObject} from "@com/usehandler"
import enerbg from '../icon/backgroundImg.png'
import Ctip from './Ctip'

const Ctag = styled(Tag)`
  &&{
    position: absolute;
    left: ${props => props.left+'px'};
    top: ${props=> props.top+12+'px'};
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
`
const Numbox = styled.div`
  display: flex;
  width: 380px;
  height: 40px;
  background-color: rgba(255,255,255,0.46);
  border-radius: 2px;
  position: absolute;
  top:32px;
  right: 16px;
  align-items: center;
  justify-content: space-around;
  color:#000;
  font-size: 16px;
  p {
    
    span+span {
        padding-left: 8px;
    }
  }
`
export default memo(({projectId, areaAnnualQuota=[],  parkNum, 
    structureNum,
    roomNum}) => {
    const [energyImage, setEnergyImage]= useState()
    const [spinning, setSpinning] = useState(false)
    const [build, setBuild] = useState()
    const [info, setInfo] = useState()
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
    const map = build?.length > 0 ? build.map(l => <Ctag left={l.x} top={l.y} key={l.buildName} onClick={() =>getbuild(l) } >{l.buildName}</Ctag>) : null
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
       if(Number.isInteger(parseInt(projectId))) {
        queryimg()
       }
     
    }, [projectId])
    //  parkNum, 
    structureNum,
    roomNum
    return    (
      <Cspin spinning={spinning} tip="图片下载中……">
      <div style={{position: "relative"}}>
          <img src={energyImage || enerbg}   style={{width: "1368px", height: "800px"}}  />
          <Numbox>
             <p><span>园区</span><span>{parkNum}</span></p>
             <p><span>建筑物</span><span>{structureNum}</span></p>
             <p><span>房间</span><span>{roomNum}间</span></p>
          </Numbox>
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
          <Ctip areaVos={areaAnnualQuota} />
      </div>
      </Cspin>
      )
   
  })