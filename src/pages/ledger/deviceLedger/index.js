import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Space, Button, message, Input, Divider, Tree, Select, Image } from 'antd'
import { selectcurlRommid, selectProjectId } from "@redux/systemconfig";
import Titlelayout from '@com/titlelayout'
import { useSelector, useDispatch } from 'react-redux'
import Pagecount from "@com/pagecontent";
import { SearchOutlined } from '@ant-design/icons'
const Mainbox = styled.div`
    && {
      flex: 1;
      display: flex;
      flex-direction: column;
       }
       .main{
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        justify-content: space-between;
       }
       .left{
        width: 245px;
        height: 735px;
       }
       .right{
        width: 1393px;
        height: 801px;
        background-color: #FFF;
        border: 1px solid #E8E8E8;
        border-radius: 4px;
        margin-left: 16px;
        padding: 16px;
        .chart{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;
          height: 700px;
          .chartRight{
            width: calc(100% - 247px);
            height: 700px;
            margin-top: -16px;
            overflow-y:scroll;
          }
        }
        .deviceBox{
          width:100%;
          height:auto;
          display:grid;
          grid-template-rows:32px;
          grid-template-columns:1fr 1fr;
          grid-gap:16px;
          .deviceItem{
            width:100%;
            height:100%;
            display:flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items:center;
            .deviceValue{
              width:241px;
              height:32px;
              border:1px solid #d1d1d1;
              border-radius:4px;
              display:flex;
              justify-content: space-between;
              align-items:center;
              padding:0 10px;
              margin-right:16px;
            }
          }
        }
       
      }
`
export default function Index() {

  const projectId = useSelector(selectProjectId)
  const roomId = useSelector(selectcurlRommid)
  const [treeData, setTreeData] = useState([
    {
      title: '1#配电室',
      key: '0',
      children: [
        {
          title: '变压器',
          key: '0-1',
        },
        {
          title: '中置柜',
          key: '0-2',
        },
        {
          title: '开关柜',
          key: '0-3',
        }, {
          title: '直流系统',
          key: '0-4',
        },
      ],
    },
  ])
  const [selectedId, setSelectedId] = useState()
  const onSelect = (e) => {
    console.log(e[0])
    setSelectedId(e[0])
  }
  const [deviceList, setDeviceList] = useState([
    { value: 0, label: '1#变压器' },
    { value: 1, label: '2#变压器' },
    { value: 2, label: '3#变压器' },
    { value: 3, label: '4#变压器' },
    { value: 4, label: '5#变压器' },
    { value: 5, label: '6#变压器' },
  ])
  const [deviceName, setDeviceName] = useState()
  const changeDevice = (e) => {
    console.log(e)
    setDeviceName(e)
  }
  const [deviceInfo, setDeviceInfo] = useState([{
    label: '变压器',
    data: [
      {
        label: '设备名称',
        data: '1',
        unit:''
      }, {
        label: '设备编号',
        data: '2',
        unit:''
      }, {
        label: '规格型号',
        data: '3',
        unit:''
      }, {
        label: '设备类型',
        data: '4',
        unit:''
      },
    ]
  }, {
    label: '温度控制器',
    data: [
      {
        label: '厂家',
        data: '1',
        unit:''
      }, {
        label: '规格型号',
        data: '2',
        unit:'qq'
      },
    ]
  }])
  useEffect(() => {


  }, [])

  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>
        <div className='main'>

          <Titlelayout title="设备选择" >
            <div className='left'>
              <Space.Compact
                style={{
                  width: '100%', marginTop: '16px'
                }}
              >
                <Input defaultValue="" placeholder="请输入关键字查询" />
                <div style={{
                  width: '54px', height: '31px', backgroundColor: '#f5f7fa', border: '1px solid #d2d2d2', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}><SearchOutlined style={{ fontSize: '20px', color: '#b4b5b6' }} /></div>
              </Space.Compact>
              <Divider dashed style={{ marginTop: '16px', marginBottom: '16px' }} />
              <Tree
                treeData={treeData}
                defaultExpandParent
                selectedKeys={selectedId}
                onSelect={onSelect}
                fieldNames={{ title: 'title', key: "key", children: 'children' }}
              />
            </div>
          </Titlelayout>

          <div className='right'>
            <Select style={{ width: 230 }} defaultValue={0} value={deviceName} options={deviceList} onChange={changeDevice}></Select>
            <Divider dashed style={{ marginTop: '16px', marginBottom: '16px' }} />
            <div className='chart'>
              <div style={{ width: '231px', height: '240px', border: '1px solid #d2d2d2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>
                <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" width={180} />
              </div>
              <div className='chartRight'>

                {deviceInfo.map(item => {
                  return <div>
                    <Divider dashed style={{ width: '100%' }}>{item.label}</Divider>
                    <div  className='deviceBox'>{item.data.map(it => {
                      return <div className='deviceItem'>
                        <span style={{width:'120px'}}>{it.label}</span>
                        <div className='deviceValue'>
                          <span>{it.data}</span>
                          <span>{it.unit}</span>
                        </div>
                      </div>
                    })}</div>
                  </div>
                })}
              </div>
            </div>

          </div>
        </div>
      </Mainbox>
    </Pagecount>
  )
}
