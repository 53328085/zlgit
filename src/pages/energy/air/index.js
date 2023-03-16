import React, { useState, useEffect, useRef } from 'react'
import style from './style.module.less';
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined, CheckCircleFilled, WarningFilled, RightOutlined, LeftOutlined } from '@ant-design/icons';
import { Spin, Input, Button, Modal, Image, Divider, message } from 'antd';
import UseHeader from '@com/useHeader'
import { useSelector } from 'react-redux'
import Titlelayout from '@com/titlelayout'
import Custmodl from '@com/useModal'
import imgurl from './img/index.js'
import { drawEcharts } from "@com/useEcharts";
import { selectProjectId } from '@redux/systemconfig.js'
import { data } from 'browserslist';
// import { energyDesigner } from '@api/api.js'
export default function Index(props) {
  const toMainPage = () => {
    let display = false;
    props.sendToIndex(display);
  }
  const projectId = useSelector(selectProjectId)
  const elref = useRef(null)
  const datasetMonth = {
    dimensions: ["time", "2020", "2019"],
    source: [
      { time: "1月", "2020": 5600, "2019": 9600 },
      { time: "2月", "2020": 4600, "2019": 3644 },
      { time: "3月", "2020": 3600, "2019": 4644 },
      { time: "4月", "2020": 5611, "2019": 9655 },
      { time: "5月", "2020": 5644, "2019": 3677 },
      { time: "6月", "2020": 4677, "2019": 3633 },
      { time: "7月", "2020": 3688, "2019": 4655 },
      { time: "8月", "2020": 5088, "2019": 2644 },
      { time: "9月", "2020": 6677, "2019": 2641 },
      { time: "10月", "2020": 5866, "2019": 5641 },
      { time: "11月", "2020": 4677, "2019": 7645 },
      { time: "12月", "2020": 1877, "2019": 2645 },
    ],
  };
  useEffect(() => {
    drawEcharts(elref.current, {
      dataset: datasetMonth,
      series: [{ type: "bar", barGap: 0 }, { type: "bar", barGap: 0 }],
      grid: {
        top: '30px',
        left: 0,
        right: 0,
        bottom: '0',
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
      legend: {

        icon: 'rect',
        itemHeight: 8,
        itemWidth: 8,
        itemGap: 20
      }
    })
    //queryData()
  }, []);
  const fs = {
    hv: '24px',
    fc: '#333'
  }
  let arr = {
    list: [
      {
        name: '1号楼0层中央空调',
        value: 25.68,
        state: '运行中'
      }, {
        name: '1号楼1层中央空调',
        value: 25.68,
        state: '未运行'
      }, {
        name: '1号楼2层中央空调',
        value: 25.68,
        state: '运行中'
      }, {
        name: '1号楼3层中央空调',
        value: 25.68,
        state: '未运行'
      }, {
        name: '1号楼4层中央空调',
        value: 25.68,
        state: '运行中'
      }, {
        name: '1号楼5层中央空调',
        value: 25.68,
        state: '未运行'
      }, {
        name: '1号楼6层中央空调',
        value: 25.68,
        state: '运行中'
      }, {
        name: '1号楼7层中央空调',
        value: 25.68,
        state: '未运行'
      }, {
        name: '1号楼8层中央空调',
        value: 25.68,
        state: '运行中'
      }, {
        name: '1号楼9层中央空调',
        value: 25.68,
        state: '未运行'
      },
    ]
  }
  const airdata = {
    today: '25.68',
    todayper: '-10.00%',
    yesterday: '80.12',
    yesterdayper: '2.50%'
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, setstate] = useState('open');
  const [modelChange, setmodal] = useState('cold');
  let [temp, settemp] = useState(23);
  const [Ctitle, setCtitle] = useState({});
  const [isOnClick, setisOnClick] = useState(true);
  const [operateState, setoperateState] = useState(true);
  const [isOnClickModal, setisOnClickModal] = useState(true);
  const onclickBtn = (e) => {
    setCtitle(e)
    setIsModalOpen(true);
  }
  // const onOk = () => {
  //   setIsModalOpen(false);
  // }
  const handleOk = () => {
    setLoading(true)
    setIsModalOpen(false);
    setTimeout(() => {
      setLoading(false)
      if (!loading) {
        aref.current.onOpen()
      }
    }, 3000)
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onclickOpen = (type) => {
    if (type == 'open') {
      setisOnClick(true)
      setstate('open')
    } else {
      setisOnClick(false)
      setstate('close')
    }

  }
  const onclickModal = (type) => {
    if (type == 'cold') {
      setisOnClickModal(true)
      setmodal('cold')
    } else {
      setisOnClickModal(false)
      setmodal('hot')
    }
  }
  const onclickTemp = (type) => {
    if (type == 'add') {
      settemp(++temp)
    } else {
      settemp(--temp)
    }
  }
  const [loading, setLoading] = useState(false);
  const aref = useRef()
  const onOkAlert = () => {
    aref.current.onCancel()
  }
  let [numfirst, setnumfirst] = useState(0);
  let [numlast, setnumlast] = useState(9);
  let [airList, setairList] = useState(arr.list);
  const [messageApi, contextHolder] = message.useMessage();
  const gotoHref = () => {
    if (numlast < arr.list.length) {
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
  const cometoHref = () => {
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
  //   const { 
  //     queryElectricClassifys, 
  //     insertEnergyClassify, 
  //     updateEnergyClassify, 
  //     deleteEnergyClassify, 
  //     queryEnergyConfigedDevicesInfo, 
  //     queryEnergyNoConfigedDevices, 
  //     saveEnergyDevices,
  //     insertEnergyClassifys 
  // } = energyDesigner
  //   const getData = () => {
  //     return queryElectricClassifys(type).then( res => {
  //         let { success, data } = res
  //         if(success && data){
  //         }else{
  //             messageApi.open({
  //                 type:'error',
  //                 content:res.errMsg
  //             })
  //         }
  //     })
  // }
  // const { run:queryData } = useRequest(getData, {
  //   refreshDeps:[changeTag],
  //   manual: true,
  // })
  const headerProps = {
    isEnergy: false,//能耗类型
    isDate: true,//日期
    isShift: false,//班次
    isTab: true,//能耗、费用radioButton
    isSearch: false,//查询按钮
    isExport: false,//导出按钮
    //export: exportData //导出调用方法
  }
  const getFromChild = data => {
  }
  return (
    <div>
      {contextHolder}
      <Spin size="large" spinning={loading} tip="控制命令下发中，请稍候……" delay={500}>
        <UseHeader {...headerProps} getValues={getFromChild}></UseHeader>
        <div className={style.content}>
          <div className={style.contentTop}>
            <div className={style.contentTopLeft}>
              <div ref={elref} style={{ width: '100%', height: '100%', padding: 16 }}>
              </div>
            </div>
            <div className={style.contentTopRight}>
              <Titlelayout title={'本日空调能耗 (kWh)'}{...fs} style={{ width: '100%', height: '100%' }}>
                <div className={style.airEnergy} style={{ width: '100%', height: '100%', padding: 16 }}>
                  <div style={{ width: '100%', height: '100%', paddingTop: 16 }}>
                    <Image src={imgurl.logo} preview={false} width={64} height={64}></Image>
                  </div>
                  <div className={style.airEnergyData}>
                    <p>本日 :{airdata.today}</p>
                    <div>同比 :{parseFloat(airdata.todayper) > 0 ? '+' + airdata.todayper : airdata.todayper}
                      {parseFloat(airdata.todayper) > 0 ? <Image src={imgurl.up} preview={false} width={9} height={14} style={{ margin: 16 }}></Image> : <Image src={imgurl.down} preview={false} width={9} height={14} style={{ margin: 16 }}></Image>}


                    </div>
                    <p>昨日  :{airdata.yesterday}</p>
                    <div>环比 :{parseFloat(airdata.yesterdayper) > 0 ? '+' + airdata.yesterdayper : airdata.yesterdayper}
                      {parseFloat(airdata.yesterdayper) > 0 ? <Image src={imgurl.up} preview={false} width={9} height={14} style={{ margin: 16 }}></Image> : <Image src={imgurl.down} preview={false} width={9} height={14} style={{ margin: 16 }}></Image>}
                    </div>
                  </div>
                </div>
              </Titlelayout>
            </div>
          </div>
          <div className={style.contentBottom}>
            <div className={style.contentBottomTop}>
              <span>空调控制</span><Input size="middle" placeholder='请输入空调名称' style={{ width: '260px', marginLeft: 16 }} />
              <Button style={{ width: 96 }} type='primary' size="middle" icon={<SearchOutlined />}>查询</Button>
            </div>
            <div style={{ marginTop: 16, marginBottom: 16, width: 1649, borderTop: "1px dashed #515151" }} ></div>
            <div className={style.contentBottomBottom}>
              <div className={style.boxList}>
                {airList.map((item, index) => {
                  return <div className={style.airBox} key={index}>
                    <p className={style.airBoxName}>{item.name}</p>
                    {item.state == '运行中' ? <p style={{ fontSize: 12, color: '#66FF00', marginBottom: 8, marginTop: 8 }}>{item.value}<span style={{ marginLeft: 5 }}>kW</span></p> : <p style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 8, marginTop: 8 }}>{item.value}<span style={{ marginLeft: 5 }}>kW</span></p>}
                    {item.state == '运行中' ? <Image src={imgurl.air} preview={false} width={160} height={160}></Image> : <Image src={imgurl.air} preview={false} width={160} height={160} style={{ opacity: 0.3 }}></Image>}
                    <div className={style.airState}>
                      {item.state == '运行中' ? <div style={{ width: 14, height: 14, backgroundColor: '#66FF00', borderRadius: '50%' }}></div> : <div style={{ width: 14, height: 14, backgroundColor: '#000', borderRadius: '50%' }}></div>}
                      {item.state == '运行中' ? <span style={{ fontSize: 12, color: ' rgba(102, 255, 0, 0.8)', marginLeft: 5 }}>{item.state}</span> : <span style={{ fontSize: 12, color: '#003366', marginLeft: 5 }}>{item.state}</span>}
                    </div>
                    <div style={{ marginTop: 16, marginBottom: 16, width: 137, borderTop: "1px dashed #fff" }} ></div>
                    {/* <Divider dashed style={{ color: '#fff', height: 2, marginTop: 16, marginBottom: 16 }} /> */}
                    <Button className={style.airBtn} style={{ width: 136, height: 32, borderRadius: 800, color: "#237AE4" }} onClick={() => { onclickBtn(item) }}>远程控制</Button>

                  </div>
                }
                )}
              </div>
              <div className={style.pageBtn}>
                <RightOutlined style={{ fontSize: 58, color: '#a3a0a0' }} onClick={() => { gotoHref() }} /><LeftOutlined style={{ fontSize: 58, color: '#a3a0a0' }} onClick={() => { cometoHref() }} />
              </div>
            </div>
          </div>
        </div>
        <Modal title={[<div style={{ fontSize: 16, color: '#515151', lineHeight: '32px' }}>{Ctitle.name}</div>]} open={isModalOpen} centered={true} closable={false}
          className={style.airModal} width={833} height={580} footer={[
            <Button key="back" onClick={handleCancel} style={{ width: 168, height: 48, borderRadius: 80 }}>
              取消
            </Button>,
            <Button style={{ width: 505, height: 48, borderRadius: 80 }}
              key="submit"
              type="primary"
              onClick={handleOk}
            >
              空调控制命令下发
            </Button>,
          ]}>
          <div className={style.airModalBox}>
            <div className={style.airModalBoxBtn}>
              <p className={style.airModalName}>开关</p>
              {state == 'open' ? <div className={style.airModalImage}>
                <Image src={imgurl.open} preview={false} width={68} height={68}></Image></div> : <div className={style.airModalImage}>
                <Image src={imgurl.open} preview={false} width={68} height={68}></Image></div>}
              <div className={style.airModalState}>{state == 'open' ? '运行中……' : '关闭'}</div>
            </div>
            <div className={style.airModalBoxBtn}>
              <p className={style.airModalName}>温度</p>
              <div className={style.airModalImage}><Image src={imgurl.temp} preview={false} width={68} height={68}></Image></div>
              <div className={style.airModalState}>{temp}<span>℃</span></div>
            </div>
            <div className={style.airModalBoxBtn}>
              <p className={style.airModalName}>模式</p>
              {modelChange == 'cold' ? <div className={style.airModalImage}>
                <Image src={imgurl.cold} preview={false} width={68} height={68}></Image></div> : <div className={style.airModalImage}>
                <Image src={imgurl.warm} preview={false} width={68} height={68}></Image></div>}
              <div className={style.airModalState}>{modelChange == 'cold' ? '制冷' : '制热'}</div>
            </div>
            <Button className={isOnClick ? style.onClickState : ''} onClick={() => { onclickOpen('open') }}>开启</Button>
            <Button onClick={() => { onclickTemp('add') }}><CaretUpOutlined /></Button>
            <Button className={isOnClickModal ? style.onClickState : ''} onClick={() => { onclickModal('cold') }}>制冷</Button>
            <Button className={!isOnClick ? style.onClickState : ''} onClick={() => { onclickOpen('close') }}>关闭</Button>
            <Button onClick={() => { onclickTemp('subtract') }}><CaretDownOutlined /></Button>
            <Button className={!isOnClickModal ? style.onClickState : ''} onClick={() => { onclickModal('hot') }}>制热</Button>
          </div>
        </Modal>
        <Custmodl title='操作提示' ref={aref} mold="cust" width={592} onOk={onOkAlert} className={style.custmodal} okText="关闭">
          {operateState ? <div style={{ display: "flex", alignItems: "center", paddingLeft: 32 }}>
            {/* <Image src={imgurl.OK} preview={false} width={48} height={48}></Image> */}
            <CheckCircleFilled style={{ color: 'green', fontSize: 48 }} />
            <p style={{ marginLeft: 32 }}>远程控制操作成功！</p>
          </div> : <div style={{ display: "flex", alignItems: "center" }}>
            {/* <Image src={imgurl.error} preview={false} width={48} height={48}></Image> */}
            <WarningFilled style={{ color: 'red', fontSize: 48 }} />
            <p style={{ marginLeft: 32 }}>远程控制操作失败，请重试!</p>
          </div>}
        </Custmodl>
      </Spin>
    </div>

  )
}