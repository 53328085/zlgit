import React, {useContext} from "react";
import styled from "styled-components";
import {useSelector} from 'react-redux'
import { systemConfigInfo} from '@redux/systemconfig.js'
import dayjs from 'dayjs';
import printContext from "./context";
const Pagecont = styled.div`
  height: 806px;
  display: grid;
  grid-template-rows: 36px 1fr;
  row-gap: 32px;
  background-color: #fff;
  page-break-after: always;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--ant-primary-color);
    color: #fff;
    font-size: 14px;
    padding: 0 16px;
  }
  .main {
    padding: 0 16px 16px 16px;
    color: #515151;
    display: flex;
    flex-direction: column;
  }
`;

export default function Index(props) {
  const {params} = useContext(printContext)
  let date 
  if (params) {
     date = params.type == 2 ? dayjs(params.date, "YYYY-MM-DD").format("YYYY-MM") : params.type == 3 ? dayjs(params.date, "YYYY-MM-DD").format("YYYY") : ''
  }
  let title = ''
  if(date) {
    title =   params.type == 2 ? `本期报告分析周期为：${date}月` : params.type == 3? `本期报告分析周期为：${date}年` : ''
  }
  const {chineseTitle} = useSelector(systemConfigInfo)
  return (
    <Pagecont>
      <div className="header">
          <span>{chineseTitle}</span>
          <span>{title}</span>
       </div> 
      <div className="main"> {props.children} </div>
     
    </Pagecont>
  );
}
