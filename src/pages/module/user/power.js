/**
 * @author zhenglin zhu
 * @description: //1 系统管理员 (2 运营管理员 3 项目管理员, 4 运维人员) ； 2 =》 3 =》 4
 * @date 2022-10-13 10:08
 */

import React, { useEffect, useMemo, useState, useRef } from "react";
import { flushSync } from "react-dom";
import styled, {css} from "styled-components";
import {
  Typography,
  Select,
  Button,
  Input,
  Space,
  Form,
  message,
  Tag,
} from "antd";
import dayjs from 'dayjs';
import { WarningFilled } from "@ant-design/icons";
import { Project } from "@api/api.js";
import { User } from "@api/api.js";
import { useSelector } from "react-redux";
import {nanoid} from '@reduxjs/toolkit'
//levelDefaultLabel
import { selectUser } from "@redux/user";
import { levelDefaultLabel } from "@redux/systemconfig";
import { CustButton } from "@com/useButton";
import Custmodl from "@com/useModal";
import { custMsg } from "@com/usehandler";
//import Custdrawer from './drawer'
//import Drawerdata from './drawerdata'
import Dataset from "./dataSet.jsx";
import Menuset from "./menuSet.jsx";
import {isObject} from '@com/usehandler'
import {useTranslation} from "react-i18next"
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
} = User;
const sty = css`
.item {
  grid-template-columns: repeat(4, 120px) 1fr;
   
}
`
const Mainbox = styled.div`
  display: grid;
  grid-template-rows: repeat(3, auto);
  //max-width: 1090px;
  row-gap: 16px;

  div.admin {
    padding-top: 16px;
    display: grid;
    grid-auto-rows: minmax(32px, auto);
    row-gap: 16px;
    border-bottom: 1px dotted #dedede;
    .item {
      display: grid;
      grid-template-columns: 160px 160px 256px 256px auto;
      
      column-gap: 16px;
      .ant-space-align-center{
        margin-left: auto;
      }
      .as {
        grid-area: 1 / 1 / 2/ 3;
      }
    }
    .title {
      font-size: 14px;
      width: auto;
    }
    .park {
      display: flex;
      align-items: center;
      .ant-typography {
        margin-right: 16px;
      }
    }
    ${props=> props.theme.laptop ? sty : null}
  }
`;
const Dbutton = styled(Button).attrs({
  danger: true,
})`
  && {
    padding: 0px;
    width: 96px;
    margin-left: auto;
  }
`;
const Ctag = styled(Tag)`
  height: 32px;
  padding: 0 23px;
  line-height: 32px;
`;
/* Button type="primary" ghost */
const Pbutton = styled(Button).attrs({
  type: "primary",
  ghost: true,
})`
  && {
    width: 'auto',;
  }
`;
/* CustButton type="default" onClick={addOperation} style={{padding: '0px', width: '112px'} */

const Abutton = styled(CustButton).attrs({
  type: "default",
  
})`
  && {
    padding: 0px 8px;
    width: auto;
  }
`;
export default function Account({ projectId, CModal }) {
  const [operate, setOperate] = useState([]); // 运营管理员（选择框）
  const [oplist, setOplist] = useState([]); // 运营管理员（已选择）
  const [admin, setAdmin] = useState([]); //运维管理员
  const [delinfo, setDelinfo] = useState(""); // 删除的信息
  const [deltype, setDeltype] = useState(""); // 删除的类型
  const [userId, setUserId] = useState(""); //  ID
  const [areas, setAreas] = useState([]); // 项目管理员 园区权限
  const [opvalue, setOpvalue] = useState(null); // 暂存选择的运营管理员
  const [manager, setManager] = useState(false); // 是否显示项目管理员
  const [role, setRole] = useState(NaN);
  const mref = useRef();
  const fmodal = useRef();
  const dref = useRef();
  const dpref = useRef();
  const editref = useRef(); // 编辑用户弹窗
  const [person, setPerson] = useState(0); // 新增项目管理员 新增运维人员
  const title = ["新增项目管理员", "新增运维人员"][person];
  const [form] = Form.useForm();
  const { roleType } = useSelector(selectUser) || {};
  const defaultLabel = useSelector(levelDefaultLabel);
  const [editTitle, setEdit] = useState("");
  const [initform, setInitialValues] = useState({
    password: false,
    enable: true,
    initialValues: {},
  }); // 编辑账号初始化表单数据
  const edituerinfo = useRef(); // 编辑的账号数据
  const newpwd = useRef(); // 重置密码
  const rref = useRef();
  const {t} =useTranslation("common","comm")

  const menufn = (id, type, role) => {
    flushSync(() => {
      setUserId(id);
      setRole(role);
    });

    type == 1 && dref.current.onOpen();

    type == 2 && dpref.current.onOpen();
  };

  const queryOperationManager = async () => {
    try {
      let {
        success,
        data,
      } = await QueryOperationManager({
        // 获取运营管理员(选择框)
        alike: "",
        pageNum: 1,
        pageSize: 150,
      });
      if (data && data.data) {
        success && Array.isArray(data.data) && setOperate([...data.data]);
      }
     
    } catch (error) {
      console.log(error)
    }
   
  };

  const queryOperationManagers = async () => {
    // 获取运营管理员(已选择)
    try {
      let { success, data } = await QueryOperationManagers({ projectId });
      setOperate((arr) => {
        arr.forEach((a) => {
          a.disabled = data?.find((i) => i.id == a.id);
        });
        return arr;
      });
      success && Array.isArray(data) && setOplist([...data]);
    } catch (error) {
      console.log(error);
    }
  };

  const addOperation = async () => {
    // 新增运营管理员

    try {
      if (!opvalue) return message.warning("请选择运营管理员");
      let { success } = await InsertOperationManager({
        projectId,
        userId: opvalue,
      });
      queryOperationManagers();
      if (success) {
        // setOperate(arr => arr.map(item => ({...item, disabled: item.id == opvalue})))
        setOpvalue(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [managerdata, setManagerData] = useState({});
  const queryProjectManager = async () => {
    // 获取项目管理员
    try {
      let { success, data } = await QueryProjectManager(projectId);

      if (success) {
        setManager(!!data);
        let { validStageTime, areaAuthority = [], ...params } = data || {};
        setManagerData({ validStageTime, ...params });
        setAreas([...areaAuthority]);
        form.setFieldsValue({
          ...params,
          validStageTime: dayjs(validStageTime, "YYYY-MM-DD").format(
            "YYYY/MM/DD"
          ),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addManager = async () => {
    // 新增项目管理员 ,运维人员
    try {
      let content = ['编辑成功','新增成功'][person] ;
      const values = await fmodal.current.onGetvalue();
      values.validStageTime = values.validStageTime.format("YYYY-MM-DD");
      const params = { ...values, enabled: values.enabled ? 1 : 0, projectId };
      let hander = ["AddProjectManager", "InsertProjectMaintenance"][person];
      let update = [queryProjectManager, queryProjectMaintenance][person];
      let { success, errMsg } = await User[hander](params);
     
      if (success) {
        message.success(content)
       if(person == 1)  {
        fmodal.current.onResetform();
       }
       if(person == 0)  fmodal.current.onCancel();
        update();
      }else {
        message.error(errMsg || "数据出错");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const queryProjectMaintenance = async () => {
    // 获取运维人员
    try {
      let { success, data, errMsg} = await QueryProjectMaintenance({ projectId });

      if(success && Array.isArray(data)) {
        setAdmin(data)
      }else {
         if(!success) message.warning(errMsg || '数据出错')
         setAdmin([])
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handChange = (value) => {
    setOpvalue(value);
  };

  const addProjectadmin = (type) => {
    try {
      setPerson(type);
      fmodal.current.onOpen();
    } catch (error) {
      console.log(error);
    }
  };

  const onDeletehandle = async () => {
    const fn = [
      "DeleteOperationManager",
      "DeleteProjectManager",
      "DeleteProjectMaintenance",
    ][deltype]; //  删除  运营管理员, 项目管理员， 运维人员
    try {
      let { success, errMsg } = await User[fn]({ projectId, userId });
      if (!success) return message.error(errMsg, 1);
      let handler = [
        queryOperationManagers,
        queryProjectManager,
        queryProjectMaintenance,
      ][deltype]; // 查询 运营管理人员， 项目管理人员 , 运维人员
      message.success('删除成功')
      mref.current.onCancel();
      handler();
     /*  message.success("删除成功", 1, () => {
        handler();
        mref.current.onCancel();
      }); */
    } catch (error) {
      console.log(error);
    }
  };
  //const msginfo = ['项目管理员', '运维人员', '运营管理员'] // //1 系统管理员 (2 运营管理员 3 项目管理员, 4 运维人员) ； 2 =》 3 =》 4

  const onDeleteMsg = (type, userId) => {
    try {
      const msg = [t("common:OperationsAdministrator"),t("common:ProjectManager"),t("common:O&MPersonnel")][type];
      setDelinfo(msg);
      setDeltype(type);
      setUserId(userId);
      mref.current.onOpen();
    } catch (error) {
      console.log(error);
    }
  };

  // 编辑账号 start
  const editType = useRef();
  const useEdit = (item, type) => {
    editType.current = type;
    edituerinfo.current = item;
    let title = ["", "", t("common:EditOperationsAdministrator"),t("common:EditProjectManager"), t( "common:EditO&MPersonnel")][
      type
    ];
    let name = ["", "", "运营管理员", "项目管理员", "运维人员"][type];
    item.validStageTime = dayjs(item.validStageTime, "YYYY-MM-DD HH:mm:ss");
    item.enabled = item.enabled == 1;
    flushSync(() => {
      setInitialValues({
        ...initform,
        roletype: [{ name, id: type }],
        initialValues: { ...item, mobile: '',RoleType: type },
      });
      setEdit(title);
    });
    editref.current.onOpen();
  };

  const updateData = () => {
    // 编辑以后更新数据
    if (editType.current == 2) {
      queryOperationManagers();
      queryOperationManager();
    }
    if (editType.current == 3) {
      queryProjectManager();
    }
    if (editType.current == 4) {
      queryProjectMaintenance();
    }
  };

  const onOkedit = async () => {
    try {
      let { id } = edituerinfo.current;
      let values = await editref.current.onGetvalue();
      console.log(values.validStageTime.format("YYYY-MM-DD"));

      let { RoleType, ...params } = values;
      params.validStageTime = params.validStageTime.format("YYYY-MM-DD");
      params.enabled = Number(params.enabled);

      let { success, errMsg} = await User.Update({ ...params, id });
      success && editref.current.onCancel();
      if (success) {
        updateData();
      }else {
        message.error(errMsg || '数据出错', 1)
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 编辑账号 end

  // 重置密码 start
  const [username, setUsername] = useState({});

  const reset = (record) => {
    setUsername({ ...record });
    newpwd.current = `wuLian@${Math.random().toString().slice(2,8)}`
    rref.current.onOpen();
  };
  const restOk = async () => {
    try {
      const { id } = username;
      const { success, errMsg } = await User.ResetPassword({
        id,
        pwd: newpwd.current,
      });
      console.log(success);
      success &&
        custMsg({
          success,
          content: "密码重置成功",
          onClose: () => {
            rref.current.onCancel();
            updateData();
          },
        });
      !success && custMsg({ success, content: errMsg, type: "warning" });
    } catch (error) {
      console.log(error);
    }
  };

  // 重置密码 end

  useEffect(() => {
    queryOperationManager();
    queryOperationManagers();
    queryProjectManager();
    queryProjectMaintenance();
  }, [projectId]);
 const RenderItem = ({field}) => {
    let [form] = Form.useForm()
    useEffect(() => {
      if(isObject(field)) {
         let {validStageTime, ...reset} = field
         form.setFieldsValue({...reset})
         form.setFieldValue("validStageTime",dayjs(
           validStageTime,
          "YYYY-MM-DD HH:mm:ss"
        ).format("YYYY/MM/DD"))
      }

    }, [field])
    return  (
      <Form form={form}>
      <div
        className="admin"
        style={{ flex: 1, borderBottom: "none" }}
        key={nanoid()}
      >
        <div className="item">
          <Item name="name" noStyle   >
            <Input size="middle"  />
          </Item>
          <Item name="nickName" noStyle   >
            <Input size="middle" />
          </Item>
          <Item name="mobile" noStyle >
            <Input size="middle"  />
          </Item>
          <Item name="validStageTime" noStyle >
            <Input
              size="middle"
            />
          </Item>
          <Item noStyle>
            <Space>
              <Pbutton onClick={() => menufn(field.id, 2, 4)}>{t("common:DataPermissions")}</Pbutton>
              <Pbutton onClick={() => menufn(field.id, 1, 4)}>{t("common:MenuPermissions")}</Pbutton>
              <Pbutton onClick={() => useEdit(field, 4)}> {t("common:Edit")}</Pbutton>
              <Pbutton onClick={() => reset(field)}> {t("common:ResetPassword")}</Pbutton>
              <Dbutton onClick={() => onDeleteMsg(2, field.id)}>  {t("common:Delete")}</Dbutton>
            </Space>

            {/*  <Button danger  onClick={() => onDeleteMsg(2, field.id)} style={{padding: '0px', width: '96px'}}>删除</Button> */}
          </Item>
          <Item noStyle></Item>
        </div>
        <Space size={8} wrap>
          <Text>{defaultLabel}权限</Text>{" "}
          {field?.areaAuthority?.map((item) => (
            <Ctag key={nanoid()}>{item.name}</Ctag>
          ))}
        </Space>
      </div>
      </Form>
    );
  };

  const addcmodal = useMemo(() =>  <Custmodl
  title={title}
  ref={fmodal}
  fromprops={{ enable: true }}
  //  onCancal={cancal}
  onOk={addManager}
  custft={person == 1}
  mold="default"
></Custmodl>, [title, person])
  return (
    <Mainbox>
      {roleType == 1 ? (
        <div className="admin">
          <Title level={5} className="title">
           {t("common:OperationAdministrator")}
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
              placeholder={t("common:SelectAdministrator")}
            ></Select>

            {/*   <Button size="middle" style={addstyl} onClick={addOperation} type="primary" ghost >+&nbsp;添加</Button> */}
            <Abutton onClick={addOperation}>{t("common:AddAdministrator")}</Abutton>
          </div>
          <div className="item">
            <Text type="">{t("common:Username")}</Text> <Text>{t("common:Name")}</Text>
            <Text>{t("common:MobileNumber")}</Text> <Text>{t("common:ValidityPeriod")}</Text>
          </div>
          {oplist?.map((item) => (
            <div className="item" key={nanoid()}>
              <Input size="middle" value={item.name} readOnly />
              <Input size="middle" readOnly value={item.nickName} />
              <Input size="middle" readOnly value={item.mobile} />
              <Input
                size="middle"
                readOnly
                value={dayjs(
                  item.validStageTime,
                  "YYYY-MM-DD HH:mm:ss"
                ).format("YYYY/MM/DD")}
              />
              <Space >
                <Pbutton onClick={() => useEdit(item, 2)}>{t("common:Edit")}</Pbutton>
                <Pbutton onClick={() => reset(item)}>{t("common:ResetPassword")}</Pbutton>
                <Dbutton onClick={() => onDeleteMsg(0, item.id)}>{t("common:Delete")}</Dbutton>
              </Space>
            </div>
          ))}
        </div>
      ) : null}
      {roleType == 2 || roleType == 1 ? (
        <div className="admin">
          <Space >
            <Title level={5} className="title">
              {t("common:ProjectAdministrator")}
            </Title>
            <Abutton onClick={addProjectadmin.bind(null, 0)} disabled={manager}>
              {t("common:AddProjectAdministrator")}
            </Abutton>
          </Space>
          <div className="item">
            <Text type="">{t("common:Username")}</Text>
            <Text>{t("common:Name")}</Text>
            <Text>{t("common:MobileNumber")}</Text>
            <Text>{t("common:ValidityPeriod")}</Text>
          </div>

          {manager && (
            <>
              <Form form={form} layout="inline" className="item" readOnly>
                <Item name="name" noStyle>
                  <Input size="middle" />
                </Item>
                <Item name="nickName" noStyle>
                  <Input size="middle" />
                </Item>
                <Item name="mobile" noStyle>
                  <Input size="middle" />
                </Item>
                <Item name="validStageTime" noStyle>
                  <Input size="middle" />
                </Item>
                <Item noStyle shouldUpdate>
                  {({ getFieldValue, getFieldsValue }) => {
                    return (
                      <Space >
                        <Pbutton
                          onClick={() => menufn(getFieldValue("id"), 1, 3)}
                        >
                          {t("common:MenuPermissions")}
                        </Pbutton>

                        <Pbutton onClick={() => useEdit(managerdata, 3)}>
                          {t("common:Edit")}
                        </Pbutton>
                        <Pbutton onClick={() => reset(managerdata)}>
                          {t("common:ResetPassword")}
                        </Pbutton>
                        <Dbutton
                          onClick={() => onDeleteMsg(1, getFieldValue("id"))}
                        >
                          {t("common:Delete")}
                        </Dbutton>
                      </Space>
                    );
                  }}
                </Item>
              </Form>

              <Space size={8} wrap>
                <Text>{defaultLabel}{t("common:Permissions")}</Text>{" "}
                {areas.map((item) => (
                  <Ctag key={nanoid()}>{item.name}</Ctag>
                ))}
              </Space>
            </>
          )}
        </div>
      ) : null}
      {roleType == 3 || roleType == 1 ? (
        <div className="admin">
          <Space>
            <Title level={5} className="title">
             {t("common:OperationAndMaintenancePersonnel")}
            </Title>
            <Abutton onClick={addProjectadmin.bind(null, 1)}>
            {t("common:AddOperationAndMaintenancePersonnel")}
            </Abutton>
          </Space>
          <div className="item">
            <Text type="">{t("common:Username")}</Text>
            <Text>{t("common:Name")}</Text>
            <Text>{t("common:MobileNumber")}</Text>
            <Text>{t("common:ValidityPeriod")}</Text>
          </div>

          
            {
            admin?.length > 0 ?
             admin.map(f => <RenderItem field={f} key={nanoid()} />) 
             : null
            }
          
        </div>
      ) : null}

      {/* 编辑账号 */}
      <Custmodl
        title={editTitle}
        ref={editref}
        fromprops={initform}
        //  onCancal={cancal}
        onOk={onOkedit}
        mold="default"
      ></Custmodl>

      {addcmodal}
      <Custmodl
        mold="cust"
        title={t("common:DeleteAccount")}
        type="warn"
        onOk={onDeletehandle}
        ref={mref}
      >
      {t("common:ConfirmDelete")} {delinfo}?
      </Custmodl>

      <CModal width={554} title={t("common:ResetPassword")} ref={rref} onOk={restOk} mold="cust">
        <p>
          {t("comm:useraccount")}： <Link>{username.name}</Link>， {t("common:ResetPasswordTo")}
          <Link>{newpwd.current}</Link>
        </p>
      </CModal>

      <Menuset
        projectId={projectId}
        userId={userId}
        ref={dref}
        role={role}
      ></Menuset>
      <Dataset
        projectId={projectId}
        userId={userId}
        ref={dpref}
        onupdate={queryProjectMaintenance}
      ></Dataset>
    </Mainbox>
  );
}
