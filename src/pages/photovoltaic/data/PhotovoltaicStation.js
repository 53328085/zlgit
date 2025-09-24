import React from 'react';
import './PhotovoltaicStation.css';

// 逆变器组件
const Inverter = ({ data }) => {
    // 根据效率值确定状态颜色
    const getEfficiencyColor = (efficiency) => {
        if (efficiency > 85) return 'green';
        if (efficiency > 70) return 'orange';
        return 'red';
    };

    return (
        <div className="inverter-item">
            <span className="inverter-id">逆变器 {data.id}</span>
            <span className="inverter-value">{data.dcVoltage} V</span>
            <span className="inverter-value">{data.dcCurrent} A</span>
            <span className="inverter-value">{data.acPower} kW</span>
            <span className="inverter-value">{data.dailyEnergy} kWh</span>
            <span className={`inverter-efficiency ${getEfficiencyColor(data.efficiency)}`}>
                {data.efficiency}%
            </span>
        </div>
    );
};

// 并网柜组件
const GridCabinet = ({ cabinet }) => {
    return (
        <div className="grid-cabinet">
            <div className="cabinet-header">
                <div className='name' title={cabinet.id}>并网柜 {cabinet.id}</div>
                <div className="cabinet-stats">
                    <div>正向有功总电能 <div>{cabinet.totalPower} kW</div></div>
                    <div>反向有功总电能 <div>{cabinet.totalEnergy} kWh</div></div>
                </div>
            </div>

            {/* 红框区域 - 可滚动的逆变器列表 */}
            <div className="inverters-scrollable">
                <div className="inverters-header">
                    <span>逆变器编号</span>
                    <span>直流电压</span>
                    <span>直流电流</span>
                    <span>交流功率</span>
                    <span>当日发电量</span>
                    <span>转换效率</span>
                </div>

                <div className="inverters-list">
                    {cabinet.inverters.map(inverter => (
                        <Inverter key={inverter.id} data={inverter} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// 光伏站点主组件
const PhotovoltaicStation = () => {
    // 模拟光伏站点数据
    const stationData = {
        summary: {
            totalPower: 325.6,
            dailyEnergy: 114.09,
            monthlyEnergy: 1698.38,
            yearlyEnergy: 7078.25,
            totalEnergy: 23232.96,
            efficiency: 82.3
        },
        cabinets: [
            {
                id: 1,
                totalPower: 108.5,
                totalEnergy: 7689.32,
                inverters: [
                    { id: 1, dcVoltage: 620.5, dcCurrent: 18.2, acPower: 11.2, dailyEnergy: 12.5, efficiency: 68.2 },
                    { id: 2, dcVoltage: 618.3, dcCurrent: 17.9, acPower: 10.9, dailyEnergy: 12.1, efficiency: 87.5 },
                    { id: 3, dcVoltage: 622.1, dcCurrent: 18.5, acPower: 11.4, dailyEnergy: 12.8, efficiency: 89.1 },
                    { id: 4, dcVoltage: 615.7, dcCurrent: 17.6, acPower: 10.7, dailyEnergy: 11.9, efficiency: 86.8 },
                    { id: 5, dcVoltage: 621.8, dcCurrent: 18.4, acPower: 11.3, dailyEnergy: 12.7, efficiency: 88.9 },
                    { id: 6, dcVoltage: 619.2, dcCurrent: 18.0, acPower: 11.0, dailyEnergy: 12.2, efficiency: 87.8 },
                    { id: 7, dcVoltage: 623.5, dcCurrent: 18.7, acPower: 11.5, dailyEnergy: 12.9, efficiency: 89.5 },
                ]
            },
            {
                id: 2,
                totalPower: 112.3,
                totalEnergy: 7845.67,
                inverters: [
                    { id: 8, dcVoltage: 621.2, dcCurrent: 18.3, acPower: 11.3, dailyEnergy: 12.6, efficiency: 88.5 },
                    { id: 9, dcVoltage: 617.5, dcCurrent: 17.8, acPower: 10.8, dailyEnergy: 12.0, efficiency: 87.2 },
                    { id: 10, dcVoltage: 624.1, dcCurrent: 18.8, acPower: 11.6, dailyEnergy: 13.0, efficiency: 89.8 },
                    { id: 11, dcVoltage: 616.9, dcCurrent: 17.7, acPower: 10.8, dailyEnergy: 11.9, efficiency: 87.0 },
                    { id: 12, dcVoltage: 622.7, dcCurrent: 18.6, acPower: 11.5, dailyEnergy: 12.9, efficiency: 89.3 },
                    { id: 13, dcVoltage: 620.1, dcCurrent: 18.1, acPower: 11.1, dailyEnergy: 12.4, efficiency: 88.1 },
                    { id: 14, dcVoltage: 618.9, dcCurrent: 18.0, acPower: 11.0, dailyEnergy: 12.3, efficiency: 87.7 },
                ]
            },
            {
                id: 3,
                totalPower: 104.8,
                totalEnergy: 7698.0,
                inverters: [
                    { id: 15, dcVoltage: 619.5, dcCurrent: 18.1, acPower: 11.1, dailyEnergy: 12.4, efficiency: 88.0 },
                    { id: 16, dcVoltage: 614.3, dcCurrent: 17.5, acPower: 10.6, dailyEnergy: 11.7, efficiency: 86.5 },
                    { id: 17, dcVoltage: 621.5, dcCurrent: 18.4, acPower: 11.3, dailyEnergy: 12.7, efficiency: 88.7 },
                    { id: 18, dcVoltage: 617.8, dcCurrent: 17.9, acPower: 10.9, dailyEnergy: 12.1, efficiency: 87.6 },
                    { id: 19, dcVoltage: 623.0, dcCurrent: 18.6, acPower: 11.5, dailyEnergy: 12.8, efficiency: 89.2 },
                    { id: 20, dcVoltage: 616.2, dcCurrent: 17.6, acPower: 10.7, dailyEnergy: 11.8, efficiency: 86.9 },
                    { id: 21, dcVoltage: 620.8, dcCurrent: 18.3, acPower: 11.2, dailyEnergy: 12.6, efficiency: 88.4 },
                ]
            }
        ]
    };

    return (
        <div className="photovoltaic-station">
            <div className='station-box'>
                <div className="station-header">
                    <h2>光伏站点监控</h2>
                    <div className="station-summary">
                        <div className="summary-card">
                            <span>今日发电量</span>
                            <span className="summary-value">{stationData.summary.dailyEnergy} kWh</span>
                        </div>
                        <div className="summary-card">
                            <span>本月发电量</span>
                            <span className="summary-value">{stationData.summary.monthlyEnergy} kWh</span>
                        </div>
                        <div className="summary-card">
                            <span>本年发电量</span>
                            <span className="summary-value">{stationData.summary.yearlyEnergy} kWh</span>
                        </div>
                        <div className="summary-card">
                            <span>累计发电量</span>
                            <span className="summary-value">{stationData.summary.totalEnergy} kWh</span>
                        </div>
                    </div>
                </div>
                <div className='station-line'></div>
            </div>

            <div className="cabinets-container">
                {stationData.cabinets.map(cabinet => (
                    <GridCabinet key={cabinet.id} cabinet={cabinet} />
                ))}
            </div>
        </div>
    );
};

export default PhotovoltaicStation;
