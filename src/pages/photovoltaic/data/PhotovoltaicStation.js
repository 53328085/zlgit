import React from 'react';
import './PhotovoltaicStation.less';

// 并网柜组件 - 添加了position属性标识位置
const GridCabinet = ({ cabinet, position, totalCabinets }) => {
    return (
        <div className="grid-cabinet">
            <div className='line'>
                {/* 根据位置添加不同的类名 */}
                <div className={`cabinet-line1 ${position}`}></div>
                <div className='cabinet-line2'></div>
            </div>
            <div className='cabinet-box'>
                <div className="cabinet-header">
                    <div className='name' title={cabinet.id}>并网柜 {cabinet.id}</div>
                    <div className="cabinet-stats">
                        <div>正向有功总电能 <div>{cabinet.totalPower} kW</div></div>
                        <div>反向有功总电能 <div>{cabinet.totalEnergy} kWh</div></div>
                    </div>
                </div>
                <div className='station-line'></div>
                <div className='inverter'>
                    {cabinet.inverters.map((inverter, index) => {
                        // 确定每个并网柜的位置（第一个、中间、最后一个）
                        let position = 'middle';
                        if (index === 0) position = 'first';
                        if (index === cabinet.inverters.length - 1) position = 'last';

                        return (
                            <InverterComp
                                key={inverter.id}
                                inverter={inverter}
                                position={position}
                                totalCabinets={cabinet.inverters.length}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
const InverterComp = ({ inverter, position, totalCabinets }) => {

    const getEfficiencyColor = (efficiency) => {
        if (efficiency > 85) return 'green';
        if (efficiency > 70) return 'orange';
        return 'red';
    };
    return (
        <div className="grid-inverter">
            <div className='line'>
                {/* 根据位置添加不同的类名 */}
                <div className={`inverter-line1 ${position}`}></div>
                <div className='inverter-line2'></div>
            </div>
            <div className='inverter-box'>
                <div className='inverter-item'>
                    <span className={`circle ${getEfficiencyColor(inverter.efficiency)}`}></span>
                    <span>逆变器编号</span>
                </div>
                <div className='inverter-item'>
                    <span>直流功率</span>
                    <div className='inverter-value'>
                        <span>{inverter.dcCurrent}</span>kW
                    </div>
                </div>
                <div className='inverter-item'>
                    <span>日发电量</span>
                    <div className='inverter-value'>
                        <span>{inverter.acPower}</span>kWh
                    </div>
                </div>
                <div className='inverter-item'>
                    <span>累计发电量</span>
                    <div className='inverter-value'>
                        <span>{inverter.dailyEnergy}</span>kWh
                    </div>
                </div>
                <div className='inverter-item'>
                    <span>累计发电量</span>
                    <div className='inverter-value'>
                        <span>{inverter.efficiency}</span>%
                    </div>
                </div>
            </div>
            {/* <div className="inverters-list">
                        {inverters.map(inverter => (
                            <Inverter key={inverter.id} data={inverter} />
                        ))}
                    </div> */}
        </div>
    )
}
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
                {stationData.cabinets.map((cabinet, index) => {
                    // 确定每个并网柜的位置（第一个、中间、最后一个）
                    let position = 'middle';
                    if (index === 0) position = 'first';
                    if (index === stationData.cabinets.length - 1) position = 'last';

                    return (
                        <GridCabinet
                            key={cabinet.id}
                            cabinet={cabinet}
                            position={position}
                            totalCabinets={stationData.cabinets.length}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default PhotovoltaicStation;
