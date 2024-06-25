import React, { useState, useEffect, } from 'react'
import { Form, Modal, Collapse, DatePicker, Radio, Button, Input, Table, Space, message, Pagination, } from 'antd'
import styled from 'styled-components'
import { useAntdTable, useRequest, useReactive } from 'ahooks'
import { useSelector } from 'react-redux'
import { selectProjectId, selectcurlRommid } from '@redux/systemconfig.js'
import UseTable from '@com/useTable'
import { Serach, Cdivider, Borderleft } from "@com/comstyled"
import style from './style.module.less'

import cameraBG from '@imgs/carmeraBG.png'
import EZUIKit from "ezuikit-js";
import moment from 'moment';
import { themeData } from './themeData'
import { selectUser } from '@redux/user'
import totalCamera from './images/totalCamera.png';
import cloudCamera from './images/cloudCamera.png';
import localCamera from './images/localCamera.png';
import playImg from './images/play.png';
import { leftControl, bottomControl, rightControl, topControl, stopControl, Monitoring,GetCamerasoneInfo, DistributionRoomRuntime, distributionRoom } from '@api/api.js'
import { isObject } from '@com/usehandler'
import Titlelayout from '@com/titlelayout'
import Pagecount from '@com/pagecontent'
import { CustButton } from '@com/useButton'
const Mainbox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  .data {
     flex:1;
     display: flex;
     flex-direction: column;
     gap: 16px;
  }
  .serach {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .cameraData {
    display: grid;
    grid-template-columns: repeat(3, 256px);
    column-gap: 16px;
  }
`
const Info = styled.div`
   flex:1;
   display: flex;
   .img{
    width: 120px;
    height: 74px;
   }
   .count {
     color: #515151;
     font-size: 16px;
     display: flex;
     flex-direction: column;
    align-items: center;
     column-gap: 16px;
     width: 128px;
     .num {
        font-size: 32px;
        padding-right: 10px;
     }
   }
`
export default function Index() {
  const { RuntimeCamera: { Statistics, Overview, StopYsPtz, StartYsPtz, GetYsHisPlayUrl, GetYsRealPlayUrl } } = Monitoring
  const { token } = useSelector(selectUser);
  // const {name, roleType} = useSelector(selectUser) || {};
  const projectId = useSelector(selectProjectId)
  const { Panel } = Collapse;
  const { Item } = Form
  const [form] = Form.useForm();
  const [isModal, setisModal] = useState(false)
  const [localModal, setLocalModal] = useState(false)
  // const [play,setplay] =useState('') //小屏监控实例
  const [bigplay, setbigplay] = useState('')
  const [disabledendDate, setdisabledendDate] = useState(() => (current => current && current > moment().endOf('day')))
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [startTimeHistory, setStartTimeHistory] = useState(null)
  const [endTimeHistory, setEndTimeHistory] = useState(null)
  let [areaId, setAreaId] = useState('')
  const [cameraTitle, setCameraTitle] = useState('')
  const [wsType, setwsType] = useState('');
  const [wsUrl, setWsUrl] = useState('');
  const [wsocket, setwebsocket] = useState(null);
  const [recordData, setrecordData] = useState()
  const roomId = useSelector(selectcurlRommid)
  // const areaOptions =oneLevel.length>0? useMemo(() => ([{ name: oneLevel[0].levelName+'(全部)', id: 0 }, ...oneLevel]), [oneLevel]):[]

  const state = useReactive({
    id: new Uint32Array(1),
    webrtc: null,
    videoPlayer: null,
    videoData: {},
  })


  const controlStyle = {
    width: 256,
    height: 256,
    margin: '0 auto',
    backgroundImage: `url(${cameraBG})`
  }
  const tags = {
    width: '50%',
    textAlign: 'center',
  }
  const buttonstyle = {
    width: '120px',
  }

  const getStatistics = () => {
    if (!(isFinite(projectId) && isFinite(roomId))) return
    return DistributionRoomRuntime.CameraSummary(projectId, roomId).then((res) => {
      let { success, data } = res
      if (success && data) {
        // setStatistics(data)
        return data
      } else {
        message.error(res.errMsg)
        return { all: '', cloud: '', local: '' }
      }
    })
  }//监控数量
  const { data: statistics } = useRequest(getStatistics, {
    refreshDeps: [projectId, roomId]
  })
  console.log(statistics)
  const [alike, setAlike] = useState('')
  let [realPlayUrl, setrealPlayUrl] = useState()
  const getYsRealPlayUrl = record => {
    return GetYsRealPlayUrl(record.sn, record.channel, 1, quality,projectId).then((res) => {
      let { success, data } = res
      if (success &&  isObject(data)) {
        // setrealPlayUrl(data)
        // console.log(realPlayUrl)
        let { token, url } = data;
        console.log(data)
        if (!url) return message.warning("url不存在");
        if (!token) return message.warning("token不存在")
        showModal({ token, url })
      } else {
        message.error(res.errMsg)
      }
    })
  }//云监控token、URL
  const getYsHisPlayUrl = (start, end) => {
    return GetYsHisPlayUrl(recordData.sn, recordData.channel, quality, start, end,projectId).then((res) => {
      let { success, data } = res
      if (success && isObject(data)) {
        let { token, url } = data;
        if (!url) return message.warning("url不存在");
        if (!token) return message.warning("token不存在")
        showModal(data)
        // setrealPlayUrl(data)
      } else {
        message.error(res.errMsg)
      }
    })
  }//云监控回放
  let StartYsPtzData = {
    cameraSn: recordData?.sn,
    channelNo: recordData?.channel,
    direction: '',
    speed: 1
  }
  const changeControlYun = val => {
    StartYsPtzData.direction = val
    StopYsPtzData.direction = val
    startYsPtz()
  }
  let StopYsPtzData = {
    cameraSn: recordData?.sn,
    channelNo: recordData?.channel,
    direction: '',
  }
  const cancelControlYun = () => {
    return StopYsPtz(StopYsPtzData).then((res) => {
      let { success, data } = res
      if (success && data) {
        // setrealPlayUrl(data)
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const startYsPtz = () => {
    console.log(StartYsPtzData)
    return StartYsPtz(StartYsPtzData).then((res) => {
      let { success, data } = res
      if (success && data) {
        // setrealPlayUrl(data)
      } else {
        message.error(res.errMsg)
      }
    })
  }//云监控云台控制


  const getCameraPage = ({ current, pageSize }) => {
    if (!(isFinite(projectId) && isFinite(roomId))) return
    let params = {
      projectId,
      pageNum: current,
      pageSize,
      roomId,
      alike: alike
    }
    return DistributionRoomRuntime.CameraPage(params).then(res => {
      let { success, data } = res
      if (success) {
        return {
          list: Array.isArray(data) ? data : [],
          total: Array.isArray(data) ? data.length : 0
        }
      } else {
        return {
          list: [],
          total: 0
        }
      }
    })

  }
  const { tableProps } = useAntdTable(getCameraPage, {
    defaultPageSize: 10,
    refreshDeps: [projectId, roomId, alike]
  })
  //云监控



  const disabledDate = current => current && current > moment().endOf('day')

  const changestartdate = (date, dateString) => {
    setStartTime(date)
    setStartTimeHistory(dateString)
    setdisabledendDate(() => (current => (current < date || current > moment().endOf('day'))))
  }
  const changeEndDate = (date, dateString) => {
    setEndTime(date);
    setEndTimeHistory(dateString)
  }
  //打开视频监控弹窗yun
  const showModal = ({ url, token }) => {
  

    //setLocalModal(true)
    // play.stop()
    let player
      setTimeout(() => {
        player = new EZUIKit.EZUIKitPlayer({
          id: 'replay',
          accessToken: token,//
          url: url,
          width: 1280,
          height: 717,
          themeData: themeData,
          handleError: (err) => {
            console.log(err)
          }
        })
        setbigplay(player)
      }, 0)
       setisModal(true)
  }
  //关闭视频监控弹窗
  const handleCancel = () => {
    setisModal(false)
    //  setLocalModal(false)
    bigplay.stop()
    // play.play()
  }

  //摄像头展示数据
  const CameraValue = (props) => {
    return (

      <Titlelayout layout="flex" pv="0">
        <Info>
          <img src={props.img} className='img' alt={props.title}></img>
          <div className="count">
            <div>{props.title}</div>
            <div><span className='num'>{props.value}</span>台</div>
          </div>
        </Info>
      </Titlelayout>
    )
  }

  const columns = [
    // {
    //   title: '序号',
    //   dataIndex: 'key',
    //   align: 'center',
    //   key:'sn'
    // },
    {
      title: '监控设备编号',
      dataIndex: 'sn',
      align: 'center',
      key: 'sn'
    }, {
      title: '监控设备名称',
      dataIndex: 'name',
      align: 'center',
      key: 'sn'
    }, {
      title: '安装地址',
      dataIndex: 'address',
      align: 'center',
      key: 'sn'
    }, {
      title: '监控类型',
      dataIndex: 'accessMode',
      render: (text) => (<span>{text == 1 ? '云监控' : '本地监控'}</span>),
      align: 'center',
      key: 'sn'
    }, {
      title: '查看监控',
      align: 'center',
      key: 'sn',
      render: (_, record) => (
        <Space size='middle'>
          <div className={style.playButton} onClick={() => showCameraDialog(record)}>
            <img src={playImg} className={style.playImg} alt='播放按钮'></img>
          </div>
        </Space>
      )
    }]

  const chooseType = async (url, rtsp, channel, account, pwd) => {
    // console.log(url);
    state.videoPlayer = document.getElementById('player')
    state.id = window.crypto.getRandomValues(state.id)


    let setAnswerUrl = `${url}/VideoWebrtcServer/V1/WebRtc/SetAnswer?id=${state.id}`;
    let setIceCandidateUrl = `${url}/VideoWebrtcServer/V1/WebRtc/AddIceCandidate?id=${state.id}`;
    let getOfferUrl = `${url}/VideoWebrtcServer/V1/WebRtc/GetOffer?id=${state.id}&url=${encodeURIComponent(rtsp)}&userName=${account}&password=${pwd}`;



    state.webrtc = new RTCPeerConnection()

    state.webrtc.ontrack = event => {
      state.videoPlayer.srcObject = event.streams[0];
    }

    state.webrtc.onicecandidate = event => {
      if (event.candidate) {
        // AddIceCandidate(state.id, url, JSON.stringify(event.candidate))
        fetch(setIceCandidateUrl, {
          method: "POST",
          body: JSON.stringify(event.candidate),
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    let offerResponse = await fetch(getOfferUrl);
    let offer = await offerResponse.json();
    if (!offer.success) {
      message.error(offer.errMsg)
      return;
    }
    offer.data.type = "offer";

    await state.webrtc.setRemoteDescription(offer.data);

    state.webrtc.createAnswer().then(function (answer) {
      return state.webrtc.setLocalDescription(answer);
    }).then(async function () {
      // console.log("Sending answer SDP.");
      // console.log("SDP: " + state.webrtc.localDescription.sdp);
      await fetch(setAnswerUrl, {
        method: 'POST',
        body: JSON.stringify(state.webrtc.localDescription),
        headers: { 'Content-Type': 'application/json' }
      });
      // SetAnswerUrl(state.id, url, JSON.stringify(state.webrtc.localDescription))
    });

  }

  const showCameraDialog = async (record) => {
  try {
   
    setrecordData(record)
    if (record.accessMode == 1) {
      getYsRealPlayUrl(record)
    } else {
    
      if (record.accessMode == 2) {
        console.log('jinlaile',record.accessMode)
        let { serverAddress, id } = record
        let { success, data } = await GetCamerasoneInfo(projectId, id)
        if (!success || !data) return
        let { ip, channel, account, pwd } = data

        state.videoData = data

        console.log(record, data)
        let url = 'http://' + serverAddress
        console.log(url)
        if (!serverAddress) return message.warning("播放地址URL不存在")
          setLocalModal(true);
        setCameraTitle(record.address)
        // setwsType('h264')
        let cha = record.channel + 100

        let rtsp = 'rtsp://' + ip + '/Streaming/Channels/' + cha

        setWsUrl(url);
        setTimeout(() => {
          chooseType(url, rtsp, channel, account, pwd);
        }, 500)
      }
    }
    

    // if (record.accessMode == 1) {
    //   showModal()
    //   getYsRealPlayUrl(record)
    // } else {
    //   if (record.accessMode == 2) {
    //     setLocalModal(true);
    //     setCameraTitle(record.address)
    //     // setwsType('h264')
    //     let cha = record.channel + 100

    //     let rtsp = 'rtsp://' + ip + '/Streaming/Channels/' + cha

    //     setWsUrl(url);
    //     setTimeout(() => {
    //       chooseType(url, rtsp, channel, account, pwd);
    //     }, 500)
    //   }
    // }
  } catch (error) {
    
  }

    
  }



  const [changeType, setChangeType] = useState('')
  const changeControl = (value) => {
    let { serverAddress, port, id, channel } = recordData

    let url = 'http://' + serverAddress

    let ip = state.videoData.ip

    if (value == 'left') {
      setChangeType('leftControl');
      leftControl(url, ip, channel, state.videoData.account, state.videoData.pwd).then(res => {
        if (res.success) {
          return;
        } else {
          message.error(res.errMsg)
        }
      })
    }
    if (value == 'right') {
      setChangeType('rightControl');
      console.log(value)
      rightControl(url, ip, channel, state.videoData.account, state.videoData.pwd).then(res => {
        if (res.success) {
          return;
        } else { message.error(res.errMsg) }
      })
    }
    if (value == 'top') {
      setChangeType('topControl');
      topControl(url, ip, channel, state.videoData.account, state.videoData.pwd).then(res => {
        if (res.success) {
          return;
        } else { message.error(res.errMsg) }
      })
    }
    if (value == 'bottom') {
      setChangeType('bottomControl');
      bottomControl(url, ip, channel, state.videoData.account, state.videoData.pwd).then(res => {
        if (res.success) {
          return;
        } else { message.error(res.errMsg) }
      })
    }
  }

  const cancelControl = () => {
    setChangeType('');

    let { serverAddress, port, id, channel } = recordData
    let url = 'http://' + serverAddress

    let ip = state.videoData.ip

    stopControl(url, ip, channel, state.videoData.account, state.videoData.pwd).then(res => {
      if (res.success) {
        return;
      } else { message.error(res.errMsg) }
    })
  }



  const closeWS = () => {
    state.webrtc.close()
    setLocalModal(false);
  }



  const [activeCollapse, setActiveCollapse] = useState(['1'])
  const changeActive = () => {
    setActiveCollapse([]);
  }
  let [quality, setquality] = useState(2)
  const changeWatchS = val => {
    setquality(val.target.value)
  }
  const changeKey = (key) => {
    setActiveCollapse(key);
  }

  const playBack = () => {
    if (!startTime || !endTime) {
      message.error('请选择正确的时间段！');
      return;
    }
    state.webrtc.close();
    state.webrtc = null;
    let { serverAddress } = recordData
    let start = changeUTC(startTime);
    let end = changeUTC(endTime);

    let url = 'http://' + serverAddress

    let rtsp = 'rtsp://' + state.videoData.ip + '/Streaming/tracks/101?startTime=' + start + '&endTime=' + end;

    setTimeout(() => {
      chooseType(url, rtsp, state.videoData.channel, state.videoData.account, state.videoData.pwd);
    }, 500)


  }
  const playBackYun = () => {
    if (!startTime || !endTime) {
      message.error('请选择正确的时间段！');
      return;
    }
    getYsHisPlayUrl(startTimeHistory, endTimeHistory)
  }
  const changeUTC = (time) => {
    let date = new Date(time);
    let year = date.getFullYear().toString();
    let month = date.getMonth() + 1; ``
    month = month < 10 ? '0' + month : month.toString();
    let day = date.getDate();
    day = day < 10 ? '0' + day : day.toString();
    let hour = date.getHours();
    hour = hour < 10 ? '0' + hour : hour.toString();
    let minute = date.getMinutes();
    minute = minute < 10 ? '0' + minute : minute.toString();
    let second = date.getSeconds();
    second = second < 10 ? '0' + second : second.toString();
    return year + month + day + 'T' + hour + minute + second + 'Z';
  }

  const preventJump = (e) => {
    e.preventDefault()
  }

  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>
        <div id='cameraData' className="cameraData" key="h">
          <CameraValue img={totalCamera} title={'监控总数'} value={statistics?.all ?? '0'}></CameraValue>
          <CameraValue img={cloudCamera} title={'云监控'} value={statistics?.cloud ?? '0'}></CameraValue>
          <CameraValue img={localCamera} title={'本地监控'} value={statistics?.local ?? '0'}></CameraValue>
        </div>

        <Titlelayout layout="flex">
          <div className='data'>
            <div className='serach'>
              <span>设备查询</span>
              <Serach style={{ width: '320px' }} placeholder='请输入设备编号/安装地址' onSearch={setAlike}></Serach>

            </div>
            <Cdivider type="h" style={{ margin: "16px 0" }} />

            <UseTable columns={columns}  {...tableProps} rowKey='sn' />
          </div>
        </Titlelayout>
      </Mainbox>
      <Modal
        title={recordData?.address}
        centered
        width={1680}
        footer={null}
        open={isModal}
        onCancel={handleCancel}
      >
        <div style={{ display: 'flex' }}>
          <div id="replay" style={{
            width: "1280px",
            height: '717px'
          }}></div>
          <div style={{ flex: "1", marginLeft: 32 }}>
            <Titlelayout title="云台控制" bordered="n">

              <div className={style.controlBackground} >
                <div className={style.slotDiv}>
                  <span className={style.leftClick} onMouseDown={() => changeControlYun(2)} onMouseUp={cancelControlYun}></span>
                  <span className={style.rightClick} onMouseDown={() => changeControlYun(3)} onMouseUp={cancelControlYun}></span>
                  <span className={style.topClick} onMouseDown={() => changeControlYun(0)} onMouseUp={cancelControlYun}></span>
                  <span className={style.bottomClick} onMouseDown={() => changeControlYun(1)} onMouseUp={cancelControlYun}></span>
                </div>
              </div>
            </Titlelayout>
            <div style={{ marginTop: 32 }}>
              <Collapse
                onChange={changeKey}
                defaultActiveKey={['1']}
                ghost
                activeKey={activeCollapse}
                expandIconPosition="end">
                <Panel header={<Borderleft>视频回放</Borderleft>} key="1">
                  <Form form={form} >
                    <Item style={{ width: '100%' }}>
                      <DatePicker
                        showTime={{
                          defaultValue: moment('00:00:00', 'HH:mm:ss'),
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="开始时间"
                        className={style.wd100}
                        disabledDate={disabledDate}
                        onChange={changestartdate}
                      />
                    </Item>
                    <Item>
                      <DatePicker
                        showTime
                        placeholder="结束时间"
                        className={style.wd100}
                        onChange={changeEndDate}
                        disabledDate={disabledendDate}></DatePicker>
                    </Item>
                    <Item>
                      <Radio.Group defaultValue="2" buttonStyle="solid" className={style.wd100} onChange={changeWatchS}>
                        <Radio.Button value="2" style={tags}>标清</Radio.Button>
                        <Radio.Button value="1" style={tags}>高清</Radio.Button>
                      </Radio.Group>
                    </Item>
                    <Item>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <CustButton ghost style={{ width: '120px' }} onClick={() => changeActive()}>
                          返回
                        </CustButton>
                        <CustButton style={{ width: '120px' }} onClick={() => { playBackYun() }}>
                          回放
                        </CustButton>
                      </div>
                    </Item>
                  </Form>
                </Panel>
              </Collapse>

            </div>
          </div>
        </div>

      </Modal>
      <Modal
        title={cameraTitle}
        centered
        width={1680}
        footer={null}
        open={localModal}
        onCancel={closeWS}
        maskClosable={false}
        destroyOnClose={true}
      >
        <div className={style.dialogBody}>
          <div className="bodyLeft" style={{ width: 1278, height: 718 }}>
            <div id="container" style={{ marginLeft: 0, marginRight: 16 }}>
              <video style={{ width: 1278, height: 717.75 }} muted controls autoPlay id="player"></video>
            </div>
          </div>
          <div className="bodyRight">
            <Titlelayout title="云台控制" bordered="n">
              <div className="controlBackground" id="controlBackground" >
                <div className={["slotDiv", changeType != '' ? changeType : ''].join(' ')}>
                  <span className="clickButton leftClick" onMouseDown={() => changeControl('left')} onMouseUp={cancelControl}></span>
                  <span className="clickButton rightClick" onMouseDown={() => changeControl('right')} onMouseUp={cancelControl}></span>
                  <span className="clickButton topClick" onMouseDown={() => changeControl('top')} onMouseUp={cancelControl}></span>
                  <span className="clickButton bottomClick" onMouseDown={() => changeControl('bottom')} onMouseUp={cancelControl}></span>
                </div>
              </div>
            </Titlelayout>
            <div className="timeControl">
              <Collapse
                onChange={changeKey}
                ghost
                activeKey={activeCollapse}
                expandIconPosition="end">
                <Panel header={<Borderleft>视频回放</Borderleft>} key="1">
                  <DatePicker
                    showTime={{
                      defaultValue: moment('00:00:00', 'HH:mm:ss'),
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="开始时间"
                    className={style.wd100}
                    disabledDate={disabledDate}
                    onChange={changestartdate}
                  />

                  <DatePicker
                    showTime
                    placeholder="结束时间"
                    className={style.wd100}
                    onChange={changeEndDate}
                    disabledDate={disabledendDate}></DatePicker>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <CustButton ghost style={{ width: '120px' }} onClick={() => changeActive()}>返回</CustButton>
                    <CustButton style={{ width: '120px' }} onClick={() => playBack()}>回放</CustButton>
                  </div>

                </Panel>
              </Collapse>
            </div>
          </div>
        </div>
      </Modal>
    </Pagecount>
  )
}
