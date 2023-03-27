/**
 * @author zhenglin zhu
 * @description: //1 系统管理员 (2 运营管理员 3 项目管理员, 4 运维人员) ； 2 =》 3 =》 4
 * @date 2022-10-13 10:08
 */


import React, { useEffect, useMemo, useState, useRef } from "react";
import {flushSync} from 'react-dom'
import styled from "styled-components";
import {
  Typography,
  Select,
  Button,
  Input,
  Space,
  Form,
  message,
  Tag
} from "antd";
import {WarningFilled} from '@ant-design/icons'
import { Project } from "@api/api.js";
import { User } from "@api/api.js";
import {useSelector} from 'react-redux'
import {selectUser} from "@redux/user";
import {CustButton} from "@com/useButton"
import  Custmodl from '@com/useModal'
//import Custdrawer from './drawer'
//import Drawerdata from './drawerdata'
import Dataset from './dataSet.jsx'
import Menuset from './menuSet.jsx'
const { Title, Text, Link } = Typography;
const { Option } = Select;
const { Item } = Form;


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
  grid-auto-rows: minmax(32px, auto);
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
const Dbutton = styled(Button).attrs({
  danger: true
})`
   && {
     padding: 0px;
     width: 96px;
     margin-left: auto;
   }
`
const Ctag = styled(Tag)`
 height: 32px;
 padding: 0 23px;
 line-height: 32px; 
`
/* Button type="primary" ghost */
const Pbutton = styled(Button).attrs({
  type: 'primary',
  ghost: true,
})`
  && {
    width: 96px;
  }
`
/* CustButton type="default" onClick={addOperation} style={{padding: '0px', width: '112px'} */

const Abutton = styled(CustButton).attrs({
  type: 'default'
})`
&& {
  padding: 0px;
  width: 112px;
}
 
`
export default function Account({projectId, CModal}) {

  const [operate, setOperate] = useState([]); // 运营管理员（选择框）
  const [oplist, setOplist] = useState([]); // 运营管理员（已选择）
  const [admin, setAdmin] = useState([]) //运维管理员 
  const [delinfo, setDelinfo] = useState('') // 删除的信息
  const [deltype, setDeltype] = useState('') // 删除的类型
  const [userId, setUserId] = useState('') //  ID
  const [areas, setAreas] = useState([]) // 项目管理员 园区权限 
  const [opvalue, setOpvalue] = useState(null) // 暂存选择的运营管理员
  const [manager, setManager] = useState(false) // 是否显示项目管理员 
  const [role, setRole]=useState(NaN)
 const mref = useRef()
 const fmodal = useRef()
 const dref = useRef()
 const dpref  = useRef();
 const [person, setPerson] = useState(0) // 新增项目管理员 新增运维人员
 const title = ['新增项目管理员', '新增运维人员'][person]
 const [form] = Form.useForm()
 const {roleType} = useSelector(selectUser) || {};
 

  const menufn = (id, type, role) => {
    flushSync(() => {
      setUserId(id);
      setRole(role)
    }) 
   
   type == 1 && dref.current.onOpen();

   type == 2 && dpref.current.onOpen();
  }
 
  const queryOperationManager = async () => {
    let {success, data: {data}} = await QueryOperationManager({                 // 获取运营管理员(选择框)    
      alike: '',
      pageNum: 1,
      pageSize: 150,
    }) 
     console.log('data')
     console.log(data)
     success && Array.isArray(data) && setOperate([...data]);
  }

  const queryOperationManagers = async () => {                          // 获取运营管理员(已选择)  
    try {
      let {success, data} = await QueryOperationManagers({projectId})
      setOperate(arr => {
        arr.forEach(a => {
           a.disabled = data?.find(i => i.id == a.id)
        })
        return arr
      })
      success  && Array.isArray(data) && setOplist([...data]) 
    } catch (error) {
      console.log(error)
    }
   
  }

  const addOperation = async () => {                                    // 新增运营管理员

    try {
      if(!opvalue) return message.warning('请选择运营管理员')
      let {success } = await InsertOperationManager({projectId, userId: opvalue})
       queryOperationManagers()
       if (success)  {
       // setOperate(arr => arr.map(item => ({...item, disabled: item.id == opvalue}))) 
        setOpvalue(null)
       }
    } catch (error) {
      console.log(error)
    }
   
 };

 const queryProjectManager = async () => {                              // 获取项目管理员
    try {
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
    } catch (error) {
      console.log(error)
    }
   
    
 }
 
 const addManager = async () => {     
  
  // 新增项目管理员 ,运维人员  
  try {
    console.log(fmodal.current)
    const values = await fmodal.current.onGetvalue()   
    values.validStageTime = values.validStageTime.format('YYYY-MM-DD')  
    const params = { ...values, enabled: values.enabled? 1 : 0 ,  projectId };
    let hander = ['AddProjectManager', 'InsertProjectMaintenance'][person];
    let update = [queryProjectManager, queryProjectMaintenance][person];
    let { success, errMsg } = await User[hander](params);    
    if (!success) return message.error(errMsg || '数据出错');
    if(success) {
      fmodal.current.onCancel()
      await update()
    }
   
   
  } catch (error) {
    console.log(error);
     
  }
};
 const queryProjectMaintenance = async () => {       // 获取运维人员
      try {
        let {success, data} = await  QueryProjectMaintenance({projectId})
        success && Array.isArray(data) && setAdmin(data)
      } catch (error) {
        console.log(error)
      }
      
 }




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
    <div className="admin" style={{flex: 1, borderBottom: 'none'}} key={field.id}>
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
                 <div style={{ display: "flex", justifyContent: "space-between" }}>
                       <Space size={16}>  
                        <Pbutton onClick={() => menufn(field.id, 2, 4)}>数据权限</Pbutton>
                        <Pbutton onClick={() => menufn(field.id, 1, 4)}>菜单权限</Pbutton>
                       
                       </Space>
                       <Dbutton onClick={() => onDeleteMsg(2, field.id)}>删除</Dbutton>
                      {/*  <Button danger  onClick={() => onDeleteMsg(2, field.id)} style={{padding: '0px', width: '96px'}}>删除</Button> */}
                    </div>
              </Item>
              <Item noStyle>
              
              </Item>
      </div>
      <Space size={8} wrap>
                <Text>园区选择</Text>  {field.areaAuthority?.map(item => (<Ctag key="item">{item.name}</Ctag>))} 
       </Space>
      </div>
    ))
  }
  return (
    <Mainbox>
     
        
      { roleType ==1 ?  <div className="admin">
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
            <Abutton  onClick={addOperation}>添加运营管理员</Abutton>
          </div>
          <div className="item">
            <Text type="">用户名</Text> <Text>姓名</Text>{" "}
            <Text>手机号</Text>
          </div>
          {oplist?.map((item) => (
            <div className="item" key={item.id}>
              <Input size="middle" value={item.name} readOnly />
              <Input size="middle" readOnly value={item.nickName} />
              <Input size="middle" readOnly value={item.mobile} />
              <Dbutton   onClick={() => onDeleteMsg(0, item.id)}>删除</Dbutton>
            </div>
          ))}
        </div>
        : null
          }
      {roleType == 2 || roleType == 1 ?  
        <div className="admin">
          <Space size={16}>
            <Title level={5} className="title">
              项目管理员（仅支持添加一位项目管理员）
            </Title>
            <Abutton  onClick={addProjectadmin.bind(null, 0)} disabled={manager}>添加项目管理员</Abutton>
          </Space>
          <div className="item">
            <Text type="">用户名</Text> <Text>姓名</Text>{" "}
            <Text >手机号</Text>
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
                   return <div style={{ display: "flex",justifyContent: 'justify-content' }}>
                          <Pbutton onClick={() => menufn(getFieldValue('id'), 1, 3)}>菜单权限</Pbutton>
                          <Dbutton  onClick={() => onDeleteMsg(1, getFieldValue('id'))} >删除</Dbutton>
                    </div>
                  }
                  }
                </Item>
              
            </Form>
           
          <Space size={8} wrap>
             <Text>园区选择</Text> {areas.map(item => (<Ctag key="item">{item.name}</Ctag>))}
          </Space>
          </>)
           }
        </div>
       : null
      }  
     {roleType == 3 || roleType == 1  ? <div className="admin">
          <Space size={16}>
            <Title level={5} className="title">
              运维人员（支持添加多位运维人员）
            </Title>
            <Abutton  onClick={addProjectadmin.bind(null, 1)} >添加运维人员</Abutton>
            
          </Space>
          <div className="item">
            <Text type="">用户名</Text> <Text>姓名</Text>{" "}
            <Text>手机号</Text>
          </div>
        
              <Form
              layout="inline"
              readOnly
            >
              {admin?.length > 0 && RenderItem(admin)}
             </Form>
        </div>
      : null
      }
      <Custmodl
              title={title}
              ref={fmodal} 
              fromprops={{enable: true}}
            //  onCancal={cancal}
              onOk={addManager}
              mold="default"             
            >

            </Custmodl>
      <Custmodl mold="cust" title='删除账号'  type="warn"  onOk={onDeletehandle} ref={mref} >
         <p style={{paddingLeft: '32px',color:"#333", display: 'flex', alignItems: 'center', fontSize: '18px'}}><WarningFilled style={{color: '#ff4d4f', fontSize: '38px', marginRight: '32px'}}/>是否确认删除{delinfo}?</p>
      </Custmodl>
     {/*   <Drawer open={menuopen} title="项目权限选择" width={608} closable={false} extra={<Button type="primary">保存</Button>}>
       
         <Table rowSelection={rowSelection} columns={columns} dataSource={menus} rowKey="no" pagination={false}></Table>
       </Drawer> */}

       
     





       <Menuset projectId={projectId} userId={userId} ref={dref} role={role}>
            
      </Menuset>
      <Dataset projectId={projectId} userId={userId} ref={dpref} ></Dataset>
    </Mainbox>
  );
}
