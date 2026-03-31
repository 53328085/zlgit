import React, { useState, useEffect, useMemo } from 'react'
import { Form, Modal, Collapse, DatePicker, Radio, Button, Space, message, Typography} from 'antd'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { selectProjectId, selectOneLevelDefaultId,adaptation } from '@redux/systemconfig.js'
import { useAntdTable, useReactive } from 'ahooks'
import style from './style.module.less'
import BlueColumn from '@com/bluecolumn'
import cameraBG from '@imgs/carmeraBG.png'
import EZUIKit from "ezuikit-js";
import moment from 'moment';
import { themeData } from './themeData'
import { selectUser } from '@redux/user'
import totalCamera from './images/totalCamera.png';
import cloudCamera from './images/cloudCamera.png';
import localCamera from './images/localCamera.png';
import playImg from './images/play.png';
import { leftControl, bottomControl, rightControl, topControl, stopControl, Monitoring, GetCamerasoneInfo } from '@api/api.js'
import { isObject } from '@com/usehandler'
import { Serach, Cdivider, Borderleft } from "@com/comstyled"
import Pagecount from "@com/pagecontent";
import Table from "@com/useTable";
import { CustTransO, i18t, i18warning,ExportExcel, RadioT,CustButtonT,CustButton } from "@com/useButton"
import Titlelayout from '@com/titlelayout'
const {Link} = Typography
const Mainbox = styled.div`
  display: grid;
  grid-template-rows: 94px 1fr;
  row-gap: 16px;
  flex: 1;
  .cameras {
    height: 94px;
    display: grid;
    column-gap: 16px;
    grid-template-columns: repeat(3,1fr);
    grid-template-rows: 1fr;
    overflow: hidden;
    .camera{
      height: inherit;
      background-color: #fff;
      padding: 16px;
      align-items: center;
      column-gap: 16px;
      display: flex;
      border-radius: 8px;
      border: 1px solid #DDDFE6;
      .itemvalue {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #37383A;
          font-size: 16px;
          .num {
            color: #1977FF;
            font-size: 31px;
            
          } 
      }
    }
  }
`
  //摄像头展示数据
  const CameraValue = (props) => {
    return (
      <div className="camera">
        <img src={props.img}   alt={props.title}></img>
        <div className="itemvalue">
          <div>{props.title}</div>
          <div><span className='num'>{props.value}</span> <span>{i18t("monitor","unit")}</span></div>
        </div>
      </div>
    )
  }
export default function Index() {
  const { RuntimeCamera: { Statistics, Overview, StopYsPtz, StartYsPtz, GetYsHisPlayUrl, GetYsRealPlayUrl } } = Monitoring
  const { token } = useSelector(selectUser);
  const {laptop} = useSelector(adaptation)
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
  let areaId = useSelector(selectOneLevelDefaultId);

  const state = useReactive({
    id: new Uint32Array(1),
    webrtc: null,
    videoPlayer: null,
    videoData:{},
  })


  const [cameraTitle, setCameraTitle] = useState('')
  const [wsType, setwsType] = useState('');
  const [wsUrl, setWsUrl] = useState('');
  const [wsocket, setwebsocket] = useState(null);
  const [recordData, setrecordData] = useState()
  const controlStyle = {
    width: 256,
    height: 256,
    margin: '0 auto',
    backgroundImage: `url(${cameraBG})`
  }
  const tags = {
    width: '50%',
    textAlign: 'center',
    whiteSpace: "nowrap"
  }
  const buttonstyle = {
    width: '120px',
  }
  let [statistics, setStatistics] = useState({ cameraCount: '', localCameras: '', onlineCameras: '' })
  const getStatistics = () => {
    return Statistics(projectId, areaId).then((res) => {
      let { success, data } = res
      if (success && data) {
        setStatistics(data)
      } else {
        message.error(res.errMsg)
      }
    })
  }//监控数量 

  let [realPlayUrl, setrealPlayUrl] = useState()
 // let [total, settotal] = useState(0)
  const getYsRealPlayUrl = async (record) => {

    try {
      let { success, data } = await GetYsRealPlayUrl(record.sn, record.channel, 1, quality, projectId)

      if (success && isObject(data)) {
        let { token, url } = data;
        if (!url) return message.warning("url不存在");
        if (!token) return message.warning("token不存在")
        showModal({ token, url })
      }
    } catch (error) {
      console.log(error)
    }
    /*   GetYsRealPlayUrl(record.sn, record.channel, 1, quality, projectId).then((res) => {
       let { success, data } = res
       if (success && data) {
         setrealPlayUrl(data)
         
       } else {
         message.error(res.errMsg)
       } 
     }) */
  }//云监控token、URL
  const getYsHisPlayUrl = (start, end) => {
    return GetYsHisPlayUrl(recordData.sn, recordData.channel, quality, start, end, projectId).then((res) => {
      let { success, data } = res
      if (success && isObject(data)) {
        let { token, url } = data;
        if (!url) return message.warning("url不存在");
        if (!token) return message.warning("token不存在")
        showModal(data)
      } else {
        if (!success) message.error(res.errMsg)
      }
    })
  }//云监控回放
  let StartYsPtzData = {
    cameraSn: recordData?.sn,
    channelNo: recordData?.channel,
    direction: '',
    speed: 1,
    projectId,
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
    projectId,
  }
  const cancelControlYun = () => {
    return StopYsPtz(StopYsPtzData).then((res) => {
      let { success, data } = res
      if (success && data) {
        // setrealPlayUrl(data)
      } else {
        message.error(i18t("monitor","info4"))
      }
    })
  }
  const startYsPtz = () => {
    return StartYsPtz({ ...StartYsPtzData }).then((res) => {
      let { success, data } = res
      if (success && data) {
        // setrealPlayUrl(data)
      } else {

        message.error(i18t("monitor","info4"))
      }
    })
  }//云监控云台控制


  const [alike, setAlike] = useState('')
  const getOverview = ({ current, pageSize }) => {
    let post = {
      pageNum: current,
      pageSize,
      projectId,
      areaId,
      alike: alike.trim()
    }
    return Overview(post).then((res) => {
      let { success, data, total } = res
    //  settotal(Number.isFinite() ? total : 0)
      if (success) {
        return {
          list: Array.isArray(data) ? data : [],
          total: Number.isInteger(total) ? total : 0
        }
      } else {
        message.error(res.errMsg)
        return {
          list: [],
          total: 0
        }
      }
    })
  }
  const { tableProps } = useAntdTable(getOverview, {
    defaultPageSize: 14,
    refreshDeps: [projectId, areaId, alike]
  })



  //云监控

  const onSearchList = (e) => {
    setAlike(e)
  }//点击查询按钮
  const onChangePage = (page, pageSize) => {
    setpageNum(page)
  }//翻页
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
        width: laptop ? 690 : 1280,
        height: 717,
        themeData: themeData,
        handleError: (err) => {
          console.log(err)
        }
      })
      setbigplay(player)
    }, 100)
    setisModal(true)

  }
  //关闭视频监控弹窗
  const handleCancel = () => {
    setisModal(false)
    //  setLocalModal(false)
    bigplay.stop()
    // play.play()
  }



  const columns = [
    // {
    //   title: '序号',
    //   dataIndex: 'key',
    //   align: 'center',
    //   key:'sn'
    // },
    {
      title:   i18t("comm","sn",{text:"监控设备"}),
      dataIndex: 'sn',
      align: 'center',
      key: 'sn'
    }, {
      title: i18t("comm","name",{text:"监控设备"}),
      dataIndex: 'name',
      align: 'center',
      key: 'sn'
    }, {
      title: i18t("comm","address"),
      dataIndex: 'address',
      align: 'center',
      key: 'sn'
    }, {
      title: i18t("comm","mode",{text: "监控类型"}),   //'监控类型',
      dataIndex: 'accessMode',
      render: (text) => (<span>{text == 1 ? '云监控' : '本地监控'}</span>),
      align: 'center',
      key: 'sn'
    }, {
      title: i18t("comm","view",{text: "查看监控"}), //'查看监控',
      align: 'center',
      key: 'sn',
      render: (_, record) => (
        <Space size='middle'>
          <Link  underline onClick={() => showCameraDialog(record)}>
            <img src={playImg} className={style.playImg} alt='播放按钮'></img>
          </Link>
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
          fetch(setIceCandidateUrl,{
            method:"POST",
            body:JSON.stringify(event.candidate),
            headers:{"Content-Type":"application/json"}
        });
        }
      }
  
      let offerResponse = await fetch(getOfferUrl);
      let offer = await offerResponse.json();
      if(!offer.success){
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
      console.log(record)
      if (record.accessMode == 1) {
        //  showModal()
        getYsRealPlayUrl(record)
      } else {
        if (record.accessMode == 2) {
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
    } catch (error) {

    }
  }
  // http: ws, https: wss


  const [changeType, setChangeType] = useState('')

  const changeControl = (value) => {

    let { serverAddress, port, id, channel } = recordData

    let url = 'http://' + serverAddress

    let ip = state.videoData.ip

    //url, rtsp, state.videoData.channel, state.videoData.account, state.videoData.pwd

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
      message.error(i18t("monitor","info5"));
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
      message.error(i18t("monitor","info5"));
      return;
    }
    getYsHisPlayUrl(startTimeHistory, endTimeHistory)
  }
  const changeUTC = (time) => {
    let date = new Date(time);
    let year = date.getFullYear().toString();
    let month = date.getMonth() + 1;
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


  useEffect(() => {
    if (Number.isFinite(areaId)) {
      getStatistics()
    }
  }, [projectId, areaId])

  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>

        <div  className="cameras">
          <CameraValue img={totalCamera} title={i18t("comm","amount",{text:"监控总数"})} value={statistics.cameraCount ? statistics.cameraCount : '0'}></CameraValue>
          <CameraValue img={cloudCamera} title={i18t("monitor","cloudmonitoring")} value={statistics.onlineCameras ? statistics.onlineCameras : '0'}></CameraValue>
          <CameraValue img={localCamera} title={i18t("monitor","localmonitoring")} value={statistics.localCameras ? statistics.localCameras : '0'}></CameraValue>
        </div>

        <Mainbox className={style.content}>
          <div className={style.contentTitle}>
            <span>{i18t("comm","Query",{text:"设备"})}</span>
            <Serach size="middle" placeholder={i18t("comm","placeholder",{text:"设备编号/安装地址"})}
              style={{ width: '340px', marginLeft: 16 }}


              //  onChange={onChange}
              onSearch={onSearchList}
            />

          </div> 

          <Table bordered columns={columns} {...tableProps} rowKey={row =>row.sn+row.id} size='small' />


        </Mainbox>
        {/* 云监控 */}
        <Modal
          title={recordData?.address}
          centered
          width={laptop ? 1024 : 1680}
          footer={null}
          open={isModal}
          onCancel={handleCancel}
        >
          <div style={{ display: 'flex' }}>
            <div id="replay" style={{
              flex:1
            }}></div>
            <div style={{ flex: 1, marginLeft: laptop ? 16 : 32 }}>
              <Titlelayout title={i18t("comm","control",{text:"云台控制"})} bordered="n">
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
                  <Panel header={<Borderleft>{i18t("comm","playback")}</Borderleft>} key="1">
                    <Form form={form} >
                      <Item style={{ width: '100%' }}>
                        <DatePicker
                          showTime={{
                            defaultValue: moment('00:00:00', 'HH:mm:ss'),
                          }}
                          format="YYYY-MM-DD HH:mm:ss"
                          
                          className={style.wd100}
                          disabledDate={disabledDate}
                          onChange={changestartdate}
                        />
                      </Item>
                      <Item>
                        <DatePicker
                          showTime
                          
                          className={style.wd100}
                          onChange={changeEndDate}
                          disabledDate={disabledendDate}></DatePicker>
                      </Item>
                      <Item>
                        <Radio.Group defaultValue="2" buttonStyle="solid" className={style.wd100} onChange={changeWatchS}>
                          <Radio.Button value="2" style={tags}>{i18t("comm","standarddefinition")}</Radio.Button>
                          <Radio.Button value="1" style={tags}>{i18t("comm","highdefinition")}</Radio.Button>
                        </Radio.Group>
                      </Item>
                      <Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <CustButtonT ghost style={{ width: '120px' }} onClick={() => changeActive()} text="back" />
                            
                          <CustButtonT style={{ width: '120px' }} onClick={() => { playBackYun() }} ns="comm" text="playback" />
                             
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
          width={laptop ? 1024 : 1680}
          footer={null}
          open={localModal}
          onCancel={closeWS}
          maskClosable={false}
          destroyOnClose={true}
        >
          <div className={style.dialogBody}>
            <div className="bodyLeft" style={{ display: "flex", flex: 1, height: "100%" }}>
              <div id="container" style={{ display: "flex",flex:1 }}>
                <video style={{ width: laptop ?"690px" : "1280px", height: "717px" }} muted controls autoPlay id="player"></video>
              </div>
            </div>
            <div className="bodyRight" style={{ marginLeft: laptop ? "16px" : "48px" }}>
              <Titlelayout title={i18t("comm","control",{text:"云台控制"})} bordered="n">
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
                  <Panel header={<Borderleft>{i18t("comm","playback")}</Borderleft>} key="1">
                    <DatePicker
                      showTime={{
                        defaultValue: moment('00:00:00', 'HH:mm:ss'),
                      }}
                      format="YYYY-MM-DD HH:mm:ss" 
                      className={style.wd100}
                      disabledDate={disabledDate}
                      onChange={changestartdate}
                    />

                    <DatePicker
                      showTime
                      
                      className={style.wd100}
                      onChange={changeEndDate}
                      disabledDate={disabledendDate}></DatePicker>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <CustButtonT ghost style={{ width: '120px' }} onClick={() => changeActive()} text="back" /> 
                      <CustButtonT style={{ width: '120px' }} onClick={() => playBack()} ns="comm" text="playback" />  
                    </div>

                  </Panel>
                </Collapse>
              </div>
            </div>
          </div>
        </Modal>
      </Mainbox>
    </Pagecount>
  )
}
