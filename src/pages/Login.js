import { useEffect,useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { loginByName, selectLoading} from "../redux/user";
import { systemConfig } from "@redux/systemconfig";
import {clearToken} from '@redux/user'
import { useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  Form,
  Input,
  message
} from "antd";


import {LoginLayout} from "../components/layout";
function UserLog() { // admin chint_123456 redux state 数据的变化监听
  const store = useStore()
 
  const navigate = useNavigate();
  let initloaidng = useSelector(selectLoading)
  let [loading, setLoading] = useState(initloaidng);  
  const dispatch = useDispatch();
  store.subscribe(() => {   
    setLoading(store.getState()?.user?.loading)
  })
  const hostname = process.env.NODE_ENV === "production" ? new URL(window.location.href).hostname  : "10.5.7.60";
  const submit = async (value) => {
    const {name, pwd} = value
   let { success,errMsg } = await dispatch(loginByName({ name, pwd })).unwrap();
   if (success) navigate("/index", {state: {index: true}});
   if (!success) message.warning(errMsg || '系统繁忙,请稍后再试')
  };
  const onFinishFailed = (error) => {
    console.log(error)
  }
  useEffect(() => {
    dispatch(clearToken()) // 返回登录页面时清楚token
  }, [])
  useEffect(() => {
    document.title = 'NES600智慧能源服务平台'

  }, [])
  useEffect(() => {
    
    dispatch(systemConfig(hostname));
  }, [hostname]);

  const [form] = Form.useForm()
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
          remember: true,
          name: '',
          pwd: ''
        }}
        onFinish={submit}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
           name="name"
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
              <Button type="primary" htmlType="submit" block loading={loading}>立即登录</Button>
          </Form.Item>
      </Form>
    </div>
  );
}
export default function Login() {  
  return <LoginLayout login={true}><UserLog /> </LoginLayout>;
}
