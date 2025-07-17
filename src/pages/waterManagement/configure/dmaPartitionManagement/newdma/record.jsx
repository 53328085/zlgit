import React, {useMemo} from 'react'
import {Form, Select, Row, Col, Input,InputNumber, Cascader, Radio, message} from "antd" 
import {useRequest} from "ahooks"
import {useNavigate,  useLocation} from "react-router-dom"
import {useGetTree,useInsert,useGetDetail,useUpdate} from "../api"
import {rules, options,partType,rateType, iscomputer} from "../data"
import { CustButton } from '@com/useButton'
import {isObject} from "@com/usehandler"
export default function Index({projectId, id}) {

 const { pathname, state,hash } = useLocation();
 const navigate = useNavigate()

 const [form] = Form.useForm()

const isEdit = useMemo(()=> {
 return  Number.isInteger(parseInt(id))
}, [id])

const getRecordDtl =async() => {
    try {
       if(![id, projectId].some(d => Number.isInteger(d))) return
      let {data, success} = await useGetDetail({id, projectId})
      if(success && isObject(data)) {
         form.setFieldsValue(data)
      }
    } catch (error) {
      
    }
}
const {refresh}  =  useRequest(getRecordDtl, {
  refreshDeps: [id, projectId],
})

  const getTree =async()=> {
    try {
        if(!Number.isInteger(projectId)) return
        const {success, data, errMsg} = await useGetTree({projectId})
        if(success, Array.isArray(data)) {
            return data
        }else {
            
            if(!success) return Promise.reject(errMsg)
            return []
        }
    } catch (error) {
        
    }
    
     
  }
  const {data} = useRequest(getTree, {
    refreshDeps: [projectId]
  })
  const onRest =()=> {
    form.resetFields()
  }
  const onSubmit=async()=> {
   try {
    let {code,level,parentId,...values} = await form.validateFields()
   
    values["parentId"] = parentId[parentId?.length - 1]
    values["isComputeLeakage"] = values["isComputeLeakage"]=="1"
     values["isComputeNrw"] = values["isComputeNrw"]=="1"
    let handler =isEdit ? useUpdate : useInsert
    let {success, data,errMsg} = await handler({projectId}, {...values, projectId})
    if(success) {
        message.success(isEdit ? "修改成功" : "新增成功")
        if(isObject(data)) {
          data["isComputeLeakage"] = Number(data["isComputeLeakage"])?.toString()
          data["isComputeNrw"] = Number(data["isComputeNrw"])?.toString()
          form.setFieldsValue(data)
        }  

        if(isEdit) {
          refresh()
        }else {
          navigate(pathname+`?item=1&id=${data.id}` + "#edit", { state, replace: true });
        } 
    }else{
        if(!success) {
            message.warning(errMsg || "数据错错")
        }
    }
   } catch (error) {
    
   }
  }
  return (
      <Form form={form} className='record' labelCol={{flex: "6em"}}  >
        <div className="head">
            <div className="title">
                分区基本信息
            </div>
        </div>
        <Row gutter={32}>
            <Col span={8}>
            <Form.Item label="上级节点" name="parentId" rules={rules}>
<Cascader options={data} fieldNames={{label: "name", value: "id"}}></Cascader>
            </Form.Item>
            </Col>
            <Col>
            <Form.Item label="分区名称" name="name" rules={[
                ...rules,
                {
                    whitespace: true
                }
            ]}>
<Input style={{width: "100%"}}></Input>
            </Form.Item>
            </Col>
        </Row>
        <Row gutter={32}>
          <Col span={8}>
          <Form.Item label="分区编号" name="code" >
<Input placeholder='自动生成' disabled />
          </Form.Item> 
          </Col>
          <Col span={8}>
          <Form.Item label="分区级别" name="level" >
            <Input disabled placeholder="自动生成"></Input>
          </Form.Item> 
          </Col>
        </Row>
        <Row gutter={32}>
          <Col span={8}>
          <Form.Item label="所属类型"  name="partitionType" rules={rules} initialValue={1}>
<Select options={options} style={{width: "100%"}} />
          </Form.Item> 
          </Col>
          <Col span={8}>
          <Form.Item label="分区类别" name="partitionCategory" initialValue={1}   >
            <Radio.Group  optionType="button" options={partType}
        buttonStyle="solid"></Radio.Group>
          </Form.Item> 
          </Col>
        </Row>
        <Row gutter={32}>
          <Col span={8}>
          <Form.Item label="管网总长度"  name="pipeLength"  >
 <Input></Input>
          </Form.Item> 
          </Col>
          <Col span={8}>
          <Form.Item label="大用户数量" name="largeConsumerNumber"   >
            <Input></Input>
          </Form.Item> 
          </Col>
        </Row>
        <Row gutter={32}>
          <Col span={8}>
          <Form.Item label="分区面积"  name="area"  >
 <Input></Input>
          </Form.Item> 
          </Col>
          <Col span={8}>
          <Form.Item label="备注" name="remark"   >
            <Input></Input>
          </Form.Item> 
          </Col>
        </Row>
        <div className="head">
            <div className="title">
                分区配置
            </div>
        </div>
        <Row gutter={32}>
        <Col span={8}>
          <Form.Item label="是否计算漏损" name="isComputeLeakage"  labelCol={{flex: "7em"}} initialValue="1"   >
            <Radio.Group  optionType="button" options={iscomputer}
        buttonStyle="solid"></Radio.Group>
          </Form.Item> 
          </Col>
          <Col span={8}>
          <Form.Item label="计算产销差"  name="isComputeNrw"  labelCol={{flex: "9em"}} initialValue="1"  >
          <Radio.Group  optionType="button" options={iscomputer}
        buttonStyle="solid"></Radio.Group>
          </Form.Item> 
          </Col>
        </Row>
        <Row gutter={32}>
        <Col span={8}>
          <Form.Item label="MNF区间"   labelCol={{flex: "7em"}} style={{marginBottom: "0px"}} >
            <Row gutter={16}>
                <Col span={10}>
                <Form.Item name="mnfStart">
                    <InputNumber addonAfter="点  至"></InputNumber>
                </Form.Item>
                </Col>
                <Col span={10}>
                <Form.Item name="mnfEnd">
                    <InputNumber addonAfter="点"></InputNumber>
                </Form.Item>
                </Col>
            </Row>
          </Form.Item> 
          </Col>
          <Col span={8}>
          <Form.Item label="用水表抄见率下限"  name="waterMeterReadingRateLowerLimit" rules={rules} labelCol={{flex: "9em"}} >
   <InputNumber addonAfter="%"></InputNumber>
          </Form.Item> 
          </Col>
        </Row>
        <Row gutter={32}>
            <Col span={8}>
            <Form.Item label="漏损生成频率" name="createLeakageRateBy" initialValue={2} labelCol={{flex: "7em"}}   >
            <Radio.Group  optionType="button" options={rateType}
        buttonStyle="solid"></Radio.Group>
          </Form.Item> 
            </Col>
            <Col span={8}>
          <Form.Item label="漏损率控漏目标"  name="leakageRateTarget" rules={rules} labelCol={{flex: "9em"}} >
   <InputNumber addonAfter="%"></InputNumber>
          </Form.Item> 
          </Col>
        </Row>
        <div className='opt'>
           <CustButton onClick={onRest} type="default">重置</CustButton>
           <CustButton onClick={onSubmit}>提交</CustButton>
        </div>
      </Form>
    
  )
}
