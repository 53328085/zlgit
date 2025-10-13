import React, { useEffect, useRef, useState } from 'react'

import styled from "styled-components";
import { useSelector } from "react-redux";
import { CustButtonT, CustButton } from '@com/useButton'
import { useOutletContext } from 'react-router-dom'
import Cupload from "@com/useUpload.js"
import { selectProjectId, selectOneLevel } from '@redux/systemconfig.js'
import { message, Form, Select, Input, InputNumber, Space, Divider, Button, Checkbox, Tag, Alert } from 'antd';
import { UpdateEnergyImage } from '@api/api.js'
import { Cspin } from "@com/comstyled"
import { isObject } from '@com/usehandler'
import { AreaSelect } from "@com/useSerach/comhead"
import { useQueryGirdCabientList, useGetAreaImage, useGetAreaHots, useUpdateAreaImageAndHot } from './api'
const Ctag = styled(Tag)`
  &&{
    position: absolute;
    left: ${props => props.left + 'px'};
    top: ${props => props.top + 'px'};
    transform: translate(-50%, -50%);
  }
`
const Main = styled.div`
   display: grid;
   grid-template-rows: 64px 300PX auto  1fr;
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
        border-left: 4px solid ${props => props.theme.primaryColor};
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
   .operation{
     display: flex;
     column-gap: 16px;
     align-items: center;
     }
   .setwrap {
     display: flex;
     column-gap: 16px;
    .set {
      position: relative;
      padding: 0;
  
      flex:0 0 1368px;
      height: 800px;
      background-color: ${props => props.theme.primaryderived || "#fffffff"};
      .img{
         position: absolute;
      }
    }
    .point {
      flex: 1 0 294px;
      overflow: auto;
    }
  }
`

export default function Index() {
   const [form] = Form.useForm();
   let { exparams } = useOutletContext()
   // let { areaId } = exparams
   const projectId = useSelector(selectProjectId)

   const oneLevel = useSelector(selectOneLevel).slice(1);
   const [energyImage, setEnergyImage] = useState('')
   const [loading, setLoading] = useState(false)
   const [spinning, setSpinning] = useState(false)
   const [area, setArea] = useState([])
   const [curarea, setCurarea] = useState(null)
   const [list, setList] = useState([])
   const [cabientData, setCabientData] = useState([]);
   const [stationId, setStationId] = useState();
   const [areaHotsData, setAreaHotsData] = useState();
   const [areaId, setAreaId] = useState(null);
   const onChnage = (e) => {
      setEnergyImage(e)
   }
   // 获取站点数据函数
   const RuntimeCabient = async () => {
      if (projectId == undefined) return
      try {
         const params = {
            projectId,
            areaId,
            stationId: 0,
         }

         let { success, data, total, errMsg } = await useQueryGirdCabientList(params)

         if (success) {
            // 检查数据结构是否正确
            if (data && Array.isArray(data) && data.length > 0) {
               setCabientData(data)
               setStationId(data[0].id)
            } else {
               setCabientData([])
               setStationId()
            }
         } else {
            setCabientData([])

            setStationId()
         }
      } catch (error) {
         setCabientData([])

         setStationId()
      }
   }
   const stationChange = (val) => {
      setStationId(val)
   }
   const searchAreaChange = (val) => {
      setAreaId(val)
   }

   const onSave = async () => {
      try {
         if (!energyImage) return message.warning("请选择图片")

         setLoading(true)
         let gridTiedCabinetHots = []
         let values = await form.validateFields();

         for (let [key, value] of Object.entries(values)) {
            console.log(key, value)
            if (value.c && value.checked) {
               let [x, y] = value.c.split(',');
               if (parseFloat(x) && parseFloat(y)) {
                  gridTiedCabinetHots.push({ gridTiedCabinetId: parseInt(key), hotX: x, hotY: y, hotC: value.r })
               }
            }
         }
         let params = {
            areaId,
            base64Image: energyImage,
            gridTiedCabinetHots,
         }
         let { success, errMsg } = await useUpdateAreaImageAndHot({ projectId }, params)
         if (success) {
            message.success('保存成功')
            setLoading(false)
            GetAreaImage()
            GetAreaHotsData()
         } else {
            message.warning(errMsg || '数据出错')
            setLoading(false)
         }
      } catch (error) {
         console.log(error)
         setLoading(false)
      }

   }
   // const getArea = async () => {
   //    try {
   //       let { success, data } = await UpdateEnergyImage.AeraQueryAll(projectId)
   //       if (success && Array.isArray(data)) {
   //          setArea(data)
   //       } else {
   //          setArea([])
   //       }
   //    } catch (error) {
   //       console.log(error)
   //    }

   // }
   const GetAreaImage = async () => {
      try {
         if (projectId == undefined || areaId == undefined) return
         setSpinning(true)
         let { success, data } = await useGetAreaImage({ projectId, areaId })

         if (success && isObject) {
            let { base64Image } = data;

            setEnergyImage(base64Image)
            setSpinning(false)
         } else {
            setEnergyImage('')
            setSpinning(false)
         }
      } catch (error) {
         setEnergyImage('')
         setSpinning(false)
      }

   }
   const GetAreaHotsData = async () => {
      try {

         if (projectId == undefined || areaId == undefined) return
         setSpinning(true)
         let { success, data } = await useGetAreaHots({ projectId, areaId })
         if (success && isObject) {
            let { areaHots } = data;
            setAreaHotsData(areaHots)
            if (Array.isArray(areaHots)) {
               areaHots.forEach(i => {
                  form.setFieldValue([i.id, 'c'], [i.hotX, i.hotY].join(','));
                  form.setFieldValue([i.id, 'r'], i.hotC);
                  form.setFieldValue([i.id, 'checked'], true);
               })
               let checked = areaHots.map(i => ({ id: i.id, name: i.name, top: i.hotY, left: i.hotX }))
               setList(checked)
            }

            setSpinning(false)
         } else {
            setAreaHotsData([])
            setSpinning(false)
         }
      } catch (error) {
         // console.log(error)
         setEnergyImage('')
         setSpinning(false)
      }

   }
   const getPoint = (e) => {
      if (!Number.isInteger(curarea?.id)) return message.warning('请点击需要设置的区域')
      let { offsetX, offsetY } = e.nativeEvent
      let { id, name } = curarea
      let tip = {
         id: id,
         name,
         left: offsetX,
         top: offsetY
      }
      let arr = [...list]
      console.log(arr)
      let index = arr.findIndex(l => l.id == curarea.id)


      if (index >= 0) {

         arr.splice(index, 1, tip)

      } else {
         arr = [...arr, tip]
      }
      setList(arr)
      form.setFieldValue([curarea.id, 'c'], [offsetX, offsetY].join(','))

   }
   const onset = (f, ar) => {
      console.log(f, ar)
      if (f.target.checked) {
         setCurarea(ar)
      } else {
         form.setFieldValue([ar.id, 'c'], null)
      }
   }

   useEffect(() => {
      if (!projectId) return
      GetAreaImage()
      GetAreaHotsData()
      RuntimeCabient()
      // getArea()
   }, [areaId])
   // useEffect(() => {
   //    if (!projectId) return
   //    RuntimeCabient()
   // }, [projectId])
   useEffect(() => {
      if (oneLevel && Array.isArray(oneLevel) && oneLevel.length > 0) {
         const filter = oneLevel?.filter?.(f => f.id != 0);
         // 如果有数据，设置第一个选项为默认值
         if (filter && filter.length > 0) {
            setAreaId(filter[0].id);
         }
      }

   }, []);
   const msg = (<div style={{ color: "#515151" }}>
      <p>鼠标点击获取热点中心</p>
      <p>默认热点半径40px,最小值16px,可以手动修改</p>
   </div>)
   return (
      <Cspin spinning={spinning} tip="图片下载中……">
         <Main>
            <div className='title'>
               <span className='text'>园区图片</span>
               <div className='operation'>
                  {/* 站点选择
                  <Select
                     style={{ width: "210px" }}
                     onChange={stationChange}
                     options={cabientData}
                     value={stationId}
                     fieldNames={{
                        label: "name",
                        value: "id",
                        options: "options",
                     }}
                  /> */}
                  园区选择
                  {areaId !== null && (
                     <AreaSelect value={areaId} style={{ width: "264px" }} onChange={searchAreaChange} />)}
                  <CustButton onClick={onSave} loading={loading} wh="auto">保存图片及热点</CustButton>
               </div>
            </div>
            <div>
               <div className='imgbox'>
                  <Cupload wpx={1368} hpx={800} swpx={400} shpx={235} onChange={onChnage} maximum={800} value={energyImage} />
               </div>
               <div className='tip'>（图片大小为: 1368*800 png或jpg 格式,不超过800KB）</div>
            </div>
            <Divider>设置图片热点区域</Divider>
            <div className='setwrap'>

               <div className="set">
                  <img src={energyImage} onClick={getPoint} className='img' />
                  {list.map(l => <Ctag left={l.left} top={l.top} key={l.name}>{l.name}</Ctag>)}
               </div>
               <div className='point'>
                  <Form form={form}>
                     {
                        cabientData?.map(a =>
                           <Form.Item label={a.name} key={a.id}>
                              <Space><Form.Item name={[a.id, 'c']} noStyle>
                                 <Input style={{ width: '80px' }} readOnly />
                              </Form.Item>
                                 <Form.Item name={[a.id, 'r']} initialValue={40} noStyle>
                                    <InputNumber min={16} />
                                 </Form.Item>
                                 <Form.Item name={[a.id, 'checked']} valuePropName="checked" noStyle>
                                    <Checkbox onChange={(f) => onset(f, a)} />
                                 </Form.Item>
                              </Space>
                           </Form.Item>
                        )
                     }
                     <Form.Item >
                        <Alert type="info" message={msg}></Alert>
                     </Form.Item>
                  </Form>
               </div>
            </div>
         </Main>
      </Cspin>
   )
}
