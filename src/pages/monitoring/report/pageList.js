import React, {Fragment} from "react";
import style from './style.module.less'
import {drawEcharts} from '@com/useEcharts'

export default function PageList() {
    return(
        <Fragment>
            <div className={style.pages}>
                <div className={style.pageHeader}>
                    <span>智慧能源服务平台</span>
                    <span className={style.subTitle}>用户分析报告</span>
                </div>
                <div className={style.pageContent}>
                    <div className={style.mainTitle}>1.配电房概况</div>
                    <div className={style.tableList}>
                        <div className={style.tableItem}>
                            <span className={style.tableTitle}>站点名称</span><span className={style.tableValue}>正泰物联</span>
                        </div>
                        <div className={style.tableItem}>
                            <span className={style.tableTitle}>站点地址</span><span className={style.tableValue}>浙江省杭州市滨江区月明路560号</span>
                        </div>
                        <div className={style.tableItem}>
                            <span className={style.tableTitle}>配电房容量</span><span className={style.tableValue}>6000 KVA</span>
                        </div>
                        <div className={style.tableItem}>
                            <span className={style.tableTitle}>电压等级</span><span className={style.tableValue}>0.4 KV</span>
                        </div>
                        <div className={style.tableItem}>
                            <span className={style.finalTitle}>变压器数</span><span className={style.finalValue}>3台</span>
                        </div>
                    </div>
                    <div className={style.mainTitle}>2.用电量分析</div>
                    <div className={style.mainText}>该变配电站监测周期内总耗电量160194kW·h， 日平均耗电量5167.55kW·h，单日最大耗电量7432.25kW·h，日耗电情况详见下图:</div>
                    <div className={style.currChart} id="currChart"></div>
                </div>
            </div>
        </Fragment>
    )
}