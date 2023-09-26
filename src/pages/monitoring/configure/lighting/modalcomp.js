import React, { useContext, useEffect, useState,forwardRef,useImperativeHandle, useMemo  } from 'react'
import { Form,Divider,Row,Col,Select,Input,Upload,Button } from 'antd'
import Table from '@com/useTable'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import style from './style.module.less'
import CustContext from '@com/content'
import WarningPng from '@imgs/warning.png'
import upCloud from './imgs/upcloud.png'
const {TextArea}=Input  
const {Dragger}=Upload
//新增Modal
export const Addmodal = ({addModalRef,areaList,addform=null,name="灯杆名称",title,levelname,...other}) => {
  const [transitionName,setTransition]=useState(undefined)
  const [maskTransitionName,setMaskTransitionName]=useState(undefined)
   const areas = areaList?.filter(it=>it.id!==0)
   let list=[]
   for (let i=0; i<Array(6).length; i++){
    list.push({
        label:i+1,
        value:i+1,
    })
   }
    return (
        <Modal mold="cust" ref={addModalRef} {...other} transitionName={transitionName} maskTransitionName={maskTransitionName}  footer={[
          <Button onClick={()=>{addModalRef.current.onCancel()}}>取消</Button>,
          <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={other.onOk}>保存</Button>,
          <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} 
          onClick={()=>{other.onSure();setTransition("");setMaskTransitionName("")}}>应用</Button>,
      ]} >
            <BlueColumn name={title} styled={{ padding: '24px 0px' }}></BlueColumn>
            <Form
             colon={false}
             form={addform}
             labelCol={{
                 span: 6
             }}
            >
            <Row className={style.customItem}>
                <Col flex={1}>
                    <Form.Item label={levelname} name="areaId" >
                        <Select 
                        showSearch
                        filterOption={(val, opts) => {
                          if (opts.name.includes(val)) {
                            return true
                          } else {
                            return false
                          }
                        }}
                        fieldNames={{
                            label: "name",
                            value:  "id",
                        }}
                        options={
                            areas
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
                    <Form.Item label={name} name="name" >
                        <Input />
                    </Form.Item>
                    <Form.Item label="所属控制箱" name="boxName" >
                        <Input />
                    </Form.Item>
                    <Form.Item label="所属回路" name="controlLine" > 
                        <Select options={list}></Select>
                    </Form.Item>
                    <Form.Item label="控制器编号" name="sn">
                        <Input />
                    </Form.Item>  
                </Col>
            </Row>
            </Form>
        </Modal>

    )
}
//编辑Modal
export const EditModal=(props)=>{
    const {editModalRef,editform,areaList,levelname,onOk,...other} =props;
    const areas = areaList?.filter(it=>it.id!==0)
    let list=[]
    for (let i=0; i<Array(6).length; i++){
     list.push({
         label:i+1,
         value:i+1,
     })
    }
    const MemoModal=useMemo(()=>{
      return( <Modal mold="cust" ref={editModalRef} {...other} footer={[
        <Button onClick={()=>{editModalRef.current?.onCancel()}}>取消</Button>,
        <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={onOk}>保存</Button>,
        <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} 
        onClick={ other.onSureEditModal}>应用</Button>,
    ]}>
      <BlueColumn name="编辑园区路灯" styled={{ padding: '24px 0px' }}></BlueColumn>
      <Form
       colon={false}
       form={editform}
       labelCol={{
           span: 6
       }}
      >
      <Row className={style.customItem}>
          <Col flex={1}>
              <Form.Item label={levelname} name="areaId" >
                  <Select 
                  showSearch
                  filterOption={(val, opts) => {
                    if (opts.name.includes(val)) {
                      return true
                    } else {
                      return false
                    }
                  }}
                  fieldNames={{
                      label: "name",
                      value:  "id",
                  }}
                  options={
                      areas
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
              <Form.Item label="灯杆名称" name="name" >
                  <Input />
              </Form.Item>
              <Form.Item label="所属控制箱" name="boxName" >
                  <Input />
              </Form.Item>
              <Form.Item label="所属回路" name="controlLine" > 
                  <Select options={list}></Select>
              </Form.Item>
              <Form.Item label="控制器编号" name="sn">
                  <Input />
              </Form.Item>  
          </Col>
      </Row>
      </Form>
  </Modal>)
     
    },[levelname])
    return (
      <>
       {MemoModal}
      </>  
    )
}

//删除modal组件
export let DeleteModal = ({ DelModalRef, name = '', content = '', ...other }) => {
    return (
      <Modal mold='cust' ref={DelModalRef} {...other} className={style.DelModal}>
        <BlueColumn name={name} styled={{ padding: '24px 0px', color: '#ff4d4f' }} bg={{ backgroundColor: '#ff4d4f' }}></BlueColumn>
        <div>
          <img src={WarningPng} style={{ margin: '0 32px', width: 48, height: 48 }}></img>
          <span>{content}</span>
        </div>
      </Modal>
    )
  }

//批量上传导入
export let MultImport = ({ modalImportRef, link = '/deviceExcel/gateway.xlsx',name="",uploadprops, ...other }) => {
    return (
      <Modal mold='cust' ref={modalImportRef} {...other}>
        <BlueColumn name={name} styled={{ padding: '24px 0px' }}></BlueColumn>
        <Dragger {...uploadprops}>
          <img src={upCloud}></img>
          <p style={{ margin: '32px 0', fontSize: 16 }}>将文件拖到此处，或<span style={{ color: '#237ae4', textDecoration: 'underline', }}>点击上传</span></p>
          <a style={{ color: '#237ae4', textDecoration: 'underline', fontSize: 16 }} onClick={(e) => { e.stopPropagation() }} href={link}>下载模板</a>
        </Dragger>
      </Modal>
    )
  }

//批量上传报错
export let ErrorMessage=forwardRef(
    (props,ref)=>{
      const {ErrModalRef,...other}=props
      const [list,setList]=useState([])
     useImperativeHandle(ref,()=>({
      setList
     }))
      const columns=[{
        title:'错误行',
        dataIndex:'row'
      },{
        title:'错误原因',
        dataIndex:'cause'
      }]
      return (
        <Modal mold='cust' ref={ErrModalRef} {...other}>
           <Table columns={columns} dataSource={list} style={{marginTop: 32}}></Table>
        </Modal>
       
      )
    }
  )