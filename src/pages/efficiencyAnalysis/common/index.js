import React, { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { useTranslation } from "react-i18next"
import { useRequest } from "ahooks"
import { Form, Select, Space, DatePicker, ConfigProvider, Carousel, Typography } from 'antd'
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig";
import enUS from 'antd/lib/calendar/locale/en_US'
import { Cform } from "@com/useSerach/comhead.js"
import { useQuerySNFReportData } from "./api";
import { AreaSelect } from "@com/useSerach/comhead"
import { isObject,divide } from "@com/usehandler"
 
const dateType = [
  {
    value: 1,
    label: "Day"
  },
  {
    value: 2,
    label: "Month"
  },
  {
    value: 3,
    label: "Year"
  },
  {
    value: 4,
    label: "Custon"
  }
];
const disabledDate = (current) => {
  return (current && current > dayjs().endOf("day"));
};
const w200 = { width: 200 }
const w88 = { width: 88 }
export default function Index({ setexparams }) {
  const [form] = Form.useForm()
  const { i18n } = useTranslation()
  useEffect(() => {
    i18n.changeLanguage("en")

    setexparams(form.getFieldsValue())
    return () => {
      i18n.changeLanguage("zh")
    }
  }, [])
  const onValuesChange = (_, allValues) => {
    setexparams(allValues)
  }
  return (
    <ConfigProvider locale={enUS}>
      <Cform form={form} layout="inline" initialValues={{ areaId: 1, type: 1 }} onValuesChange={onValuesChange}>
        <Space size={16}>
          <Form.Item name="areaId" label="Park selection">
            <AreaSelect></AreaSelect>
          </Form.Item>
          <Form.Item name="type">
            <Select options={dateType} style={w88}></Select>
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(cur, pre) => cur.type != pre.type}>
            {
              ({ getFieldValue }) => {
                let type = getFieldValue("type")
                console.log("type", type)
                const picker = { "1": "date", "2": "month", "3": "year" }[type?.toString()]
                if (type == 4) {
                  return <Form.Item name="date" initialValue={[dayjs().startOf("day"), dayjs().endOf("day")]}  >
                    <DatePicker.RangePicker disabledDate={disabledDate} format="DD/MM/YYYY" style={w200} />
                  </Form.Item>
                } else {
                  return <Form.Item name="date" initialValue={dayjs()}>
                    <DatePicker picker={picker} disabledDate={disabledDate} style={w200} />
                  </Form.Item>
                }
              }
            }
          </Form.Item>
        </Space>
      </Cform>
    </ConfigProvider>
  )
}

export function Custitem(props) {
  const { data, h = 120, len = 5 } = props
  if (data?.length < len) {
    return data?.map((item, index) => (<div className="row" key={item.sn + index}>
      <Typography.Paragraph ellipsis={{ tooltip: item?.keyName }}>{item?.keyName}</Typography.Paragraph>  <Typography.Paragraph type="success">{item.keyValue}</Typography.Paragraph>

    </div>))
  }
  return (<Carousel vertical={true} autoplay style={{ height: h }} dots={false} >
    {
      data?.map((item, index) => {
        return <div className="row" key={item.sn + index}>
          <Typography.Paragraph ellipsis={{ tooltip: item?.keyName }}>{item?.keyName}</Typography.Paragraph>  <Typography.Paragraph type="success">{item.keyValue}</Typography.Paragraph>

        </div>
      })

    }
  </Carousel>)
}
export function useGauge(params) {
  let { data,value, radius = "100px", center = ['50%', 110], splitNumber = 10, startAngle = 180, endAngle = 0 } = isObject(params) ? params : {}
  data =  data?.sort?.((a, b)=>a-b) // 排序
  let len = Array.isArray(data) ? data.length : 0
  let max = data?.[len - 1] ?? NaN
  const goption = useMemo(() => {
    const series = {
      type: 5,
      series: [
        {
          type: 'gauge',
          radius,
          center,
          startAngle,
          endAngle,
          min: data?.[0],
          max: data?.[len - 1],
          splitNumber,

          axisLine: {
            lineStyle: {
              width: 18,
              color: len ? [
                [divide(data[1], max), 'rgba(5, 192, 110, 1)'],
                [divide(data[2], max), 'rgba(255, 177, 43, 1)'],
                [1, 'rgba(255, 96, 33, 1)']
              ] : [],
              opacity: 0.8
            }
          },
          pointer: {
            offsetCenter: [0, '-10%'],
            width: 5,
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -18,
            length: 8,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          anchor: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: true,
            color: 'auto',
            distance: 5,
            fontStyle: "bold",
            fontSize: 12,
            formatter: (value) => {
              if (value == data?.[0]) {
                return value
              } else if (value == data?.[3]) {
                return value

              }
            }
          },
          detail: {
            valueAnimation: true,
            color: 'rgba(96, 98, 102, 1)',
            fontSize: 20,
            offsetCenter: [0, "-30%"]
          },
          data: len > 0 ? [
            {
              value: value || null,
              //  name: "value"
            }
          ] : [],

        }
      ]
    }
    return series
  }, [data, radius, value])

  return goption
}
export function useLine(chartdata = {}) {
  const lineopt = useMemo(() => {
    return {
      series: [{
        type: "line",
        seriesLayoutBy: 'row',
        smooth: 0.2,
      }],
      grid: {
        left: "0px",
        right: "0px",
        top: "0px",
        bottom: "0px",
        containLabel: true,
      },
      legend: {
        show: false
        // itemHeight: 4,
        // itemWidth: 16,
      },
      yAxis: {
        show: true,
        axisLabel: {
          show: false
        }
      },
      xAxis: {
        axisLabel: {
          color: "#909399",
          fontSize: 12,
          align: "left"
        },
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(144, 147, 153, 0.30)',
          },
        },
      },
      dataset: {
        dimensions: [
          { name: 'time', type: 'time' },
          { name: 'value' },

        ],
        source: [chartdata?.x, chartdata?.y],
        sourceHeader: false,
      },
    }
  }, [chartdata])
  return lineopt
}

export const settings = {
  dots: false,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  vertical: true,
  verticalSwiping: true,
  speed: 2000,
  autoplaySpeed: 1000,
  autoplay: true,
  effect: "fade"

}
