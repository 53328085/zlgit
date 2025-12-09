import styled, {css} from "styled-components";
import { Tabs, Typography } from 'antd';
const { Text } = Typography;
const sty = css`
  grid-template-columns: 3fr  minmax(416px, 1fr);
 `
export const Mainbox = styled.div` 
&& {
    flex:1;
    display: grid;
    grid-template-columns: 1256px  minmax(416px, 1fr);
    column-gap: 16px; 
    overflow: hidden;
     ${props => props.laptop ? sty : null}
    .left {
      display: grid;
      grid-template-rows: 40px minmax(472px, 1fr);
    }
}
`;
export const   Tabsbox = styled(Tabs)`
&& {
 .ant-tabs-nav {
   margin-bottom: 0px;
  .ant-tabs-nav-list {
   .ant-tabs-tab {
       border-radius: 6px 6px 0 0;
       height: 41px;
       width: 114px;
       justify-content: center;
       font-size: 14px;
       background-color: #fff;  
       transition: none;
       &:hover {
           background-color: ${props => props.theme.primaryColor}  ;
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
   .ant-tabs-tab + .ant-tabs-tab {
     margin: 0 0 0 16px;
   }
   .ant-tabs-tab.ant-tabs-tab-active {
       background-color: ${props => props.theme.primaryColor};
      
       .ant-tabs-tab-btn {
           color:#fff;
           transition: none;
       }
   }
  }  
  .ant-tabs-content-holder {
   display: none;
  }
 }
}
`
export const Echartbox = styled.div`
height: 100%;
width: 100%;
background-color: #fff;
padding: 16px;
border: 1px solid #d7d7d7;
display: flex;
flex-direction: column;
.model {
 display: flex;
 justify-content: flex-end;
}
.chart {
 flex: 1;
 display: flex;
}
`
const divboxsty = css`
.imgbox {
  width: 48px;
  height: 48px;
}
`
export const  Detailbox = styled.div`
 display: grid;
 grid-template-rows:  ${props => props.tabvalue==0 ? `250px minmax(240px, 1fr)` : `200px minmax(240px, 1fr)`} ;
 row-gap: 16px;
.divbox{
    flex:1;
display: grid;
grid-template-columns: 64PX 1fr;
column-gap: 32px;
padding-right:${props=> props.tabvalue==0 ? "32px" : "0px"} ;
align-items: center;
.imgwrap{
    display: flex; 
    align-items: center;
    justify-content: center;
.imgbox {
   width: 64px;
   height: 64px;
   img {
    max-width: 100%;
   }
}
}

${props => props.theme.laptop ? divboxsty : null}
}
`;
 
 
 
 
const Custspan = styled(Text)`
&& {
  font-size: 14px;
   min-width: 142px;
  color: #515151;
  display: flex;
  justify-content: ${(props) => (props.jc == 1 ? "flex-start" : "space-between")};
 
  span {
    color: #999;
    padding-left: 1em;
  }
}

`;
export  const Title = ({ title, subtitle, jc }) => {
    return (
      <Custspan className="t" jc={jc} ellipsis={{ tooltip: title }}>
        {title}
        <span>{subtitle}</span>
      </Custspan>
    );
  };