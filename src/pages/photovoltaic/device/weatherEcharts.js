import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const SolarPowerGenerationChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chart = echarts.init(chartRef.current);

        // 模拟数据
        const hours = [
            '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00',
            '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
            '14:00', '15:00', '16:00'
        ];

        // 发电量数据 (kWh)
        const powerData = [
            0, 0, 0, 0, 15, 20, 45,
            120, 210, 290, 360, 390, 400, 380,
            320, 240, 150
        ];

        // 每个时间点的天气状况
        const weatherData = [
            { weather: 'night', temp: '25°C' },        // 00:00
            { weather: 'night', temp: '24°C' },        // 01:00
            { weather: 'night', temp: '24°C' },        // 02:00
            { weather: 'night', temp: '23°C' },        // 03:00
            { weather: 'night', temp: '23°C' },        // 04:00
            { weather: 'sunrise', temp: '24°C' },      // 05:00
            { weather: 'sunny', temp: '25°C' },        // 06:00
            { weather: 'sunny', temp: '26°C' },        // 07:00
            { weather: 'sunny', temp: '28°C' },        // 08:00
            { weather: 'sunny', temp: '30°C' },        // 09:00
            { weather: 'sunny', temp: '32°C' },        // 10:00
            { weather: 'sunny', temp: '33°C' },        // 11:00
            { weather: 'sunny', temp: '34°C' },        // 12:00
            { weather: 'cloudy', temp: '33°C' },       // 13:00
            { weather: 'cloudy', temp: '32°C' },       // 14:00
            { weather: 'overcast', temp: '30°C' },       // 15:00
            { weather: 'rainy', temp: '29°C' }        // 16:00
        ];

        // 天气图标映射
        // const weatherIcons = {
        //     'night': '🌙',
        //     'sunrise': '🌅',
        //     'sunny': '☀️',
        //     'cloudy': '☁️',
        //     'rainy': '🌧️'
        // };
        const weatherIcons = {
            'night': '🌙', // 黑色月亮
            'sunrise': '🌄', // 日出
            'sunny': '☀️', // 太阳
            'cloudy': '⛅', // 少云
            'overcast': '☁️', // 多云
            'rainy': '🌧️', // 雨
            'stormy': '⛈️', // 雷雨
            'snowy': '❄️', // 雪
            'foggy': '🌫️' // 雾
        };

        // 准备自定义系列数据 - 每个柱子顶部显示天气图标
        const customSeriesData = hours.map((hour, index) => {
            return {
                value: powerData[index],
                weather: weatherData[index].weather,
                temp: weatherData[index].temp,
                itemStyle: {
                    color: getColorForHour(weatherData[index].weather)
                }
            };
        });

        // 根据时间获取柱状图颜色
        function getColorForHour(weather) {
            if (weather == 'night') return '#5e5e61'; // 深夜
            if (weather == 'sunrise') return '#fde636'; // 日出
            if (weather == 'cloudy') return '#f0f9ff'; // 多云
            if (weather == 'sunny') return '#ff9d34'; // 晴
            if (weather == 'rainy') return '#4298fd'; // 下雨
            return '#308e22'; // 下午
        }

        // 准备图表选项 - 柱状图版本
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params) {
                    const data = params[0];
                    const hour = data.name;
                    const value = data.value;
                    const weather = data.data.weather;
                    const temp = data.data.temp;

                    return `
            <div style="font-weight: bold; margin-bottom: 5px;">时间: ${hour}</div>
            <div>发电量: <span style="color: #5470C6; font-weight: bold;">${value} kWh</span></div>
            <div>天气: ${weatherIcons[weather]} ${weather} ${temp}</div>
          `;
                },
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: '#ddd',
                borderWidth: 1,
                textStyle: {
                    color: '#333'
                }
            },
            grid: {
                left: '5%',
                right: '5%',
                bottom: '0%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: hours,
                axisLabel: {
                    interval: 0,
                    rotate: 45,
                    margin: 10,
                    fontSize: 11
                },
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisTick: {
                    alignWithLabel: true
                }
            },
            yAxis: {
                type: 'value',
                name: '发电量(kWh)',
                nameTextStyle: {
                    fontSize: 12,
                    padding: [0, 0, 0, 10]
                },
                max: 400,
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#eee'
                    }
                },
                axisLabel: {
                    fontSize: 11
                }
            },
            series: [
                {
                    name: '发电量',
                    type: 'bar',
                    data: customSeriesData,
                    barWidth: '35%',
                    itemStyle: {
                        borderRadius: [4, 4, 0, 0],
                        borderWidth: 0
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.3)'
                        }
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: function (params) {
                            return weatherIcons[params.data.weather];
                        },
                        fontSize: 16,
                        color: '#333',
                        distance: 10
                    }
                }
            ],
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100,
                zoomLock: true
            }]
        };

        // 设置图表选项
        chart.setOption(option);

        // 响应式调整
        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);

        // 清理函数
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.dispose();
        };
    }, []);


    return (
        <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>
    );
};
export default SolarPowerGenerationChart;