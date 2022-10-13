import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  Typography,
  Select,
  Row,
  Col,
  Button,
  Input,
  Space,
  Drawer,
  Modal,
  Form,
  message,
  Table
} from "antd";
import {WarningFilled} from '@ant-design/icons'
import { useRequest } from "ahooks";
import { Project } from "@api/api.js";
import Custmodal from "./modal";
const { Title, Text, Link } = Typography;
const { Option } = Select;
const { Item } = Form;
const {
  getOperationManagerUsers, // 获取运营管理员列表 
  getProjectUser, // 获取项目管理员列表
  GetProjectOperator, // 获取运维管理员列表
  ProjectAddOperationManager,
  addProjectUser,
 
  DeleteOperationManager, //  删除运营管理员
  DeleteProjectUser, // 删除项目管理员或者运维人员
  GetMenus, // 功能授权
} = Project;
/**
 * @author zhenglin zhu
 * @description: //1 系统管理员 (2 运营管理员 3 项目管理员, 4 运维人员) ； 2 =》 3 =》 4
 * @date 2022-10-13 10:08
 */
const msginfo = ['', '', '运营管理员', '项目管理员', '运维人员']
export default function Account() {
  const Mainbox = styled.div`
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: 1090px 1fr;
    row-gap: 16px;

    div.admin {
      padding: 16px 0;
      display: grid;
      grid-auto-rows: 32px;
      row-gap: 16px;
      border-bottom: 1px dotted #dedede;
      .item {
        display: grid;
        grid-template-columns: 160px 160px 256px 1fr;
        column-gap: 16px;
        .as {
          grid-area: 1 / 1 / 2/ 3;
        }
      }
      .title {
        font-size: 14px;
        width: 336px;
      }
    }
  `;
  const [operate, setOperate] = useState([]);
  const [opvalue, setOpvalue] = useState("");
  const [open, setOpen] = useState(false);
  const [msgopen, setMsgopen] = useState(false)
  const [menuopen, setMenuopen] = useState(false)
  const [menus, setMenus] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [delmsg, setDelmsg] = useState('')
  const [delarg, setDelarg] = useState({
    type: '',
    projectId: 1, // 暂时写死
    userId: ''
  })
  const [admin, setAdmin] = useState({
    LoginName: "",
    NickName: "",
    Mobile: "",
    id: ''
  });
  const {runAsync: runMenu} = useRequest(GetMenus, { // 获取菜单
    manual: true,
     
  })
  const up = (index, row, data) => {
    // 上移
    let prerow = data[index - 1];
    data[index] = prerow;
    data[index - 1] = row;
  };
  const down = (index, row, data) => {
    // 下移
    let nextrow = data[index + 1];
    data[index] = nextrow;
    data[index + 1] = row;
  }
  const rowmove = (record, index) => {
      
  }
  
  const onSelectChange = (newSelectedRowKeys) => {
    console.log(newSelectedRowKeys)
   
   
    setSelectedRowKeys((arr) => [...new Set([...arr, ...newSelectedRowKeys])]);
    console.log(selectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const columns = [
    {
    title: 'name',
    dataIndex: 'name',
     
   },
   {
    title: '',
    dataIndex: 'up',
    render: (_, record, index) => (<Link onClick={() => rowmove(record, index, 'up')}>上移一行</Link>)
   },
   {
    title: '',
    dataIndex: 'down',
    render: (_, record, index) => (<Link onClick={() => rowmove(record, index, 'down')}>下移一行</Link>)
   }
]
  const menufn = () => { 
    console.log(admin)
    setMenuopen(true)
     runMenu({projectId: 1, userId: admin.id}).then(res => {
        
         let {success, data: {menuList}} = res        
         success && setMenus(menuList) && setMenuopen(true)
        
     }).catch(e => {
      console.log(e)
     })
  }
  const {run: runmg} = useRequest(getOperationManagerUsers, { // 获取运营管理员
    manual: true,
    onSuccess: (res) => {
      const { success, data } = res;
      success && setOperate(data);
    },
  });
  const {run: runadmin} = useRequest(getProjectUser, { // 获取项目管理员
    manual: true,   
    onSuccess: ({ success, data }) => {
      if (success && Array.isArray(data) && data.length > 0) {
        let { loginName, nickName, mobile,id } = data[0];
        setAdmin((o) => ({
          ...o,
          LoginName: loginName,
          NickName: nickName,
          Mobile: mobile,
          id
        }));
      }
    },
  });
  const {run: runop} = useRequest(GetProjectOperator, { // 获取运营人员
    manual: true,   
    onSuccess: ({ success, data }) => {
      if (success && Array.isArray(data) && data.length > 0) {
        let { loginName, nickName, mobile,id } = data[0];
        setAdmin((o) => ({
          ...o,
          LoginName: loginName,
          NickName: nickName,
          Mobile: mobile,
          id
        }));
      }
    },
  });
  const addOperation = () => {
    setOperate((arr) => {
      let item = arr.find((i) => i.id == opvalue);
      if (item) item.disabled = true;
      return [...arr];
    });
  };
  const delop = (id) => {
    setOperate((arr) => {
      let item = arr.find((i) => i.id == id);
      if (item) item.disabled = false;
      return [...arr];
    });
  };
  const handChange = (value, options) => {
    console.log(options);
    setOpvalue(value);
  }; 
  const oplist = useMemo(() => {
    return operate.filter((item) => item.disabled);
  }, [operate]);

  const addProjectadmin = () => {
    setOpen(true);
  };
  const cancal = () => {
    setOpen(false);
  };
  const ok = async (values) => {
    const params = { ...values, RoleType: 3, ProjectId: "1" };
    try {
      let { success, errMsg } = await addProjectUser(params);
      console.log(success);
      if (!success) message.error(errMsg, 1);
      return success;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const Pributton = ({
    children = "",
    width = "112px",
    onClick = () => {},
    ...other
  } = {}) => {
    return (
      <Button
        size="middle"
        style={{ width: width, padding: "0px" }}
        onClick={onClick}
        type="primary"
        ghost
        {...other}
      >
        {children}
      </Button>
    );
  };
  const Delbutton = ({
    children = "",
    width = "96px",
    onClick = () => {},
    ...other
  } = {}) => {
    return (
      <Button
        size="middle"
        danger
        style={{ width: width, padding: "0px", marginLeft: "auto" }}
        onClick={onClick}
        {...other}
      >
        删除
      </Button>
    );
  };
  const onDeletehandle = async ( ) => { 
    let {type, userId} = delarg
    let i = type == 2 ? 1 : type;
    const fn = ["DeleteOperationManager", "DeleteProjectUser"][i]; // 删除项目管理员或者运维人员, 删除运营人员
    try {
      let { success, errMsg } = await Project[fn](1, userId); // 项目ID暂时写死！！！
      if (!success) return message.error(errMsg, 1);      
      let handler = [
        runadmin,
        runmg,
        runop
      ][type]; // 获取 项目管理人员 , 运维人员    运营管理人员，
      message.error('删除成功', 1,  handler);
    } catch (error) {
      console.log(error);
    }
  };
  const msginfo = ['项目管理员', '运维人员', '运营管理员'] // //1 系统管理员 (2 运营管理员 3 项目管理员, 4 运维人员) ； 2 =》 3 =》 4
  const onDeleteMsg = (type, id) => {     
     setDelmsg(msginfo[type])
     setDelarg(o => ({...o, type, userId: id}))
     setMsgopen(true)
  }
  const onDeleteMsgClose = () => {
     setMsgopen(false)
  }
  useEffect(() => {
    runadmin(1)
    runmg()
    runop(1)
  }, []) // 需要projectId
  const CustDrawer = ({menuopen, rowSelection, columns, menus}) => {

   return (
     <Drawer open={menuopen} title="项目权限选择" width={608} closable={false} extra={<Button type="primary">保存</Button>}>
       <Table rowSelection={rowSelection} columns={columns} dataSource={menus} rowKey="no" pagination={false}></Table>
    </Drawer>
   )
  }
  return (
    <Mainbox>
      <div>
        <div className="admin">
          <Title level={5} className="title">
            运营管理员（支持添加多位运营管理员）
          </Title>
          <div className="item">
            <Select
              size="middle"
              className="as"
              value={opvalue}
              onChange={handChange}
              fieldNames={{
                label: "loginName",
                value: "id",
                disabled: "disabled",
              }}
              options={operate}
              placeholder="请选择运营管理员"
            ></Select>

            {/*   <Button size="middle" style={addstyl} onClick={addOperation} type="primary" ghost >+&nbsp;添加</Button> */}
            <Pributton onClick={addOperation}>+&nbsp;添加</Pributton>
          </div>
          <div className="item">
            <Text type="">用户名</Text> <Text>姓名</Text>{" "}
            <Text span={4}>手机号</Text>
          </div>
          {oplist.map((item) => (
            <div className="item" key={item.id}>
              <Input size="middle" value={item.loginName} readOnly />
              <Input size="middle" readOnly value={item.nickName} />
              <Input size="middle" readOnly value={item.mobile} />
              <Delbutton onClick={() => onDeleteMsg(2, item.id)}></Delbutton>
            </div>
          ))}
        </div>
        <div className="admin">
          <Space size={16}>
            <Title level={5} className="title">
              项目管理员（仅支持添加一位项目管理员）
            </Title>
            <Pributton onClick={addProjectadmin}>添加项目管理员</Pributton>
          </Space>
          <div className="item">
            <Text type="">用户名</Text> <Text>姓名</Text>{" "}
            <Text span={4}>手机号</Text>
          </div>
          <Form.Provider
            onFormFinish={(name, { values, forms }) => {
              if (name == "modalform") {
                const { useform } = forms;
                useform.setFieldsValue({
                  ...values,
                });
              }
            }}
          >
            <Form
              name="useform"
              layout="inline"
              className="item"
              initialValues={admin}
              readOnly
            >
              <Item name="LoginName" noStyle>
                <Input size="middle" />
              </Item>
              <Item name="NickName" noStyle>
                <Input size="middle" />
              </Item>
              <Item name="Mobile" noStyle>
                <Input size="middle" />
              </Item>
               
                <Item  noStyle shouldUpdate>
                  { ({getFieldValue }) => {
                   return <div style={{ display: "flex" }}>
                       <Pributton onClick={() => menufn(getFieldValue('id'))}>菜单权限</Pributton>
                       <Delbutton onClick={() => onDeleteMsg(0, getFieldValue('id'))}>删除</Delbutton>
                    </div>
                  }
                  }
                </Item>
              
            </Form>
            <Custmodal
              title="新增项目管理员"
              open={open}
              cancal={cancal}
              ok={ok}
            ></Custmodal>
          </Form.Provider>
        </div>
        <div className="admin">
          <Space size={16}>
            <Title level={5} className="title">
              运维人员（支持添加多位运维人员）
            </Title>
            <Pributton>
              添加运维人员
            </Pributton>
          </Space>
        </div>
      </div>
      <Custmodal mold="msg" title='删除账号' open={msgopen} type="warn" cancal={onDeleteMsgClose} ok={onDeletehandle}>
         <p style={{paddingLeft: '32px',color:"#333", display: 'flex', alignItems: 'center', fontSize: '18px'}}><WarningFilled style={{color: '#ff4d4f', fontSize: '38px', marginRight: '32px'}}/>是否确认删除{delmsg}</p>

      </Custmodal>
     {/*   <Drawer open={menuopen} title="项目权限选择" width={608} closable={false} extra={<Button type="primary">保存</Button>}>
       
         <Table rowSelection={rowSelection} columns={columns} dataSource={menus} rowKey="no" pagination={false}></Table>
       </Drawer> */}
       <CustDrawer menuopen={menuopen} rowSelection={rowSelection} columns={columns} menus={menus} />
    </Mainbox>
  );
}
