import styled, { css } from "styled-components";

const flexBox = ({ jc = "center", fd = "row" }) => css`
  display: flex;
  flex-direction: ${fd};
  justify-content: ${jc};
  align-items: center;
`;
const borderBox = ({ borderRadius = "4px", bgcolor = "#fff" }) => css`
  border: 1px solid #d7d7d7;
  border-radius: ${borderRadius};
  background: ${bgcolor};
`;

const flex1 = css`
  display: flex;
  flex:1;
  overflow: hidden;
`;
export const Header = styled.div`
  height: 48px;
  width: 100%;
  padding-right: 16px;
  ${flexBox({ jc: "space-between" })}
  .ant-radio-button-wrapper {
    border: none;
    height: 100%;
    box-shadow: none;
    border-radius: 0;
    background: #f0f0f0;
    height: 46px;
    line-height: 46px;
    width: 99px;
    text-align: center;
    font-size: 14px;
    &:nth-of-type(1) {
    }
    .ant-radio-button-checked::before {
      background: #fff;
    }
  }
  ${borderBox}
`;
export const Main = styled.div`
  ${flexBox({ jc: "space-between" })}
  flex: 1;
  width: 100%;
  margin-top: 16px;
  .tree-box {
    height: 799px;
    flex-shrink: 0;
    max-width: 210px;
    display: flex;
    flex-direction: column;
    width: 210px;
  }
  .right-box {
    flex: 1;
    height: 100%;
    margin-left:16px;
    padding:16px;
    max-width:1465px;
    overflow: hidden;
    ${borderBox};
    ${flexBox({jc:"flex-start",fd:"column"})}
    .chart{
        ${flex1}
        .airChart{
          ${flex1}
          .airPie{
            height: 422px;
            flex: 1;
          }
          .airColumn{
            height: 438px;
            flex:2.2;
          }
        }
        .chartCol{
          flex: 1;
          height: 542px;
        }
    }
    .ant-radio-button-wrapper {
    margin-left: auto;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    border-radius: 2px;

    &:first-child {
      border-radius: 0;
    }

    &:last-child {
      border-radius: 0;
    }

    &::before {
      display: none;
    }
  }
  }
`;
export const Container = styled.div`
  ${flexBox({ jc: "space-between", fd: "column" })}
  flex: 1;
  .ant-table-cell .bg{
    background: #f6f9ff;
  }
`;
export const  AirModal=styled.div`
 .ant-table-tbody .ant-table-row .ant-table-cell.bg{
  background-color: #f6f9ff;
}
`
export const BasicInfo =styled.div`
display:grid;
grid-template-columns:repeat(3,1fr);
grid-gap:16px;
margin:16px 0;
.flexbox{
${flexBox({jc:"flex-start"})}
}
`

export const  CellDiv=styled.div`
  height:42px;
  position:relative;
  display: flex;
  .bg-segment {
      position: absolute;
      top: 0;
      height: 100%;
      z-index: 3;
    } 
`
export const TbEchartDiv=styled.div`
flex:1;
height: 100%;
z-index:4;
`