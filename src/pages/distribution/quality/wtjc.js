import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { nanoid } from "@reduxjs/toolkit";
import UserTable from "@com/useTable";
import svgurl from "@svgs";
import { PowerQuality } from "@api/api";
import { isObject } from "@com/usehandler";

import {
  columns,
  columns2,
  columns3,
  columns4,
  columns5,
  columns6,
  columns7,
  columns8,
  columns9,
} from "./columns";
const sty = css``;
const Mainbox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  padding: 16px;
  /*  .item {
    display: grid;
    grid-template-columns: ${(props) => props.col || "1fr 334px"};
    grid-template-rows: 30px auto;
    gap: 16px 32px;
    padding-bottom: 32px;
    border-bottom: 1px dotted #d7d7d7;
    .title {
      display: flex;
      align-items: center;
      column-gap: 16px;
      font-size: 16px;
    }
  } */
`;
const Citems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  .item {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    flex: auto;
  //  align-items: flex-start;
    .title {
      display: flex;
      align-items: center;
      column-gap: 16px;
      font-size: 16px;
    }
  }
  
`;
const Item = styled.div`
  && {
    display: grid;
    grid-template-columns: ${(props) => props.col || "1fr 334px"};
    grid-template-rows: 30px auto;
    gap: 16px 32px;
    padding-bottom: 32px;
    border-bottom: 1px dotted #d7d7d7;
    &:last-of-type {
      border-bottom: none;
    }
    .title {
      display: flex;
      align-items: center;
      column-gap: 16px;
      font-size: 16px;
    }
  }
`;
const returnO = (o) => {
  return isObject(o) ? o : {};
};
export default function Index({ projectId, day, sn, laptop }) {
  const [datas, setDatas] = useState({});
  let { au, bu, cu, zu, fu, lu, ai, bi, ci } = datas || {};

  let abcuData = [
    { type: "A相", ...returnO(au) },
    { type: "B相", ...returnO(bu) },
    { type: "C相", ...returnO(cu) },
  ];

  let bphdData = [
    { type: "正序", ...returnO(zu) },
    { type: "负序", ...returnO(fu) },
    { type: "零序", ...returnO(lu) },
  ];
  let abciData = [
    { type: "A相", ...returnO(ai) },
    { type: "A相", ...returnO(bi) },
    { type: "A相", ...returnO(ci) },
  ];
  let zfliData = [
    { type: "正序", ...returnO(datas?.zi) },
    { type: "负序", ...returnO(datas?.fi) },
    { type: "零序", ...returnO(datas?.li) },
  ];
  let abcpData = [
    { type: "A相", ...returnO(datas?.ap) },
    { type: "A相", ...returnO(datas?.bp) },
    { type: "A相", ...returnO(datas?.cp) },
  ];
  const getData = async () => {
    try {
      const body = {
        projectId,
        sn,
        day: day.format("YYYY-MM-DD"),
      };
      let { success, data } = await PowerQuality.WTJC(body);
      if (success && isObject(data)) {
        setDatas(data);
      } else {
        setDatas({});
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (Number.isInteger(parseInt(projectId)) && sn && day) {
      getData();
    }
  }, [projectId, day, sn]);
  return (
    <Mainbox laptop={laptop}>
      <Citems>
        <div className="item">
          <div className="title" key={nanoid()}>
            <img src={svgurl.dy} />
            电压
          </div>
          <div key={nanoid()}>
            <UserTable
              columns={columns}
              dataSource={abcuData}
              istheme="theme"
              rowKey={nanoid()}
            ></UserTable>
          </div>
        </div>
        <div className="item" style={{alignSelf: "flex-start"}}>
          <div className="title" key={nanoid()}>
            <img src={svgurl.dy} />
            电压
          </div>
          <div key={nanoid()}>
            <UserTable
              columns={columns2}
              dataSource={bphdData}
              istheme="theme"
              rowKey={nanoid()}
            ></UserTable>
          </div>
        </div>
      </Citems>
      {/*  <Item key="ec">
          <div className='title' key={nanoid()}>
                <img src={svgurl.dy} />
                电压
          </div>
          <div className='title' key={nanoid()}>
                <img src={svgurl.dy} />
                电压
          </div>
          <div key={nanoid()}>
               <UserTable columns={columns} dataSource={abcuData} istheme="theme" rowKey={nanoid()} ></UserTable>
          </div>
          
          <div key={nanoid()}>
               <UserTable columns={columns2} dataSource={bphdData} istheme="theme" rowKey={nanoid()} ></UserTable>
          </div>
          </Item> */}
        <Citems>
          <div className="item" style={{flex: "0 0 464px"}}>
          <div className="title" key={nanoid()}>
          <img src={svgurl.ec} />
          电流
        </div>
        <div key={nanoid()}>
          <UserTable
            columns={columns3}
            dataSource={abciData}
            istheme="theme"
            rowKey={nanoid()}
          ></UserTable>
        </div>
          </div>
          <div className="item" style={{flex: "0 0 336px"}}>
          <div className="title" key={nanoid()}>
          <img src={svgurl.ec} />
          电流
        </div>
        <div key={nanoid()}>
          <UserTable
            columns={columns4}
            dataSource={zfliData}
            istheme="theme"
            rowKey={nanoid()}
          ></UserTable>
        </div>
          </div>
        </Citems>
      {/* <Item key="ei" col="464px 336px">
        <div className="title" key={nanoid()}>
          <img src={svgurl.ec} />
          电流
        </div>
        <div className="title" key={nanoid()}>
          <img src={svgurl.ec} />
          电流
        </div>
        <div key={nanoid()}>
          <UserTable
            columns={columns3}
            dataSource={abciData}
            istheme="theme"
            rowKey={nanoid()}
          ></UserTable>
        </div>
        <div key={nanoid()}>
          <UserTable
            columns={columns4}
            dataSource={zfliData}
            istheme="theme"
            rowKey={nanoid()}
          ></UserTable>
        </div>
      </Item> */}
      <Citems>
        <div className="item">
          <div className="title" key={nanoid()}>
            <img src={svgurl.kv} />
            分相功率
          </div>
          <div key={nanoid()}>
            <UserTable
              columns={columns5}
              dataSource={abcpData}
              istheme="theme"
              rowKey={nanoid()}
            ></UserTable>
          </div>
        </div>
        <div className="item">
        <div className='title' key={nanoid()}>
                <img src={svgurl.kv} />
               总功率
          </div>
          <div key={nanoid()}>
               <UserTable columns={columns6} dataSource={[datas?.p]} istheme="theme" rowKey={nanoid()} ></UserTable>
          </div> 
        </div>
        <div className="item">
        <div className='title' key={nanoid()}>
                <img src={svgurl.kv} />
               功率因数
          </div>
          <div key={nanoid()}>
               <UserTable columns={columns7} dataSource={[datas?.p]} istheme="theme" rowKey={nanoid()} ></UserTable>
          </div> 
        </div>
        <div className="item">
        <div className='title' key={nanoid()}>
                <img src={svgurl.pl} />
               频率
          </div>
          <div key={nanoid()}>
               <UserTable columns={columns8} dataSource={[datas?.p]} istheme="theme" rowKey={nanoid()} ></UserTable>
          </div> 
        </div>
        <div className="item">
        <div className='title' key={nanoid()}>
                <img src={svgurl.pl} />
               频率偏差
          </div>
          <div key={nanoid()}>
               <UserTable columns={columns9} dataSource={[datas?.p]} istheme="theme" rowKey={nanoid()} ></UserTable>
          </div> 
        </div>
      </Citems>
      {/*  <Item key="ep" col="464px 480px repeat(3, 160px)">
          <div className='title' key={nanoid()}>
                <img src={svgurl.kv} />
                分相功率
          </div>
          <div className='title' key={nanoid()}>
                <img src={svgurl.kv} />
               总功率
          </div>
          <div className='title' key={nanoid()}>
                <img src={svgurl.kv} />
               功率因数
          </div>
          <div className='title' key={nanoid()}>
                <img src={svgurl.pl} />
               频率
          </div>
          <div className='title' key={nanoid()}>
                <img src={svgurl.pl} />
               频率偏差
          </div>
          <div key={nanoid()}>
               <UserTable columns={columns5} dataSource={abcpData} istheme="theme" rowKey={nanoid()} ></UserTable>
          </div>
          <div key={nanoid()}>
               <UserTable columns={columns6} dataSource={[datas?.p]} istheme="theme" rowKey={nanoid()} ></UserTable>
          </div> 
          <div key={nanoid()}>
               <UserTable columns={columns7} dataSource={[datas?.p]} istheme="theme" rowKey={nanoid()} ></UserTable>
          </div> 
          <div key={nanoid()}>
               <UserTable columns={columns8} dataSource={[datas?.p]} istheme="theme" rowKey={nanoid()} ></UserTable>
          </div> 
          <div key={nanoid()}>
               <UserTable columns={columns9} dataSource={[datas?.p]} istheme="theme" rowKey={nanoid()} ></UserTable>
          </div> 
          </Item> */}
    </Mainbox>
  );
}
