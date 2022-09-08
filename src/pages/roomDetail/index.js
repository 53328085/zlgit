import React, {useState, useEffect} from 'react'
import style from './style.module.less'
import logo from './images/logo.png'
import {Progress} from 'antd';

export default function Index(){
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
                    <div className={style.itemTitle}><span>综合能耗</span></div>
                </div>
            </div>
        </div>
    </div>
}