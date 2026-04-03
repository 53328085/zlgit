import { numberformat } from '@com/usehandler'

/**
 * getTableColumns 获取中间表格列配置
 */
export const getTableColumns = (type) => {
  return type===1 ? [
    {
      title: '时间',
      dataIndex: 'dateTime',
    },
    {
      title: '时段',
      dataIndex: 'timePeriod',
    },
    {
      title: '总能耗(kWh)',
      dataIndex: 'totalEnergy',
    },
  ]:
  [
    {
      title: '时间',
      dataIndex: 'dateTime',
    },
    {
      title: '尖能耗(kWh)',
      dataIndex: 'tariffTimeType1',
    },
    {
      title: '峰能耗(kWh)',
      dataIndex: 'tariffTimeType2',
    },
    {
      title: '平能耗(kWh)',
      dataIndex: 'tariffTimeType3',
    },
    {
      title: '谷能耗(kWh)',
      dataIndex: 'tariffTimeType4',
    },
    {
      title: '总能耗(kWh)',
      dataIndex: 'totalEnergy',
    },

  ]
}

/**
 * getRightTableColumns 获取右侧同比环比表格列配置
 */
export const getRightTableColumns = () => {
  return [
    {
      title: '分时能耗',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '用电量',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: '环比',
      dataIndex: 'mom',
      key: 'mom',
      render: numberformat,
    },
    {
      title: '同比',
      dataIndex: 'yoy',
      key: 'yoy',
      render: numberformat,
    },
  ]
}

/**
 * DefaultOptions 获取月、年图表配置
 */
export const DefaultOptions = {
  yAxis: {
    name: 'kWh',
  },
  xAxis: {
    axisLabel: {
      showMaxLabel: true,
      showMinLabel: true,
      hideOverlap: false, // 改为false以确保所有标签都显示
      interval: 0 // 改为0确保所有标签都显示
    },
    boundaryGap: true,
    axisTick: {
      alignWithLabel: true // 确保刻度线与标签对齐
    }
  },
  series: [
    {
      type: 'bar', seriesLayoutBy: 'row', stack: 'Ad',
      tooltip: {
        valueFormatter: value => value + 'kWh'
      },
    },
    {
      type: 'bar', seriesLayoutBy: 'row', stack: 'Ad',
      tooltip: {
        valueFormatter: value => value + 'kWh'
      },
    },
    {
      type: 'bar', seriesLayoutBy: 'row', stack: 'Ad',
      tooltip: {
        valueFormatter: value => value + 'kWh'
      },
    },
    {
      type: 'bar', seriesLayoutBy: 'row', stack: 'Ad',
      tooltip: {
        valueFormatter: value => value + 'kWh'
      },
    }],
  grid: {
    left: '16px',
    right: '16px',
    top: '64px',
    bottom: '16px',
    containLabel: true,
  },
  legend: {
    top: '5px',
  }
}

/**
 * DefaultSingleOptions 获取日图表配置
 */
export const DefaultSingleOptions = {
  yAxis: {
    name: 'kWh',
  },
  xAxis: {
    axisLabel: {
      showMinLabel: true,
      showMaxLabel: true,
      hideOverlap: false, // 改为false以确保所有标签都显示
    },
    boundaryGap: true,
    axisTick: {
      alignWithLabel: true // 确保刻度线与标签对齐
    }
  },
  dataZoom: [
    {
      type: 'slider', // 滑动条缩放
      xAxisIndex: 0,  // 控制第一个x轴
      filterMode: 'filter' // 设置为 filter 模式则数据范围外的数据会被过滤掉
    },
    {
      type: 'inside', // 内置缩放
      xAxisIndex: 0
    }
  ],
  series: [
    {
      type: 'bar',
      seriesLayoutBy: 'row',
      tooltip: {
        valueFormatter: value => value + 'kWh'
      }
    }
  ],
  grid: {
    left: '16px',
    right: '16px',
    top: '64px',
    bottom: '16px',
    containLabel: true,
  },
  legend: {
    show: false
  }
}

/**
 * markArea 分时区域背景数据转换
 * @param originalData 接口原始数据（分时配置）
 */
export function convertToMarkAreaData (originalData) {
  const typeColorMap = {
    1: '#5983FE', // 尖
    2: '#46C7FF', // 峰
    3: '#FFAA54', // 平
    4: '#5ED9A7', // 谷
    5: '#6859EA', // 深谷
  }

  return {
    data: originalData?.tariffTimes?.map(item => {
      const endTime = item.endTime || '24:00' // 处理空结束时间
      return [
        {
          name: ['尖', '峰', '平', '谷', '深谷'][item.tariffTimeType - 1],
          xAxis: item.startTime === '00:00' ? Number.NEGATIVE_INFINITY : item.startTime,
          itemStyle: {
            color: typeColorMap[item.tariffTimeType],
            opacity: 0.3
          },
        },
        {
          xAxis: endTime === '00:00' ? Number.POSITIVE_INFINITY : endTime
        }
      ]
    }) || []
  }
}

/**
 * 比较两个时间点，返回较晚的时间
 * @param {string} time1 - 时间字符串 "HH:mm" (如 "08:30")
 * @param {string} time2 - 时间字符串 "HH:mm" (如 "18:45")
 * @returns {boolean} true-time1较晚 false-time2较晚
 */
export function isLaterTime(time1, time2) {
  // 处理24:00特殊情况
  if (time1 === "24:00") return true;
  if (time2 === "24:00") return false;

  // 转换为分钟数进行比较
  const toMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutes1 = toMinutes(time1);
  const minutes2 = toMinutes(time2);

  return minutes1 >= minutes2
}

/**
 * 根据时间区间获取匹配到的第一个区间的颜色值
 * @param {string} currentTime - 当前时间点 "HH:mm"
 * @param {Array} colorRanges - 颜色区间数组 [{color:'', value:'HH:mm'}]
 * @returns {string} 第一个匹配区间的颜色值，未匹配返回空字符串
 */
export function getTimeRangeColor(currentTime, colorRanges) {
  if (!colorRanges?.length) return '';
  // 特殊情况：当前时间早于第一个区间点
  if (!isLaterTime(currentTime, colorRanges[0].value)) {
    return colorRanges[0].color;
  }
  // 遍历区间判断位置
  for (let i = 1; i < colorRanges.length; i++) {
    if (!isLaterTime(currentTime, colorRanges[i].value)) {
      return colorRanges[i].color;
    }
  }
  // 当前时间晚于所有区间点，返回空字符串
  return '';
}

// 1. 首先提取颜色计算逻辑为独立函数
export const getDynamicColor = (params, colorArray) => {
  const timeValue = params.value[0]; // 获取时间值
  const color = getTimeRangeColor(timeValue, colorArray)
  return color;
};

