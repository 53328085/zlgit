import React, { useState, useEffect, useRef } from 'react'
import style from './style.module.less';
import { SearchOutlined } from '@ant-design/icons';
import { Select, Input, Button, Modal, Pagination, Image, Divider } from 'antd';
import UseHeader from '@com/useHeader'
import Titlelayout from '@com/titlelayout'
import imgurl from './img/index.js'
import { drawEcharts } from "@com/useEcharts";
import { data } from 'browserslist';
export default function Index(props) {
  const toMainPage = () => {
    let display = false;
    props.sendToIndex(display);
  }
  // const [isModalOpen, setIsModalOpen] = useState(false);
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
  const arr = {
    list: [
      {
        name: '1号楼2层中央空调',
        value: 25.68,
        state: '运行中'
      }, {
        name: '1号楼2层中央空调',
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
  // const Ctitle = useRef()
  const onclickBtn = (e) => {
    console.log(e)
    //Ctitle = e.name
    //setIsModalOpen(true);
  }
  // const onOk = () => {
  //   setIsModalOpen(false);
  // }
  return (
    <div>
      <UseHeader isbuilding={false} iscircle={false} isSearch={false} ischangetab={true}></UseHeader>
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
            <span>空调控制</span><Input size="middle" placeholder='请输入空调名称' style={{ width: '260px', marginLeft: 16 }} />
            <Button style={{ width: 96 }} type='primary' size="middle" icon={<SearchOutlined />}>查询</Button>
          </div>
          <Divider dashed style={{ marginTop: 16, marginBottom: 16 }} />
          <div className={style.contentBottomBottom}>
            {arr.list.map((item, index) => {
              return <div className={style.airBox}>
                <p className={style.airBoxName}>{item.name}</p>
                {item.state == '运行中' ? <p style={{ fontSize: 12, color: '#66FF00', marginBottom: 8, marginTop: 8 }}>{item.value}<span style={{ marginLeft: 5 }}>kW</span></p> : <p style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 8, marginTop: 8 }}>{item.value}<span style={{ marginLeft: 5 }}>kW</span></p>}
                {item.state == '运行中' ? <Image src={imgurl.air} preview={false} width={160} height={160}></Image> : <Image src={imgurl.air} preview={false} width={160} height={160} style={{ opacity: 0.3 }}></Image>}
                <div className={style.airState}>
                  {item.state == '运行中' ? <div style={{ width: 14, height: 14, backgroundColor: '#66FF00', borderRadius: '50%' }}></div> : <div style={{ width: 14, height: 14, backgroundColor: '#000', borderRadius: '50%' }}></div>}
                  {item.state == '运行中' ? <span style={{ fontSize: 12, color: ' rgba(102, 255, 0, 0.8)', marginLeft: 5 }}>{item.state}</span> : <span style={{ fontSize: 12, color: '#003366', marginLeft: 5 }}>{item.state}</span>}
                </div>
                <Divider dashed style={{ color: '#fff', height: 2, marginTop: 16, marginBottom: 16 }} />
                <Button className={style.airBtn} style={{ width: 136, height: 32, borderRadius: 800, color: "#237AE4" }} onClick={onclickBtn(item)}>远程控制</Button>
                {/* <Modal title={Ctitle} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                  <p>Some contents...</p>
                </Modal> */}
              </div>
            })}
          </div>
        </div>
      </div>
    </div>

  )
}