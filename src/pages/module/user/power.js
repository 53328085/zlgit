import React, { useEffect, useMemo, useState, useRef } from "react";
import styled from "styled-components";
import {
  Typography,
  Select,
  Button,
  Input,
  Space,
  Drawer,
  Form,
  message,
  Table,
  Tag

} from "antd";
import {WarningFilled} from '@ant-design/icons'
import { useRequest } from "ahooks";
import { Project } from "@api/api.js";
import Custmodal from "@com/useModal";

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
    grid-template-rows: repeat(3, auto);
     max-width: 1090px;
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
      .park {
        display: flex;
        align-items: center;
        .ant-typography {
          margin-right: 16px;
        }
      }
    }
  `;
  const Ctag = styled(Tag)`
     height: 32px;
     padding: 0 23px;
     line-height: 32px;
     margin-right: 16px;
   
  `
  const [operate, setOperate] = useState([]); // 运营管理员
  const [admin, setAdmin] = useState([]) //运维管理员 
  const [menuopen, setMenuopen] = useState(false)
  const [menus, setMenus] = useState([])
  const [opvalue, setOpvalue] = useState('')
  const [manager, setManager] = useState(false) // 是否显示项目管理员 
 const modal = useRef()
 const fmodal = useRef()
  const {runAsync: runMenu} = useRequest(GetMenus, { // 获取菜单
    manual: true,
     
  })
 const [title, setTitle] = useState('新增项目管理员')
 const [form] = Form.useForm()
  const menufn = () => { 
   
    setMenuopen(true)
    const userId = form.getFieldValue('id')
     runMenu({projectId: 1, userId}).then(res => {
        
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
  const {run: runadmin, runAsync: runAsyncadmin} = useRequest(getProjectUser, { // 获取项目管理员
    manual: true,   
    onSuccess: ({ success, data }) => {
      console.log('项目管理员', data)
      if (success && Array.isArray(data) && data.length > 0) {
        setManager(true)
        let { loginName, nickName, mobile,id } = data[0];       
        form.setFieldsValue({
          LoginName: loginName,
          NickName: nickName,
          Mobile: mobile,
          id
        })
      } else {
        setManager(false)
      }
    },
    onError: () => {
      setManager(false)
    }
  });
  
  const {run: runop} = useRequest(GetProjectOperator, { // 获取运维人员
    manual: true,   
    onSuccess: ({ success, data }) => {
      if (success && Array.isArray(data) && data.length > 0) {
         setAdmin(data)
        console.log(admin)
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
    console.log(fmodal.current.onOpen)
     try {
      fmodal.current.onOpen();
     } catch (error) {
       console.log(error)
     }
    // 
  };
  const cancal = () => {
      fmodal.current.onResetform()
      fmodal.current.onCancal()
  };
  const ok = async () => {
   
    try {
      const values = await fmodal.current.onGetvalue()     
      const params = { ...values, RoleType: 3, ProjectId: "1" };
      let { success, errMsg } = await addProjectUser(params);    
      if (!success) return message.error(errMsg, 1);
      runAsyncadmin(1).finally(() => {
        cancal()
      })
       
     
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
  const delarg = {
    type: '',
    userId: '',
    projectId : 1, // 暂时写死
  }
  const onDeletehandle = async () => { 
    let {type, userId} = delarg
    let i = type < 2 ? 0 : 1;
    const fn = ["DeleteProjectUser", "DeleteOperationManager"][i]; // 删除项目管理员或者运维人员, 删除运营人员
    try {
      let { success, errMsg } = await Project[fn](1, userId); // 项目ID暂时写死！！！
      if (!success) return message.error(errMsg, 1);      
      let handler = [
        runadmin(1),
        runmg,
        runop
      ][type]; // 获取 项目管理人员 , 运维人员    运营管理人员，
      message.error('删除成功', 1,  () => {
        handler()
        modal.current.onCancel()
      });
    } catch (error) {
      console.log(error);
    }
  };
  const msginfo = ['项目管理员', '运维人员', '运营管理员'] // //1 系统管理员 (2 运营管理员 3 项目管理员, 4 运维人员) ； 2 =》 3 =》 4
  let delmsg = ''
  const onDeleteMsg = (type, id) => {      
     delmsg = msginfo[type]
     delarg.type = type
     delarg.userId = id
     modal.current.onOpen()
  }

  useEffect(() => {
    runadmin(1)
    runmg()
    runop(1)
  }, []) // 需要projectId

  const saveMenu =() => {}
  const closemenu = () => {
    setMenuopen(false)
  }
  const CustDrawer = ({menuopen, onClose=()=> {}, menus=[]}={} ) => {
    const [tbdata, setTbdata] = useState(menus)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    
    const rowmove = {
      up: (record,index) => {
        setTbdata(arr => {
          let prerow = arr[index - 1];
          arr[index] = prerow;
          arr[index - 1] = record;
          console.log(arr)
          return [...arr]
        })
     
      },
      down: (record,index) => {
        setTbdata(arr => {
          let nextrow = arr[index + 1];
          arr[index] = nextrow;
          arr[index + 1] = record;
          return [...arr]
        })
       
      }
    }
    const rowlen = useMemo(() => menus.length, [menus])
   
    const onSelectChange = (selectedRowKeys, selectedRows) => {
     //  console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
     // setSelectedRowKeys((arr) => [...new Set([...arr, ...newSelectedRowKeys])]);
     // console.log(selectedRowKeys)
    }
    const rowSelection = {
     // selectedRowKeys,
      onChange: onSelectChange,
    }
    const columns = [
      {
      title: '预付费的菜单',
      dataIndex: 'name',
       
     },
     {
      title: '',
      dataIndex: 'up',
      render: (_, record, index) => index !==0 && (<Link onClick={() => rowmove.up(record, index)}>上移一行</Link>)
     },
     {
      title: '',
      dataIndex: 'down',
      render: (_, record, index) => index <  rowlen - 1 && (<Link onClick={() => rowmove.down(record, index)} type="danger">下移一行</Link>)
     }
  ]
    return (
      <Drawer open={menuopen} title="项目权限选择" width={608} onClose={onClose} closable={false}  extra={<Pributton type="primary" onClick={() => saveMenu()}>保存</Pributton>}>
          <Table rowSelection={rowSelection} columns={columns} dataSource={tbdata} rowKey="no" pagination={false}></Table>
      </Drawer>
    )
  }
  const RenderItem = (data) => {
  return data.map((field, index) => (
    <div className="admin" style={{flex: 1}}>
      <div className="item" >
         <Item name={[index, "LoginName"]} noStyle>
                <Input size="middle" defaultValue={field.loginName} />
              </Item>
              <Item name={[index, "NickName"]} noStyle>
                <Input size="middle" defaultValue={field.nickName} />
              </Item>
              <Item name={[index, "Mobile"]} noStyle>
                <Input size="middle" defaultValue={field.mobile} />
              </Item>
              <Item noStyle>
                 <div style={{ display: "flex" }}>
                       <Space size={16}>  <Pributton onClick={() => menufn(field.id)}>数据权限</Pributton><Pributton onClick={() => menufn(field.id)}>菜单权限</Pributton></Space>
                       <Delbutton onClick={() => onDeleteMsg(0, field.id)}>删除</Delbutton>
                    </div>
              </Item>
              <Item noStyle>
              
              </Item>
      </div>
      <div className="park">
                <Text>园区选择</Text> <Ctag>温州园区</Ctag> <Ctag>滨江园区</Ctag>
              </div>
      </div>
    ))
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
        </div>
        <div>
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
         
          {manager && (<><Form
              form={form}
              layout="inline"
              className="item"
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
           
          <div className="park">
             <Text>园区选择</Text> <Ctag>温州园区</Ctag> <Ctag>滨江园区</Ctag>
          </div>
          </>)
           }
        </div>
        </div>
        <div>
        <div className="admin">
          <Space size={16}>
            <Title level={5} className="title">
              运维人员（支持添加多位运维人员）
            </Title>
            <Pributton>
              添加运维人员
            </Pributton>
          </Space>
          <div className="item">
            <Text type="">用户名</Text> <Text>姓名</Text>{" "}
            <Text span={4}>手机号</Text>
          </div>
        
              <Form
              layout="inline"
              readOnly
            >
              {admin?.length > 0 && RenderItem(admin)}
             </Form>
        </div>
      </div>
      
      <Custmodal
              title={title}
              ref={fmodal} 
              onCancal={cancal}
              onOk={ok}
              mold="default"
            ></Custmodal>
      <Custmodal mold="cust" title='删除账号'  type="warn"  onOk={onDeletehandle} ref={modal}>
         <p style={{paddingLeft: '32px',color:"#333", display: 'flex', alignItems: 'center', fontSize: '18px'}}><WarningFilled style={{color: '#ff4d4f', fontSize: '38px', marginRight: '32px'}}/>是否确认删除{delmsg}</p>

      </Custmodal>
     {/*   <Drawer open={menuopen} title="项目权限选择" width={608} closable={false} extra={<Button type="primary">保存</Button>}>
       
         <Table rowSelection={rowSelection} columns={columns} dataSource={menus} rowKey="no" pagination={false}></Table>
       </Drawer> */}
       <CustDrawer menuopen={menuopen} menus={menus} onClose={() => closemenu()}>
            
      </CustDrawer>
    </Mainbox>
  );
}
