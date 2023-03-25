import React, {useState, useEffect, useLayoutEffect, useRef, forwardRef, useImperativeHandle, useMemo} from 'react'
import {flushSync} from 'react-dom'
import {Drawer, Button, Table, Typography, Checkbox, Tabs, Space, Spin, Radio} from 'antd' 
import {nanoid} from '@reduxjs/toolkit'
import styled from 'styled-components' 
import { User } from "@api/api.js";
import {custMsg} from '@com/usehandler'

import CModal from '@com/useModal'
 
const { Text, Link, Paragraph  } = Typography
const CheckboxGroup = Checkbox.Group;
const Checkdiv = styled.div`
  display: flex;
  align-items: stretch;
  padding: 12px 0;
  border-bottom: 1px dotted #d7d7d7;
  && {
    .ant-checkbox-wrapper {
      height: 32px;
      border: 1px solid #e4e4e4;
      display: flex;
      align-items: center;
      padding: 0 4px;
      min-width: 128px;
      .ant-checkbox {
        margin-right: 8px;
        top: 0;
        & + span {
          color: #515151 ;
        }
      }
      
    }
    .checktitle {
      background-color: #f2f2f2;
      margin-right: 32px;
      min-width: 168px;
    }
  }
`
const Tabsbox = styled(Tabs)`
    .ant-tabs-content-holder {
      padding: 32px;
      border: 1px solid #d7d7d7;
    }
  .ant-tabs-nav {
    margin-bottom: 0px;
  
   .ant-tabs-nav-list {
    .ant-tabs-tab {
        border-radius: 4px 4px 0 0;
        height: 41px;
        width: 145px;
        justify-content: center;
        font-size: 14px;
        background-color: #fff;  
        transition: none;
        &:hover {
            background-color: var(--ant-primary-color);
            color: #fff;
            transition: all 0.3s;
        }
        .ant-tabs-tab-btn{
            transition: none;
        }
        .ant-tabs-tab-btn:active {
            color:#fff
        }
    }
    .ant-tabs-tab.ant-tabs-tab-active {
        background-color: var(--ant-primary-color);
       
        .ant-tabs-tab-btn {
            color:#fff;
            transition: none;
        }
    }
   }  
 
}
`
 function Index({projectId, userId}, ref) { 
    const mref= useRef() 
    const   MenuNos  =  useRef({}) // 运行
    const  Dmenunos = useRef({}) // 设计
    const onClose = () => {
        mref.current.onCancal() 
    }
    const onOpen = () => {
        mref.current.onOpen()
    }
    useImperativeHandle(ref, () => ({
        onClose,
        onOpen,
    })) 
    const saveMenu = async () => { 
        const getno = (data) => {
          let include = ['0101', '0102', '0103', '0104'];
          let Nos = []
            for(let [key, value] of Object.entries(data)) {
               if(Array.isArray(value) && value.length > 0) {
                  let i = value[0].slice(0, 4)
                  if (!include.includes(i)) {
                    Nos = [...Nos, i, ...value]
                  }else {
                    Nos = [...Nos, ...value]
                  }
               }
            }
          return [...new Set(Nos)]
        }
        try {        
            let runnos = getno(MenuNos.current);
            let desnos = getno(Dmenunos.current)
            let paramsNos = [...new Set([...runnos, ...desnos, '0102', '0104','0201', '020101', '020102','020103', '020104'])]
            let {success, errMsg} = await  User.SetMenus({projectId, userId}, paramsNos)
            success &&  custMsg({content: '保存成功', onClose: ()=> {
              mref.current.onCancel()
            }})
            !success && custMsg({success, content: errMsg || '数据出错'})
        } catch (error) {
            console.log(error)
        }
    
      //  
    }
   
    const Menulist = () => {    
      const [value, setvalue] = useState('run')
      const [AllRunMenus, setAllRunMenus] = useState([])    
      const [allSinderRunMenus, setAllSinderRunMenus] = useState({}) 
      const [AllDesignMenus, setAllDesignMenus] = useState([])
      const [allSinderDesignMenus, setallSinderDesignMenus] = useState({}) 
     let exclude = [ '0101', '0103'];
       const queryUserMenus =  () => { 
        let f = !!projectId && !!userId
        if (!f)  return;
         User.QueryUserMenus({projectId, userId}).then(res => {
             let {success, data} = res
             if (success && Array.isArray(data)) {
             //let runmenu = data.filter(m => m.parentNo == '01').filter(m => !exclude.includes(m.no))
             let runmenu = data.filter(m => m.parentNo == '01').filter(m => !['0102', '0104'].includes(m.no))
             setAllRunMenus([...runmenu]);
             let designmenu = data.filter(m => m.parentNo == '02').filter(m => m.no !='0201');   
           

             setAllDesignMenus([...designmenu])     
             let sider = {}, design = {};
              runmenu.forEach(item => {
                let {no, key } = item 
                let arr = data?.filter(m => m.parentNo == no);
                 if(exclude.includes(no)) {
                  sider[key] = [item]
                } else if(arr.length > 0) {
                  sider[key] = arr;
                } 
             })
             setAllSinderRunMenus({...sider})

             console.log(designmenu)
             designmenu.forEach(item => {
              let {no, key } = item  
              let arr = data?.filter(m => m.parentNo == no);
              if(no == '0202') {
                design[key] = [item]
              }else if(arr.length > 0) {
                design[key] = arr
              }
              
                
            })     
            console.log(design)    
            setallSinderDesignMenus({...design})
          }
         }).catch(e => {
            console.log(e)
         });
         }
         useEffect(() => {
          queryUserMenus()
         }, [userId])
      
         const Runcom = () => {
         
          const runValue = useMemo(() => {

            let allvalues = []
            for(let values of Object.values(allSinderRunMenus)) {
                allvalues= [...allvalues, ...values];
            }
            return allvalues
          }, [allSinderRunMenus])
          const [indeterminate, setIndeterminate] = useState(false); //
          const [isall, setIsall] = useState({})

          const [runall, setRunall] = useState(() => !runValue.find(i => i.select == 0))
          const onRunall = (e) => {
            let checked = e.target.checked
            setRunall(checked)
            setIndeterminate(false)
            setAllSinderRunMenus(pre => {
                let menus = {}
                for(let [key, sider] of Object.entries(pre)) { 
                    let ms = []
                    sider.forEach(s => {
                      s.select = Number(checked);
                      ms.push(s);
                    })
                    menus[key] = ms 
                }
                return menus  
  
            })
          }
          useEffect(() => { 
            let bools = Object.values(isall)
            if (bools?.length) {
              console.log(bools)
              let trues = bools.filter(f => !f) 
              console.log(trues)
              setIndeterminate(!!trues.length && bools.length > trues.length) 
              if(trues.length ==bools.length) setRunall(false)

            } 
           
          }, [isall])
        
          return (
            <>
              <Checkdiv style={{paddingTop: '0px'}}>
              <Checkdiv style={{backgroundColor: '#e4e4e4', padding: "0px", flex: 1}}><Checkbox checked={runall} onChange={onRunall} indeterminate={indeterminate}>选择全部</Checkbox></Checkdiv>
              </Checkdiv>

              <Checkdiv>
            
            <Checkbox  checked disabled className="checktitle">
                      项目设置
            </Checkbox>
        
              <CheckboxGroup value={["0102"]}>
                         <Checkbox value="0102" checked disabled>项目设置</Checkbox>
              </CheckboxGroup>
        </Checkdiv>
        <Checkdiv>
        
        <Checkbox  checked disabled className="checktitle">
                  项目概述
        </Checkbox>
    
          <CheckboxGroup value={["0104"]}>
                     <Checkbox value="0104" checked disabled>项目概述</Checkbox>
          </CheckboxGroup>
    </Checkdiv>

             { AllRunMenus.length == 0 ?  <Spin tip="Loading..."> </Spin> : AllRunMenus.map(m => <CheckboxList setIsall={setIsall} data={allSinderRunMenus[m.key]}   title={m.label} mod={m.key} key={m.key} type="run" />)}
              
           
           
            </>
          )
         }
         const Descom = () =>{
          const runValue = useMemo(() => {

            let allvalues = []
            for(let values of Object.values(allSinderDesignMenus)) {
                allvalues= [...allvalues, ...values];
            }
            return allvalues
          }, [allSinderDesignMenus])
          const [indeterminate, setIndeterminate] = useState(false); //
          const [isall, setIsall] = useState({})

          const [runall, setRunall] = useState(() => !runValue.find(i => i.select == 0))
          const onRunall = (e) => {
            let checked = e.target.checked
            setRunall(checked)
            setIndeterminate(false)
            setallSinderDesignMenus(pre => {
                let menus = {}
                for(let [key, sider] of Object.entries(pre)) {
                    let ms = []
                    sider.forEach(s => {
                      s.select = Number(checked);
                      ms.push(s);
                    })
                    menus[key] = ms
                }
                return menus  
  
            })
          }
          useEffect(() => { 
            let bools = Object.values(isall)
            if (bools?.length) {
              console.log(bools)
              let trues = bools.filter(f => !f) 
              console.log(trues)
              setIndeterminate(!!trues.length && bools.length > trues.length) 
              if(trues.length ==bools.length) setRunall(false)
              
            } 
           
          }, [isall])

          const selectedmenu = [
            {no: "020101", label: '基础设置'},
            {no: "020102", label: '项目设置'},
            {no: "020103", label: '用户管理'},
            {no: "020104", label: '区域管理'}
          ]
          return (
            <>
          <Checkdiv style={{paddingTop: '0px'}}>
          <Checkdiv style={{backgroundColor: '#e4e4e4', padding: "0px", flex: 1}}><Checkbox checked={runall} onChange={onRunall} indeterminate={indeterminate}>选择全部</Checkbox></Checkdiv>
            </Checkdiv>
            <Checkdiv>
        
        <Checkbox  checked disabled className="checktitle">
                  公共模块
        </Checkbox>
    
          <CheckboxGroup value={['020101', '020102','020103', '020104']} disabled>
          <Space size={16} wrap>
                      {
                        selectedmenu?.map((d) => <Checkbox value={d.no} key={d.no} disabled >{d.label}</Checkbox>)
                      }
                 </Space>
          </CheckboxGroup>
      </Checkdiv>
           { AllDesignMenus.length ==0 ?  <Spin tip="Loading..."></Spin> : AllDesignMenus.map(m => <CheckboxList setIsall={setIsall} data={allSinderDesignMenus[m.key]}  title={m.label} mod={m.key} type='design'/>)}
           </>
          )
         }
  
         const cachrun = useMemo(() => <Runcom />, [AllRunMenus, allSinderRunMenus])
         const cachdes = useMemo(() => <Descom />, [AllDesignMenus, allSinderDesignMenus])
         const items =  [
          {
          key: 'run',
          label: '展示模块',
          children:  cachrun // <Menulist type='run' />
          },
          {
            key: 'design',
            label: '设置模块',
            children: cachdes // <Menulist type='design' />
            }
        ]
          const tabChange =(t) => { 
            setvalue(t);
          }
         return (
          <Tabsbox  items={items} onChange={tabChange} activeKey={value} />
         )
        
     }
  
 

   const CheckboxList = ({data, title, mod, type,  setIsall }) => {    
    
   /* projectSet 项目设置， runtimeProject 项目概述 必选 */

   

    if (!Array.isArray(data))  return  
     
     
    const [checkedList, setCheckedList] = useState(() => data?.filter(d => d.select == 1)?.map(d => d.no));
    const [allSelect] = useState(() => data.map(d => d.no) || []) 
    const [indeterminate, setIndeterminate] = useState(() => {
      let list = data.filter(d => d.select == 1)
       return  list.length>0 && list.length < data.length
    }); // 全选 或 全不选 false
    const [checkAll, setCheckAll] = useState(() => data.length === checkedList.length); 

    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? allSelect : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    }
  
    const onChange = (list) => { 
       setCheckedList(list)
       setIndeterminate(!!list.length && list.length < data.length)
       setCheckAll(list.length === data.length)
    }
    useEffect(() => {
       if(type == 'run') {
        MenuNos.current[mod] = checkedList;
        setIsall((pre) => ({
           ...pre,
           [mod]: data.length === checkedList.length
        }))
       
       }else if(type == 'design') {
        Dmenunos.current[mod] = checkedList;
        setIsall((pre) => ({
          ...pre,
          [mod]: data.length === checkedList.length
       }))
       }
       
    }, [checkedList, type])
    return (
      
          <Checkdiv>
            
             <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} className="checktitle">
                       {title}
             </Checkbox>
             
            <CheckboxGroup  value={checkedList} onChange={onChange}  >
                 <Space size={16} wrap>
                      {
                        data?.map((d) => <Checkbox value={d.no} key={d.no}  >{d.label}</Checkbox>)
                      }
                 </Space>
                  
                   
            </CheckboxGroup>
          </Checkdiv>
         
        
    )
   }
 
   
 

  
    return (

        <CModal mold="cust" okText="保存" cancelText="关闭" className="cstTitle" maskClosable={false} title="菜单权限设置"   ref={mref} width={1600} onOk={saveMenu} >
          <Menulist />
        </CModal>


   
    )
}
export default forwardRef(Index)