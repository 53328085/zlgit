import React, { useState, useEffect,useMemo  } from 'react'
import { Form, Modal, Collapse, DatePicker, Radio, Button,  Space, message,  } from 'antd'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { selectProjectId, selectOneLevelDefaultId } from '@redux/systemconfig.js'
import {useAntdTable} from 'ahooks'
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
import { leftControl, bottomControl, rightControl, topControl, stopControl, Monitoring , GetCamerasoneInfo} from '@api/api.js'

import {Serach, Cdivider, Borderleft} from "@com/comstyled"
import Pagecount from "@com/pagecontent";
import Table from "@com/useTable";
import {CustButton} from '@com/useButton'
import Titlelayout from '@com/titlelayout'
const Mainbox = styled.div`
  display: grid;
  grid-template-rows: 80px 1fr;
  row-gap: 16px;
  flex: 1;
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
  let areaId = useSelector(selectOneLevelDefaultId);


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
  let [total, settotal] = useState(0)
  const getYsRealPlayUrl = record => {
    return GetYsRealPlayUrl(record.sn, record.channel, 1, quality).then((res) => {
      let { success, data } = res
      if (success && data) {
        setrealPlayUrl(data)
        console.log(realPlayUrl)
      } else {
        message.error(res.errMsg)
      }
    })
  }//云监控token、URL
  const getYsHisPlayUrl = (start,end) => {
    return GetYsHisPlayUrl(recordData.sn, recordData.channel, quality,start,end).then((res) => {
      let { success, data } = res
      if (success && data) {
        setrealPlayUrl(data)
      } else {
        message.error(res.errMsg)
      }
    })
  }//云监控回放
  let StartYsPtzData={
    cameraSn:recordData?.sn,
    channelNo:recordData?.channel,
    direction:'',
    speed:1
  }
  const changeControlYun=val=>{
    StartYsPtzData.direction=val
    StopYsPtzData.direction=val
    startYsPtz()
  }
  let StopYsPtzData={
    cameraSn:recordData?.sn,
    channelNo:recordData?.channel,
    direction:'',
  }
  const cancelControlYun=()=>{
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
    return StartYsPtz(StartYsPtzData).then((res) => {
      let { success, data } = res
      if (success && data) {
        // setrealPlayUrl(data)
      } else {
        message.error(res.errMsg)
      }
    })
  }//云监控云台控制


  const [alike, setAlike] = useState('')
  const getOverview = ({current, pageSize}) => {
    let post = {
      pageNum: current,
      pageSize,
      projectId,
      areaId,
      alike: alike.trim()
    }
    return Overview(post).then((res) => {
      let { success, data } = res
      settotal(Number.isFinite(total) ? total : 0)
      if (success) {
         return {
           list: Array.isArray(data) ? data : [],
           total: Number.isFinite(total) ? total : 0
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
  const {tableProps} = useAntdTable(getOverview, {
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
  const showModal = () => {
   

    //setLocalModal(true)
    // play.stop()
    let player
    if(realPlayUrl){
      setTimeout(() => {
        player = new EZUIKit.EZUIKitPlayer({
          id: 'replay',
          accessToken: realPlayUrl?.token,//
          url: realPlayUrl?.url,
          width: 1280,
          height: 717,
          themeData: themeData,
        })
        setbigplay(player)
      }, 0)
      setisModal(true)
    }
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

      <div className={style.dataItem}>
        <img src={props.img} className={style.itemImg} alt={props.title}></img>
        <div className={style.itemValue}>
          <div>{props.title}</div>
          <div><span style={{ fontSize: 32, marginRight: 10 }}>{props.value}</span>台</div>
        </div>
      </div>
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

  const chooseType = (url) => {
    console.log(url);
    let config = {
      type: 'raw265',
      player: "glplayer",
      width: '1278',
      height: '717.75',
      token: "base64:QXV0aG9yOmNoYW5neWFubG9uZ3xudW1iZXJ3b2xmLEdpdGh1YjpodHRwczovL2dpdGh1Yi5jb20vbnVtYmVyd29sZixFbWFpbDpwb3JzY2hlZ3QyM0Bmb3htYWlsLmNvbSxRUTo1MzEzNjU4NzIsSG9tZVBhZ2U6aHR0cDovL3h2aWRlby52aWRlbyxEaXNjb3JkOm51bWJlcndvbGYjODY5NCx3ZWNoYXI6bnVtYmVyd29sZjExLEJlaWppbmcsV29ya0luOkJhaWR1",
      extInfo: {
        rawFps: 30,
        autoPlay: true,
        ignoreAudio: 1,
      }
    };

    // setwebsocket(new WebSocket(url));
    let ws = new WebSocket(url);
    console.log(ws)
    ws.binaryType = 'arraybuffer';
    ws.addEventListener('open', function (event) {  });
    ws.addEventListener('message', function (event) {
      let data = new Uint8Array(event.data);
      if (data.length == 1) {
        ws.close();
        if (data[0] == 1) {
          setwsType('h265');
          setTimeout(() => {
            makeH265webjsRawLIVE(url, config);
          }, 500);
        } else {
          setwsType('h264')
          setTimeout(() => { getwebConnect(url) }, 500);
        }
      } else {
        ws.close();
      }
    });
  }
 
  const showCameraDialog = async (record) => {
    try {
      
    
    setrecordData(record)
    let {serverAddress, id} = record
    let {success, data} =    await GetCamerasoneInfo(projectId, id)
    if (!success || !data) return
    let {ip, channel,account, pwd } = data
    let idx = serverAddress.indexOf(":")
    let htp = serverAddress.slice(0, idx)
    let url = htp =='http' ? serverAddress.replace('http', 'ws') : htp == 'https' ? serverAddress.replace('https', 'ws') : ''
    console.log(url)
    if(!url) return message.warning("播放地址URL不存在")
    if (record.accessMode == 1) {
      showModal()
      getYsRealPlayUrl(record)
    } else {
      if (record.accessMode == 2) {
        setLocalModal(true);
        setCameraTitle(record.address)
        // setwsType('h264')
        
        setWsUrl(url  + '/video?ip=' +ip + '&type=real&user=' + account + '&pwd=' +pwd + '&channel=' + channel);
        chooseType(url  + '/video?ip=' + ip + '&type=real&user=' + account + '&pwd=' + pwd + '&channel=' + channel);
      }
    }
  } catch (error) {
      
  }
  }
 // http: ws, https: wss


  const [changeType, setChangeType] = useState('')
 
  const changeControl = (value) => {
    
    let {serverAddress, port, id} = recordData
     
  
    if (value == 'left') {
      setChangeType('leftControl');
      leftControl({},serverAddress,projectId,id).then(res => {
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
      rightControl({},serverAddress,projectId,id).then(res => {
        if (res.success) {
          return;
        } else { message.error(res.errMsg) }
      })
    }
    if (value == 'top') {
      setChangeType('topControl');
      topControl({},serverAddress,projectId,id).then(res => {
        if (res.success) {
          return;
        } else { message.error(res.errMsg) }
      })
    }
    if (value == 'bottom') {
      setChangeType('bottomControl');
      bottomControl({},serverAddress,projectId,id).then(res => {
        if (res.success) {
          return;
        } else { message.error(res.errMsg) }
      })
    }
  }

  const cancelControl = () => {
    setChangeType('');
     
    let {serverAddress, port, id} = recordData
    
    stopControl({},serverAddress,projectId,id).then(res => {
      if (res.success) {
        return;
      } else { message.error(res.errMsg) }
    })
  }

  const getwebConnect = (url) => {
    var jmuxer;
    jmuxer = new JMuxer({
      node: 'player',
      mode: 'video',
      flushingTime: 1000,
      clearBuffer: false,
      fps: 25,
      debug: true,
    });
    // setwebsocket(new WebSocket(url));
    let ws = new WebSocket(url);
    ws.binaryType = 'arraybuffer';

    setwebsocket(ws);

    ws.addEventListener('open', function (event) { });
    ws.addEventListener('message', function (event) {
      let data = new Uint8Array(event.data);
      if (data.length == 1) {
      } else {
        jmuxer.feed({
          video: new Uint8Array(event.data),
        });
      }
    });
  }

  const closeWS = () => {
    setLocalModal(false);
    if (wsType == 'h264') {
      wsocket.close();
    } else {
      //closeWeb();
    }
  }



  const [activeCollapse, setActiveCollapse] = useState(['1'])
  const changeActive = () => {
    setActiveCollapse([]);
  }
  let [quality,setquality]=useState(2)
  const changeWatchS=val=>{
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
    if (wsType == 'h264') {
      wsocket.close();
    } else {
      // closeWeb();
    }
    let start = changeUTC(startTime);
    let end = changeUTC(endTime);
    console.log(start, end);
    setTimeout(() => {
      if (wsType == 'h265') {
        let playerContainer = document.getElementById("player-container");
        let glplayer = document.getElementById('glplayer');
        console.log(playerContainer);
        playerContainer.removeChild(glplayer);
        let div = document.createElement('div');
        div.setAttribute('class', 'glplayer');
        div.setAttribute('id', 'glplayer');
        playerContainer.appendChild(div);
      }
      let backURL = 'ws://' + recordData.serverAddress + ':' + recordData.port + '/video?ip=' + recordData.ip + '&type=track&user=' + recordData.account + '&pwd=' + recordData.pwd + '&channel=' + recordData.channel + '&startTime=' + start + '&endTime=' + end;
      setWsUrl(backURL);
      chooseType(backURL);
    }, 1000)
  }
const playBackYun=()=>{
  if (!startTime || !endTime) {
    message.error('请选择正确的时间段！');
    return;
  }
  getYsHisPlayUrl(startTimeHistory,endTimeHistory)
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
  
      <div id='cameraData' className={style.cameraData}>
        <CameraValue img={totalCamera} title={'监控总数'} value={statistics.cameraCount ? statistics.cameraCount : '0'}></CameraValue>
        <CameraValue img={cloudCamera} title={'云监控'} value={statistics.onlineCameras ? statistics.onlineCameras : '0'}></CameraValue>
        <CameraValue img={localCamera} title={'本地监控'} value={statistics.localCameras ? statistics.localCameras : '0'}></CameraValue>
      </div>
   
      <Mainbox className={style.content}>
        <div className={style.contentTitle}>
          <span>设备查询</span>
          <Serach size="middle"  placeholder='请输入设备编号/安装地址' 
          style={{ width: '340px', marginLeft: 16 }} 
          
          
        //  onChange={onChange}
          onSearch = {onSearchList}
           />
      
        </div>
        <Cdivider type="h" margin="16px 0" />
      
          <Table bordered columns={columns} {...tableProps} rowKey='sn' size='small' />
        
       
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
                <span className={style.leftClick } onMouseDown={() => changeControlYun(2)} onMouseUp={cancelControlYun}></span>
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
                        <CustButton  ghost style={{width: '120px'}} onClick={() => changeActive()}>
                          返回
                        </CustButton>
                        <CustButton  style={{width: '120px'}} onClick={()=>{playBackYun()}} >
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
            {wsType == 'h265' ?
              <div id="player-container" >
                <div id="glplayer" className="glplayer"></div>
                <div id="controller" className="controller">
                  <div id="progress-contaniner" className="progress-common progress-contaniner">
                    <div id="cachePts" className="progress-common cachePts"></div>
                    <div id="progressPts" className="progress-common progressPts"></div>
                  </div>
                  <div id="operate-container" className="operate-container">
                    <li id="playBar" className="playBtn">
                      <a href="/#" title="start" onClick={preventJump}>Start</a>
                    </li>
                    <span id="ptsLabel" className="ptsLabel">00:00:00/00:00:00</span>
                    <div className="voice-div">
                      <span>
                        <a id="muteBtn" className="muteBtn" href='/#' onClick={preventJump}>
                          <svg className="icon" style={{ width: '1em', height: '1em', verticalAlign: 'middle', fill: 'currentColor', overflow: 'hidden' }} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="488">
                            <path d="M153.6 665.6V358.4h204.8V256H153.6c-56.32 0-102.4 46.08-102.4 102.4v307.2c0 56.32 46.08 102.4 102.4 102.4h204.8v-102.4H153.6zM358.4 256v102.4l204.8-128v563.2L358.4 665.6v102.4l307.2 204.8V51.2zM768 261.12v107.52c61.44 20.48 102.4 76.8 102.4 143.36s-40.96 122.88-102.4 143.36v107.52c117.76-25.6 204.8-128 204.8-250.88s-87.04-225.28-204.8-250.88z" p-id="489">
                            </path>
                          </svg>
                        </a>
                      </span>
                      <progress id="progressVoice" className="progressVoice" value="50" max="100"></progress>
                    </div>

                    <a id="fullScreenBtn" className="fullScreenBtn" href='/#' onClick={preventJump}>
                      <svg className="icon" style={{ width: '1em', height: '1em', verticalAlign: 'middle', fill: 'currentColor', overflow: 'hidden' }} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="403">
                        <path d="M167.8 903.1c-11.5 0-22.9-4.4-31.7-13.1-17.5-17.5-17.5-45.8 0-63.3l221.1-221.1c17.5-17.5 45.9-17.5 63.3 0 17.5 17.5 17.5 45.8 0 63.3L199.4 890c-8.7 8.7-20.2 13.1-31.6 13.1zM638.5 432.4c-11.5 0-22.9-4.4-31.7-13.1-17.5-17.5-17.5-45.8 0-63.3l221.7-221.7c17.5-17.5 45.8-17.5 63.3 0s17.5 45.8 0 63.3L670.1 419.3c-8.7 8.7-20.2 13.1-31.6 13.1zM859.7 903.8c-11.5 0-23-4.4-31.7-13.1L606.7 668.8c-17.5-17.5-17.4-45.9 0.1-63.4s45.9-17.4 63.3 0.1l221.4 221.9c17.5 17.5 17.4 45.9-0.1 63.4-8.8 8.7-20.2 13-31.7 13zM389 432.1c-11.5 0-23-4.4-31.7-13.1L136.1 197.2c-17.5-17.5-17.4-45.9 0.1-63.4s45.9-17.4 63.3 0.1l221.2 221.7c17.5 17.5 17.4 45.9-0.1 63.4-8.7 8.7-20.2 13.1-31.6 13.1z" fill="#ffffff" p-id="404">
                        </path>
                        <path d="M145 370c-24.7 0-44.8-20.1-44.8-44.8V221.8C100.2 153.5 155.7 98 224 98h103.4c24.7 0 44.8 20.1 44.8 44.8s-20.1 44.8-44.8 44.8H224c-18.9 0-34.2 15.3-34.2 34.2v103.4c0 24.7-20.1 44.8-44.8 44.8zM883.3 370c-24.7 0-44.8-20.1-44.8-44.8V221.8c0-18.9-15.3-34.2-34.2-34.2H700.8c-24.7 0-44.8-20.1-44.8-44.8S676.1 98 700.8 98h103.5c68.2 0 123.8 55.5 123.8 123.8v103.5c0 24.7-20.1 44.7-44.8 44.7zM327.5 926.6H224c-68.2 0-123.8-55.5-123.8-123.8V699.4c0-24.7 20.1-44.8 44.8-44.8s44.8 20.1 44.8 44.8v103.5c0 18.9 15.3 34.2 34.2 34.2h103.5c24.7 0 44.8 20.1 44.8 44.8s-20.1 44.7-44.8 44.7zM804.3 926.6H700.8c-24.7 0-44.8-20.1-44.8-44.8s20.1-44.8 44.8-44.8h103.5c18.9 0 34.2-15.4 34.2-34.2V699.4c0-24.7 20.1-44.8 44.8-44.8 24.7 0 44.8 20.1 44.8 44.8v103.5c0 68.2-55.6 123.7-123.8 123.7z" fill="#ffffff" p-id="405">
                        </path>
                      </svg>
                    </a>
                    <span id="showLabel" className="showLabel"></span>
                  </div>
                </div>
              </div> : wsType == 'h264' ?
                <div id="container" style={{ marginLeft: 0, marginRight: 16 }}>
                  <video style={{ width: 1278, height: 717.75 }} muted controls autoPlay id="player"></video>
                </div> : null
            }
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
                    <CustButton  ghost style={{width: '120px'}} onClick={() => changeActive()}>返回</CustButton>
                    <CustButton   style={{width: '120px'}} onClick={() => playBack()}>回放</CustButton>
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
