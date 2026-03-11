import React, { useContext, useEffect, useState } from 'react'
import { Button, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import Titlelayout from "@com/titlelayout";
import { isObject } from "@com/usehandler"
import { TopologySty } from "../style"
import { Paramscontext } from '../context'
import { useQueryTopologyDiagramInfo } from "../api"
import imgurl from '../imgs'

export default function Index() {
  const navigate = useNavigate()
  const { areaId, stationName, projectId } = useContext(Paramscontext)
  const [datas, setDatas] = useState({})

  const getData = async () => {
    try {
      let params = {
        areaId,
        siteId: stationName?.value,
        projectId,

      }
      const { data, success } = await useQueryTopologyDiagramInfo(params)
      if (success && isObject(data)) {
        setDatas(data)
      } else {
        setDatas({})
      }
    } catch (error) {

    }
  }
  useEffect(() => {
    if ([areaId, projectId].every((id) => Number.isInteger(parseInt(id))) && isObject(stationName)) {
      getData()
    }

  }, [areaId, stationName, projectId])
  const sty = {

    position: "absolute",
    top: "50%",
    transform: "translate(0px, -30px)",
    zIndex: 1,
    backgroundColor: "#E94126",
    borderColor: "#E94126",
    color: "#fff",
  }
  const toPage = (key, label) => {
    navigate(`/index/runtimeStorage/${key}`, {
      state: { type: 'index', primary: 'runtimeStorage', title: label, nested: key }
    })
  }
  return (
    <Titlelayout title={<span style={{ color: "#fff" }}>站点接线图</span>} pv="24px" bgcolor="transparent" bg="transparent" layout="flex">
      <Button style={sty} >交流母线</Button>
      <TopologySty>
        <div className="up">
          <div className='paint'>
            <div className="outwrap">
              <div className="imgbox1">
                <img src={imgurl["Etagine"]}></img>
              </div>
              <span className='text'>市电</span>
            </div>
            <div className="outwrap meter">
              <Button type="primary">并网总表</Button>
              <div className="imgbox2">
                <img src={imgurl["meter"]}></img>
              </div>
            </div>

          </div>
          <div className='digital'>
            <div className="item">
              <span>A相电压</span><span>{datas?.onGridDevice?.ua}(Ua)</span>
            </div>
            <div className="item">
              <span>B相电压</span><span>{datas?.onGridDevice?.ub}(Ub)</span>
            </div>
            <div className="item">
              <span>C相电压</span><span>{datas?.onGridDevice?.uc}(Uc)</span>
            </div>
            <div className="item"><span>A相电流</span><span>{datas?.onGridDevice?.ia}(Ia)</span></div>
            <div className="item"><span>B相电流</span><span>{datas?.onGridDevice?.ib}(Ib)</span></div>
            <div className="item"><span>C相电流</span><span>{datas?.onGridDevice?.ic}(Ic)</span></div>
            <div className="item"><span>功率</span><span>{datas?.onGridDevice?.p}(kW)</span></div>


          </div>
        </div>
        <div className='down'>
          <div className="meter">
            <div className="upm">
              <Button type="primary">储能总表</Button>
              <div className="eimgbox">
                <img src={imgurl["meter"]} className='eimg'></img>
              </div>
            </div>
            <div className="upm">
              <Button type="primary">储能柜</Button>
              <div className="simgbox">
                <Typography.Link onClick={() => toPage("cabinetMonitor", "储能柜监控")}><img src={imgurl["cabinet"]} className='eimg'></img></Typography.Link>
              </div>
            </div>

          </div>
          <div className='digital downleft'>
           
              <div className="item">
              <span>A相电压</span><span>{datas?.storageDevice?.ua}(Ua)</span>
            </div>
            <div className="item">
              <span>B相电压</span><span>{datas?.storageDevice?.ub}(Ub)</span>
            </div>
            <div className="item">
              <span>C相电压</span><span>{datas?.storageDevice?.uc}(Uc)</span>
            </div>
            <div className="item"><span>A相电流</span><span>{datas?.storageDevice?.ia}(Ia)</span></div>
            <div className="item"><span>B相电流</span><span>{datas?.storageDevice?.ib}(Ib)</span></div>
            <div className="item"><span>C相电流</span><span>{datas?.storageDevice?.ic}(Ic)</span></div>
            <div className="item"><span>功率</span><span>{datas?.storageDevice?.p}(kW)</span></div>


          </div>
          <div className='digital downright'>
           
              <div className="item">
              <span>A相电压</span><span>{datas?.loadDevice?.ua}(Ua)</span>
            </div>
            <div className="item">
              <span>B相电压</span><span>{datas?.loadDevice?.ub}(Ub)</span>
            </div>
            <div className="item">
              <span>C相电压</span><span>{datas?.loadDevice?.uc}(Uc)</span>
            </div>
            <div className="item"><span>A相电流</span><span>{datas?.loadDevice?.ia}(Ia)</span></div>
            <div className="item"><span>B相电流</span><span>{datas?.loadDevice?.ib}(Ib)</span></div>
            <div className="item"><span>C相电流</span><span>{datas?.loadDevice?.ic}(Ic)</span></div>
            <div className="item"><span>功率</span><span>{datas?.loadDevice?.p}(kW)</span></div>


          </div>
          <div className="meter">
            <div className="upm">
              <Button type="primary">负载总表</Button>
              <div className="eimgbox">
                <img src={imgurl["meter"]} className='eimg'></img>
              </div>
            </div>
            <div className="upm">
              <div className="bimgbox">
                <img src={imgurl["bulb"]} className='bimg'></img>
              </div>
              <span className="text">负载系统</span>
            </div>

          </div>
        </div>
      </TopologySty>
    </Titlelayout>
  )
}
