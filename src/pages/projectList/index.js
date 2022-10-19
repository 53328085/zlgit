import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
import {
  Space,
  Image,
  Modal,
  Button,
  Form,
  Input,
  Select,
  Divider,
  Table,
  Layout,
} from "antd";
import {
  UserOutlined,
  PoweroffOutlined,  
  PlusCircleOutlined,
  SettingOutlined,
  SearchOutlined,
  DesktopOutlined, 
} from "@ant-design/icons";
import { useAntdTable } from "ahooks";
import { Project } from "@api/api.js";
import {Iptserach, Cselect} from "@com/comstyled"
import Chintlog from "@imgs/chintlog.png";
import Custmodal from "@com/useModal";
import {Circle} from '@com/useIcon'
const { Content } = Layout;
const Ccontent = styled(Content)`
  height: inherit;
  overflow-y: auto;
  display: flex;
`;
const CustBtn = styled(Button)`
  max-width: ${(props) => props.width || "144px"};
  height: 40px;
  background-color: ${(props) => props.bgColor || "rgba(0,51,255, 0.6)"};
  border-color: #0066cc;
  color: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding-top:0px;
  padding-bottom: 0px;
  .anticon + span {
    margin-left: ${(props) => props.mgl || "16px"};
  }
  &:hover, &:active, &:focus  {
    background-color: #0033ff;
    color: #fff;
  }
`;
const CutSerachBt = styled(CustBtn)`
  .anticon + span {
    margin-left: 8px;
  }
  font-size: 16px;
  color:#fff !important;
  border:none;
/*   &:hover, &:focus {
    background-color: #0033ff;
    border-color: none;
  } */
`;
const Mainbox = styled.div`
  background-image: linear-gradient(#003399, #000000);
  padding: 32px;
  flex: 1;
  display: grid;
  grid-template-rows: 101px 1fr;
  row-gap: 32px;
  color: #fff;
  min-height: 780px;
  min-width:1440px;
  overflow: auto;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 32px;
    border-bottom: 1px solid #dedede;
    .name {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .ch {
        color: #fff;
        font-size: 36px;
        height: 46px;
        line-height: 46px;
      }
      .en {
        color: rgba(255, 255, 255, 0.6);
        font-size: 16px;
        font-style: italic;
      }
    }
    .loginName {
      font-size: 20px;
      color: #f2f2f2;
    }
    .exit {
      color: rgba(255, 255, 255, 0.6);
      transition: color 0.3s;
      &:hover {
        color: #fff;
      }
    }
  }
  .maincontent {
    display: grid;
    grid-template-rows: 42px 1fr;
    row-gap: 32px;
    .serach {
      .ant-form-item {
        margin-right: 0px;
      }
      .addbtn {
        width: 144px;
        height: 40px;
        background-color: #002e88;
        color: #fff;
        font-size: 14px;
        display: flex;
        align-items: center;
        .anticon + span {
          margin-left: 16px;
        }
      }
      .ant-input-search-button {
       // background-color: #002e88;
      }
      .ant-space-item:last-of-type {
        margin-left: auto;
      }
    }
    .ant-table-wrapper {
      height: 100%;
      .ant-spin-nested-loading {
        height: 100%;
        .ant-spin-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
      }
    }
    .ant-table {
      background-color: transparent;

      color: #fff;
      font-size: 16px;
      .ant-table-tbody > tr.rowclass > td {
        border-color: #2b4475;
        padding-top: 0px;
        padding-bottom: 0px;
        height: 56px;
        &:first-of-type {
          border-left: 1px solid #2b4475;
        }
        //border-right-color: #2b4475;
      }
      .ant-table-cell {
      }
      .rowclass:hover {
        .ant-table-cell {
          background-color: transparent;
        }
      }
      .ant-table-thead > tr > th {
        background-color: #476299;
        font-size: 20px;
        color: #fff;
        text-align: center;
        border-color: #2b4475;
        height: 48px;
        padding: 0px;
        &:first-of-type,
        &:last-of-type {
          border-left: 1px solid #2b4475;
        }
      }
    }
  }
`;
const Modalbox = styled(Modal)`
  .ant-modal-header,
  .ant-modal-body,
  .ant-modal-footer {
    background-color: #1b1d23;
    color: #ccc;
  }
  .ant-modal-body {
    font-size: 18px;
  }
  .ant-modal-header {
    .ant-modal-title {
      color: #ccc;
      font-size: 18px;
    }
  }
  .ant-modal-footer {
    .ant-btn {
      width: 96px;
      height: 36px;
    }
    .ant-btn + .ant-btn {
      margin-left: 16px;
    }
    .ant-btn-default {
      background-color: transparent;
      color: #ccc;
    }
    .ant-btn-primary {
      background-color: #0b2ba7;
    }
  }
`;

export default function Index() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [count, setCount] = useState(0); 
  const modal = useRef()
  const { Item } = Form;
  const { Option } = Select;
  const [options, setOptions] = useState([
    { label: "全部", value: 0 },
    { label: "已发布", value: 1 },
    { label: "未发布", value: 2 },
    { label: "已过期", value: 3 },
    { label: "未过期", value: 4 },
  ]);
  const onShow = () => {    
      modal.current.onOpen()
  };
  const onOk = () => {   
    modal.current.onCancel()
    navigate("/", {});
  };
  const projectcig = () => {
    console.log(1111)
    navigate("/index/module/project", {
      state: { headerKeys: "module",  title: "项目管理" },
    })
  }
  const columns = [
    {
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 80,
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: "项目名称",
      dataIndex: "name",
      key: "name",
     // width: 420,
      ellipsis: true,
    },
    {
      title: "项目地址",
      dataIndex: "address",
      key: "address",
    //  with: 620,
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "enabled",
      key: "enabled",
      align: "center",
      width: 180,
      render: (text) => {
        return text == 1 ? "已发布" : "未发布";
      },
    },
    {
      title: "有效期",
      key: "projectValidStageTime",
      dataIndex: "projectValidStageTime",
      align: "center",
      width: 200,
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "操作",
      key: "custop",
      dataIndex: "custop",
      align: "center",
      render: () => (
        <Space size={32}>
          <CustBtn icon={<SettingOutlined style={{ fontSize: "20px" }}  />} onClick={() => projectcig()}>
            项目配置
          </CustBtn>
          <CustBtn
            icon={<DesktopOutlined style={{ fontSize: "20px" }} />}
            onClick={() =>
              navigate("/index", {
                state: { headerKeys: "/index", index: true, title: "首页" },
              })
            }
          >
            进入项目
          </CustBtn>
        </Space>
      ),
    },
  ];

  const getTableData = ({ current, pageSize }, formData) => {
    console.log(formData)
    //setFormParams((formParams) => ({ ...formParams, ...formData }));

   const params = Object.assign(
      {},
     // params,
      { pageNum: current, pageSize },
     formData
    );
    return Project.queryProject(params).then((res) => {
      let { success, data, totalNum } = res;
      if (success && Array.isArray(data)) {
        setCount(totalNum);
        return {
          total: totalNum,
          list: data,
        };
      } else {
        setCount(0);
        return {
          total: 0,
          list: [],
        };
      }
    });
  };
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    defaultParams: [
      { current: 1, pageSize: 10 },
      {projectName: '', valid: 0}
    ],
   
  });

tableProps.pagination.position = ["bottomCenter"] // 底部居中
  const { submit } = search;

  const { chineseTitle, englishTitle, systemLogoImage } = useSelector(
    (state) => state.system
  );
  const { loginName } = useSelector((state) => state.user);

  return (
      
      <Mainbox>
        <div className="title">
          <Space size={32}>
            <Image
              src={
                systemLogoImage
                  ? "data:image/png;base64," + systemLogoImage
                  : Chintlog
              }
              height={68}
              preview={false}
            ></Image>
            <div className="name">
              <p className="ch">{chineseTitle || "正泰智慧能源服务平台"}</p>
              <p className="en">
                {englishTitle || "Chint Smart Energy Service Platform"}
              </p>
            </div>
          </Space>
          <Space size={32}>
            <UserOutlined style={{ color: "#fff", fontSize: "32px" }} />
            <span className="loginName">{loginName}</span>
            <PoweroffOutlined
              style={{ fontSize: "30px", cursor: "pointer" }}
              className="exit"
              onClick={() => onShow()}
            />
          </Space>
        </div>
        <div className="maincontent">
          <Form
            layout="inline"
            className="serach"
            form={form}
          >
            <Space size={32} style={{ flex: 1 }}>
              <Item>
                <CustBtn
                  icon={
                    <PlusCircleOutlined
                      style={{ color: "#fff", fontSize: "24px" }}
                    />
                  }
                >
                  新增项目
                </CustBtn>
              </Item>
              <Item name="projectName">
              <Iptserach
                   placeholder="请输入项目名称"
                   style={{ width: "500px" }}
                   allowClear
                   onSearch={submit}
                   enterButton={ <CutSerachBt
                    width="98px"                  
                    icon={
                      <SearchOutlined
                        style={{ fontSize: "18px", color: '#fff' }}
                        
                        mgl="8px"
                      />  
                    }
                  >查询</CutSerachBt>}
                >
                </Iptserach>       
              </Item>
              <Item>
                <Divider
                  dashed
                  style={{ borderColor: "#fff", height: "36px", margin: "0px" }}
                  type="vertical"
                />
              </Item>
              <Item name="valid">
                <Cselect
                  placeholder="项目状态"
                  style={{ width: "200px" }}
                  onChange={submit}
                >
                  {options.map((o) => (
                    <Option value={o.value} key={nanoid()}>
                      {o.label}
                    </Option>
                  ))}
                </Cselect>
              </Item>

              <Item>
                <span style={{ color: "#ccc", fontSize: "16px" }}>
                  当前账户共有{count}个项目
                </span>
              </Item>
            </Space>
          </Form>
          <Table
            columns={columns}
            {...tableProps}
            rowClassName="rowclass"
            rowKey="id"
            bordered={true}
          >
           
          </Table>
        </div>
        <Custmodal
        title="提示信息"
         ref={modal}
         onOk={onOk}
        
        width={488}
        mold="msg"
        type="dark"
      >
        <Space size={16} style={{paddingLeft: '32px'}}>
          <Circle
          />
         <span style={{color: '#fff', fontSize: '18px'}}> 是否退出系统？</span>
        </Space>
      </Custmodal>
   
      </Mainbox>
     
  );
}
