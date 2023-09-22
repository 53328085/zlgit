import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useNavigate, useParams, useLoaderData } from "react-router-dom";
 
 
import md5 from 'js-md5';
import {
  loginByName,
  selectLoading,
  selectMemorize,
  selectMemoPhone,
  clearToken,
  memorizeName,
  memorizePhone,
  selectUser,
} from "@redux/user";
import { systemConfig, getpublishState, systemConfigInfo, mixtitle, getJump, getdataScreen, getIsGranary, configProject,
  getMenus,
  getshifts,
  getOnelevel, getThemeColor, setCurrentlevel} from "@redux/systemconfig";
import { useBoolean, useCountDown, useRequest } from "ahooks";
import { Area, ProjectList, eneryShift } from "@api/api.js";
import { Button, Checkbox, Form, Input, message, Space, Image } from "antd";
import styled from "styled-components";
import { LoginLayout } from "@com/layout";
import { pwdValidator, phoneValidator, codeValidator, imgcodeValidator } from "@pages/rule";
import { Login as Logapi, ProjectSetting, BigScreen } from "@api/api";
import imgurl from "./icon";
import bgImg from "./logBg.png";

 
const Logmain = styled.div`
  && {
    padding: 142px 45px 0 100px;
    display: flex;
    height: calc(100vh - 138px - 24px);
    overflow-y: auto;
  }
`;

const List = styled.div`
  width: 660px;
  display: flex;
  flex-direction: column;
  .chtitle {
    .text {
      color: #fff;
      font-style: italic;
      font-size: 52px;
      z-index: 2;
      position: absolute;
      min-width: 744px;
    }
    position: relative;
    height: 90px;
    text-align: center;
  }
  .block {
    display: block;
    width: 775px;
    height: 35px;
    background-color: #012bd2;
    position: absolute;
    top: 59px;
    transform: skewX(-20deg);
    box-shadow: rgb(0 0 0 / 30%) 12px 12px;
  }
  .entitle {
    font-size: 28px;
    line-height: 2;
    color: rgba(255, 255, 255, 0.7);
    padding-left: 20px;
    padding-bottom: 72px;
    font-style: oblique;
  }
  .itemlist {
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    .item {
      display: flex;
      align-items: center;
    }
    .text {
      display: inline-block;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
    }
    .icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      background-color:#0033ff ;
      transform: rotate(45deg);
      border: 1px solid #0099ff;
      margin-right: 16px;
    }
    .item + .item {
      margin-top: 24px;
    }
  }
`;
 
const Logbox = styled.div`
  width: 402px;
  color: #fff;
  background: transparent;
  margin-left: auto;
`;
const Logtype = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  height: 44px;
  span {
    font-style: italic;
    transition: font-size 0.3s, color 0.3s;
    &:hover {
      cursor: pointer;
    }
  }
`;
const { Item } = Form;
const Itembox = styled(Item)`
  &:not(:last-child) {
    margin-bottom: ${props => props.btm || "64px"};
  }
  .ant-input-affix-wrapper-lg {
    height: 48px;
  }
`;
const Ipticon = styled.span`
  display: inline-block;
  width: 32px;
  height: 32px;

  background-size: 32px 32px;
  transition: all 0.3s;
`;
const Logipt = styled(Input)`
  font-size: 14px;
  background-color: transparent !important;
  border: 1px solid #9c9ea4;
  border-radius: 4px;
  ${Ipticon} {
    background-image: url(${(props) => props.url});
  }
  &:focus,
  &:hover {
    border-color: #1f83fe !important;
    ${Ipticon} {
      background-image: url(${(props) => props.aurl});
    }
    .ant-input {
      color: #1f83fe;
    }
  }
  && {
    .ant-input-prefix {
      margin-right: 16px;
    }
  }
  .ant-input-affix-wrapper-status-error {
    background-color: transparent !important;
  }
  .ant-input {
    background-color: transparent;
    color: #999;
  }
  .ant-input::placeholder {
    color: #999;
  }
  input:-internal-autofill-previewed,
  input:-internal-autofill-selected {
    -webkit-text-fill-color: #999 !important;
    　　transition: background-color 5000s ease-in-out 0s !important;
  }
`;
const Logpsd = styled(Input.Password)`
  background-color: transparent !important;
  border: 1px solid #9c9ea4;
  font-size: 14px;
  border-radius: 4px;
  ${Ipticon} {
    background-image: url(${(props) => props.url});
  }
  &:focus,
  &:hover {
    border-color: #1f83fe !important;
    ${Ipticon} {
      background-image: url(${(props) => props.aurl});
    }
    .ant-input {
      color: #1f83fe;
    }
    .ant-input-password-icon.anticon {
      color: #1f83fe !important;
    }
  }
  && {
    .ant-input-prefix {
      margin-right: 16px;
    }
  }
  .ant-input-password-icon.anticon {
    color: #999;
  }
  .ant-input-affix-wrapper-status-error {
    background-color: transparent !important;
  }
  .ant-input {
    background-color: transparent;
    color: #999;
  }
  .ant-input::placeholder {
    color: #999;
  }
`;
const Logck = styled(Checkbox)`
  display: flex;
  align-items: center;
  &:hover {
    .ant-checkbox:hover {
      border-color: #9c9ea4;
    }
  }
  .ant-checkbox + span {
    padding-left: 0;
    padding-right: 0;
    color: #999;
    font-size: 16px;
  }
  .ant-checkbox-checked .ant-checkbox-inner:after {
    transform: rotate(45deg) scale(2) translate(-25%, -50%);
  }
  .ant-checkbox {
    width: 32px;
    height: 32px;
    margin-right: 16px;
    top: 0px;
    .ant-checkbox-input,
    .ant-checkbox-inner {
      width: inherit;
      height: inherit;
      background-color: transparent;
    }
    .ant-checkbox-inner {
      border-color: #9c9ea4;
      background-color: transparent;
      &:hover {
        border-color: #9c9ea4;
      }
    }
  }
`;

const Logbtn = styled(Button)`
  border-color: #0e2db3;
  background-color: #0e2db3;
  font-size: 18px;
  color: #fff;
  &:hover {
    border-color: #0728ae;
    background-color: #0728ae;
    color: #fff;
  }
`;

const Title = styled.div`
  display: flex;
  height: inherit;
  flex: 1;
  padding: 0 84px 0 96px;
  justify-content: space-between;
  align-items: flex-end;
`;

const Logtitle = ({log, logtitle}) => {
  return (
    <Title>
      <Image src={log ?  `data:image/png;base64,${log}` : imgurl.logo} preview={false} fallback={imgurl.logo} />
      <Image src={imgurl.credentials} preview={false} width={200} />
    </Title>
  );
};
const Loglist = ({logtitle, englishTitle, literal}) => {
 
  
 
  let items = [
    "运行监控",
    "电气安全",
    "配电管理",
    "结算收费",
    "光伏发电",
    "碳排管理",
    "运维管理",
  ];
 
 
  return (
    <List>
      <div className="chtitle">
        <p className="text">{logtitle}</p>
        <p className="block"></p>
      </div>
      <p className="entitle">{englishTitle}</p>
      <div className="itemlist" style={{display: literal== 1 ? 'flex' : 'none'}}>
        {items.map((i, index) => (
          <div className="item" key={index}>
            <span className="icon"></span>
            <span className="text">{i}</span>
          </div>
        ))}
      </div>
    </List>
  );
};
function UserLog() {
  const store = useStore();

  const navigate = useNavigate();
  let initloaidng = useSelector(selectLoading);
  let [loading, setLoading] = useState(initloaidng);
  const dispatch = useDispatch();
  store.subscribe(() => {
    setLoading(store.getState()?.user?.loading);
  });
  const projectRun = ({ key, label }) => {
    dispatch(getJump(true))
    navigate(`/index/${key}`, {
      state: { type: "index", primary: key, index: true, title: label },
    });
  };
/*   const hostname =
    process.env.NODE_ENV === "production"
      ? new URL(window.location.href).hostname
      : "10.5.7.60";
 */
  // 进入项目配置/项目 

 const handlermenu = (data,  id) => {
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
     siderDesignerMenus[key] = sidermenu.filter(m => m.parentNo == no)?.sort((a, b) => a.index - b.index)

     console.log(siderDesignerMenus[key])
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
  dispatch(configProject(false))
 // dispatch(getJump(false))
  return runMenus?.find(item => item.no == '0104') || runMenus[0] 

 
 }


 const enterProject = async (id) => {
   try {    
     let promises = [Area.QueryAll({projectId: id,level: 1,parentId: 0}),  eneryShift.queryShifts(id), ProjectList.QueryMenus(id), ProjectSetting.queryProjectPublishInfo(id), BigScreen.QueryBigScreen(id)] 
     let results = await Promise.allSettled(promises)   
     let menu;   
     results.forEach((res, index) => {
       let {status, value: {success, data}} = res
       if (status ==='fulfilled') {
          if(success) {
            dispatch(setCurrentlevel({})) //当前项目设置为空对象
            index == 0 && dispatch(getOnelevel(data || []));
            index == 1 && dispatch(getshifts(data || []))
            index == 2 && (menu = handlermenu(data, id))
            index == 3 && dispatch(getpublishState(data?.state))
            index == 4 && dispatch(getdataScreen(data))
          }else{
            index== 0 && dispatch(getOnelevel([]));
            index == 1 && dispatch(getshifts([]));
            index == 4 && dispatch(getdataScreen({}))
          }
       }
     })  
    if(!menu) return message.error({content: '没有设置菜单，请联系管理人员', duration: 0.5})
     projectRun(menu)
   } catch (error) {
     console.log(error)
   }
     

        

 }
 
 const cipher = (name, pwd) => {
   
   return md5(`chint_${name}_${pwd}_wulian`)
    
 }

 let onSubmit = async (value, type=0, codekey) => {
   console.log(value)
   const {name, pwd, code} = value;  
   value.pwd = cipher(name, pwd)
   value.type = type;
   if(type == 0){
    value.code = code
    value.key = codekey
   } 
   let { success, errMsg, data} = await dispatch(loginByName(value)).unwrap();
   if(success) {
      let {projectId, roleType} = data
      if (roleType == 1 || roleType == 2)  return navigate("/projectlist", {})
      if (roleType == 3 || roleType == 4) {      
        enterProject(projectId)
      }

   }else {
    return message.warning(errMsg || "数据出错,请重试");
   }

 }

  const onFinishFailed = (error) => {
    console.log(error);
  };
  useEffect(() => {
    dispatch(clearToken()); // 返回登录页面时清楚token
    dispatch(getIsGranary(false))
  }, []);
 

  const [userform] = Form.useForm();

  const [state, { toggle }] = useBoolean(true);

  const stylefn = (state) => {
    return state
      ? { fontSize: "28px", color: "#fff" }
      : { fontSize: "26px", color: "#515151" };
  };

  const iconsty = {
    fontSize: "26px",
    color: "#999",
    marginRight: "16px",
  };

 
  const Userlog = () => {
    let initmemorize = useSelector(selectMemorize);
    let { name } = useSelector(selectUser);
    let [codekey, setCodeKey] = useState()
    let [codeUrl, setCodeUrl] =useState()
    const auto = useMemo(() => (initmemorize ? "on" : "off"), [initmemorize]);
    const userName = useMemo(() => (initmemorize ? name : ""), [initmemorize]);
    const ckChange = (e) => {
      dispatch(memorizeName(e.target.checked));
    };
    const getCode = async () => {
       try {
         let {data, success} = await  Logapi.GetCode()
         if(success) {  
           let {key, image} = data || {}
           setCodeKey(key)
           setCodeUrl(image)

         }
       } catch (error) {
        
       }
         
    }
    
  /*   store.subscribe(() => {
      initmemorize = store.getState()?.memorize;
    }); */
    useEffect(() => {
      getCode();
      return () => {
        setLoading(false);
      };
    }, []);
    return (
      <Form
        layout="horizontal"
        labelCol={{ flex: "4em" }}
        wrapperCol={{ flex: 1 }}
        labelWrap
        form={userform}
        name="login"
        onFinish={(value) => {
          console.log(value)
          onSubmit(value, 0, codekey)
        }}
        onFinishFailed={onFinishFailed}
        initialValues={{
          name: userName,
          pwd: "",
          code: '',
        }}
      >
        <Itembox
          name="name"
          hasFeedback
          btm="32px"
          rules={[
            {
              required: true,
              message: "请输入用户姓名",
            },
            {
              type: "string",
              min: 2,
              max: 20,
              message: "用户名2至20个字符串",
            },
          ]}
        >
          <Logipt
            prefix={<Ipticon />}
            url={imgurl.user}
            aurl={imgurl.usera}
            placeholder="请输入用户名"
            allowClear
            autoComplete={auto}
          />
        </Itembox>
        <Itembox
          name="pwd"
          hasFeedback
          btm="32px"
          rules={[
            {
              required: true,
              message: "请输入密码",
            },
             {
            validator: pwdValidator
            },  
          ]}
        >
          <Logpsd
            prefix={<Ipticon />}
            url={imgurl.pwd}
            aurl={imgurl.pwda}
            placeholder="请输入密码"
          />
        </Itembox>
       
        
          <Itembox
         hasFeedback
         btm="32px"
         style={{alignItems: "center"}}
       >
        <Input.Group compact>
          <Item  name="code" noStyle  rules={[
           {
             required: true,
             message: "请输入验证码",
           },
            {
           validator: imgcodeValidator
           },  
         ]}>
          <Logipt
            style={{width: "264px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px"}}
            prefix={<Ipticon />}
            url={imgurl.pwd}
            aurl={imgurl.pwda}
            placeholder="请输入验证码"
          />
          </Item>
           {codeUrl && <Image src={"data:image/gif;base64," + codeUrl} style={{height: "42px", width: "136px"}} preview={false} onClick={getCode} /> }
           </Input.Group>
           </Itembox>
         
       
        <Itembox valuePropName="checked">
          <Logck onChange={ckChange} defaultChecked={initmemorize}>
            记住用户名
          </Logck>
        </Itembox>
        <Itembox>
          <Logbtn
            htmlType="submit"
            block
            loading={loading}
            style={{ height: "56px" }}
          >
            立即登录
          </Logbtn>
        </Itembox>
      </Form>
    );
  };
  function Phonelog() {
    const { GetVerification } = Logapi;
    const [phoneform] = Form.useForm();
    let initPhone = useSelector(selectMemoPhone);
    let { mobile } = useSelector(selectUser);
    const auto = useMemo(() => (initPhone ? "on" : "off"), [initPhone]);
    const initMobile = useMemo(() => (initPhone ? mobile : ""), [initPhone]);
    const ckchange = (e) => {
      dispatch(memorizePhone(e.target.checked));
    };
   /*  store.subscribe(() => {
      initPhone = store.getState()?.memoPhone;
    }); */
    const [targetDate, setTargetDate] = useState(0);
    const [countdown] = useCountDown({
      targetDate,
    });
    const { loading, run } = useRequest(GetVerification, {
      // 获取验证码
      manual: true,
      onSuccess: (res) => {
        let { success, data } = res;
        if (success) phoneform.setFieldValue("code", data.code);
      },
      onError: (error) => {
        console.log(error);
      },
    });
    const getCode = () => {
      const phone = phoneform.getFieldValue("mobile");
      phoneform
        .validateFields(["mobile"])
        .then((res) => {
          setTargetDate(Date.now() + 1000 * 60);
          run(phone);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    const Countdown = () => {
      return (
        <Logbtn
          style={{ height: "42px", width: "112px", fontSize: "16px" }}
          onClick={() => getCode()}
          disabled={countdown !== 0}
        >
          {countdown === 0 ? "获取验证码" : ` ${Math.round(countdown / 1000)}s`}
        </Logbtn>
      );
    };
    useEffect(() => {});
    return (
      <Form
        layout="horizontal"
        labelCol={{ flex: "4em" }}
        wrapperCol={{ flex: 1 }}
        labelWrap
        form={phoneform}
        name="phonelogin"
        onFinish={(e) => onSubmit(e, 1)}
        onFinishFailed={onFinishFailed}
        initialValues={{
          mobile: initMobile,
          remember: initPhone,
        }}
      >
        <Itembox
          name="mobile"
          hasFeedback
          rules={[
            {
              required: true,
              message: "请输入手机号",
            },
            {
              validator: phoneValidator,
            },
          ]}
        >
          <Logipt
            prefix={<Ipticon />}
            url={imgurl.phone}
            aurl={imgurl.phonea}
            placeholder="请输入手机号"
            autoComplete={auto}
          />
        </Itembox>
        <Itembox>
          <Space size={16}>
            <Item
              name="code"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "请输入验证码",
                },
                {
                  validator: codeValidator,
                },
              ]}
              noStyle
            >
              <Logipt
                prefix={<Ipticon />}
                url={imgurl.code}
                aurl={imgurl.codea}
                placeholder="请输入验证码"
                style={{ width: "275px" }}
              />
            </Item>
            <Item noStyle>
              {/*  <Button type="primary" style={{height: '48px', width: '112px'}} onClick={() => getCode()} disabled={countdown !== 0}>        
               {countdown === 0 ? '获取验证码' : ` ${Math.round(countdown / 1000)}s`}
         </Button> */}
              <Countdown />
            </Item>
          </Space>
        </Itembox>
        <Itembox name="remember" valuePropName="checked">
          <Logck onChange={ckchange}>记住手机号</Logck>
        </Itembox>
        <Itembox>
          <Logbtn
            htmlType="submit"
            block
            loading={loading}
            style={{ height: "56px" }}
          >
            立即登录
          </Logbtn>
        </Itembox>
      </Form>
    );
  }

 
  const Phone = React.memo(Phonelog);
  const params = useParams();
  const type = useMemo(() => {
    let param = Object.values(params)?.[0];

    return !param || param == "user";
  }, [params]);
  return (
    <Logbox>
      <Logtype>
        <span
          onClick={() => {
            //  navigate('user')
            toggle();
          }}
          style={stylefn(state)}
        >
          账户登录
        </span>
        <span
          onClick={() => {
            // navigate('mobile')
            toggle();
          }}
          style={stylefn(!state)}
        >
          手机登录
        </span>
      </Logtype>
     {state ? <Userlog /> : <Phonelog />}
  
    </Logbox>
  );
}
export default function Login() {
 // const routeData = useLoaderData();
 // console.log(routeData)
  const dispatch = useDispatch();
  const { systemLogoImage, systemBackImage, englishTitle="Integrated Energy Service Platform", literal } = useSelector(systemConfigInfo) || {}
  const enchtitle = useSelector(mixtitle)
  document.title = enchtitle
 const hostname = process.env.NODE_ENV === "production"
    ? new URL(window.location.href).hostname
    : "10.5.7.60";
  
 useEffect(() => {
  dispatch(systemConfig(hostname)).then(res => {
    console.log(res)
    let {success, data} = res.payload
    console.log(data)
    if(success) dispatch(getThemeColor(data.themeColor));
  }).catch(e => {
    console.log(e)
  })
}, [hostname]); 
  return (
    <LoginLayout login={true} header={<Logtitle img={systemLogoImage} />} bgImg={systemBackImage ? `data:image/png;base64,${systemBackImage}` : bgImg}>
      <Logmain>
        <Loglist  logtitle={enchtitle} englishTitle={englishTitle} literal={literal} ></Loglist>
        <UserLog />
      </Logmain>
    </LoginLayout>
  );
}
