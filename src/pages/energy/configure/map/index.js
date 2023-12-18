import React, {useEffect, useRef, useState} from 'react'
 
import styled from "styled-components";
import {useSelector} from "react-redux";
import {CustButton} from '@com/useButton'
import Cupload from "@com/useUpload.js" 
import {selectProjectId} from '@redux/systemconfig.js'
import { message, Spin } from 'antd';
import {UpdateEnergyImage} from '@api/api.js'
const Main = styled.div`
   display: grid;
   grid-template-rows: 64px 1fr;
   row-gap: 16px;
   .title {
      padding: 16px;
      border: 1px solid #d7d7d7;
      border-radius: 4px;
       background-color: #fff;
       display: flex;
       align-items: center;
       justify-content: space-between;
      .text {
        padding-left: 16px;
        border-left: 4px solid #237ae4;
        display: inline-block;
      }
   }
   .imgbox {
    display: flex;
     background-color: #fff;
     width: 432px;
    height: 264px;
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(215, 215, 215, 1);
    border-radius: 4px;
    padding: 16px;
   }
   .tip {
     color: #999;
     text-align: center;
     width: 432px;
     margin-top: 16px;
   }
`
export default function Index() {
   const projectId = useSelector(selectProjectId)  
   const [energyImage, setEnergyImage]= useState('')
   const [loading, setLoading] = useState(false)
   const [spinning, setSpinning] = useState(false)
  const onChnage = (e) => {
     setEnergyImage(e)
  }
  const onSave =async () => {
    try {
        if(!energyImage) return message.warning("请选择图片")
     let params = {
        projectId,
        energyImage,
     }
     setLoading(true)
     let {success,errMsg} = await UpdateEnergyImage.update(params)
     if(success) {
        message.success('保存成功')
        setLoading(false)
        query()
     }else {
        message.warning(errMsg || '数据出错')
        setLoading(false)
     }
    } catch (error) {
        setLoading(false)
    }
    
  }

  const query =async () => {
       try {
         setSpinning(true)
        let {success, data} = await  UpdateEnergyImage.query(projectId)
        if(success) {
            setEnergyImage(data)
            setSpinning(false)
        }else {
            setEnergyImage('')
            setSpinning(false)
        }
       } catch (error) {
          setEnergyImage('')
          setSpinning(false)
       }
            
  }

  useEffect(() => {
    if(!projectId) return
     query()
  }, [projectId])
  return (
     <Spin spinning={spinning} tip="图片下载中……">
     <Main>
        <div className='title'>
            <span className='text'>园区图片</span>
            <CustButton onClick={onSave} loading={loading}>保存图片</CustButton>
        </div>
        <div>
           <div className='imgbox'>
                <Cupload wpx={1368} hpx={800} swpx={400} shpx={235} onChange={onChnage} maximum={800} value={energyImage}  /> 
           </div>
           <div className='tip'>（图片大小为: 1368*800 png或jpg 格式,不超过800KB）</div>
        </div>
     </Main>
     </Spin>
  )
}
