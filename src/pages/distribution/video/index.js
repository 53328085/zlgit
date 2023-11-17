import React, { useState, useEffect,useMemo } from 'react'
import { Form, Modal, Collapse, DatePicker, Radio, Button, Input, Table, Space, message, Pagination,Select,Divider } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
// import Header from './header'
import UseHeader from '@com/useHeader'
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
import { leftControl, bottomControl, rightControl, topControl, stopControl, Monitoring,DistributionRoomRuntime,distributionRoom} from '@api/api.js'

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
  const roomopts =useSelector(state=>state.system.roomId)
  console.log(roomopts)
  const [roomlist,setRoomList] = useState(roomopts)
  const oneLevel = useSelector(state => state.system.onelevel)
  const [roomId,setRoomId] =useState(roomlist[0]?.id)
  // const areaOptions =oneLevel.length>0? useMemo(() => ([{ name: oneLevel[0].levelName+'(全部)', id: 0 }, ...oneLevel]), [oneLevel]):[]
  const changeArea=(v)=>{
    setAreaId(v)
    getRoomList(v)
  }
  const changeRoom=(v)=>{
    setRoomId(v)
  }
  const getRoomList = async (areaId) => {
    const resp = await distributionRoom.RoomList(projectId, areaId)
    if (resp.success) {
      setRoomList(resp.data)
      if (Array.isArray(resp.data) && resp.data.length > 0) {
        form.setFieldValue('roomId', resp.data[0][['id']])
        setRoomId(resp.data[0][['id']])
      } else {
        form.setFieldValue('roomId', [])
        setRoomId(null)
        setStatistics({ all: '', cloud: '', local: '' })
        setoverView([])
      }

    }
  }
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
  let [statistics, setStatistics] = useState({ all: '', cloud: '', local: '' })
  const getStatistics = () => {
    return DistributionRoomRuntime.CameraSummary(projectId, roomId).then((res) => {
      let { success, data } = res
      if (success && data) {
        setStatistics(data)
      } else {
        message.error(res.errMsg)
      }
    })
  }//监控数量
  let [pageNum, setpageNum] = useState(1)
  let inputValue = ''
  let params = {
    pageNum: pageNum,
    pageSize: 10,
    projectId: projectId,
    areaId: areaId,
    alike: ''
  }
  let [overView, setoverView] = useState()
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

  // const getOverview = () => {
  //   return Overview(params).then((res) => {
  //     let { success, data } = res
  //     if (success && data) {
  //       setoverView(data)
  //       settotal(res.total)
  //     } else {
  //       message.error(res.errMsg)
  //     }
  //   })
  // }
  const getCameraPage =async ()=>{
    try{
      let p ={
        projectId,
        pageNum:params.pageNum,
        pageSize: 10,
        roomId,
        alike:params.alike
      }
      const resp = await DistributionRoomRuntime.CameraPage(p)
      let { success, data } = resp
      if(success && data){
        setoverView(data)
        settotal(resp.total)
      }else{
        message.error(resp.errMsg)
      }
    }catch(e){
      console.log(e)
    }
   
  }
  
  //云监控
  const onChangeValue = e => {
    inputValue = e.target.value
  }//输入框改变值
  const onSearchList = () => {
    params.alike = inputValue
    console.log(params)
    // getOverview()
    getCameraPage()
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
    setisModal(true)

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
 
  const showCameraDialog = (record) => {
    console.log(record,location.protocol)

    setrecordData(record)
    if (record.accessMode == 1) {
      showModal()
      getYsRealPlayUrl(record)
    } else {
      if (record.accessMode == 2) {
        setLocalModal(true);
        setCameraTitle(record.address)
        // setwsType('h264')
        
        setWsUrl('ws://' + record.serverAddress + ':' + record.port + '/video?ip=' + record.ip + '&type=real&user=' + record.account + '&pwd=' + record.pwd + '&channel=' + record.channel);
        chooseType('wss://' + record.serverAddress + ':' + record.port + '/video?ip=' + record.ip + '&type=real&user=' + record.account + '&pwd=' + record.pwd + '&channel=' + record.channel);
      }
    }
  }



  const [changeType, setChangeType] = useState('')
  const changeControl = (value) => {
    if (value == 'left') {
      setChangeType('leftControl');
      leftControl({}, recordData.serverAddress + ':' + recordData.port, recordData.ip, recordData.channel, recordData.account, recordData.pwd).then(res => {
        if (res.success) {
          return;
        } else {
          message.error(res.errMsg)
        }
      })
    }
    if (value == 'right') {
      setChangeType('rightControl');
      rightControl({}, recordData.serverAddress + ':' + recordData.port, recordData.ip, recordData.channel, recordData.account, recordData.pwd).then(res => {
        if (res.success) {
          return;
        } else { message.error(res.errMsg) }
      })
    }
    if (value == 'top') {
      setChangeType('topControl');
      topControl({}, recordData.serverAddress + ':' + recordData.port, recordData.ip, recordData.channel, recordData.account, recordData.pwd).then(res => {
        if (res.success) {
          return;
        } else { message.error(res.errMsg) }
      })
    }
    if (value == 'bottom') {
      setChangeType('bottomControl');
      bottomControl({}, recordData.serverAddress + ':' + recordData.port, recordData.ip, recordData.channel, recordData.account, recordData.pwd).then(res => {
        if (res.success) {
          return;
        } else { message.error(res.errMsg) }
      })
    }
  }

  const cancelControl = () => {
    setChangeType('');
    stopControl({}, recordData.serverAddress + ':' + recordData.port, recordData.ip, recordData.channel, recordData.account, recordData.pwd).then(res => {
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
    console.log(start, end,wsType);
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
      let backURL = 'wss://' + recordData.serverAddress + ':' + recordData.port + '/video?ip=' + recordData.ip + '&type=track&user=' + recordData.account + '&pwd=' + recordData.pwd + '&channel=' + recordData.channel + '&startTime=' + start + '&endTime=' + end;
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
    let month = date.getMonth() + 1;``
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
  const headerProps = {
    isEnergy: false,//能耗类型
    isDate: false,//日期
    isShift: false,//班次
    isTab: false,//能耗、费用radioButton
    isSearch: false,//查询按钮
    isExport: false,//导出按钮
    //export: exportData //导出调用方法
  }
  const getFromChild = data => {
    console.log(data.areaId)//园区id
    if (data.areaId == undefined) {
      return
    } else {
      setAreaId(data.areaId)
    }
  }
  const showTotal = (total) => `共 ${total} 条记录`;
  useEffect(() => {
     console.log(roomId,areaId)
     roomId&&getStatistics()
    
  }, [projectId, roomId])
  useEffect(() => {
    console.log(areaId)
    if(roomId){
      getCameraPage()
    }
  
    // if (areaId) {
    //   getOverview()
    // }
  }, [projectId, roomId, params.alike, params.pageNum])
  return (
    <div className={style.video}>
      {/* <UseHeader {...headerProps} getValues={getFromChild}></UseHeader> */}
      <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '8px 16px', border: '1px solid #d7d7d7', borderRadius: 4 }}>
          <Form
            form={form}
            colon={false}
            layout="inline"
            initialValues={{
              area:oneLevel[0]?.id,
              roomId
            }}
          >
            <Form.Item label={oneLevel[0]?.levelName} name="area" style={{ marginBottom: 0 }}>
              <Select 
              style={{ width: 200 }} 
              options={oneLevel} 
              fieldNames={{ label: 'name', value: 'id' }} 
              onChange={changeArea} 
              placeholder="请选择园区"
              ></Select>
            </Form.Item>
            <Form.Item>
            <Divider dashed type="vertical" style={{borderColor: "#999",height:'30px'}}></Divider>
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
      <div id='cameraData' className={style.cameraData}>
        <CameraValue img={totalCamera} title={'监控总数'} value={statistics.all ? statistics.all : '0'}></CameraValue>
        <CameraValue img={cloudCamera} title={'云监控'} value={statistics.cloud ? statistics.cloud : '0'}></CameraValue>
        <CameraValue img={localCamera} title={'本地监控'} value={statistics.local ? statistics.local : '0'}></CameraValue>
      </div>
      {/* <div className={style.container}>
        <VideoList showModal={showModal} setplay={setplay}/>
      </div> */}
      <div className={style.content}>
        <div className={style.contentTitle}>
          <span>设备查询</span>
          <Input placeholder='请输入设备编号/安装地址' style={{ width: 240, marginLeft: 16 }} size='middle' onChange={onChangeValue}></Input>
          <Button size='middle' style={{ width: 80, backgroundColor: 'rgb(245,247,250)' }} onClick={() => { onSearchList() }}>查询</Button>
        </div>
        <div style={{ marginTop: 16, marginBottom: 16, width: 1649, borderTop: "1px dashed #515151" }} ></div>
        <div className={style.tableList}>
          <Table bordered columns={columns} dataSource={overView} rowKey='sn' size='small' pagination={false} />
        </div>
        <Pagination className={style.pageNum} current={pageNum} size="small" total={total} showTotal={showTotal} defaultPageSize={10} onChange={onChangePage} />
      </div>
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
            <div >
              <BlueColumn name="云台控制" styled={{ fontSize: 16 }} />
              {/* <div style={controlStyle}></div> */}
              <div className={style.controlBackground} >
              <div className={style.slotDiv}>
                <span className={style.leftClick } onMouseDown={() => changeControlYun(2)} onMouseUp={cancelControlYun}></span>
                <span className={style.rightClick} onMouseDown={() => changeControlYun(3)} onMouseUp={cancelControlYun}></span>
                <span className={style.topClick} onMouseDown={() => changeControlYun(0)} onMouseUp={cancelControlYun}></span>
                <span className={style.bottomClick} onMouseDown={() => changeControlYun(1)} onMouseUp={cancelControlYun}></span>
              </div>
            </div>
            </div>
            <div style={{ marginTop: 32 }}>
              <Collapse
                onChange={changeKey}
                defaultActiveKey={['1']}
                ghost
                activeKey={activeCollapse}
                expandIconPosition="end">
                <Panel header={<BlueColumn name="视频回放" styled={{ fontSize: 16 }} />} key="1">
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
                        <Button htmlType="button" style={buttonstyle} onClick={() => changeActive()}>
                          返回
                        </Button>
                        <Button htmlType="button" onClick={()=>{playBackYun()}} style={{ ...buttonstyle, display: 'inlineBlock', marginLeft: 'auto', marginRight: 0 }}>
                          回放
                        </Button>
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
            <div className="title">云台控制</div>
            <div className="controlBackground" id="controlBackground" >
              <div className={["slotDiv", changeType != '' ? changeType : ''].join(' ')}>
                <span className="clickButton leftClick" onMouseDown={() => changeControl('left')} onMouseUp={cancelControl}></span>
                <span className="clickButton rightClick" onMouseDown={() => changeControl('right')} onMouseUp={cancelControl}></span>
                <span className="clickButton topClick" onMouseDown={() => changeControl('top')} onMouseUp={cancelControl}></span>
                <span className="clickButton bottomClick" onMouseDown={() => changeControl('bottom')} onMouseUp={cancelControl}></span>
              </div>
            </div>
            <div className="timeControl">
              <Collapse
                onChange={changeKey}
                ghost
                activeKey={activeCollapse}
                expandIconPosition="end">
                <Panel header={<BlueColumn name="视频回放" styled={{ fontSize: 16 }} />} key="1">
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
                    <span className='footerButton backButton' onClick={() => changeActive()}>返回</span>
                    <span className='footerButton replay' onClick={() => playBack()}>回放</span>
                  </div>

                </Panel>
              </Collapse>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
