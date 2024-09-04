import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Space, Button, message, Input, Divider, Tree, Select, Image } from 'antd'
import { selectcurlRommid, selectProjectId,selectOneLevelDefaultId } from "@redux/systemconfig";
import Titlelayout from '@com/titlelayout'
import { useSelector, useDispatch } from 'react-redux'
import Pagecount from "@com/pagecontent";
import { SpareParts, distributionRoom } from '@api/api.js'
import { SearchOutlined } from '@ant-design/icons'
import Cempty from '@com/useEmpty'

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
  const areaId = useSelector(selectOneLevelDefaultId)
  const projectId = useSelector(selectProjectId)
  const roomId = useSelector(selectcurlRommid)
  const [treeData, setTreeData] = useState([])
  const [selectedInfo, setSelectedInfo] = useState()
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState([])
  const getQueryLedger=(id)=>{
    SpareParts.QueryLedger(projectId, id).then(res=>{
      if(res.success){
        setDeviceInfo(res.data)
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const onSelect = (selectedKeys, info) => {
    console.log(selectedKeys, info.node)
    setSelectedInfo(info.node)
    setSelectedKeys(selectedKeys)
    getQueryLedger(info.node.value)
  }

  const [name,setName]=useState('')
  const onChangeName=(e)=>{
    setName(e.target.value)
  }
  const getDeviceInfo = () => {
    SpareParts.QueryLedgerTree(projectId, areaId,name).then(res=>{
      if(res.success){
        setTreeData(res.data)
      }else{
        message.error(res.errMsg)
      }
    })
  }
  useEffect(() => {
    getDeviceInfo()
  }, [projectId, areaId])

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
                <Input value={name} placeholder="请输入关键字查询" onChange={onChangeName}/>
                <div style={{
                  width: '54px', height: '31px', backgroundColor: '#f5f7fa', border: '1px solid #d2d2d2', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }} onClick={getDeviceInfo}><SearchOutlined style={{ fontSize: '20px', color: '#b4b5b6' }} /></div>
              </Space.Compact>
              <Divider dashed style={{ marginTop: '16px', marginBottom: '16px' }} />
              <Tree
                treeData={treeData}
                defaultExpandParent
                selectedKeys={selectedKeys}
                onSelect={onSelect}
                fieldNames={{ title: 'title', key: "value", children: 'children' }}
              />
            </div>
          </Titlelayout>

          <div className='right'>
            <p style={{width:'231px',textAlign:'center'}}>{selectedInfo?.title}</p>
            {/* <Divider dashed style={{ marginTop: '16px', marginBottom: '16px' }} /> */}
            <div className='chart'>
              <div style={{ width: '231px', height: '240px', border: '1px solid #d2d2d2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>
                {deviceInfo&&deviceInfo.image?<Image src={deviceInfo.image} width={180} />:
                <Cempty tip='暂无数据'/>}
              </div>
              <div className='chartRight'>
              <Divider dashed style={{ width: '100%' }}>{deviceInfo?.typeName||''}</Divider>
              <div  className='deviceBox'>
              <div className='deviceItem'>
                        <span style={{width:'120px'}}>设备名称</span>
                        <div className='deviceValue'>
                          <span>{deviceInfo?.deviceName}</span>
                          <span></span>
                        </div>
              </div>
              <div className='deviceItem'>
                        <span style={{width:'120px'}}>设备编号</span>
                        <div className='deviceValue'>
                          <span>{deviceInfo?.sn}</span>
                          <span></span>
                        </div>
              </div>
              <div className='deviceItem'>
                        <span style={{width:'120px'}}>规格型号</span>
                        <div className='deviceValue'>
                          <span>{deviceInfo?.category}</span>
                          <span></span>
                        </div>
              </div>
              <div className='deviceItem'>
                        <span style={{width:'120px'}}>设备类型</span>
                        <div className='deviceValue'>
                          <span>{deviceInfo?.typeName}</span>
                          <span></span>
                        </div>
              </div>
              {deviceInfo?.data&&deviceInfo.data[0]?.data?.length>0?deviceInfo?.data[0]?.data.map(it => {
                      return <div className='deviceItem'>
                        <span style={{width:'120px'}}>{it.label}</span>
                        <div className='deviceValue'>
                          <span>{it.data}</span>
                          <span>{it.unit}</span>
                        </div>
                      </div>
                    }):null}
              </div>
              
                {deviceInfo?.data&&deviceInfo.data.slice(1)?.length>0?deviceInfo?.data.slice(1).map(item => {
                  return <div>
                    <Divider dashed style={{ width: '100%' }}>{item.label}</Divider>
                    <div  className='deviceBox'>{item.data.map(it => {
                      return <div className='deviceItem'>
                        <span style={{width:'120px'}}>{it.label}</span>
                        <div className='deviceValue'>
                          {it.label=='最后一次维护时间'?<span>{it.data.slice(0,10)}</span>:
                          it.label=='维护详情'?<span style={{overflowX:'auto'}}>{it.data}</span>:
                          <span>{it.data}</span>}
                          <span>{it.unit}</span>
                        </div>
                      </div>
                    })}</div>
                  </div>
                }):null}
              </div>
            </div>

          </div>
        </div>
      </Mainbox>
    </Pagecount>
  )
}
