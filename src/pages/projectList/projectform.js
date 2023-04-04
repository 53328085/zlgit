import React, { useState, useEffect, useImperativeHandle, forwardRef} from "react";
import moment from 'moment';
import {
  Form,
  Input,
  Cascader,
  message,
  Row,
  Col,
  Image
} from "antd";
import styled from "styled-components";
import Mapcom from "@com/useMap";
import imgurl from "@imgs"
import Upload from '@com/useUpload'
import {Comipt, Comtext, CdatePicker} from "@com/comstyled"
import projectimg from './projectimg.png'
import projectlog from './projectlog.png'
const Formbox = styled(Form)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(10, 36px);
  gap: 16px 128px;
  grid-auto-flow: column;
  .ant-form-item {
    margin-bottom: 0px;
  }
  .ant-form-item-label {
    flex-basis: 100px;
    padding-right: 10px;
    label {
      color:#fff;
    }
    .ant-form-item-required::before {
      content: ''
    }
    .ant-form-item-required::after {
      content: "*";
      color: #fff;
    }
  }

  .remark {
    grid-row: 7 / 10;
  }
  /* .upload {
    grid-row: 4 / 7;
    .ant-form-item-control-input-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 32px;
    }
   
  } */
  .upload {
    grid-row: 4 / 7;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 16px;
    .ant-form-item-row {
       height: 140px;
      }
    .ant-form-item-control-input-content {
        display: grid;
        grid-template-rows: 116px 1fr;
        row-gap: 8px;
        width: 200px;
        height: 140px;
        .img {
          border: 1px dotted #dedede;
          display: flex;
        }
      }
    
    }
  .address {
    grid-column: 2;
   // grid-row: 1/ 3;
  }
  .map {
    grid-column: 2;
    grid-row: 3 / -1;
    width: 487px;
    justify-self: end;
  }
  .lnglat {
    grid-column: 2;
    grid-row: 2 / 3;
  }
  .ant-btn-default,
  .ant-btn-primary {
    width: 96px;
    height: 36px;
    line-height: 36px;
    padding: 0;
    font-size: 14px;
  }
`;
const Info = styled.span`
  font-size: 12px;
  color: rgba(0,0,0,0.85);
`
 function Set(props, ref) {
  const [form] = Form.useForm();
  const { Item } = Form;
  const { TextArea } = Input;
  /* "validStageTime": "2023-02-01T00:14:31.889Z",
  "name": "string",
  "address": "string",
  "lng": 0,
  "lat": 0,
  "imgLogo": "string",
  "imgProject": "string",
  "remark": "string" */
  
  const params = {
    name: "",
    validStageTime: moment(), //项目有效期
     imgLogo: projectlog,
     imgProject: projectimg,
    address: "",
   // LineAnalysisEnabled: 0,
    //lng: "",
   // lat: "",
    lngLat: '',
    remark: "", //备注
  };
  const [initialValues] = useState(params);
 
 
  const [imgLogo, setImgLogo] = useState(projectlog)
  const [imgProject, setImgProject] = useState(projectimg)
  const setAaddress = ({
    lng = "",
    lat = "",
    address = "", 
  } = {}) => {
    form.setFieldsValue({
      lng,
      lat,
      address,
    });
  };
 
  
 
  const onSubmint =async () => {
   return  new Promise((resolve, reject) => {
    form.validateFields().then(res => {
      let {validStageTime, lng, lat, ...other} = res;
      other['lngLat'] = lng + ','+lat;
     
      const params = Object.assign({}, other, {imgLogo, imgProject, validStageTime: validStageTime.format('YYYY-MM-DD')})
       resolve(params)
    }).catch(e => {
        console.log(e)
    })
   })
    
 


    

 
   
 /*   return
   let fileds = form.getFieldValue()
   let {validStageTime, lng, lat, ...other} = fileds;
   other['lngLat'] = lng + ','+lat;
  
   const params = Object.assign({}, other, {imgLogo, imgProject, validStageTime: validStageTime.format('YYYY-MM-DD')})
   
   return params; */
  }  

  useImperativeHandle(ref, () => ({
    onSubmint
  }));
  return (
    <Formbox
      form={form}
      initialValues={params}
      labelAlign="left"
      size="middle"
      requiredMark="optional"
      colon={false}

    >
      <Item label="项目ID">
        <Comipt placeholder="系统自增项目ID" disabled />
      </Item>
      <Item label="项目名称" required name="name" rules={[
        {
          required: true 
        }
      ]}>
        <Comipt placeholder="请输入项目名称" />
      </Item>
      <Item label="项目有效期" required name="validStageTime" rules={[
        {
          required: true 
        }
      ]}>
        <CdatePicker placeholder="请选择项目有效期" format="YYYY-MM-DD" />
      </Item>
      {/*  imgLogo: "",
    imgProject: '', */}
      <div className='upload'>
         <Item label="项目logo" className="left" >
           <div className="img">
           <Item nostyle name="imgLogo" rules={
            [
             {
              required: true,
              message: '请上传项目logo'
            }
            ]
           }>
            <Upload wpx={212} hpx={32} swpx={155} shpx={32} style={{padding: '16px'}} getfile={setImgLogo} /> 
            </Item>
           </div>
           <Info>（图片大小为: 212*32 png 格式)</Info>
         </Item>
         <Item label="项目图片" required>
           <div className="img">
            <Item nostyle  name="imgProject" rules={
              [
              {
                required: true,
                message: '请上传项目图片'
              }
             ]
           }>
            <Upload wpx={248} hpx={168} swpx={200} shpx={116} getfile={setImgProject} /> 
            </Item>
           </div>
           <Info>（图片大小为: 248*168像素 png 格式)</Info>
         </Item>
      </div>
     {/*  <Item label="项目图片" className="upload">
        <Image src={imgurl['projectimg']} height={116}></Image>
        <div style={{border: "1px dotted #9c9ea4", display: 'flex'}}>
           <Upload shpx={116} wpx={248} hpx={168}  />
        </div>
      </Item> */}
      <Item label="项目备注" name="remark" className="remark">
        <Comtext  placeholder="请输入备注0-99字" maxLength={99} h="140px" />
      </Item>
      <Item label="项目地址" className="address" name="address" tooltip="请从地图上点击获取">
       {/*  <Item noStyle>
          <Cascader
            options={options}
            defaultValue={defaultAdress}
            value={addressVal}
            onChange={changeaddress}
            showSearch
            placeholder="请选择或输入省/市/区"
            style={{
              marginBottom: "16px",
            }}
          />
        </Item> */} 
          <Comipt placeholder="请输入项目的详细地址" /> 
      </Item>
      <Item label="经纬度"  className="lnglat" tooltip="请从地图上点击获取">
        <Row gutter={16}>
          <Col span={12}>
            <Item name="lng" rules={[
        {
          required: true,
          message: '请从地图上点击获取'
        }
      ]}>
              <Comipt placeholder="经度" />
            </Item>
          </Col>
          <Col span={12}>
            <Item name="lat" rules={[
        {
          required: true,
          message: '请从地图上点击获取'
        }
      ]}>
              <Comipt placeholder="纬度" />
            </Item>
          </Col>
        </Row>
      </Item>
      <div className="map">
        <Mapcom setAaddress={setAaddress} initialValues={initialValues} />
      </div>
    </Formbox>
  );
}
export default forwardRef(Set)