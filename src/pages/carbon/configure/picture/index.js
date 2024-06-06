import React, {useEffect, useRef, useState} from 'react'
 
import styled from "styled-components";
import {useOutletContext} from 'react-router-dom' 
import {useSelector} from "react-redux";
import {CustButtonT} from '@com/useButton'
import Cupload from "@com/useUpload.js" 
import {selectProjectId} from '@redux/systemconfig.js'
import { message  } from 'antd';
import {UpdateEnergyImage} from '@api/api.js'
import {Cspin} from "@com/comstyled"
import {useProjectPhotoQuery, useUpdateImgMutation} from "@redux/carbon"
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
        display: flex;
        align-items: center;
        height: 32px;
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
   const {projectId} = useOutletContext()  
   const [loading, setLoading] = useState(false)

   
   const energyImage = useRef()

   const spinning = useRef(false)

  const onChnage = (e) => {      
       energyImage.current = e;
     //setEnergyImage(e)
  }
  const [uploadImg, {isLoading}] = useUpdateImgMutation()
  const onSave =async () => {
    try {
        if(!energyImage.current) return message.warning("请选择图片")
     let params = {
        projectId,
        body: {
         image: energyImage.current,
        } 
     }
     
     let {success,errMsg} = await uploadImg(params).unwrap()
     if(success) {
        message.success('保存成功')
        energyImage.current = null
     }else {
        message.warning(errMsg || '数据出错')
        energyImage.current = null
     }
    } catch (error) {
      
    }
    
  }

// 获取图片
const {isSuccess: imgsuc, data: imgData, refetch } = useProjectPhotoQuery(projectId, {
   skip: !Number.isInteger(projectId)
  })
 
  if(imgsuc) {
    
    energyImage.current = imgData;
    spinning.current = false
  // setEnergyImage(data)
 //  setSpinning(false)
  }else {
 //  setEnergyImage('')
 //  setSpinning(false)
  }


/*   const query =async () => {
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
  }, [projectId]) */
  return (
     <Cspin spinning={spinning.current} tip="图片下载中……">
     <Main>
        <div className='title'>
            <span className='text' onClick={refetch}>园区图片</span>
            <CustButtonT onClick={onSave} loading={isLoading} text="saveImage" />
        </div>
        <div>
           <div className='imgbox'>
                <Cupload wpx={1368} hpx={800} swpx={400} shpx={235} onChange={onChnage} maximum={800} value={energyImage.current}  /> 
           </div>
           <div className='tip'>（图片大小为: 1368*800 png或jpg 格式,不超过800KB）</div>
        </div>
     </Main>
     </Cspin>
  )
}
