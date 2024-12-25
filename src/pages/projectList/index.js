import React, { useState,  useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import {useTranslation} from "react-i18next"
import styled, {css} from "styled-components";
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
  DatePicker
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
 
import { ProjectList} from "@api/api.js";
import {selectUser} from '@redux/user'

import {Iptserach, Cselect} from "@com/comstyled"
import Chintlog from "@imgs/chintlog.png";
 
import Custmodal from "@com/useModal";
import {Circle} from '@com/useIcon'
 
import Projectform from './projectform'
import { systemConfigInfo, getJump, iszhCN, getWebsiteState, getWebsiteMenu, adaptation} from "@redux/systemconfig";

import UseTabel from '@com/useTable'
import Account from "./account";
//import { runMenus } from "../../redux/systemconfig";
 
 
const CustTable = styled(Table)`
  && {
    .ant-table-container {
      border-color: #2b4576;
      
       
    }
    .ant-table-content {
      table {
        border-top-color: #2b4576 !important;
      }
    }
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
const btsty = css`
  height: 32px;
  font-size: 12px;
`
const CustBtn = styled(Button)`
  max-width: ${(props) => props.width || "144px"};
  height: ${props => props.laptop ? "32px" : "40px"} ;
  background-color: ${(props) => props.bgColor || "rgba(0,51,255, 0.6)"};
  border-color: #0066cc;
  color: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding-top:0px;
  padding-bottom: 0px;
  ${props => props.laptop ? btsty : null}
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
  background-color: #0030ca;
  height: ${props => props.laptop ? "32px" : "40px"} ;
/*   &:hover, &:focus {
    background-color: #0033ff;
    border-color: none;
  } */
`;
const maisty=css`
  padding: 16px;
  grid-template-rows: 60px 1fr;
  row-gap: 16px;
`
const cnsty=css`
  font-size: 20px;
        height: 20px;
        line-height: 20px;
        `
const thsty=css`
font-size: 14px;
height: 36px;
`
const Mainbox = styled.div`
  background-image: linear-gradient(#003399, #000000);
  padding: 32px;
  flex: 1;
  display: grid;
  grid-template-rows: 101px 1fr;
  row-gap: 32px;
  color: #fff;
 // min-height: 780px;
//  min-width:1440px;
  overflow: auto;
  ${props => props.laptop ? maisty : ''}
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: ${props => props.laptop ? "8px" : "32px"};
    border-bottom: 1px solid #476297;
    .name {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .ch {
        color: #fff;
        font-size:${props=> props.laptop ? "20px" : "36px"};
       
       
      }
      .en {
        color: rgba(255, 255, 255, 0.6);
        font-size: ${props=> props.laptop ? "14px" : "16px"};
        font-style: italic;
      }
    }
    .loginName {
      font-size: ${props=> props.laptop ? "14px" : "20px"};
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
    grid-template-rows: ${props => props.laptop ? "32px 1fr" : "42px 1fr"} ;
    row-gap: 32px;
    height: calc(100vh - 165px);
    .serach {
      display: flex;
      justify-content: space-between;
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
      .ant-form-item-control-input-content {
      height:${props => props.laptop ? "32px" : "40px"};
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
      font-size: ${props => props.laptop ? "12px" : "16px"};
      
      .ant-table-tbody > tr.rowclass > td {
        border-color: #2b4576;
        padding-top: 0px;
        padding-bottom: 0px;
        height: ${props => props.laptop ? "42px" : "56px"}; 
        border-color: #2b4576;
       
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
        font-size: 18px;
        color: #fff;
        text-align: center;
        border-color: #2b4576 !important;
        height: 40px;
        padding: 0px;
        ${props => props.laptop ? thsty : null}
      }
    }
  }
`;
const Opbox = styled.div`
 display: grid;
 grid-template-rows: 32px 1fr;
 row-gap: 16px;
 flex:1;
 padding-top: 16px;
 border-top: 1px dotted #d7d7d7;
 min-height: 760px;
 min-height: 760px;
`
const { RangePicker } = DatePicker
export default function Index() {
 const {t} = useTranslation(["comm","platformcig"])
  const iszh = useSelector(iszhCN)
  const {laptop} = useSelector(adaptation) || {}
  const {userId,roleType} =useSelector(selectUser)
  const navigate = useNavigate();
  const dispatch = useDispatch();
   
  const [form] = Form.useForm(); 
  const [count, setCount] = useState(0); 
  const modal = useRef()
  const formmodal = useRef()
  const projectform = useRef()
  const { Item } = Form;
  const { Option } = Select;
  const [options, setOptions] = useState([
    { label: t("comm:All"), value: 0 },
    { label: t("comm:Published"), value: 1 },
    { label: t("comm:Unpublished"), value: 2 },
    { label: t("comm:Expired"), value: 3 },
    { label: t("comm:Unexpired"), value: 4 },
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
  const onSubmit = async () => {
    let params =  await projectform.current.onSubmint();
    if(!params) return
    ProjectList.createProject(params).then(res => {
       let {success, errMsg} = res

       if(success) {
        formmodal.current.onCancel()
        refresh()
        message.success(t("comm:newsuc"))
       } else {
        message.error(errMsg || t("comm:dataerr"))
       }
    }).catch(e => {
      console.log(e);
    })
  }

 const enterProject = async ({id, type, publishState}) => { // type 1是设计type 2是运行
   try {
     dispatch(getWebsiteState({id, userId}))
    // dispatch(configProject(type === 1))
     let {runMenus, designerMenus,siderRunMenus, siderDesignerMenus, homeMenuNO} = await dispatch(getWebsiteMenu(id)).unwrap()
    
     let menu;
     let  jumpath, substate;
     if (type == 2) {
      menu = runMenus?.find(item => item.no == homeMenuNO) || runMenus[0] 
      if(!menu) return message.error({content:  t("comm:NoSetMenu"), duration: 0.5})
      let sider = siderRunMenus?.[menu.key]?.[0] 
      if(sider) { 
        let {key, label} = sider
        jumpath = `/index/${menu.key}/${key}`
        substate = {
          nested: key,
          title: label,
          primary: menu.key
        }

      }
    }else if(type == 1) {  
      let {key} = designerMenus?.find(item => item.no == '0201')|| designerMenus[0]      
      if(key) {
        let {label, key: nested} = siderDesignerMenus[key][0]
        menu = {label, key, nested}
      } else {
        menu = null
      }
    }
   
    if(!menu) return message.error({content: t("comm:NoSetMenu"), duration: 0.5})
    type == 2  && projectRun(menu, jumpath, substate)
    type == 1 && projectDesigner(menu)

   } catch (error) {
     console.log(error)
   }
      
 }


  // 数据需要动态获取
  const projectRun = ({key, label}, jumpath, substate) => { 
    dispatch(getJump(true))
    navigate(`/index/${key}`, {
      state: { type: 'index',  primary: key,  index: true, title: label, jumpath, substate }
    })
  };

 const projectDesigner = (menu) => { 
     console.log(menu)
     let {label, key, nested} = menu
      dispatch(getJump(false))
      navigate(`/config/${key}/${nested}`, {
        state: { type: 'config', primary: key,  title: label, nested } 
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
      width: 60,
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: t("comm:ProjectName"),
      dataIndex: "name",
      key: "name",
     // width: 420,
      ellipsis: true,
    },
    {
      title: t("comm:ProjectAddress"),
      dataIndex: "address",
      key: "address",
    //  with: 620,
      ellipsis: true,
    },
    {
      title: t("comm:Status"),
      dataIndex: "publishStateStr",
      key: "publishStateStr",
      align: "center",
      width: 180,
      // render: (text) => {
      //   return text == 1 ? "已发布" : "未发布";
      // },
    },
    {
      title: t("comm:ValidityPeriod"),
      key: "validStageTime",
      dataIndex: "validStageTime",
      align: "center",
      width: 200,
     // render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: t("comm:Operation"),
      key: "custop",
      dataIndex: "custop",
      align: "center",
      render: (text, record) => (
        <Space size={32}>
          <CustBtn  width={iszh ? null : "auto"} laptop={laptop}  icon={laptop? null : <SettingOutlined style={{ fontSize: "20px" }}  />} onClick={() => enterProject({id: record.id, type: 1, publishState: record.publishState
})}>
            {t("platformcig:ProjectConfiguration")}
          </CustBtn>
          <CustBtn
            laptop={laptop}
            icon={laptop ? null : <DesktopOutlined style={{ fontSize: laptop?"16px": "20px" }} />}
            onClick={() =>
              enterProject({id: record.id, type: 2, publishState: record.publishState
              })
            }
          >
            {t("platformcig:EnterProject")}
          </CustBtn>
        </Space>
      ),
    },
  ];

  const getTableData = ({ current, pageSize }, formData) => {
    //setFormParams((formParams) => ({ ...formParams, ...formData }));
   let {name} = formData
   formData.name = encodeURIComponent(name)
   const params = Object.assign(
      {},
     // params,
      { pageNum: current, pageSize },
     formData
    );
    return ProjectList.queryProject(params).then((res) => {
      let { success, data, total} = res;
      if (success && Array.isArray(data)) {
        setCount(total);
        return {
          total,
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
  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form,
    defaultParams: [
      { current: 1, pageSize: 10 },
      {name: '', state: 0}
    ],
   
  });

tableProps.pagination.position = ["bottomCenter"] // 底部居中
tableProps.pagination.size=laptop ? "small" : "default" // 页码大小默认
  const { submit } = search;

  const { chineseTitle, englishTitle, systemLogoImage } = useSelector(systemConfigInfo);
  const { name } = useSelector((state) => state.user);
  
  // 操作记录 start
  const opref = useRef()
  const opRecord = () => {
    opref.current.onOpen()
 }
 const opclose = () => {
  opref.current.onCancel()
 }
 const OprecordCom = () => {

  const [opform] = Form.useForm()
 
  const opcolumns = [ 
    {
      dataIndex: "projectId",
      title: t("comm:ProjectID"),
      key: "projectId",
      align: "center",
    },
    {
      dataIndex: "projectName",
      title: t("comm:ProjectName"),
      key: "projectName",
      align: "center",
    },
    {
      dataIndex: "creatorInfo",
      title: t("platformcig:OperatorMobileNumber"),
      key: "creatorInfo",
      align: "center",
    },
    {
      dataIndex: "operate",
      title: t("platformcig:OperationType"),
      key: "operate",
      align: "center",
    },
    {
      dataIndex: "detail",
      title: t("comm:remark"),
      key: "detail",
      align: "center",
      width: 546
    },
    {
      dataIndex: "operationTime",
      title: t("comm:OperationTime"),
      key: "operationTime",
      align: "center",
    },
  ]
  const getRecord = ({current, pageSize}, formData) => {        
    try {
     let {date} = formData
     let start='0001-01-01', end ='0001-01-01';
      if (Array.isArray(date) && date.length > 1) {
        start = date[0].format('YYYY-MM-DD')
        end = date[1].format('YYYY-MM-DD')+" 23:59:59"
      } 
    let params = {pageNum: current, pageSize, start, end} 
     return ProjectList.QueryProjectLog(params).then(res => {
       let {success, data, total} = res
       if (success) {
         return {
            list: data,
            total,
         }
      
       }else {
        return {
          list: [],
          total: 0
        }
     }     
   }).catch(e => {
     console.log(e)
   })
    
  
    } catch (error) {
      console.log(error)
    }
    
 }
  const {tableProps, search} = useAntdTable(getRecord, {
  
    defaultParams: [{current: 1, pageSize: 12}, {start: '0001-01-01', end: '0001-01-01'}],
    form: opform,
  })
 let {submit} = search
 const disabledDate = (current) => {
 
  return current && current > moment() ;
};
 return  <Opbox>
         
  <Form
    form={opform}
  >
      <Item label={t("comm:OperationTime")} name="date">
         <RangePicker style={{width: '408px'}} onChange={submit} disabledDate={disabledDate} />
      </Item>
  </Form>
<UseTabel
    columns={opcolumns}
   {...tableProps}
    scroll={{y: '695px'}}
    rowKey="id"
  />  
</Opbox>
 }

// 操作记录 end

// 运维管理员管理 start
 //const {roleType} = useSelector(selectUser)
 const operRef = useRef()
 const devOps = () => {
     operRef.current.onOpen();
 }
const closeModl = () => {
  operRef.current.onCancel()
}

  return (
      
      <Mainbox laptop={laptop}>
        <div className="title">
          <Space size={32}>
            <Image
              src={
                systemLogoImage
                  ? "data:image/png;base64," + systemLogoImage
                  : Chintlog
              }
              height={ laptop ? 54 : 68}
              preview={false}
            ></Image>
            <div className="name">
              <p className="ch">{chineseTitle || "正泰智慧能源服务平台"}</p>
              <p className="en">
                {englishTitle || "Integrated Energy Service Platform"}
              </p>
            </div>
          </Space>
          <Space size={32}>
            <UserOutlined style={{ color: "#fff", fontSize: laptop ? "22px" : "32px" }} />
            <span className="loginName">{name}</span>
            <PoweroffOutlined
              style={{ fontSize: laptop ? "22px" : "30px", cursor: "pointer" }}
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
            autoComplete="off"
          >
            <Space size={64} split={ <Divider
                  dashed
                  style={{ borderColor: "#999", height: "32px", margin: "0px" }}
                  type="vertical"
                />} >
              
              <Item name="name" normalize={(v) => v.trim() }>
              <Iptserach
                   placeholder={t("comm:Message_enterprojectname")}
                   style={{ width: "500px" }}
                   allowClear
                   onSearch={submit}
                   laptop={laptop}
                   enterButton={ <CutSerachBt
                   laptop={laptop}
                    width="98px"                  
                    icon={
                      <SearchOutlined
                        style={{ fontSize: "18px", color: '#fff' }}
                        
                        mgl="8px"
                      />  
                    }
                  >{t("comm:Query")}</CutSerachBt>}
                >
                </Iptserach>       
              </Item>
              <Item name="state">
                <Cselect
                  placeholder={t("comm:projectStatus")}
                  w="200px"
                  h={laptop ? "32px" :"42px"}
                  onChange={submit}
                  size={laptop ? "small" : "large"}
                >
                  {options.map((o) => (
                    <Option value={o.value} key={nanoid()}>
                      {o.label}
                    </Option>
                  ))}
                </Cselect>
              </Item>
            </Space>
            <Space size={32}>
            <Item noStyle>
              {  roleType == 2 &&    <CustBtn
                  onClick={showproject}
                  laptop={laptop}
                  icon={
                    <PlusCircleOutlined
                      style={{ color: "#fff", fontSize:  laptop ? "16px" : "24px" }}
                    />
                  }
                >
                 {t("comm:newproject")}
                </CustBtn>
               }
                 {  roleType == 1 &&    <CustBtn  laptop={laptop} width={iszh ? null : "auto"}
                  onClick={devOps}
                >
                   {t("platformcig:OperationsAdministratorManagement")}
                </CustBtn>
               }
              </Item>
              <Item noStyle>
                  <CustBtn
                  onClick={opRecord}
                  laptop={laptop}
                   >
                  {t("platformcig:OperationRecord")}
                </CustBtn>
              </Item>
            </Space>
          </Form>
          <CustTable
            columns={columns}
            {...tableProps}
            rowClassName="rowclass"
            rowKey="id"
            bordered={true}
            laptop={laptop}
            size={laptop ? "small" : "default"}
          >
           
          </CustTable>
        </div>
        <Custmodal
        title={t("comm:promptmessage")}
         ref={modal}
         onOk={onOk}
        
        width={488}
        mold="cust"
       
      >
        <Space size={16} style={{paddingLeft: '32px'}}>
          <Circle
          />
         <span style={{color: '#333', fontSize: '18px'}}>{t("platformcig:system")}</span>
        </Space>
      </Custmodal>
      <Custmodal
        title={t("comm:newproject")}
        ref={formmodal}
        onOk={onSubmit}        
        width={laptop ? 1000 : 1366} 
        mold="cust"     
        
      >
        <Projectform ref={projectform} />
      </Custmodal>


      <Custmodal
        title={<div style={{display: 'flex', justifyContent: 'space-between'}}><span>{t("platformcig:ProjectOperationHistory")}</span> <Button style={{width: '92px'}} type="primary" onClick={opclose}>{t("comm:Close")}</Button></div>}
        ref={opref} 
        width={laptop ? 1000 : 1424} 
        mold="cust"   
        footer={null}
      >
         <OprecordCom />
         
      </Custmodal>


      <Custmodal
        title={t("platformcig:OperationAdministratorAccountManagement")}
        ref={operRef} 
        width={laptop ? 840 : 1080} 
        onOk={closeModl}
        mold="cust"  
      //  footer={<Space><Button onClick={closeModl}>取消</Button><Button type="primary" onClick={closeModl}>确认</Button></Space>}
      >
         <Account />
         
      </Custmodal>
      </Mainbox>
     
  );
}
