import React, {useEffect} from 'react'
import { useDispatch, useSelector,  } from "react-redux";
import { useNavigate,} from "react-router-dom"; 
import {  getpublishState,   getJump, getdataScreen, getIsGranary, configProject,
    getMenus,
    getshifts,
    getOnelevel,  setCurrentlevel, getSystemconfiginfo, getDisonlevel} from "@redux/systemconfig";
   
  import { Area, ProjectList,ProjectSetting, BigScreen, eneryShift, Login as LoginApi } from "@api/api.js";
export default function useLogon(projectId) {
      // 进入项目配置/项目 
      const navigate = useNavigate();
 
 
      const dispatch = useDispatch();
     
      const projectRun = ({ key, label }) => {
        dispatch(getJump(true))
        navigate(`/index/${key}`, {
          state: { type: "index", primary: key, index: true, title: label },
        });
      };
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
          let promises = [
            Area.QueryAll({projectId: id,level: 1,parentId: 0}), 
            eneryShift.queryShifts(id), 
            ProjectList.QueryMenus(id), 
            ProjectSetting.queryProjectPublishInfo(id),
            BigScreen.QueryBigScreen(id),
            Area.AreaList(id), // 配电管理运行状态下的一级下拉菜单
           ] 
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
                 index == 5 && dispatch(getDisonlevel(data))
               }else{
                 index== 0 && dispatch(getOnelevel([]));
                 index == 1 && dispatch(getshifts([]));
                 index == 4 && dispatch(getdataScreen({}))
                 index == 5 && dispatch(getDisonlevel(data))
               }
            }
          })  
         if(!menu) return message.error({content: '没有设置菜单，请联系管理人员', duration: 0.5})
          projectRun(menu)
        } catch (error) {
          console.log(error)
        }
  return (
    <div>useLogon</div>
  )
}
}