import React, { useEffect, useState,useContext, useRef, forwardRef, useImperativeHandle, Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Divider, Select, Tree, Row, Col, Input, Form, message, Drawer, Table,Button } from 'antd'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import UseMap from '@com/useMap'
import CustContext from '@com/content.js'
export let  SetPosition =({positionRef,savePosition})=>{
    const loaclRef=useRef()
    return (
        <Modal mold="cust" ref={positionRef} width={800} onOk={()=>{savePosition(loaclRef.current)}} destroyOnClose={true}>
            <BlueColumn name="设置坐标" styled={{padding:'16px 0',color:'#237ae4'}}/>
            <LoaclForm  ref={loaclRef}/>
        </Modal>
    )
}
let LoaclForm =forwardRef((props,ref)=>{
    const [inpvalue,setInpvalue] =useState()
    // const inpvalueRef = useRef()
    const [local,setLoacl] = useState()
    const mapRef = useRef()
    const context =useContext(CustContext)
    console.log(context)
    const search=(text)=>{
        mapRef.current.serachMap.search(inpvalue)
    }
    const setAaddress=(mes)=>{
        console.log(mes)
        setInpvalue(mes.address)
        if(mes.point){
            setLoacl(`${mes.point.lng},${mes.point.lat}`) 
        }else{
            setLoacl(`${mes.lng},${mes.lat}`)
        }
       
    }
    useImperativeHandle(ref,()=>({
        inpvalue,
        local
    }))
    useEffect(()=>{
        setLoacl(context?.lngLat?.current.lngLat)
        setInpvalue(context?.lngLat?.current.lngLatAddress)
    },[context?.lngLat?.current])
    return (
        <>
         <div>
          <span style={{ paddingRight: 16, }} >设备查询</span>
          <Input
            style={{
              width: 565,
              margin: '16px 0'
            }}
            placeholder="输入地址信息"
            value={inpvalue}
            onChange={(e)=>{  setInpvalue(e.target.value)}}
          />
          <Button style={{ width: 80, borderLeft: 'none', background: '#f5f7fa' }} className='searchbtn' onClick={search}>查询</Button>
        </div>
        <div>
            <span style={{paddingRight:32}}>经纬度</span>
            <Input style={{width:645}}  placeholder="点击地图获取经纬度" value={local} ></Input>
        </div>
        <div style={{height:387,marginTop:24,border:'1px solid #d7d7d7'}}>
        <UseMap setAaddress={setAaddress} ref={mapRef} lngLat={context?.lngLat?.current.lngLatAddress}/>
        </div>
        
        </>
    )
})