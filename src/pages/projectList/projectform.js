import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Cascader,
  message,
  Row,
  Col,
  Image
} from "antd";
import provinces from "china-division/dist/provinces.json";
import cities from "china-division/dist/cities.json";
import areas from "china-division/dist/areas.json";
import styled from "styled-components";
import Mapcom from "@com/useMap";
import imgurl from "@imgs"
import Upload from '@com/useUpload'
import {Comipt, Comtext, CdatePicker} from "@com/comstyled"

const Formbox = styled(Form)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(9, 36px);
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
  .upload {
    grid-row: 4 / 7;
    .ant-form-item-control-input-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 32px;
    }
   
  }
  .address {
    grid-column: 2;
    grid-row: 1/ 3;
  }
  .map {
    grid-column: 2;
    grid-row: 4 / -1;
    width: 487px;
    justify-self: end;
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
export default function Set() {
  const [form] = Form.useForm();
  const { Item } = Form;
  const { TextArea } = Input;
  const params = {
    ProjectType: "预付费项目",
    ProjectValidStageTime: "", //项目有效期
    Name: "",
    Address: "",
    LineAnalysisEnabled: 0,
    Lng: "",
    Lat: "",
    Remark: "", //备注
  };
  const [initialValues] = useState(params);
  const [defaultAdress, setDefaultAddress] = useState([]);
  const [addressVal, setAddressVal] = useState(["", "", ""]);
  areas.forEach((area) => {
    const matchCity = cities.filter((city) => city.code === area.cityCode)[0];
    if (matchCity) {
      matchCity.children = matchCity.children || [];
      matchCity.children.push({
        label: area.name,
        value: area.code,
      });
    }
  });
  cities.forEach((city) => {
    const matchProvince = provinces.filter(
      (province) => province.code === city.provinceCode
    )[0];
    if (matchProvince) {
      matchProvince.children = matchProvince.children || [];
      matchProvince.children.push({
        label: city.name,
        value: city.code,
        children: city.children,
      });
    }
  });
  const options = provinces.map((p) => ({
    label: p.name,
    value: p.code,
    children: p.children,
  }));
  const setAaddress = ({
    Lng = "",
    Lat = "",
    Address = "",
    province = "",
    city = "",
    district = "",
  } = {}) => {
    form.setFieldsValue({
      Lng,
      Lat,
      Address,
    });

    const p = options.find((i) => i.label == province);

    let c, a;
    if (Array.isArray(p?.children)) {
      c = p.children.find((i) => i.label == city);
      if (Array.isArray(c?.children)) {
        a = c.children.find((i) => i.label == district)?.value;
      }
    }
    setAddressVal([p.value, c.value, a]);
    console.log(defaultAdress);
  };
  const changeaddress = (value) => {
    setAddressVal(value);
  };
  const onUpdate = (file) => {
    console.log(file);
    return false;
  };
 
  return (
    <Formbox
      form={form}
      initialValues={initialValues}
      labelAlign="left"
      size="middle"
      requiredMark="optional"
      colon={false}
    >
      <Item label="项目ID">
        <Comipt placeholder="系统自增项目ID" disabled />
      </Item>
      <Item label="项目名称" required>
        <Comipt placeholder="请输入项目名称" />
      </Item>
      <Item label="项目有效期" required name="ProjectValidStageTime">
        <CdatePicker placeholder="请选择项目有效期" />
      </Item>
      <Item label="项目图片" className="upload">
        <Image src={imgurl['projectimg']} height={116}></Image>
        <div style={{border: "1px dotted #9c9ea4", display: 'flex'}}>
        <Upload shpx={116} wpx={248} hpx={168}  />
        </div>
      </Item>
      <Item label="项目备注" name="Remark" className="remark">
        <Comtext  placeholder="请输入备注0-99字" maxLength={99} h="140px" />
      </Item>
      <Item label="项目地址" className="address">
        <Item noStyle>
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
        </Item>
        <Item name="Address">
          <Comipt placeholder="请输入项目的详细地址" />
        </Item>
      </Item>
      <Item label="经纬度" required>
        <Row gutter={16}>
          <Col span={12}>
            <Item name="Lng">
              <Comipt placeholder="经度" />
            </Item>
          </Col>
          <Col span={12}>
            <Item name="Lat">
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
