import React, { useRef } from 'react'
import style from './style.module.less'
import { Form, Select, Input, Button, Divider, Space } from 'antd'
import styled from 'styled-components'
import UseTable from '@com/useTable'

export default function Index(props) {
  const tableRef = useRef()
  const [form] = Form.useForm()
  const Item = Form.Item
  const { Search } = Input

  const MainButton = styled(Button)`
    margin-left: 16px;
    width: 96px;
  `

  const changeArea = val =>{}
  const columns =[
    {
      title:'园区名称',
      dataIndex:'regionName',
      key:'regionName',
      align:'center'
    },{
      title:'安装地址',
      dataIndex:'address',
      key:'address',
      align:'center'
    },{
      title:'传感器型号',
      dataIndex:'sensorCategory',
      key:'sensorCategory',
      align:'center'
    },{
      title:'传感器编号',
      dataIndex:'sensorNumber',
      key:'sensorNumber',
      align:'center'
    },{
      title:'传感器名称',
      dataIndex:'sensorName',
      key:'sensorName',
      align:'center'
    },{
      title:'所属网关',
      dataIndex:'gateway',
      key:'gateway',
      align:'center'
    },{
      title:'备注',
      dataIndex:'remark',
      key:'remark',
      align:'center'
    },{
      title:'操作',
      dataIndex:'action',
      key:'action',
      align:'center',
      render:(_, record) =>{
        <Space>
          <span style={{textDecoration:'underline', color:'#f00'}}>删除</span>
        </Space>
      }
    },
  ]
  const data = []
  const exportData = () => {
    tableRef.current.download()
  }
  return (
    <div>
      <div className={style.header}>
        <Form form={form} layout='inline' colon={false}>
          <Item name='areaId' label='' style={{marginLeft:16}} initialValue={0}>
            <Select
              size="middle"
              style={{width: '264px'}}
              onChange={changeArea}
            >
              <Select.Option value={0}>全部园区</Select.Option>
                {props.areaList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
          <Divider dashed type='vertical' style={{height: 32}}></Divider>
          <Item name='searchInput' label='编号查询' style={{marginLeft:16}}>
            <Search
              placeholder="输入编号/安装地址"
              allowClear
              style={{width: '400px'}}
              enterButton="查询"
            />        
          </Item>
        </Form>
        <div>
          <MainButton type='primary'>新增</MainButton>
          <MainButton type='primary'>批量导入</MainButton>
          <MainButton type='primary' onClick={()=>exportData()}>导出</MainButton>
        </div>
      </div>
      <Divider dashed style={{borderColor:'#d7d7d7'}}></Divider>
      <UseTable columns={columns} dataSource={data} ref={tableRef} sheetName='传感器.xlsx'></UseTable>
    </div>
  )
}
