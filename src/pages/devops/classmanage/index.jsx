import React, { useEffect, useState, useRef, useMemo } from 'react'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import { Form, Image, message, Progress, Select, Button,Checkbox, Space  } from 'antd'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import UserTable from '@com/useTable'
import { useReactive } from 'ahooks';
const MainBox = styled.div`
  background-color: #fff;
  padding:16px;
  border: 1px solid #d7d7d7;
  border-radius: 4px; 
  flex: 1;
  --ant-primary-color:#237ae4;
  --ant-primary-color-hover:#237ae4;
  .title{
    display: flex;
    justify-content: space-between;
  }
  .wd96{
      width: 96px;
    }
  .mgt16{
      margin-top: 16px;
    }
  .pd0{
    padding: 0px !important;
    width: 63px;
    height:92px;
    .ant-checkbox-group{
      padding: 2px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .ant-checkbox-group-item
      {
        width: 16px;
        height:28px ;
        padding: 0;
        margin: 0;
        text-align: center;
        line-height: 28px;
      }
      
    }
    
    .gridrow3{
      display: grid;
      grid-template-rows: repeat(3,28px);
      grid-template-columns:59px;
      grid-gap: 2px;
      justify-content: center;
      align-items: center;
      .planclass{
      color: #fff;
      line-height:28px;
      &:nth-of-type(1){
        background-color: #6666ff;
      }
      &:nth-of-type(2){
        background-color: #339966;
      }
      &:nth-of-type(3){
        background-color: #cc3333;
      }
    }
    }
    
  }
  
`
export default function Index() {
  const [form] = Form.useForm()
  const oneLevel = useSelector(state => state.system.onelevel)
  const areaOptions = oneLevel.length > 0 ? useMemo(() => ([{ name: oneLevel[0].levelName + '(全部)', id: 0 }, ...oneLevel]), [oneLevel]) : []
  const changeArea = () => {

  }

  const columns = useReactive([
    {
      title: "值班人员",
      dataIndex: `user`,
      align: 'center',
      width: 280,
    }, {
      title: "班次",
      dataIndex: `plan`,
      align: 'center',
      onCell(record, rowIndex) {
        return {
          className: "pd0"
        }
      },
      render(text, record, index) {
        return (
          <div className='gridrow3'>
            <div className='planclass'>早班</div>
            <div className='planclass'>中班</div>
            <div className='planclass'>晚班</div>
          </div>
        )
      }
    }
  ])
  const tabledata = useReactive([{

  }])
  const planName =[{
    label:null,
    value:1
  },{
    label:null,
    value:2
  },{
    label:null,
    value:3
  }]
  useEffect(() => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const days = new Date(year, month, 0).getDate()
    for (let i = 1; i <= days; i++) {
      columns.push({
        title: i,
        dataIndex: `date${i}`,
        align: 'center',
        onCell(record, rowIndex) {
          return {
            className: "pd0"
          }
        },
        render(){
            return (
                  <Checkbox.Group options={planName} className='checkGroup'></Checkbox.Group>  
            )
        }
      })
      tabledata.push({
        1: 100
      })
    }
  }, [])
  return (
    <CustContext.Provider >
      <Pagecount bgcolor="#eeeff3" pd={0}>
        <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '8px 16px', marginBottom: 16, border: '1px solid #d7d7d7', borderRadius: 4 }}>
          <Form
            form={form}
            colon={false}
          >
            <Form.Item label={oneLevel[0]?.levelName} name="area" style={{ marginBottom: 0 }}>
              <Select style={{ width: 200 }} options={areaOptions} fieldNames={{ label: 'name', value: 'id' }} onChange={changeArea} defaultValue={oneLevel.length > 0 ? 0 : null}></Select>
            </Form.Item>
          </Form>
        </div>
        <MainBox>
          <div className='title'>
            <BlueColumn name="排班信息"></BlueColumn>
            <div className='wd96'>
              <Button type="primary" block>导出</Button>
            </div>
          </div>
          <div className='mgt16'>
            <UserTable columns={columns} dataSource={tabledata}></UserTable>
          </div>
        </MainBox>
      </Pagecount>
    </CustContext.Provider>
  )
}
