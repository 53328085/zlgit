import React, { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectProjectId, getCurrProjectInfo } from '@redux/systemconfig.js'
import styled from 'styled-components';
import companyImg from './company.png'
import { useReactive } from 'ahooks';
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';

const MainBox = styled.div`
width: 460px;
height: 200px;
background-color: #fff;
border-radius: 4px;
padding: 16px;
display: flex;
align-items: center;
.company{
  width: 188px;
  height: 100%;
  .headerTitle{
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding-left: 16px;
    border-left: 4px solid #237ae4;
  }
  .dataItem{
    display: flex;
    align-items: center;
    height: 24px;
    margin-top: 6px;
    font-size: 13px;
    color: #666;
    &:nth-child(5){
      align-items: flex-start;
      margin-top: 11px;
    }
    .square{
      width: 8px;
      height: 8px;
      margin-right: 16px;
    }
    .items{
      width: 150px;
      line-height: 16px;
    }
  }
}
`

export default function DefaultHome(props) {
  const projectId = useSelector(selectProjectId)
  const dispatch = useDispatch()
  const { GetProjectInfo } = HomeRuntime

  const state = useReactive({
    projectName: '诚办企业服务有限公司',
    deviceNum: 0,
    gatewayNum: 0,
    projectManager: '张三',
    mobile: '13588566548',
    address: '浙江省杭州市滨江区月明路560号',
    projectImage:'',
  })

  useEffect(() => {
    if (props.type == 'runtTime') {
      GetProjectInfo(projectId).then(res => {
        let {success, data} = res
          if(success){
            if(data){
              dispatch(getCurrProjectInfo(data))
              state.projectName = data.projectName
              state.deviceNum = data.deviceNum
              state.gatewayNum = data.gatewayNum
              state.projectManager = data.projectManager
              state.mobile = data.mobile
              state.address = data.address
              state.projectImage = data.projectImage
            }
          }else{
            dispatch(getCurrProjectInfo({}))
            message.error(res.errMsg)
          }
      }).catch(e => {
           dispatch(getCurrProjectInfo({}))
      })
    } else if (props.type == 'configure') {
      return;
    }
  }, [])
  return (
    <MainBox>
      <div className='company'>
        <div className='headerTitle'>{state.projectName}</div>
        <div className='dataItem'>
          <div className='square' style={{ backgroundColor: '#237ae4' }}></div>
          <div className='items'>测点数量： {state.deviceNum}</div>
        </div>
        <div className='dataItem'>
          <div className='square' style={{ backgroundColor: '#237ae4' }}></div>
          <div className='items'>网关数量： {state.gatewayNum}</div>
        </div>
        <div className='dataItem'>
          <div className='square' style={{ backgroundColor: '#008000' }}></div>
          <div className='items'>{state.projectManager} / {state.mobile}</div>
        </div>
        <div className='dataItem'>
          <div className='square' style={{ backgroundColor: '#333' }}></div>
          <div className='items'>{state.address}</div>
        </div>
      </div>
      <img src={ state.projectImage ? state.projectImage : companyImg} style={{ width: 240, height: 168 }}></img>
    </MainBox>


  )
}
