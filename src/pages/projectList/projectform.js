import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef} from "react";
import {useSelector} from "react-redux"
import dayjs from 'dayjs';
import {
  Form,
  Input,
  
  Row,
  Col,
  DatePicker,
  
} from "antd";
import {useTranslation} from 'react-i18next'
import styled, {css} from "styled-components";
import Mapcom from "@com/useMap/indexset";
import projectlog from "@imgs/chintlog.png";
import projectimg from "@imgs/projectimg.png";
import Upload from '@com/useUpload'
import {Comipt, Comtext, CdatePicker} from "@com/comstyled"
import { adaptation} from "@redux/systemconfig";
 const formsty=css`
 grid-template-rows: repeat(12, 24px);
 gap: 16px 32px;
 `
 const lablesty=css`
 flex-basis: 85px;
 padding-right: 5px;
 `
const Formbox = styled(Form)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(10, 36px);
  gap: 16px 128px;
  grid-auto-flow: column;
  ${props => props.laptop ? formsty : ''}
  .ant-form-item {
    margin-bottom: 0px;
    .ant-input{
      font-size: ${props => props.laptop ? "12px" : "14px"};
    }
  }
  .ant-form-item-label {
    flex-basis: 100px;
    padding-right: 10px;
    ${props => props.laptop ? lablesty : null};
    label {
      font-size: ${props => props.laptop ? "12px" : "14px"};
    }
    
    
  }
  .smalllog {
    grid-row: 8/10; 
  }
  .remark {
    grid-row: 10/12; //  ${props => props.laptop ? "8 / 10" : "7 / 9" } ;
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
    grid-row: 4 / 8; //${props => props.laptop ? "4 / 8" : "4 / 7" } ;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 16px;
    .ant-form-item-row {
      // height: 140px;
      }
    .ant-form-item-control-input-content {
        display: grid;
        grid-template-rows: 116px 1fr;
        row-gap: 8px;
      //  width: 200px;
      //  height: 140px;
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
  white-space: nowrap;
`

const imgToBase = (url) => {
 return new Promise((resolve, reject) => {
    let img = document.createElement("img")
    img.src = url
    img.setAttribute("crossOrigin",'Anonymous')
    let canvas = document.createElement("canvas");
    img.onload =() => {
       if(img.complete) {
         canvas.width = img.width;
         canvas.height = img.height;
         let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        resolve(canvas.toDataURL());
       }
   
    }
   img.onerror = () => {
     reject(null)
   }

  })
 
   
 
}
 function Set(props, ref) {
  const {laptop} = useSelector(adaptation)
  const [form] = Form.useForm();
  const { Item } = Form;
  const {t} = useTranslation("comm")
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
    validStageTime: '', //项目有效期
     imgLogo: '',
     imgProject: '',
     imgSmallLogo:"",
    address: "",  
    lngLat: '',
    remark: "", //备注
  };
  const [initialValues] = useState(params);
  
 
 
  const [imgLogo, setImgLogo] = useState()

 
  const [imgProject, setImgProject] = useState()
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
 
  useEffect(() => {
    imgToBase(projectimg).then(res => {
      setImgProject(res)
      form.setFieldsValue({
        imgProject: res
      })
    }).catch(e => {
      console.log(e)
    })

    imgToBase(projectlog).then(res => {
      setImgLogo(res)
      form.setFieldsValue({
        imgLogo: res
      })
    }).catch(e => {
      console.log(e)
    })
  }, [projectlog, projectimg])
 
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
  const map = useRef()
  const onInput = (e) =>   map.current?.serachMap(e.target.value)
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
  }

  useImperativeHandle(ref, () => ({
    onSubmint
  }));
  return (
    <Formbox
      form={form}
      initialValues={params}
      labelAlign="left"
      size={laptop ? "small" : "middle"}
      colon={false}
      laptop={laptop}
    >
      <Item label={t("ProjectID")}>
        <Input placeholder={t("systemID")} disabled />
      </Item>
      <Item label={t("ProjectName")} required name="name" rules={[
        {
          required: true 
        }
      ]}>
        <Input placeholder={t("enterprojectname")}  autoComplete="off" />
      </Item>
      <Item label={t("Projectvalidityperiod")} required name="validStageTime" rules={[
        {
          required: true 
        }
      ]}>
        <DatePicker placeholder={t("sevalidityperiod")} format="YYYY-MM-DD" disabledDate={disabledDate} style={{width: '260px'}} />
      </Item>
      {/*  imgLogo: "",
    imgProject: '', */}
      <div className='upload'>
         <Item label={t("Projectlogo")} className="left" >
           <div className="img">
           <Item nostyle name="imgLogo" rules={
            [
             {
              required: true,
              message: t("uploadprojectlog")
            }
            ]
           }>
            <Upload wpx={200} hpx={70} swpx={155} shpx={32} style={{padding: '16px'}}  /> 
            </Item>
           </div>
           <Info>{t("sizeofpicture", {size: '200*70'})}</Info>
         </Item>
         <Item label={t("Projectpicture")} labelCol={laptop ? {flex:"5em"} :{flex: "100px"}}   required>
           <div className="img">
            <Item nostyle  name="imgProject" rules={
              [
              {
                required: true,
                message: t("uploadprojectpic")
              }
             ]
           }>
            <Upload wpx={248} hpx={168} swpx={laptop ? 150 : 200} shpx={116}  /> 
            </Item>
           </div>
           <Info>{t("sizeofpicture", {size: '248*168'})}</Info>
         </Item>
      </div>
     <Item label={t("comm:smalllog")} className="smalllog" required>
     <Item nostyle  name="imgSmallLogo" rules={
              [
              {
                required: true,
                message: t("uploadprojectlog")
              }
             ]
           }>
            <Upload wpx={54} hpx={70} swpx={54} shpx={70}   /> 
    </Item>
     </Item>
      <Item label={t("Projectremark")} name="remark" className="remark">
        <Input.TextArea   placeholder={t("99words")} maxLength={99}   />
      </Item>
      <Item label={t("ProjectAddress")} labelCol={{flex: laptop ? "85px" : "166px"}} className="address" name="address" tooltip={t("mapgetit")}> 
          <Input placeholder={t("detailedaddress")} onChange={onInput} /> 
      </Item>
      <Item label={t("longitudeatitude")} labelCol={{flex: laptop? "85px" :"166px"}} className="lnglat" tooltip={t("mapgetit")}>
        <Row gutter={16}>
          <Col span={12}>
            <Item name="lng" rules={[
        {
          required: true,
          message: t("mapgetit")
        }
      ]}>
              <Input placeholder={t("longitude")} />
            </Item>
          </Col>
          <Col span={12}>
            <Item name="lat" rules={[
        {
          required: true,
          message: t("mapgetit")
        }
      ]}>
        <Input placeholder={t("longitude")} />
            </Item>
          </Col>
        </Row>
      </Item>
    {/*   <div className="map">
        <Mapcom setAaddress={setAaddress} initialValues={initialValues} ref={map} />
      </div> */}
    </Formbox>
  );
}
export default forwardRef(Set)