import React, { useContext, useEffect, useState } from 'react'
import { Form,Divider,Row,Col,Select,Input } from 'antd'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import style from './style.module.less'
import CustContext from '@com/content'

const {TextArea}=Input  
export const Addmodal = ({addModalRef,areaList,...other}) => {

    const list =Array(6).forEach((it,index)=>{it=index+1})
   
 useEffect(()=>{
    areaList?.shift()
    console.log(areaList)
 },[])
    return (
        <Modal mold="cust" ref={addModalRef} {...other}>
            <BlueColumn name="新增园区路灯" styled={{ padding: '24px 0px' }}></BlueColumn>
            <Form
             colon={false}
             labelCol={{
                 span: 6
             }}
            >
            <Row className={style.customItem}>
                <Col flex={1}>
                    <Form.Item label="所属区域" name="areaId" >
                        <Select 
                        fieldNames={{
                            label: "name",
                            value:  "id",
                        }}
                        options={
                            areaList
                        }
                        ></Select>
                        
                    </Form.Item>
                    <Form.Item label="安装地址" name="address" >
                        <Input />
                    </Form.Item>
                    <Form.Item label="备注" name="remark" >
                        <TextArea />
                    </Form.Item>
                </Col>
                <Col>
                    <Divider type='vertical' style={{ height: '100%', margin: '0 32px', borderColor: '#bcbcbc' }} dashed />
                </Col>
                <Col flex={1}>
                    <Form.Item label="灯杆名称" name="gatewayId" >
                        <Input />
                    </Form.Item>
                    <Form.Item label="所属控制箱" name="category" >
                        <Input />
                    </Form.Item>
                    <Form.Item label="所属回路" name="sn" > 
                        <Select></Select>
                    </Form.Item>
                    <Form.Item label="控制器编号" name="name">
                        <Input />
                    </Form.Item>  
                </Col>
            </Row>
            </Form>
        </Modal>

    )
}