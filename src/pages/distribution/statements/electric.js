import React, {useRef} from 'react'
import Titlelayout from '@com/titlelayout'
import {Space, Select, DatePicker, Form} from 'antd'
import UseTable from '@com/useTable'
import {ExportExcel, CustButtonT } from "@com/useButton"
import styled from 'styled-components'
const Ctitle = styled.div`
  && {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .time{
        padding-right: 64px;
        color: #515151;
    }
  }
`
const columns =[
    {
     title: '回路名称',
     dataIndex: 'name',
     key: 'name',
     width: 100,
     fixed: 'left'
    },
    {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        width: 80,
       },
       
       {
        title: '有功功率(kW)',
       
        children: [
            {
                title: '最大值',
                children: [
                  {
                    title: '最大值',
                    dataIndex: 'max',
                    key: 'max',
                    width: 90
                   },
                   {
                    title: '发生时间',
                    dataIndex: 'maxstart',
                    key: 'maxstart',
                    width: 90
                   },
                ]
               },
               {
                title: '最小值',
                children: [
                  {
                    title: '最小值',
                    dataIndex: 'min',
                    key: 'min',
                    width: 90
                   },
                   {
                    title: '发生时间',
                    dataIndex: 'minstart',
                    key: 'minstart',
                    width: 90
                   },
                ]
               },
               {
                title: '平均值',
                dataIndex: 'avg',
                key: 'avg',
                width: 75
               },
        ]
       },
       {
        title: '无功功率(kW)',
        width: 418,
        children: [
            {
                title: '最大值',
                children: [
                  {
                    title: '最大值',
                    dataIndex: 'wmax',
                    key: 'wmax',
                    width: 90
                   },
                   {
                    title: '发生时间',
                    dataIndex: 'wmaxstart',
                    key: 'wmaxstart',
                    width: 90
                   },
                ]
               },
               {
                title: '最小值',
                children: [
                  {
                    title: '最小值',
                    dataIndex: 'wmin',
                    key: 'wmin',
                    width: 90
                   },
                   {
                    title: '发生时间',
                    dataIndex: 'wminstart',
                    key: 'wminstart',
                    width: 90
                   },
                ]
               },
               {
                title: '平均值',
                dataIndex: 'wavg',
                key: 'wavg',
                width: 75,
               },
        ]
       },
       {
        title: '实在功功率(kVA)',
        width: 418,
        children: [
            {
                title: '最大值',
                children: [
                  {
                    title: '最大值',
                    dataIndex: 'smax',
                    key: 'smax',
                    width: 90,
                   },
                   {
                    title: '发生时间',
                    dataIndex: 'smaxstart',
                    key: 'smaxstart',
                    width: 90,
                   },
                ]
               },
               {
                title: '最小值',
                children: [
                  {
                    title: '最小值',
                    dataIndex: 'smin',
                    key: 'smin',
                    width: 90,
                   },
                   {
                    title: '发生时间',
                    dataIndex: 'sminstart',
                    key: 'sminstart',
                    width: 90,
                   },
                ]
               },
               {
                title: '平均值',
                dataIndex: 'savg',
                key: 'savg',
                width: 75
               },
        ]
       },
       {
        title: '功率因数',
        width: 418,
        children: [
            {
                title: '最大值',
                children: [
                  {
                    title: '最大值',
                    dataIndex: 'ymax',
                    key: 'ymax',
                    width: 90
                   },
                   {
                    title: '发生时间',
                    dataIndex: 'ymaxstart',
                    key: 'ymaxstart',
                    width: 90
                   },
                ]
               },
               {
                title: '最小值',
                children: [
                  {
                    title: '最小值',
                    dataIndex: 'ymin',
                    key: 'ymin',
                    width: 90
                   },
                   {
                    title: '发生时间',
                    dataIndex: 'yminstart',
                    key: 'yminstart',
                    width: 90
                   },
                ]
               },
               {
                title: '平均值',
                dataIndex: 'ysavg',
                key: 'yavg',
                width: 75,
               },
        ]
       },
]
export default function Electric() {
  const tbref=useRef()
  const [form] = Form.useForm()
  const options = [
    {value: 1,label: '功率'},
    {value: 2,label: '电流'},
    {value: 3,label: '相电压'},
    {value: 4,label: '线电压'},
    {value: 5,label: '不平衡度'},
    {value: 6,label: '电压谐波'},
    {value: 7,label: '电流谐波'},
  ]
  const CusTitle =(
   <Form form={form} layout='inline' style={{display: 'flex',justifyContent: 'space-between'}}> 
   <Form.Item label="数据类别"><Select options={options} style={{width: '200px'}}></Select></Form.Item>
        <Space><Form.Item label=''><DatePicker /></Form.Item> <CustButtonT text="search" src="search" />   <ExportExcel single={true} tb={tbref}  /></Space> 
    </Form>
  )
  return (
     <Titlelayout title={CusTitle} layout="flex" bordered="none" pv="0" bodypad="16px 0 0 0" bl="none" >
       <UseTable columns={columns} dataSource={[]} 
       hbg="#ecf5ff"
       hbc="#515151"
       ref={tbref}
       sheetName="运行参数"
       scroll={{ y: 470, x:'calc(700px + 50%)' }}></UseTable>
     </Titlelayout>
  )
}
