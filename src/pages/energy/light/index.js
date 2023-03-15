import React, { useState, useEffect, useRef } from 'react'
import style from './style.module.less';
import { SearchOutlined, QuestionCircleFilled, RightOutlined, LeftOutlined, CheckCircleFilled, WarningFilled } from '@ant-design/icons';
import { Spin, Input, Button, Image, Empty, message } from 'antd';
import UseHeader from '@com/useHeader'
import Titlelayout from '@com/titlelayout'
import { useSelector } from 'react-redux'
import Custmodl from '@com/useModal'
import imgurl from './img/index.js'
import { useRequest } from "ahooks";
import { drawEcharts } from "@com/useEcharts";
import { flowExternStorage } from '@topology/flow-diagram';
import { selectProjectId } from '@redux/systemconfig.js'
import { energyDesigner } from '@api/api.js'
export default function Index(props) {
  const toMainPage = () => {
    let display = false;
    props.sendToIndex(display);
  }
  const [messageApi, contextHolder] = message.useMessage();
  const projectId = useSelector(selectProjectId)
  const formInfo = {
    changeType: 3,
    changeAreaId: 1,
    changeDate: '2023-01-01',
    changeInput: ''
  }
  let [state, setstate] = useState('开启');
  let [operateState, setoperateState] = useState(true);
  const [Ctitle, setCtitle] = useState({});
  const [loading, setLoading] = useState(false);
  let [numfirst, setnumfirst] = useState(0);
  let [numlast, setnumlast] = useState(9);
  const [changeTag, setChangeTag] = useState('')
  let [airList, setairList] = useState([]);
  let charts = ['本年（元）', '去年（元）']
  let [lightDate, setlightDate] = useState('本年');
  let [lightDateYesterday, setlightDateYesterday] = useState('去年');
  let energyInfo = {
    total: {
      periodValue: '0.00',
      lastMonthPeriodValue: '0.00',
      mom: '100%',
      yoy: '100%'
    },
    detail: {
      x: [],
      y: [],
      y1: []
    }
  };
  const aref = useRef()
  const elref = useRef(null)
  const sref = useRef()
  const {
    queryStreetLights,
    querOverview,
    lineOn,
    lineOff
  } = energyDesigner
  const getData = () => {//图表和能耗详情值
    return querOverview(projectId, formInfo.changeType, formInfo.changeAreaId, formInfo.changeDate).then(res => {
      let { success, data } = res
      if (success && data) {
        energyInfo = data
        console.log(4)
      } else {
        messageApi.open({
          type: 'error',
          content: res.errMsg
        })
      }
    })
  }
  const getDataList = () => {//路灯列表
    return queryStreetLights(projectId, formInfo.changeInput, formInfo.changeAreaId).then(res => {
      let { success, data } = res
      if (success && data) {
        //setairList(data)
        setairList([{
          id:1,
          name:'123456',
          boxName:'xxx',
          sn:'0123456789',
          controlLine:1,
          address:'zxxx',
          state:0
        }])
        console.log(3)
      } else {
        messageApi.open({
          type: 'error',
          content: res.errMsg
        })
      }
    })
  }
  const { run: queryData } = useRequest(getData, {
    refreshDeps: [changeTag],
    manual: true,
  })
  const { run: queryDataList } = useRequest(getDataList, {
    refreshDeps: [changeTag],
    manual: true,
  })
  const option = (name, name2, type = "bar") => ({
    xAxis: {
      data: energyInfo.detail ? energyInfo.detail.x : []
    },
    series: [
      {
        data: energyInfo.detail ? energyInfo.detail.y : [],
        type,
        name: name
      }, {
        data: energyInfo.detail ? energyInfo.detail.y1 : [],
        type,
        name: name2
      }
    ],
    grid: {
      // 图表 grid
      left: "0px",
      right: "0",
      top: "30px",
      bottom: "0px",
      containLabel: true,
    },
    legend: {
      top: 0,
      // bottom: 0,
      icon: 'rect',
      itemHeight: 2,
      itemWidth: 12,
      itemGap: 20,
    },
  });

  const tdrawEcharts = (c, option) => {
    return drawEcharts(c, { ...option, type: 2 })
  }
  useEffect(() => {
    if (formInfo.changeType && formInfo.changeAreaId && formInfo.changeDate) {
      queryData()
      queryDataList()
      tdrawEcharts(elref.current, option(charts[0], charts[1]))
    }
    console.log(2)
  }, []);
  const fs = {
    hv: '24px',
    fc: '#333'
  }
  const onclickBtn = (e, num, index) => {//点击远程操作按钮
    console.log(e, num, index)
    if (e.state == 1 && num == 2 || e.state == 0 && num == 1) {
      setCtitle(e)
      //setLightIndex(index)
      aref.current.onOpen()
      if (num == 1) {//开启
        setstate('开启')//弹窗文案
      } else {
        setstate('关闭')
      }
    }
  }

  const onOkAlert = () => {//执行远程开启/关闭操作
    aref.current.onCancel()
    setLoading(true)
    if (state == '开启') {
      return lineOn(projectId, Ctitle.sn, Ctitle.controlLine).then(res => {
        let { success, data } = res
        if (success && data) {
          setLoading(false)
          setoperateState(true)
          sref.current.onOpen()
          queryDataList()
        } else {
          setLoading(false)
          setoperateState(false)
          sref.current.onOpen()
        }
      })
    } else if (state == '关闭') {
      return lineOff(projectId, Ctitle.sn, Ctitle.controlLine).then(res => {
        let { success, data } = res
        if (success && data) {
          setLoading(false)
          setoperateState(true)
          sref.current.onOpen()
          queryDataList()
        } else {
          setLoading(false)
          setoperateState(false)
          sref.current.onOpen()
        }
      })
    }



  }
  const onOkEdit = () => {//关闭操作提示反馈
    sref.current.onCancel()
  }


  const gotoHref = () => {//路灯列表后一个
    if (numlast < airList.length) {
      setnumfirst(++numfirst)
      setnumlast(++numlast)
      setairList(arr.list.slice(numfirst, numlast))
    } else {
      messageApi.open({
        type: 'warning',
        content: '当前已为最后一个……',
      });
    }
  }
  const cometoHref = () => {//路灯列表前一个
    if (numfirst > 0) {
      setnumfirst(--numfirst)
      setnumlast(--numlast)
      setairList(arr.list.slice(numfirst, numlast))
    } else {
      messageApi.open({
        type: 'warning',
        content: '当前已为第一个……',
      });
    }
  }
  const onSearchList = () => {//点击查询按钮
    queryDataList()
  }
  const onChangeValue = e => {//输入框内容变化回调
    formInfo.changeInput = e.target.value
  }
  const exportData = () => {
  }
  const headerProps = {
    isEnergy: false,//能耗类型
    isDate: true,//日期
    isShift: false,//班次
    isTab: true,//能耗、费用radioButton
    isSearch: false,//查询按钮
    isExport: false,//导出按钮
    export: exportData //导出调用方法
  }
  const getFromChild = data => {
    formInfo.changeAreaId = data.areaId
    formInfo.changeDate = data.date
    formInfo.changeType = data.type == 'date' ? 1 : data.type == 'month' ? 2 : 3
    charts = data.type == 'date' ? ['本日（元）', '昨日（元）'] : data.type == 'month' ? ['本月（元）', '上月（月）'] : ['本年（元）', '去年（元）']
    setlightDate(data.type == 'date' ? '本日' : data.type == 'month' ? '本月' : '本年')
    setlightDateYesterday(data.type == 'date' ? '昨日' : data.type == 'month' ? '上月' : '去年')
    queryDataList()
    queryData()
    setTimeout(() => {
      tdrawEcharts(elref.current, option(charts[0], charts[1]))
    }, 1000)
  }

  return (
    <div>
      {contextHolder}
      <Spin size="large" spinning={loading} tip="控制命令下发中，请稍候……">
        <UseHeader {...headerProps} getValues={getFromChild}></UseHeader>
        <div className={style.content}>
          <div className={style.contentTop}>
            <div className={style.contentTopLeft}>
              <div ref={elref} style={{ width: '100%', height: '100%', padding: 16 }}>
              </div>
            </div>
            <div className={style.contentTopRight}>
              <Titlelayout title={lightDate + '路灯能耗 (kWh)'}{...fs} style={{ width: '100%', height: '100%' }}>
                <div className={style.airEnergy} style={{ width: '100%', height: '100%', padding: 16 }}>
                  {/* <div className={style.airEnergyImage} style={{ borderRadius:'50%',width:72,height:72 ,border:'2px solid #237AE4'}}> */}
                  <div style={{ borderRadius: '50%', width: 64, height: 64, backgroundColor: '#237AE4', marginTop: 16 }}><Image src={imgurl.logo} preview={false} width={64} height={64}></Image></div>
                  {/* </div> */}
                  <div className={style.airEnergyData}>
                    <p>{lightDate} :{energyInfo.total ? energyInfo.total.periodValue : '0.00'}</p>
                    <div>同比 :{parseFloat(energyInfo.total.mom) > 0 ? '+' + energyInfo.total.mom : energyInfo.total.mom}
                      {parseFloat(energyInfo.total.mom) > 0 ? <Image src={imgurl.up} preview={false} width={9} height={14} style={{ margin: 16 }}></Image> : <Image src={imgurl.down} preview={false} width={9} height={14} style={{ margin: 16 }}></Image>}


                    </div>
                    <p>{lightDateYesterday}  :{energyInfo.total ? energyInfo.total.lastMonthPeriodValue : '0.00'}</p>
                    <div>环比 :{parseFloat(energyInfo.total.yoy) > 0 ? '+' + energyInfo.total.yoy : energyInfo.total.yoy}
                      {parseFloat(energyInfo.total.yoy) > 0 ? <Image src={imgurl.up} preview={false} width={9} height={14} style={{ margin: 16 }}></Image> : <Image src={imgurl.down} preview={false} width={9} height={14} style={{ margin: 16 }}></Image>}
                    </div>
                  </div>
                </div>
              </Titlelayout>
            </div>
          </div>
          <div className={style.contentBottom}>
            <div className={style.contentBottomTop}>
              <span>路灯控制</span><Input size="middle" placeholder='请输入回路名称' style={{ width: '260px', marginLeft: 16 }} onChange={onChangeValue} />
              <Button style={{ width: 96 }} type='primary' size="middle" icon={<SearchOutlined />} onClick={() => { onSearchList() }}>查询</Button>
              {/* <Divider dashed style={{ marginLeft: 32, marginRight: 32, height: 32 }} type="vertical" /> */}
              <div style={{ marginLeft: 32, marginRight: 32, height: 32, borderLeft: "1px dashed #515151" }} ></div>
              <Button style={{ width: 96, height: 32 }} type='primary' size="middle" >全部开启</Button>
              <Button style={{ width: 96, height: 32, marginLeft: 16 }} type='primary' size="middle" >全部关闭</Button>
            </div>
            {/* <Divider dashed style={{ marginTop: 16, marginBottom: 16 }} /> */}
            <div style={{ marginTop: 16, marginBottom: 16, width: 1649, borderTop: "1px dashed #515151" }} ></div>
            {airList.length > 0 ? <div className={style.contentBottomBottom}>
              <div className={style.boxList}>
                {airList.map((item, index) => {
                  return <div className={style.airBox} key={index}>
                    <p className={style.airBoxName}>{item.name}</p>
                    {item.state == 1 ? <Image src={imgurl.light} preview={false} width={110} height={110}></Image> : <Image src={imgurl.light} preview={false} width={110} height={110} style={{ opacity: 0.3 }}></Image>}
                    <div className={style.airState}>
                      {item.state == 1 ? <div style={{ width: 14, height: 14, backgroundColor: '#66FF00', borderRadius: '50%' }}></div> : <div style={{ width: 14, height: 14, backgroundColor: '#000', borderRadius: '50%' }}></div>}
                      {item.state == 1 ? <span style={{ fontSize: 12, color: '#fff', marginLeft: 5 }}>{item.state==1?'开启':'关闭'}</span> : <span style={{ fontSize: 12, color: '#003366', marginLeft: 5 }}>{item.state==1?'开启':'关闭'}</span>}
                    </div>
                    {/* <Divider className={style.dividerLine} dashed style={{ color: '#fff', height: 2, marginTop: 16, marginBottom: 16 }} /> */}
                    <div style={{ marginTop: 16, marginBottom: 16, width: 137, borderTop: "1px dashed #fff" }} ></div>
                    <Button className={item.state == 1 ? style.airBtnOff : style.airBtn} style={{ width: 136, height: 32, borderRadius: 800, }} onClick={() => { onclickBtn(item, 1, index) }}>远程开启</Button>
                    <Button className={item.state == 1 ? style.airBtn : style.airBtnOff} style={{ width: 136, height: 32, borderRadius: 800, marginTop: 16 }} onClick={() => { onclickBtn(item, 2, index) }}>远程关闭</Button>
                  </div>
                }
                )}
              </div>
              {airList.length > 0 ? <div className={style.pageBtn}>
                <RightOutlined style={{ fontSize: 58, color: '#a3a0a0' }} onClick={() => { gotoHref() }} /><LeftOutlined style={{ fontSize: 58, color: '#a3a0a0' }} onClick={() => { cometoHref() }} />
              </div> : ''}
            </div> : <Empty style={{ marginTop: 100 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          </div>
        </div>
        <Custmodl title='远程控制' ref={aref} mold="cust" width={592} onOk={onOkAlert}>
          <div style={{ display: "flex", alignItems: "center", paddingLeft: 32 }}>
            <QuestionCircleFilled style={{ color: '#237AE4', fontSize: 48 }} />
            <p style={{ marginLeft: 32 }}>确认要远程{state}{Ctitle.name}？</p>
          </div>
        </Custmodl>
        <Custmodl title='操作提示' className={style.custmodal} ref={sref} mold="cust" width={592} onOk={onOkEdit} onCancel='close' cancelText="" okText="关闭">
          {operateState ? <div style={{ display: "flex", alignItems: "center", paddingLeft: 32 }}>
            <CheckCircleFilled style={{ color: 'green', fontSize: 48 }} />
            <p style={{ marginLeft: 32 }}>远程控制操作成功！</p>
          </div> : <div style={{ display: "flex", alignItems: "center" }}>
            <WarningFilled style={{ color: 'red', fontSize: 48 }} />
            <p style={{ marginLeft: 32 }}>远程控制操作失败，请重试!</p>
          </div>}
        </Custmodl>
      </Spin>
    </div>

  )
}