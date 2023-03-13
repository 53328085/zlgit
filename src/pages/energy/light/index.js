import React, { useState, useEffect, useRef } from 'react'
import style from './style.module.less';
import { SearchOutlined, QuestionCircleFilled, RightOutlined, LeftOutlined,CheckCircleFilled,WarningFilled } from '@ant-design/icons';
import { Spin, Input, Button, Image, Divider,message } from 'antd';
import UseHeader from '@com/useHeader'
import Titlelayout from '@com/titlelayout'
import Custmodl from '@com/useModal'
import imgurl from './img/index.js'
import { drawEcharts } from "@com/useEcharts";
export default function Index(props) {
  const toMainPage = () => {
    let display = false;
    props.sendToIndex(display);
  }
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
  });
  const fs = {
    hv: '24px',
    fc: '#333'
  }
  let arr = {
    list: [
      {
        name: '园区回路1路灯',
        state: '开启'
      }, {
        name: '园区回路2路灯',
        state: '关闭'
      },{
        name: '园区回路1路灯',
        state: '开启'
      }, {
        name: '园区回路2路灯',
        state: '关闭'
      },{
        name: '园区回路1路灯',
        state: '开启'
      }, {
        name: '园区回路2路灯',
        state: '关闭'
      },{
        name: '园区回路1路灯',
        state: '开启'
      }, {
        name: '园区回路2路灯',
        state: '关闭'
      },{
        name: '园区回路1路灯',
        state: '开启'
      }, {
        name: '园区回路2路灯',
        state: '关闭'
      },
    ]
  }
  const airdata = {
    today: '25.68',
    todayper: '-10.00%',
    yesterday: '80.12',
    yesterdayper: '2.50%'
  }
  let [state, setstate] = useState('开启');
  let [operateState, setoperateState] = useState(true);
  const [Ctitle, setCtitle] = useState({});
  const onclickBtn = (e, num) => {
    console.log(e, num)
    if (e.state == '开启' && num == 2 || e.state == '关闭' && num == 1) {
      setCtitle(e)
      aref.current.onOpen()
      if (num == 1) {//开启
        setstate('开启')
      } else {
        setstate('关闭')
      }
    }
  }
  const [loading, setLoading] = useState(false);
  const aref = useRef()
  const sref = useRef()
  const onOkAlert = () => {
    aref.current.onCancel()
    setLoading(true)
      setTimeout(() => {
        setLoading(false)
        sref.current.onOpen()
      }, 3000)
  }
  const onOkEdit=()=>{
    sref.current.onCancel()
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
    }else{
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
    }else{
      messageApi.open({
        type: 'warning',
        content: '当前已为第一个……',
      });
    }
  }
  return (
    <div>
      {contextHolder}
      <Spin size="large" spinning={loading} tip="控制命令下发中，请稍候……">
        <UseHeader isbuilding={false} iscircle={false} isSearch={false} ischangetab={true}></UseHeader>
        <div className={style.content}>
          <div className={style.contentTop}>
            <div className={style.contentTopLeft}>
              <div ref={elref} style={{ width: '100%', height: '100%', padding: 16 }}>
              </div>
            </div>
            <div className={style.contentTopRight}>
              <Titlelayout title={'本日路灯能耗 (kWh)'}{...fs} style={{ width: '100%', height: '100%' }}>
                <div className={style.airEnergy} style={{ width: '100%', height: '100%', padding: 16 }}>
                  <div style={{ width: '100%', height: '100%', paddingTop: 16 }}>
                    <Image src={imgurl.bg} preview={false} width={64} height={64}></Image>
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
              <span>路灯控制</span><Input size="middle" placeholder='请输入回路名称' style={{ width: '260px', marginLeft: 16 }} />
              <Button style={{ width: 96 }} type='primary' size="middle" icon={<SearchOutlined />}>查询</Button>
              <Divider dashed style={{ marginLeft: 32, marginRight: 32, height: 32 }} type="vertical" />
              <Button style={{ width: 96, height: 32 }} type='primary' size="middle" >全部开启</Button>
              <Button style={{ width: 96, height: 32, marginLeft: 16 }} type='primary' size="middle" >全部关闭</Button>
            </div>
            <Divider dashed style={{ marginTop: 16, marginBottom: 16 }} />
            <div className={style.contentBottomBottom}>
            <div className={style.boxList}>
              {airList.map((item, index) => {
                return <div className={style.airBox} key={index}>
                  <p className={style.airBoxName}>{item.name}</p>
                  {item.state == '开启' ? <Image src={imgurl.air} preview={false} width={160} height={130}></Image> : <Image src={imgurl.air} preview={false} width={160} height={130} style={{ opacity: 0.3 }}></Image>}
                  <div className={style.airState}>
                    {item.state == '开启' ? <div style={{ width: 14, height: 14, backgroundColor: '#66FF00', borderRadius: '50%' }}></div> : <div style={{ width: 14, height: 14, backgroundColor: '#000', borderRadius: '50%' }}></div>}
                    {item.state == '开启' ? <span style={{ fontSize: 12, color: '#fff', marginLeft: 5 }}>{item.state}</span> : <span style={{ fontSize: 12, color: '#003366', marginLeft: 5 }}>{item.state}</span>}
                  </div>
                  <Divider className={style.dividerLine} dashed style={{ color: '#fff', height: 2, marginTop: 16, marginBottom: 16 }} />
                  <Button className={item.state == '开启' ? style.airBtnOff : style.airBtn} style={{ width: 136, height: 32, borderRadius: 800, }} onClick={() => { onclickBtn(item, 1) }}>远程开启</Button>
                  <Button className={item.state == '开启' ? style.airBtn : style.airBtnOff} style={{ width: 136, height: 32, borderRadius: 800, marginTop: 16 }} onClick={() => { onclickBtn(item, 2) }}>远程关闭</Button>
                </div>
              }
              )}
              </div>
              <div className={style.pageBtn}>
                <RightOutlined style={{ fontSize: 58, color: '#a3a0a0' }} onClick={() => { gotoHref() }}/><LeftOutlined style={{ fontSize: 58, color: '#a3a0a0' }} onClick={() => { cometoHref() }}/>
              </div>
            </div>
          </div>
        </div>
        <Custmodl title='远程控制' ref={aref} mold="cust" width={592} onOk={onOkAlert}>
          <div style={{ display: "flex", alignItems: "center", paddingLeft: 32 }}>
            <QuestionCircleFilled style={{ color: '#237AE4', fontSize: 48 }} />
            <p style={{ marginLeft: 32 }}>确认要远程{state}{Ctitle.name}？</p>
          </div>
        </Custmodl>
        <Custmodl title='操作提示' className={style.custmodal} ref={sref} mold="cust" width={592} onOk={onOkEdit} onCancel='close' cancelText="" okText="关闭">
        {operateState?<div style={{display:"flex", alignItems: "center",paddingLeft:32}}>
                <CheckCircleFilled  style={{color:'green',fontSize:48}}/>
                <p style={{marginLeft:32}}>远程控制操作成功！</p>
                </div>:<div style={{display:"flex", alignItems: "center"}}>
                <WarningFilled style={{color:'red',fontSize:48}}/>
                <p style={{marginLeft:32}}>远程控制操作失败，请重试!</p>
                </div>}
        </Custmodl>
      </Spin>
    </div>

  )
}