/**
 * @author zhenglin zhu
 * @description: //1 系统管理员 (2 运营管理员 3 项目管理员, 4 运维人员) ； 2 =》 3 =》 4
 * @date 2022-10-13 10:08
 */


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
import { Project } from "@api/api.js";
import { User } from "@api/api.js";
import {CustButton} from "@com/useButton"
import  Custmodl from '@com/useModal'
import Custdrawer from './drawer'
const { Title, Text, Link } = Typography;
const { Option } = Select;
const { Item } = Form;
import {custMsg} from '@com/usehandler'
 
const { 
  
  GetProjectOperator, // 获取运维管理员列表 
  
  GetMenus, // 功能授权
} = Project;
const {
  QueryOperationManager,
  QueryOperationManagers,
  InsertOperationManager,
  QueryProjectManager,
  AddProjectManager, 
  DeleteProjectManager,
  QueryProjectMaintenance,
  InsertProjectMaintenance,
  DeleteProjectMaintenance,
  
} = User
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
export default function Account({projectId, CModal}) {

  const [operate, setOperate] = useState([]); // 运营管理员（选择框）
  const [oplist, setOplist] = useState([]); // 运营管理员（已选择）
  const [admin, setAdmin] = useState([]) //运维管理员 
  const [delinfo, setDelinfo] = useState('') // 删除的信息
  const [deltype, setDeltype] = useState('') // 删除的类型
  const [userId, setUserId] = useState('') //  ID
  const [areas, setAreas] = useState([]) // 项目管理员 园区权限
  const [menuopen, setMenuopen] = useState(false) 
  const [opvalue, setOpvalue] = useState(null) // 暂存选择的运营管理员
  const [manager, setManager] = useState(false) // 是否显示项目管理员 
 const mref = useRef()
 const fmodal = useRef()
 const dref = useRef()
 
 const [person, setPerson] = useState(0) // 新增项目管理员 新增运维人员
 const title = ['新增项目管理员', '新增运维人员'][person]
 const [form] = Form.useForm()

  const menufn = (id) => {
    setUserId(id);
    dref.current.onOpen()
  }
 
  const queryOperationManager = async () => {
    let {success, data} = await QueryOperationManager({                 // 获取运营管理员(选择框)    
      alike: '',
      pageNum: 1,
      pageSize: 150,
    }) 
    success && Array.isArray(data) && setOperate([...data]);
  }

  const queryOperationManagers = async () => {                          // 获取运营管理员(已选择)  
    let {success, data} = await QueryOperationManagers({projectId})
    success  && Array.isArray(data) && setOplist([...data]) 
  }

  const addOperation = async () => {                                    // 新增运营管理员
    let {success } = await InsertOperationManager({projectId, userId: opvalue})
     queryOperationManagers()
     success && setOperate(arr => arr.map(item => ({...item, disabled: item.id == opvalue}))) 
 };

 const queryProjectManager = async () => {                              // 获取项目管理员
    let {success, data} = await QueryProjectManager(projectId)
    
    if (success) {
      setManager(!!data)
      let { name, nickName, mobile,id, areaAuthority=[] } = data || {};    
      setAreas([...areaAuthority])
      form.setFieldsValue({
       name,
       nickName,
       mobile,
        id
      })
    }
    
 }
 
 const addManager = async () => {                                     // 新增项目管理员 ,运维人员  
  try {
    const values = await fmodal.current.onGetvalue()     
    const params = { ...values, enabled: values.enabled? 1 : 0 ,  projectId };
    let hander = ['AddProjectManager', 'InsertProjectMaintenance'][person];
    let update = [queryProjectManager, queryProjectMaintenance][person];
    let { success, errMsg } = await User[hander](params);    
    if (!success) return message.error(errMsg, 1);
    await update()
    fmodal.current.onCancal()
   
  } catch (error) {
    console.log(error);
     
  }
};
 const queryProjectMaintenance = async () => {       // 获取运维人员
      let {success, data} = await  QueryProjectMaintenance({projectId})
      
      success && Array.isArray(data) && setAdmin(data)
 }



  const delop = (id) => {
    setOperate((arr) => {
      let item = arr.find((i) => i.id == id);
      if (item) item.disabled = false;
      return [...arr];
    });
  };
  const handChange = (value) => { 
    setOpvalue(value) 
  }; 


  const addProjectadmin = (type) => {
     try {
      setPerson(type)
      fmodal.current.onOpen();
     } catch (error) {
       console.log(error)
     } 
  };
  const cancal = () => {
      fmodal.current.onResetform()
      fmodal.current.onCancal()
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
  const onDeletehandle = async () => {  
     
    const fn = ["DeleteOperationManager", "DeleteProjectManager", 'DeleteProjectMaintenance'][deltype]; //  删除  运营管理员, 项目管理员， 运维人员
    try {
      let { success, errMsg } = await User[fn]({projectId, userId});  
      if (!success) return message.error(errMsg, 1);      
      let handler = [
        queryOperationManagers,
        queryProjectManager,
        queryProjectMaintenance
      ][deltype]; // 查询 运营管理人员， 项目管理人员 , 运维人员
      message.error('删除成功', 1,  () => {
        handler()
        mref.current.onCancel()
      });
    } catch (error) {
      console.log(error);
    }
  };
  //const msginfo = ['项目管理员', '运维人员', '运营管理员'] // //1 系统管理员 (2 运营管理员 3 项目管理员, 4 运维人员) ； 2 =》 3 =》 4
 
  const onDeleteMsg = (type, userId) => {     
    try { 
      const msg = ['运营管理员', '项目管理员', '运维人员', ][type] 
      setDelinfo(msg);
      setDeltype(type)
      setUserId(userId)
      mref.current.onOpen()
    } catch (error) {
       console.log(error);
      
    }  
  }

  useEffect(() => { 
   queryOperationManager()
   queryOperationManagers()
   queryProjectManager()
   queryProjectMaintenance() 
  }, [projectId])  
  const RenderItem = (data) => {
  return data.map((field, index) => (
    <div className="admin" style={{flex: 1}}>
      <div className="item" >
         <Item name={[index, "name"]} noStyle>
                <Input size="middle" defaultValue={field.name} />
              </Item>
              <Item name={[index, "nickName"]} noStyle>
                <Input size="middle" defaultValue={field.nickName} />
              </Item>
              <Item name={[index, "mobile"]} noStyle>
                <Input size="middle" defaultValue={field.mobile} />
              </Item>
              <Item noStyle>
                 <div style={{ display: "flex" }}>
                       <Space size={16}>  <Pributton onClick={() => menufn(field.id)}>数据权限</Pributton><Pributton onClick={() => menufn(field.id)}>菜单权限</Pributton></Space>
                       <Delbutton onClick={() => onDeleteMsg(2, field.id)}>删除</Delbutton>
                    </div>
              </Item>
              <Item noStyle>
              
              </Item>
      </div>
      <div className="park">
                <Text>园区选择</Text>  {field.areaAuthority?.map(item => (<Ctag key="item">{item}</Ctag>))}
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
                label: "name",
                value: "id",
                disabled: "disabled",
              }}
              options={operate}
              placeholder="请选择运营管理员"
            ></Select>

            {/*   <Button size="middle" style={addstyl} onClick={addOperation} type="primary" ghost >+&nbsp;添加</Button> */}
            <CustButton type="default" onClick={addOperation} style={{padding: '0px', width: '112px'}}>添加运营管理员</CustButton>
          </div>
          <div className="item">
            <Text type="">用户名</Text> <Text>姓名</Text>{" "}
            <Text span={4}>手机号</Text>
          </div>
          {oplist?.map((item) => (
            <div className="item" key={item.id}>
              <Input size="middle" value={item.name} readOnly />
              <Input size="middle" readOnly value={item.nickName} />
              <Input size="middle" readOnly value={item.mobile} />
              <Button   danger onClick={() => onDeleteMsg(0, item.id)} style={{padding: '0px', width: '96px'}}>删除</Button>
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
            <Button type="primary" ghost  onClick={addProjectadmin.bind(null, 0)} disabled={manager}>添加项目管理员</Button>
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
              <Item name="name" noStyle>
                <Input size="middle" />
              </Item>
              <Item name="nickName" noStyle>
                <Input size="middle" />
              </Item>
              <Item name="mobile" noStyle>
                <Input size="middle" />
              </Item>
               
                <Item  noStyle shouldUpdate>
                  { ({getFieldValue }) => {
                   return <div style={{ display: "flex" }}>
                       <Pributton onClick={() => menufn(getFieldValue('id'))}>菜单权限</Pributton>
                       <Delbutton onClick={() => onDeleteMsg(1, getFieldValue('id'))}>删除</Delbutton>
                    </div>
                  }
                  }
                </Item>
              
            </Form>
           
          <div className="park">
             <Text>园区选择</Text> {areas.map(item => (<Ctag key="item">{item}</Ctag>))}
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
            <Button type="primary" ghost  onClick={addProjectadmin.bind(null, 1)} >添加运维人员</Button>
            
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
      
      <Custmodl
              title={title}
              ref={fmodal} 
              fromprops={{enable: true}}
              onCancal={cancal}
              onOk={addManager}
              mold="default"
            >

            </Custmodl>
      <Custmodl mold="cust" title='删除账号'  type="warn"  onOk={onDeletehandle} ref={mref}>
         <p style={{paddingLeft: '32px',color:"#333", display: 'flex', alignItems: 'center', fontSize: '18px'}}><WarningFilled style={{color: '#ff4d4f', fontSize: '38px', marginRight: '32px'}}/>是否确认删除{delinfo}?</p>
      </Custmodl>
     {/*   <Drawer open={menuopen} title="项目权限选择" width={608} closable={false} extra={<Button type="primary">保存</Button>}>
       
         <Table rowSelection={rowSelection} columns={columns} dataSource={menus} rowKey="no" pagination={false}></Table>
       </Drawer> */}
       <Custdrawer projectId={projectId} userId={userId} ref={dref} >
            
      </Custdrawer>
    </Mainbox>
  );
}
