import React, {memo, useState, useEffect} from 'react'
import styled from 'styled-components'
import { Login as Logapi } from "@api/api";
import {useDispatch} from 'react-redux'
import {  getThemeColor, getSystemconfiginfo} from "@redux/systemconfig";
const List = styled.div`
  display: flex;
  flex-direction: column;
  .chtitle {
    .text {
      color: #fff;
      font-style: italic;
      font-size: 52px;
      z-index: 2; 
      position: relative;
      transform: translate(6px, 22px);
    }
     
  }
  .block {
    display: block;
    width: 775px;
    height: 35px;
    background-color: #012bd2;
   
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
const items = [
    "运行监控",
    "电气安全",
    "配电管理",
    "结算收费",
    "光伏发电",
    "碳排管理",
    "运维管理",
  ];
export default memo(function Listitem({logtitle, englishTitle, literal}) {   
  const dispatch = useDispatch();
  const [systitle, setTitle] = useState({})
  
  const getSysteminfo = async (hostname) => {
     try {
       let {data, success} =   await Logapi.SystemConfig(hostname)
       if(success && data.constructor === Object) { 
            const { englishTitle="Integrated Energy Service Platform", literal, title, chineseTitle } = data;
            
          
            let enchtitle = (title ?? 'NIS6000') + ' '+ (chineseTitle ?? '正泰综合能源服务平台');
            document.title = enchtitle
            setTitle({
               englishTitle,
               literal,
               enchtitle
            })
            dispatch(getSystemconfiginfo(data)) 
            dispatch(getThemeColor({primaryColor: data.themeColor || "#237ae4"})) 
       }else {
            dispatch(getSystemconfiginfo({}))
       }

     } catch (error) {         
          dispatch(getSystemconfiginfo({}))
     }
    
  }
  useEffect(() => {
   
    const hostname = process.env.NODE_ENV === "production"
    ? new URL(window.location.href).hostname
    : "10.5.7.60";
   
    getSysteminfo(hostname)
 
 }, []); 
        return (
          <List>
            <div className="chtitle">
              <p className="text">{systitle.enchtitle}</p>
              <p className="block"></p>
              <p className="entitle">{systitle.englishTitle}</p>
            </div>
          
            <div className="itemlist" style={{display: systitle.literal== 1 ? 'flex' : 'none'}}>
              {items.map((i, index) => (
                <div className="item" key={index}>
                  <span className="icon"></span>
                  <span className="text">{i}</span>
                </div>
              ))}
            </div>
          </List>
        );
     
})
