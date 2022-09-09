import React, {useState, useEffect} from 'react'
import style from './style.module.less';
import { SearchOutlined } from '@ant-design/icons';
import { Select,Input, Button, Progress, Pagination } from 'antd';
import UseHeader from '@com/useHeader'
import bg from './img/bg.png'
import RingChart from './ringChart'
import area from './img/area-1.png'

export default function Index(props){
    const toMainPage = ()=>{
        let display =false;
        props.sendToIndex(display);
    }

    return (
        <div>
            <UseHeader isbuilding={false} iscircle={false} isSearch={false}></UseHeader>
            <div className={style.content}>
                <div className={style.contentLeft}>
                    <div className={style.item}>
                        <div className={style.itemTitle}>
                            <span>项目年度能耗指标</span>
                            <span style={{color:'#999',marginLeft:8}}>(吨标煤)</span>
                            <span className={style.state}>能耗正常</span>
                        </div>
                        <div className={style.itemData}>
                            <img className={style.bgImg} src={bg}></img>
                            <div className={style.dataList}>
                                <div className={style.dataItem}>
                                    <span className={style.listTitle}>本年定额能耗</span>
                                    <span className={style.listValue}>2000.00</span>
                                </div>
                                <div className={style.dataItem}>
                                    <span className={style.listTitle}>本年累计使用</span>
                                    <span className={style.listValue}>1500.00</span>
                                </div>
                                <div className={style.dataItem}>
                                    <span className={style.listTitle}>本年剩余额度</span>
                                    <span className={style.listValue}>500.00</span>
                                </div>
                            </div>
                        </div>
                        <div className={style.progress}>
                            <span className={style.quota}>指标剩余</span>
                            <Progress style={{width:'252px'}} percent={25} trailColor='#ebeef5' strokeWidth={20} />
                        </div>
                    </div>
                    <div className={style.item}>
                        <div className={style.itemTitle}>
                            <span>房间能耗指标情况</span>
                            <span className={style.detail} onClick={toMainPage}>详细情况</span>
                        </div>
                        <div className={style.itemData}>
                            <img className={style.bgImg} src={bg}></img>
                            <div className={style.dataList}>
                                <div className={style.dataItem}>
                                    <span className={style.listTitle}>能耗指标总数</span>
                                    <span className={style.listValue}>100</span>
                                </div>
                                <div className={style.dataItem}>
                                    <span className={style.listTitle}>能耗指标正常</span>
                                    <span className={style.listValue}>80</span>
                                </div>
                                <div className={style.dataItem}>
                                    <span className={style.listTitle}>能耗指标异常</span>
                                    <span className={style.listValue}>20</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.item}>
                        <div className={style.itemTitle}>
                            <span>房间剩余能耗指标分布</span>
                        </div>
                        <div style={{width:368,height:320,marginLeft:12}}>
                            <RingChart></RingChart>
                        </div>
                    </div>
                </div>
                <div className={style.contentRight}>
                    <img src={area} className={style.area}></img>
                </div>
            </div>
        </div>
        
    )
}