import React, { useState,  useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
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
  Select,
  Divider,
  Table,
  Layout,
  message,
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
import { ProjectList } from "@api/api.js";
import {Iptserach, Cselect} from "@com/comstyled"
import Chintlog from "@imgs/chintlog.png";
import Custmodal from "@com/useModal";
import {Circle} from '@com/useIcon'
import Projectform from './projectform'
import { configProject, getMenus, getRunMenus, getDesignerMenus, getSiderRunMenus, getSiderDesignerMenus, getSetMenus } from "@redux/systemconfig";
const { Content } = Layout;
const Ccontent = styled(Content)`
  height: inherit;
  overflow-y: auto;
  display: flex;
`;
const CustTable = styled(Table)`
  && {
    .ant-pagination-item-active {
      background-color: #0033ff;
      border-color:  #0033ff;
     
      a{ 
       
        color: #fff;
      }
    }
    .ant-pagination-next .ant-pagination-item-link, .ant-pagination-prev .ant-pagination-item-link {
      background-color: transparent;
      color: #fff;
      border-color: #5e5e5e;
    }
  }
  
` 
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
 // min-height: 780px;
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
    height: calc(100vh - 165px);
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
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [proform] =  Form.useForm()
  console.log(proform)
  const [count, setCount] = useState(0); 
  const modal = useRef()
  const formmodal = useRef()
  const projectform = useRef()
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
     navigate("/", {});
    // projectform.current.onFinish();
   // projectform.current.onFinish();
   // modal.current.onCancel()
    //navigate("/", {});
  };
  const onSubmit = () => {
    let params =  projectform.current.onSubmint();
    console.log(params);
    ProjectList.createProject(params).then(res => {
      console.log(res)
    }).catch(e => {
      console.log(e);
    })
  }
  const data = [
    
{no: '01', label: '运行功能', key: '', parentNo: '00', select: 1},

{no: '0101', label: '数据大屏', key: '', parentNo: '01', select: 1},

{no: '0102', label: '项目设置', key: 'projectSet', parentNo: '01', select: 1},
 
{no: '0103', label: '平台设置', key: 'systemSet', parentNo: '01', select: 1},
 
{no: '0104', label: '项目概述', key: 'runtimeProject', parentNo: '01', select: 1},
 
{no: '0105', label: '运行监控', key: 'runtimeMonitor', parentNo: '01', select: 1},

{no: '010501', label: '运行监控', key: 'monitor', parentNo: '0105', select: 1},

 
{no: '010502', label: '测点监测', key: 'point', parentNo: '0105', select: 1},
 
{no: '010503', label: '网关监测', key: 'gateway', parentNo: '0105', select: 1},

{no: '010504', label: '远程控制', key: 'remote', parentNo: '0105', select: 1},
 
{no: '010505', label: '告警监控', key: 'alarm', parentNo: '0105', select: 1},

{no: '010506', label: '视频监控', key: 'camera', parentNo: '0105', select: 1},

{no: '010507', label: '运行报告', key: 'report', parentNo: '0105', select: 1},
 
{no: '010508', label: '系统日志', key: 'log', parentNo: '0105', select: 1},
 
{no: '0106', label: '电气安全', key: 'runtimeSafe', parentNo: '01', select: 1},
 
{no: '010601', label: '概述', key: 'summary', parentNo: '0106', select: 1},

{no: '010602', label: '告警消息', key: 'alarm', parentNo: '0106', select: 1},
 
{no: '0107', label: '配电管理', key: 'runtimeDistribution', parentNo: '01', select: 1},

{no: '010701', label: '概述', key: 'summary', parentNo: '0107', select: 1},
 
{no: '010702', label: '配电系统图', key: 'diagram', parentNo: '0107', select: 1},

{no: '010703', label: '变压器监测', key: 'transformer', parentNo: '0107', select: 1},
{no: '010704', label: '回路监测', key: 'line', parentNo: '0107', select: 1},

{no: '010705', label: '环境监测', key: 'environment', parentNo: '0107', select: 1},
 
{no: '010706', label: '视频监控', key: 'camera', parentNo: '0107', select: 1},
 
{no: '010707', label: '告警信息', key: 'alarm', parentNo: '0107', select: 1},

{no: '010708', label: '运行报告', key: 'report', parentNo: '0107', select: 1},
 
{no: '0108', label: '结算收费', key: 'runtimePrepay', parentNo: '01', select: 1},

{no: '010801', label: '概述', key: 'summary', parentNo: '0108', select: 1},

{no: '010802', label: '客户管理', key: 'user', parentNo: '0108', select: 1},

{no: '010803', label: '能源收费', key: 'energy', parentNo: '0108', select: 1},

{no: '010804', label: '物业收费', key: 'property', parentNo: '0108', select: 1},
 
{no: '010805', label: '账单报表', key: 'account', parentNo: '0108', select: 1},

{no: '010806', label: '数据报表', key: 'data', parentNo: '0108', select: 1},
 
{no: '010807', label: '手动抄表', key: 'manual', parentNo: '0108', select: 1},
 
{no: '010808', label: '充值补助', key: 'charge', parentNo: '0108', select: 1},
 
{no: '010809', label: '运行报告', key: 'report', parentNo: '0108', select: 1},

{no: '0109', label: '能源管理', key: 'runtimeEnergy', parentNo: '01', select: 1},
 
{no: '010901', label: '概述', key: 'summary', parentNo: '0109', select: 1},

{no: '010902', label: '综合能耗', key: 'complex', parentNo: '0109', select: 1},

{no: '010903', label: '分类能耗', key: 'assorting', parentNo: '0109', select: 1},
 
{no: '010904', label: '综合费用', key: 'complexCost', parentNo: '0109', select: 1},

{no: '010905', label: '分类费用', key: 'assortingCost', parentNo: '0109', select: 1},

{no: '010906', label: '能耗排名', key: 'range', parentNo: '0109', select: 1},
 
{no: '010907', label: '分时能耗', key: 'time', parentNo: '0109', select: 1},

{no: '010908', label: '数据报表', key: 'report', parentNo: '0109', select: 1},

{no: '010909', label: '能源流向', key: 'direction', parentNo: '0109', select: 1},

{no: '010910', label: '损耗分析', key: 'analysis', parentNo: '0109', select: 1},
 
{no: '010911', label: '定额能耗', key: 'norm', parentNo: '0109', select: 1},
 
{no: '010912', label: '公共能耗', key: 'public', parentNo: '0109', select: 1},

{no: '010913', label: '路灯监控', key: 'light', parentNo: '0109', select: 1},

{no: '010914', label: '公共照明', key: 'grading', parentNo: '0109', select: 1},

{no: '0110', label: '光伏发电', key: 'runtimeSolar', parentNo: '01', select: 1},

{no: '011001', label: '概述', key: 'summary', parentNo: '0110', select: 1},
 
{no: '011002', label: '运行监控', key: 'monitor', parentNo: '0110', select: 1},

{no: '011003', label: '数据分析', key: 'analysis', parentNo: '0110', select: 1},

{no: '011004', label: '环境监测', key: 'environment', parentNo: '0110', select: 1},
 
{no: '011005', label: '告警监测', key: 'alarm', parentNo: '0110', select: 1},
 
{no: '011006', label: '运行报告', key: 'report', parentNo: '0110', select: 1},
 
{no: '0111', label: '碳排管理', key: 'runtimeCarbon', parentNo: '01', select: 1},

{no: '011101', label: '概述', key: 'summary', parentNo: '0111', select: 1},

{no: '011102', label: '排放详情', key: 'details', parentNo: '0111', select: 1},
 
{no: '011103', label: '碳排流向', key: 'direction', parentNo: '0111', select: 1},

{no: '011104', label: '碳排报告', key: 'report', parentNo: '0111', select: 1},
 
{no: '0112', label: '数据报表', key: 'runtimeReport', parentNo: '01', select: 1},
 
{no: '011201', label: '运行监控', key: 'monitor', parentNo: '0112', select: 1},

{no: '0113', label: '运维管理', key: 'runtimeMaintenance', parentNo: '01', select: 1},

{no: '011301', label: '概述', key: 'summary', parentNo: '0113', select: 1},

{no: '011302', label: '告警信息', key: 'alarm', parentNo: '0113', select: 1},

{no: '011303', label: '工单管理', key: 'order', parentNo: '0113', select: 1},

{no: '011304', label: '巡检管理', key: 'inspection', parentNo: '0113', select: 1},

{no: '011305', label: '运行报告', key: 'report', parentNo: '0113', select: 1},
 
{no: '02', label: '设置功能', key: '', parentNo: '00', select: 1},

{no: '0201', label: '公共模块', key: 'designerCommon', parentNo: '02', select: 1},

{no: '020101', label: '项目设置', key: 'project', parentNo: '0201', select: 1},

{no: '020102', label: '用户管理', key: 'user', parentNo: '0201', select: 1},

{no: '020103', label: '区域管理', key: 'area', parentNo: '0201', select: 1},

{no: '020104', label: '数字驾驶舱', key: 'driver', parentNo: '0201', select: 1},
 
{no: '0202', label: '项目概述', key: 'designerProject', parentNo: '02', select: 1},
 
{no: '0203', label: '运行监控', key: 'designerMonitor', parentNo: '02', select: 1},

{no: '020301', label: '类型管理', key: 'category', parentNo: '0203', select: 1},
 
{no: '020302', label: '设备管理', key: 'device', parentNo: '0203', select: 1},

{no: '020303', label: '线路管理', key: 'line', parentNo: '0203', select: 1},
 
{no: '020304', label: '告警管理', key: 'alarm', parentNo: '0203', select: 1},
 
{no: '0204', label: '电气安全', key: 'designerSafe', parentNo: '02', select: 1},

{no: '020401', label: '配额管理', key: 'quota', parentNo: '0204', select: 1},

{no: '0205', label: '配电管理', key: 'designerDistribution', parentNo: '02', select: 1},

{no: '020501', label: '配电房管理', key: 'room', parentNo: '0205', select: 1},

{no: '0206', label: '收费结算', key: 'designerPrepay', parentNo: '02', select: 1},

{no: '020601', label: '配额管理', key: 'quota', parentNo: '0206', select: 1},
 
{no: '020602', label: '后台管理', key: 'back', parentNo: '0206', select: 1},

{no: '0207', label: '能源管理', key: 'designerEnergy', parentNo: '02', select: 1},

{no: '020701', label: '能耗分类', key: 'assorting', parentNo: '0207', select: 1},

{no: '020702', label: '能耗定价', key: 'price', parentNo: '0207', select: 1},

{no: '020703', label: '能耗定额', key: 'norm', parentNo: '0207', select: 1},

{no: '0208', label: '光伏发电', key: 'designerSolar', parentNo: '02', select: 1},

{no: '020801', label: '配额管理', key: 'quota', parentNo: '0208', select: 1},

{no: '020802', label: '后台设置', key: 'back', parentNo: '0208', select: 1},

{no: '0209', label: '碳排管理', key: 'designerCarbon', parentNo: '02', select: 1},

{no: '020901', label: '配额管理', key: 'quota', parentNo: '0209', select: 1},

{no: '020902', label: '后台设置', key: 'back', parentNo: '0209', select: 1},

{no: '0210', label: '数据报表', key: 'designerReport', parentNo: '02', select: 1},

{no: '021001', label: '配额管理', key: 'quota', parentNo: '0210', select: 1},
 
{no: '021002', label: '后台设置', key: 'back', parentNo: '0210', select: 1},
 
{no: '0211', label: '运维管理', key: 'designerMaintenance', parentNo: '02', select: 1},

{no: '021101', label: '配额管理', key: 'quota', parentNo: '0211', select: 1},
 
{no: '021102', label: '后台设置', key: '/back', parentNo: '0211', select: 1},
  ]
  const projectcig = async ({id}) => {   
    // console.log(text);
    console.log(data.length)
     try {
     // let {data, success, errMsg} = await ProjectList.QueryMenus(1)
      if (Array.isArray(data)) {    
         try {
        
         const setMenus = data.filter(m => ['0101', '0102', '0103'].includes(m.no));
         const runMenus = data.filter(m => m.parentNo == '01' && m.select == 1).filter(m => !['0101', '0102', '0103'].includes(m.no)) // 运行
         const designerMenus = data.filter(m => m.parentNo == '02' && m.select == 1) // 设置
         let exclude = ['01','02','0101','0102', '0103', '0104'] // 排除  项目概述, 数据大屏， 项目设置， 平台配置,
        
         const sidermenu = data.filter(m => m.parentNo !='01').filter(m => m.parentNo !='02').filter(m => !exclude.includes(m.no));    
         console.log(runMenus);

         const siderRunMenus = {}; 
         runMenus.forEach(item => {
          let {no, key, parentNo} = item 
          if (!exclude.includes(item.no)) {
             siderRunMenus[key] = sidermenu.filter(m => m.parentNo == no)
          }   
         })
         console.log()
         const siderDesignerMenus = {};
         designerMenus.forEach(item => {
          let {no, key, parentNo} = item 
          if (!exclude.includes(item.no)) {
            siderDesignerMenus[key] = sidermenu.filter(m => m.parentNo == no)
          }   
         }) 
         const menus = {
          runMenus,
          designerMenus,
          siderRunMenus,
          siderDesignerMenus,
          setMenus,
         }
         dispatch(getMenus(menus));
           
        } catch (error) {
          console.log(error);
        }   
       /*   dispatch(getRunMenus(runMenus));
         dispatch(getDesignerMenus(designerMenus));
         dispatch(getSiderRunMenus(siderRunMenus));
         dispatch(getSiderDesignerMenus(siderDesignerMenus));
         dispatch(getSetMenus(setMenus)); */
      } else {
        return message.warning(errMsg || '数据出错,请重试', 1)
      }
     } catch (error) {
       console.log(error);
     }
    
      
    dispatch(configProject(false))
    navigate("/index/runtimeProject", {
      state: { path: "index", index: true, title: "项目概述" },
    })
   /*  navigate("/config/module/project", {
      state: { selectedKeys: "module",  title: "项目管理", path: 'module' },
    })  */
  }
  const projectinfo = () => {   
    dispatch(configProject(false))
    navigate("/index", {
      state: { path: "index", index: true, title: "项目概述" },
    })
  }
  /* 新增项目  start*/
  const showproject = () => {
    formmodal.current.onOpen()
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
      render: (text, record) => (
        <Space size={32}>
          <CustBtn icon={<SettingOutlined style={{ fontSize: "20px" }}  />} onClick={() => projectcig(record)}>
            项目配置
          </CustBtn>
          <CustBtn
            icon={<DesktopOutlined style={{ fontSize: "20px" }} />}
            onClick={() =>
              projectinfo()
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
    return ProjectList.queryProject(params).then((res) => {
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
    }).catch(e => {
      console.log(e)
    });
  };
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    defaultParams: [
      { current: 1, pageSize: 10 },
      {name: '', state: 0}
    ],
   
  });

tableProps.pagination.position = ["bottomCenter"] // 底部居中
tableProps.pagination.size="default" // 页码大小默认
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
                  onClick={showproject}
                  icon={
                    <PlusCircleOutlined
                      style={{ color: "#fff", fontSize: "24px" }}
                    />
                  }
                >
                  新增项目
                </CustBtn>
              </Item>
              <Item name="name">
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
              <Item name="state">
                <Cselect
                  placeholder="项目状态"
                  w="200px"
                  h="40px"
                  onChange={submit}
                  size="large"
                >
                  {options.map((o) => (
                    <Option value={o.value} key={nanoid()}>
                      {o.label}
                    </Option>
                  ))}
                </Cselect>
              </Item>
             
              <Item>
                <Space>
                <span style={{ color: "#ccc", fontSize: "16px" }}>
                  当前账户共有{count}个项目
                </span>
                 <Button onClick={projectcig}>menus</Button>
                </Space>
              </Item>
            </Space>
          </Form>
          <CustTable
            columns={columns}
            {...tableProps}
            rowClassName="rowclass"
            rowKey="id"
            bordered={true}
          >
           
          </CustTable>
        </div>
        <Custmodal
        title="提示信息"
         ref={modal}
         onOk={onOk}
        
        width={488}
        mold="cust"
        type="dark"
      >
        <Space size={16} style={{paddingLeft: '32px'}}>
          <Circle
          />
         <span style={{color: '#fff', fontSize: '18px'}}> 是否退出系统？</span>
        </Space>
      </Custmodal>
      <Custmodal
        title="新增项目"
        ref={formmodal}
        onOk={onSubmit}        
        width={1366} 
        mold="cust"     
        type="dark"
      >
        <Projectform ref={projectform} />
      </Custmodal>
      </Mainbox>
     
  );
}
