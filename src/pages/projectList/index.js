import React, { useState,  useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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
 
import { ProjectList, eneryShift, BigScreen, Area } from "@api/api.js";
import {selectUser} from '@redux/user'

import {Iptserach, Cselect} from "@com/comstyled"
import Chintlog from "@imgs/chintlog.png";
import Custmodal from "@com/useModal";
import {Circle} from '@com/useIcon'
 
import Projectform from './projectform'
import { configProject, getMenus, getshifts, getOnelevel, getpublishState, systemConfigInfo, getJump, getdataScreen, setCurrentlevel } from "@redux/systemconfig";
 
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
  background-color: #0030ca;
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
    border-bottom: 1px solid #476297;
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
      height: 40px;
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
        border-color: #2b4576;
        padding-top: 0px;
        padding-bottom: 0px;
        height: 56px;
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
  const onSubmit = async () => {
    let params =  await projectform.current.onSubmint();
    if(!params) return
    ProjectList.createProject(params).then(res => {
       let {success, errMsg} = res

       if(success) {
        formmodal.current.onCancel()
        refresh()
        message.success('新增成功')
       } else {
        message.error(errMsg || '数据出错')
       }
    }).catch(e => {
      console.log(e);
    })
  }

// 进入项目配置/项目 

 const handlermenu = (data, type, id) => {
  const setMenus = data.filter(m => ['0101', '0102', '0103'].includes(m.no));
  const runMenus = data.filter(m => m.parentNo == '01' && m.select == 1).filter(m => !['0101', '0102', '0103'].includes(m.no)) // 运行功能 菜单
//  const allRunMenus = data.filter(m => m.parentNo == '01').filter(m => !['0101', '0102', '0103'].includes(m.no)) 
  const designerMenus = data.filter(m => m.parentNo == '02' && m.select == 1) // 设置

  const comSet = data.filter(m => m.parentNo=="0201") // 公共设置

  let exclude = ['01','02','0101','0102', '0103', '0104'] // 排除  项目概述, 数据大屏， 项目设置， 平台配置,
 
  const sidermenu = data.filter(m => m.parentNo !='01').filter(m => m.parentNo !='02').filter(m => !exclude.includes(m.no));    
  
  const siderRunMenus = {}; // 运行功能 选择的子菜单
 // const allsinderRunMenus = {} ; //运行功能 所有的子菜单
  runMenus.forEach(item => {
   let {no, key, parentNo} = item 
   if (!exclude.includes(item.no)) { 
      siderRunMenus[key] = sidermenu.filter(m => m.parentNo == no && m.select == 1).sort((a, b) => a.index - b.index)
      
   }   
  }) 
  const siderDesignerMenus = {};
  designerMenus.forEach(item => {
   let {no, key, parentNo} = item 
   if (!exclude.includes(item.no)) {
     siderDesignerMenus[key] = sidermenu.filter(m => m.parentNo == no).sort((a, b) => a.index - b.index)
   }   
  }) 
  const menus =  {
   designerMenus, 
   siderDesignerMenus,
   runMenus,
   siderRunMenus, 
   setMenus,  
   comSet,      
   projectId: id,
  }
 
  dispatch(getMenus(menus));
  dispatch(configProject(type === 1))
 

  if (type == 2) {
    return runMenus?.find(item => item.no == '0104') || runMenus[0] 
  }else if(type == 1) {
    return designerMenus?.find(item => item.no == '0201')|| designerMenus[0]
  }

 
 }


 const enterProject = async ({id, type, publishState}) => {
   try {
     dispatch(getpublishState(publishState)) 
     let promises = [Area.QueryAll({projectId: id,level: 1,parentId: 0}),  eneryShift.queryShifts(id), ProjectList.QueryMenus(id), BigScreen.QueryBigScreen(id)] 
     let results = await Promise.allSettled(promises)   
     let menu;
     results.forEach((res, index) => {
       let {status, value: {success, data}} = res
       if (status ==='fulfilled') {
          if(success) {
            dispatch(setCurrentlevel({}))// 当前项目设置为空对象
            index == 0 && dispatch(getOnelevel(data || []));
            index == 1 && dispatch(getshifts(data || []))
            index == 2 && (menu = handlermenu(data, type, id))           
            index == 3 && dispatch(getdataScreen(data))
          }else{
            index== 0 && dispatch(getOnelevel([]));
            index == 1 && dispatch(getshifts([]));
            index == 3 && dispatch(getdataScreen({}));
          }
       }
     })
   
    if(!menu) return message.error({content: '没有设置菜单，请联系管理人员', duration: 0.5})
    type == 2  && projectRun(menu)
    type == 1 && projectDesigner(menu)

   } catch (error) {
     console.log(error)
   }
     

        

 }


  // 数据需要动态获取
  const projectRun = ({key, label}) => { 
    dispatch(getJump(true))
    navigate(`/index/${key}`, {
      state: { type: 'index',  primary: key,  index: true, title: label }
    })
  };

 const projectDesigner = ({key, label}) => { 
      dispatch(getJump(false))
      navigate(`/config/${key}/base`, {
        state: { type: 'config', primary: key,  title: label, nested: 'base'  } 
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
      dataIndex: "publishStateStr",
      key: "publishStateStr",
      align: "center",
      width: 180,
      // render: (text) => {
      //   return text == 1 ? "已发布" : "未发布";
      // },
    },
    {
      title: "有效期",
      key: "validStageTime",
      dataIndex: "validStageTime",
      align: "center",
      width: 200,
     // render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "操作",
      key: "custop",
      dataIndex: "custop",
      align: "center",
      render: (text, record) => (
        <Space size={32}>
          <CustBtn icon={<SettingOutlined style={{ fontSize: "20px" }}  />} onClick={() => enterProject({id: record.id, type: 1, publishState: record.publishState
})}>
            项目配置
          </CustBtn>
          <CustBtn
            icon={<DesktopOutlined style={{ fontSize: "20px" }} />}
            onClick={() =>
              enterProject({id: record.id, type: 2, publishState: record.publishState
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
    //setFormParams((formParams) => ({ ...formParams, ...formData }));

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
tableProps.pagination.size="default" // 页码大小默认
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
      title: '项目ID',
      key: "projectId",
      align: "center",
    },
    {
      dataIndex: "projectName",
      title: '项目名称',
      key: "projectName",
      align: "center",
    },
    {
      dataIndex: "creatorInfo",
      title: '操作者/手机号',
      key: "creatorInfo",
      align: "center",
    },
    {
      dataIndex: "operate",
      title: '操作类型',
      key: "operate",
      align: "center",
    },
    {
      dataIndex: "detail",
      title: '备注',
      key: "detail",
      align: "center",
      width: 546
    },
    {
      dataIndex: "operationTime",
      title: '操作时间',
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
 
 return  <Opbox>
         
  <Form
    form={opform}
  >
    
      <Item label="操作时间" name="date">
         <RangePicker style={{width: '408px'}} onChange={submit} />
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
 const {roleType} = useSelector(selectUser)
 const operRef = useRef()
 const devOps = () => {
     operRef.current.onOpen();
 }
const closeModl = () => {
  operRef.current.onCancel()
}

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
                {englishTitle || "Integrated Energy Service Platform"}
              </p>
            </div>
          </Space>
          <Space size={32}>
            <UserOutlined style={{ color: "#fff", fontSize: "32px" }} />
            <span className="loginName">{name}</span>
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
            <Space size={64} split={ <Divider
                  dashed
                  style={{ borderColor: "#999", height: "32px", margin: "0px" }}
                  type="vertical"
                />} >
              
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
              <Item name="state">
                <Cselect
                  placeholder="项目状态"
                  w="200px"
                  h="42px"
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
            </Space>
            <Space size={32}>
            <Item noStyle>
              {  roleType == 2 &&    <CustBtn
                  onClick={showproject}
                  icon={
                    <PlusCircleOutlined
                      style={{ color: "#fff", fontSize: "24px" }}
                    />
                  }
                >
                  新增项目
                </CustBtn>
               }
                 {  roleType == 1 &&    <CustBtn 
                  onClick={devOps}
                >
                  运营管理员管理
                </CustBtn>
               }
              </Item>
              <Item noStyle>
                  <CustBtn
                  onClick={opRecord}
                   
                   >
                  操作记录
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


      <Custmodal
        title={<div style={{display: 'flex', justifyContent: 'space-between'}}><span>项目操作历史</span> <Button style={{width: '92px'}} type="primary" onClick={opclose}>关闭</Button></div>}
        ref={opref} 
        width={1424} 
        mold="cust"   
        footer={null}
      >
         <OprecordCom />
         
      </Custmodal>


      <Custmodal
        title="运营管理员账号管理"
        ref={operRef} 
        width={1080} 
        mold="cust"  
        footer={<Space><Button onClick={closeModl}>取消</Button><Button type="primary" onClick={closeModl}>确认</Button></Space>}
      >
         <Account />
         
      </Custmodal>
      </Mainbox>
     
  );
}
