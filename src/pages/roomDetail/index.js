import React, {useState, useEffect} from 'react'
import style from './style.module.less'
import logo from './images/logo.png'
import {Progress, Radio} from 'antd';
import BarChart from './barchart';
import Ringchart from './ringchart';
import LineChart from './linechart';

export default function Index(){
    const energyData = {
        Name:'月度用电',
        Unit:'用电量(kWh)',
        valueList:[
            {
              type: '1月',
              sales: 125.36,
            },
            {
              type: '2月',
              sales: 251.25,
            },
            {
              type: '3月',
              sales: 321.25,
            },
            {
              type: '4月',
              sales: 587.36,
            },
            {
              type: '5月',
              sales: 258.14,
            },
            {
              type: '6月',
              sales: 298.36,
            },
            {
              type: '7月',
              sales: 301.32,
            },
            {
              type: '8月',
              sales: 428.69,
            },{
              type: '9月',
              sales: 298.54,
            },
            {
              type: '10月',
              sales: 125.96,
            },
            {
              type: '11月',
              sales: 189.15,
            },
            {
              type: '12月',
              sales: 315.45,
            }
          ]
    };
    const waterData = {
        Name:'月度用水',
        Unit:'用水量(㎡)',
        valueList:[
            {
              type: '1月',
              sales: 125.36,
            },
            {
              type: '2月',
              sales: 251.25,
            },
            {
              type: '3月',
              sales: 321.25,
            },
            {
              type: '4月',
              sales: 587.36,
            },
            {
              type: '5月',
              sales: 258.14,
            },
            {
              type: '6月',
              sales: 298.36,
            },
            {
              type: '7月',
              sales: 301.32,
            },
            {
              type: '8月',
              sales: 428.69,
            },{
              type: '9月',
              sales: 298.54,
            },
            {
              type: '10月',
              sales: 125.96,
            },
            {
              type: '11月',
              sales: 189.15,
            },
            {
              type: '12月',
              sales: 315.45,
            }
          ]
    };
    const gasData = {
        Name:'月度用燃气',
        Unit:'用气量(m³)',
        valueList:[
            {
              type: '1月',
              sales: 125.36,
            },
            {
              type: '2月',
              sales: 251.25,
            },
            {
              type: '3月',
              sales: 321.25,
            },
            {
              type: '4月',
              sales: 587.36,
            },
            {
              type: '5月',
              sales: 258.14,
            },
            {
              type: '6月',
              sales: 298.36,
            },
            {
              type: '7月',
              sales: 301.32,
            },
            {
              type: '8月',
              sales: 428.69,
            },{
              type: '9月',
              sales: 298.54,
            },
            {
              type: '10月',
              sales: 125.96,
            },
            {
              type: '11月',
              sales: 189.15,
            },
            {
              type: '12月',
              sales: 315.45,
            }
          ]
    };

    return <div className={style.roomDetail}>
        <div className={style.header}>
            <img className={style.logo} src={logo}></img>
            <span className={style.mainTitle}>智慧能源服务管理平台</span>
            <span className={style.subTitle}>房间能耗</span>
        </div>

        <div className={style.content}>
            <div className={style.contentTop}>
                <div className={style.topLeft}>
                    <div className={style.leftItem}>
                        <div className={style.itemTitle}><span>房间基本信息</span></div>
                        <div className={style.itemData}>
                            <span>房间地址</span><span>正泰物联滨江园区-研发1号楼-203</span>
                        </div>
                        <div className={style.itemData}>
                            <span>房间类别</span><span>研发中心实验室</span>
                        </div>
                        <div className={style.itemData}>
                            <span>能耗种类</span><span>电 / 水 / 燃气</span>
                        </div>
                    </div>
                    <div className={style.leftItem}>
                        <div className={style.itemTitle}><span>能耗指标</span><span className={style.state}>能耗正常</span></div>
                        <div className={style.itemData}>
                            <div className={style.dataList}>
                                <span>定额能耗(吨标煤)</span>
                                <span className={style.energyData}>100.00</span>
                            </div>
                            <div className={style.dataList}>
                                <span>已用能耗</span>
                                <span className={style.energyData}>75.00</span>
                            </div>
                            <div className={style.dataList}>
                                <span>剩余能耗</span>
                                <span className={style.energyData}>25.00</span>
                            </div>
                        </div>
                        <div className={style.itemData}>
                            <span>能耗剩余</span>
                            <Progress style={{width:'280px'}} percent={25} trailColor='#ebeef5' strokeWidth={20} />
                        </div>
                    </div>
                </div>
                <div className={style.topRight}>
                    <div className={style.itemTitle}>
                        <span>综合能耗</span>
                        <Radio.Group size='middle' style={{marginLeft:'auto',marginRight: 12}} defaultValue="day" buttonStyle="solid">
                            <Radio.Button value="day">本日</Radio.Button>
                            <Radio.Button value="month">本月</Radio.Button>
                            <Radio.Button value="year">本年</Radio.Button>
                        </Radio.Group>
                    </div>
                    <BarChart></BarChart>
                </div>
            </div>
            <div className={style.contentBottom}>
                <Ringchart></Ringchart>
                <LineChart lineData = { energyData }></LineChart>
                <LineChart lineData = { waterData }></LineChart>
                <LineChart lineData = { gasData }></LineChart>
            </div>
        </div>
    </div>
}