import React, { useState, useEffect, useMemo } from 'react';
import './PhotovoltaicStation.less';
import { useQueryOverview } from './api';
import Cempty from '@com/useEmpty'
import { Spin } from 'antd';
import { color } from 'echarts';
// 默认数据（不变）
const DEFAULT_STATION_DATA = {
    success: true,
    errMsg: '',
    data: []
};
// 并网柜组件 - 添加了position属性标识位置
const GridCabinet = ({ cabinet, cabinets, position, totalCabinets }) => {
    return (
        <div className={cabinets?.length > 1 ? "grid-cabinet" : "inverterLessThan2"} >
            {cabinets.length == 1 ?
                <div className='line'>
                    <div className='cabinet-line2'></div>
                </div> : cabinets.length > 1 ?
                    <div className='line'>
                        <div className={`cabinet-line1 ${position}`}></div>
                        <div className='cabinet-line2'></div>
                    </div> : null}
            <div className={cabinet?.children?.length > 0 ? 'cabinet-box' : 'inverter-empty'}>
                <div className="cabinet-header">
                    <div className='name' title={cabinet.name}>{cabinet.name}</div>
                    <div className="cabinet-stats">
                        <div className='ele'>{cabinets.length}正向有功总电能
                            <div className='numBox'>
                                <div className='num' title={cabinet.imEp + 'kW'}>{cabinet.imEp}</div>kW </div></div>
                        <div className='ele'>反向有功总电能
                            <div className='numBox'>
                                <div className='num' title={cabinet.expEp + 'kWh'}>{cabinet.expEp}</div> kWh</div></div>
                    </div>
                </div>
                {cabinet?.children?.length > 0 ? (
                    <>
                        <div className='inverter-line'></div>
                        <div className='inverter'>
                            {cabinet.children.map((inverter, index) => {
                                // 确定每个并网柜的位置（第一个、中间、最后一个）
                                let position = 'middle';
                                if (index === 0) position = 'first';
                                if (index === cabinet.children.length - 1) position = 'last';

                                return (
                                    <InverterComp
                                        key={inverter.id}
                                        inverter={inverter}
                                        inverters={cabinet.children}
                                        position={position}
                                        totalCabinets={cabinet.children.length}
                                    />
                                );
                            })}
                        </div>
                    </>
                ) : null}
            </div>
        </div >
    );
};
const InverterComp = ({ inverter, inverters, position, totalCabinets }) => {

    const getEfficiencyColor = (state) => {
        if (state = 1) return 'green';
        if (state = 2) return 'orange';
        return 'red';
    };
    return (
        <div className="grid-inverter">
            <div className='line'>
                {/* 根据位置添加不同的类名 */}
                {inverters.length > 1 ?
                    <div className={`inverter-line1 ${position}`}></div>
                    : null}
                <div className='inverter-line2'></div>
            </div>
            <div className='inverter-box'>
                <div className='inverter-item'>
                    <span className={`circle ${getEfficiencyColor(inverter.state)}`}></span>
                    <span>{inverter.name}</span>
                </div>
                <div className='inverter-item'>
                    <span>直流功率</span>
                    <div className='inverter-value'>
                        <span>{inverter.dcPower}</span>kW
                    </div>
                </div>
                <div className='inverter-item'>
                    <span>日发电量</span>
                    <div className='inverter-value'>
                        <span>{inverter.dayPowerGeneration}</span>kWh
                    </div>
                </div>
                <div className='inverter-item'>
                    <span>累计发电量</span>
                    <div className='inverter-value'>
                        <span>{inverter.totalPowerGeneration}</span>kWh
                    </div>
                </div>
                <div className='inverter-item'>
                    <span>效率</span>
                    <div className='inverter-value'>
                        <span>{inverter.efficiency}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
// 光伏站点主组件
const PhotovoltaicStation = ({ projectId, areaId }) => { // 从 props 接收参数
    const [apiData, setApiData] = useState(DEFAULT_STATION_DATA);
    const [loading, setLoading] = useState(false);

    // 关键优化：监听 projectId/areaId 变化，每次变化都重新请求接口
    useEffect(() => {
        const fetchStationData = async () => {
            // 1. 验证参数有效性（参数为空时不请求）
            if (projectId == undefined || areaId == undefined) {
                setApiData(DEFAULT_STATION_DATA);
                return;
            }
            setLoading(true);

            try {
                // 2. 接口请求：传入 projectId 和 areaId（关键！之前未传areaId）
                const response = await useQueryOverview({
                    projectId: projectId, // 明确传递 projectId
                    areaId: areaId         // 补充传递 areaId（解决接口未用areaId的问题）
                });

                // 3. 验证接口返回
                if (response?.hasOwnProperty('success') && response?.hasOwnProperty('data')) {
                    if (!response.success) {
                        throw new Error(response.errMsg || '接口返回失败');
                    }
                    setApiData(response);
                } else {
                    throw new Error('接口返回格式错误');
                }
            } catch (err) {
                ;
                setApiData(DEFAULT_STATION_DATA);
            } finally {
                setLoading(false);
            }
        };

        // 执行请求（参数变化时自动重新执行）
        fetchStationData();
    }, [projectId, areaId]); // 依赖 projectId 和 areaId，变化时重新请求（解决只能获取一次的问题）

    // 数值格式化、加载/错误状态、渲染逻辑（不变，省略重复代码）
    const formatValue = useMemo(() => (value) => {
        return parseFloat(value || '0').toFixed(2);
    }, []);

    if (loading) {
        return (
            <div className="photovoltaic-station loading">
                <Spin tip="Loading..."></Spin>
            </div>
        );
    }



    const stations = apiData.data || [];
    return (
        <div className="photovoltaic-station">
            <div className='stationAll'>
                {stations.length === 0 ? (
                    <div className="empty-station">
                        {/* <span>当前区域暂无光伏站点数据</span> */}
                        <Cempty tip='暂无数据' />
                    </div>
                ) : (
                    stations?.map((station, stationIndex) => {
                        const cabinets = station.children || [];
                        return (
                            <div key={station.id} className="station-container">
                                <div className="station-box">
                                    <div className="station-header">
                                        <div className='name'>{station.name}（监控面板）</div>
                                        <div className="station-summary">
                                            {[
                                                { label: '今日发电量', key: 'todayPowerGeneration', unit: 'kWh' },
                                                { label: '本月发电量', key: 'monthPowerGeneration', unit: 'kWh' },
                                                { label: '本年发电量', key: 'yearPowerGeneration', unit: 'kWh' },
                                                { label: '累计发电量', key: 'totalPowerGeneration', unit: 'kWh' }
                                            ].map((item, index) => (
                                                <div key={index} className="summary-card">
                                                    <span>{item.label}</span>
                                                    <div className="summary-value">
                                                        <div className='num'>{formatValue(station[item.key])} </div> {item.unit}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="station-line"></div>
                                </div>
                                <div className={cabinets.length > 0 ? "cabinets-container" : "cabinets-empty"}  >
                                    {cabinets.length === 0 ? (
                                        <div className='cabinet-box'>
                                            <div className='line'>
                                                <div className='cabinet-line2'></div>
                                            </div>
                                            <div className="cabinet-header">
                                                <div className='name' title='暂无数据'>暂无数据</div>
                                                <div className="cabinet-stats">
                                                    <div className='ele'>正向有功总电能  <div className='numBox'><div className='num'>- </div>kW</div></div>
                                                    <div className='ele'>反向有功总电能 <div className='numBox'><div className='num'>- </div>kWh</div></div>
                                                </div>
                                            </div>
                                        </div>

                                    ) : (
                                        cabinets?.map((cabinet, cabIndex) => {
                                            const cabPosition = cabIndex === 0 ? 'first' : cabIndex === cabinets.length - 1 ? 'last' : 'middle';
                                            return (
                                                <GridCabinet
                                                    key={cabinet.id}
                                                    cabinet={cabinet}
                                                    cabinets={cabinets}
                                                    position={cabPosition}
                                                />
                                            );
                                        })
                                    )}
                                </div>
                                {/* {stationIndex !== stations.length - 1 && (
                                    <div className="station-divider"></div>
                                )} */}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default PhotovoltaicStation;
