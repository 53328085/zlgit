import styled from "styled-components";
import {List} from 'antd'
export  const Mainwrap = styled.div`
&& {
   flex:1;
   display: grid;
   grid-template-columns: 288px minmax(1382px, 1fr);
   grid-template-rows: minmax(817px, 1fr);
   column-gap: 16px; 
   .right {
     display: flex; 
     flex-direction: column;
     flex:1;
     row-gap: 16px;
     .outtbwrap{
       flex:1;
       position: relative;
       .inerwrap{
        position: absolute;
        width: 100%;
       }

     }
     
   }
}
`
export const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const Clist = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column; 
  padding: 16px 0;
    .item {
      padding: 0 8px;
      display: flex;
      align-items: center;
      height: 32px;
      
      &:hover  {
        cursor: pointer;
      //  background-color:#ECF5ff;  // ${props=> `rgba(${props.MRGB[0]},${props.MRGB[0]},${props.MRGB[2]},0.5)`}  ; 
        color:${props=>props.theme.primaryColor}
      }
    }
    .item.active {
      background-color:#ECF5ff;   
    }
 `