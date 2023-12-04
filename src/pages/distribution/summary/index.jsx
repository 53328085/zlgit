import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getRoomId, selectOneLevel, getDiscurlevel, getcurlRommid, selectdiscurlevel, selectcurlRommid } from "@redux/systemconfig";
import { nanoid } from '@reduxjs/toolkit'
import Titlelayout from '@com/titlelayout'
import styled from 'styled-components'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import { Divider, Form, Image, Radio, Select,message  } from 'antd'

import { drawEcharts } from "@com/useEcharts"
import { DistributionRoomRuntime, distributionRoom } from '@api/api.js'
import dimg from './icon/3dimg.png'
import imgurl from '@imgs'

import imglist from '@imgs/index.js'


const Mainbox = styled.div`
  flex: 1;
  position: relative;
  .cardList{
    position: absolute;
    right: 221px;
    top: 21px;
    color: #fff;
    .card{
      width: 256px;
      height: 48px;
      background-color: rgba(15, 34, 63, 1);
      border: 1px solid rgba(0, 153, 204, 1);
      padding: 4px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span{
        padding-left: 12px;
      }
      .cardval{
        color: #00ff00;
        font-size: 16px;
      }
    }
    img{
      width: 32px;
    }
    .headtext{
      display: block;
      padding: 0;
      font-size: 18px;
      color: #fff;
      text-align: center;
      line-height: 48px;
    }
  }
 `






export default function Index() {

  const [form] = Form.useForm()
  const dispatch = useDispatch()
  // const roomlist =useSelector(state=>state.system.roomId)
  const projectId = useSelector(state => state.system.menus.projectId)
  const oneLevel = useSelector(selectOneLevel)
  
  const init = {
    door:"",
    fire:"",
    humidness:"",
    noise:"",
    smoke:"",
    temperature:"",
    water:""
  }

  const [roomlist, setRoomList] = useState([])
  const [envlist,setEnvList]=useState(init)
  //切换区域
  const changeArea = (e) => {
    getRoomList(e)
  }
  //切换配电房
  const changeRoom=(e)=>{
    getEnvironment(e)
  }

  const getEnvironment = async (roomId) => {
    const res = await DistributionRoomRuntime.GetEnvironment(projectId, roomId)
    if (res.success) {
      setEnvList(res.data)
    } else {
      message.error(res.errMsg)
    }
  }
  const getRoomList = async (areaId) => {
    const resp = await distributionRoom.RoomList(projectId, areaId)
    if (resp.success) {
      console.log(resp)
      dispatch(getRoomId(resp.data))
      setRoomList(resp.data)
      if (Array.isArray(resp.data) && resp.data.length > 0) {
        form.setFieldValue('roomId', resp.data[0][['id']])
        getEnvironment(resp.data[0][['id']])
      } else {
        form.setFieldValue('roomId', [])
        setEnvList(init)
      }
    }
  }

  
  useEffect(() => {
    getRoomList(oneLevel[0]?.id)
   
  }, [])
  return (
    <CustContext.Provider value={{ form }}>
      <Pagecount bgcolor="#eeeff3" pd="0px">
        <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '8px 16px', marginBottom: 16, border: '1px solid #d7d7d7', borderRadius: 4 }}>
          <Form
            form={form}
            colon={false}
            layout="inline"
            initialValues={{
              area: oneLevel[0]?.id
            }}
          >
            <Form.Item label={oneLevel[0]?.levelName} name="area" style={{ marginBottom: 0 }}>
              <Select
                style={{ width: 200 }}
                options={oneLevel}
                fieldNames={{ label: 'name', value: 'id' }}
                placeholder="请选择园区"
                onChange={changeArea}
              ></Select>
            </Form.Item>
            <Form.Item>
              <Divider dashed type="vertical" style={{ borderColor: "#999", height: '30px' }}></Divider>
            </Form.Item>
            <Form.Item name="roomId" >
              <Select
                options={roomlist}
                fieldNames={{ label: 'name', value: 'id' }}
                style={{ width: 240 }}
                placeholder="请选择配电房"
                onChange={changeRoom}></Select>
            </Form.Item>
          </Form>
        </div>
        <Mainbox >
          <img className='bgiamge' src={dimg}></img>
          <div className='cardList'>
            <div className='card headtext'>
              配电房环境监控
            </div>
            <div className='card'>
              <div>
                <img src={imgurl.temperature} alt="" />
                <span>温度</span>
              </div>
              <div className='cardval'>
                {envlist.temperature}
              </div>
            </div>
            <div className='card'>
              <div>
                <img src={imgurl.humidness} alt="" />
                <span>湿度</span>
              </div>
              <div className='cardval'>
                {envlist.humidness}
              </div>
            </div>
            <div className='card'>
              <div>
                <img src={imgurl.water} alt="" />
                <span>噪音</span>
              </div>
              <div className='cardval'>
              {envlist.water}
              </div>
            </div>
            <div className='card'>
              <div>
                <img src={imgurl.smook} alt="" />
                <span>水浸</span>
              </div>
              <div className='cardval'>
              {envlist.smoke}
              </div>
            </div>
            <div className='card'>
              <div> <img src={imgurl.nosie} alt="" />
                <span>烟感</span>
              </div>
                <div className='cardval'>
                {envlist.noise}
              </div>
            </div>
            <div className='card'>
              <div> <img src={imgurl.fire} alt="" />
                <span>明火</span>
                </div>
                <div className='cardval'>
                {envlist.fire}
              </div>
            </div>
            <div className='card'>
              <div>
                <img src={imgurl.door} alt="" />
                <span>门禁</span>
              </div>
              <div className='cardval'>
              {envlist.door}
              </div>
            </div>
          </div>
        </Mainbox>
      </Pagecount>
    </CustContext.Provider>
  )
}
