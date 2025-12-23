import { numberformat } from '@com/usehandler'

/**
 * getTableColumns 获取中间表格列配置
 */
export const getTableColumns = () => {
  return [
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
