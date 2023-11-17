import React, { useEffect,  memo,  } from "react";
import { useDispatch, useSelector,  } from "react-redux";
import { useNavigate,} from "react-router-dom"; 
import {
  loginByName, 
  clearToken, 
} from "@redux/user";
import {  getpublishState,   getJump, getdataScreen, getIsGranary, configProject,
  getMenus,
  getshifts,
  getOnelevel,  setCurrentlevel, getSystemconfiginfo} from "@redux/systemconfig";
 
import { Area, ProjectList, eneryShift } from "@api/api.js";
import { message, Tabs } from "antd";
import styled from "styled-components";
import { ProjectSetting, BigScreen } from "@api/api";
import {cipher} from "@com/usehandler"
import imgurl from "./icon";
 
 import  Headicon from './Headicon'
import Listitem from "./Listitem";
import Username from "./Username";
import Phonelog from "./Phonelog";
import Copyright from './Copyright'
const Loginpage =  styled.div`
  display: flex;
  flex:1;
  flex-direction: column;
  position: relative;
  background-image: ${props => `url(${props.bgImg})`};
  background-size: cover;
`
const CTabs = styled(Tabs)`
   && {
      width: 402px;
      .ant-tabs-nav {
         margin-bottom: 32px;
         &::before {
           border: none;
         }
      }
     
      .ant-tabs-tab .ant-tabs-tab-btn{
         font-size: 26px;
         color: #515151;
         font-style: italic;
         transition: none;
      }
      .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn{
         font-size: 28px;
         color: #fff;
         transition: none;
      }
      .ant-tabs-ink-bar.ant-tabs-ink-bar-animated{
         background-color: transparent;
      }
      .ant-tabs-ink-bar {
        display: none;
      }
   }

`
const Logmain = styled.div`
  && {
    padding: 142px 45px 0 100px;
    display: flex;
    height: calc(100vh - 138px - 24px);
    overflow-y: auto;
    justify-content: space-between;
  }
`;

 
function UserLog() {
   
  const navigate = useNavigate();
 
 
  const dispatch = useDispatch();
 
  const projectRun = ({ key, label }) => {
    dispatch(getJump(true))
    navigate(`/index/${key}`, {
      state: { type: "index", primary: key, index: true, title: label },
    });
  };
 
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
 
 
 
 let onSubmit = async (value, type=0, codekey, setLoading) => {
   try {
    setLoading && setLoading(true) 
    const {name, pwd, code, mobile} = value;  
    value.pwd = cipher(name, pwd)
    value.type = type;
    if(type == 0){
     value.code = code
     value.key = codekey
    } else if(type == 1) {
      value.code = cipher(mobile, code)
    }
    let { success, errMsg, data} = await dispatch(loginByName(value)).unwrap();
    if(success) {
      setLoading &&  setLoading(false) 
       let {projectId, roleType} = data
       if (roleType == 1 || roleType == 2)  return navigate("/projectlist", {})
       if (roleType == 3 || roleType == 4) {      
         enterProject(projectId)
       }
 
    }else {
      setLoading &&   setLoading(false) 
     return message.warning(errMsg || "数据出错,请重试");
    }
   } catch (error) {
    setLoading &&   setLoading(false) 
     console.log(error)
   }
  

 }

 
  useEffect(() => {
    dispatch(clearToken()); // 返回登录页面时清楚token
    window.sessionStorage.removeItem('chintwuliu')
    dispatch(getIsGranary(false))
  }, []);
 

  const items = [
   {
      label: "账户登录",
       key: '1',
       children:   <Username onSubmit={onSubmit} />,
   },
   {
      label: "手机登录",
       key: '2',
       children:   <Phonelog onSubmit={onSubmit} />,
   }
  ]
  return (     
         <CTabs 
           defaultActiveKey="1"
           items={items}
          
           tabBarGutter={128}
           
         >

         </CTabs>    
  );
}
const Log = memo(UserLog)
export default function Login() {
  const {systemBackImage} = useSelector(getSystemconfiginfo) || {}
  const bgImg= systemBackImage ? `data:image/png;base64,${systemBackImage}` : imgurl.logBg
  return (
    <Loginpage bgImg={bgImg}>
      <Headicon /> 
      <Logmain>
         <Listitem />
         <Log />
      </Logmain>
      <Copyright/>
    </Loginpage>
  );
}
