import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginByName, selectLoading, selectUser } from "../redux/user";
import { systemConfig } from "../redux/systemconfig";
import { useNavigate } from "react-router-dom";

import {
  Layout,
  Button,
  Checkbox,
  Form,
  Input,
} from "antd";

import { SmileOutlined } from '@ant-design/icons';
import PageLayout from "../components/layout/PageLayout";
import moment from "moment";
var now = moment('1995-6-6')
console.log(now)
function UserLog() {
  const [name, userSet] = useState("admin");
  const [pwd, pwdSet] = useState("chint_123456");
  const hostname =
    process.env.NODE_ENV === "production"
      ? new URL(window.location.href).hostname
      : "10.5.7.60";
  const navigate = useNavigate();
  let loading = useSelector(selectLoading);
  let userinfo = useSelector(selectUser);
  const dispatch = useDispatch();
  const submit = async (value) => {
    console.log(value)
    let { success } = await dispatch(loginByName({ name, pwd })).unwrap();
    if (success) navigate("/index");
  };
  const onFinishFailed = (error) => {
    console.log(error)
  }
  useEffect(() => {
    dispatch(systemConfig(hostname));
  }, [hostname]);
  const [form] = Form.useForm()
  const getform = () => {
    console.log(112233)
    form.setFieldsValue({
      name: 'zhuzl',
      pwd: 123
    })
  }
  const resetform = () => {
    form.resetFields()
  }
  return (
    <div style={{width: '402px', margin: '100px auto'}}>  
   
      <Form
        layout="horizontal"
        labelCol={{flex: '4em'}}
        wrapperCol={{flex:1}}
        labelWrap
        form={form}
        name='login'
        initialValues={{
          remember: true
        }}
        onFinish={submit}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
           name="Name"
           label="用户名"
           rules={[
            {
              required: true,
              message: '请输入用户姓名',
              warningOnly: true
            },
          ]}
          >
           <Input/>
          </Form.Item>
          <Form.Item
           name="pwd"
           label="密码"
           rules={[
            {
              required: true,
              message: '请输入密码',
              warningOnly: true
            },
          ]}
          >
           <Input.Password />
          </Form.Item>
          <Form.Item
           name='remember'
           valuePropName="checked"
          >
            <Checkbox>记住用户名</Checkbox>
          </Form.Item>
          <Form.Item>
              <Button type="primary" htmlType="submit" block>立即登录</Button>
          </Form.Item>
      </Form>
     
      {/*  <p><label>用户名</label><input value={name} onChange={e => userSet(e.target.value)}></input></p>
       <p><label>用户名</label><input value={pwd} onChange={e => pwdSet(e.target.value)}></input></p>
       <p><button onClick={submit}>提交</button></p>
       <div>
         <p> 用户姓名： {userinfo.loginName} </p>
         <p> 用户电话： {userinfo.mobile} </p>
       </div> */}
    
    </div>
  );
}
export default function Login() {
  const { Content } = Layout;
  return <PageLayout ><Content><UserLog /></Content> </PageLayout>;
}
