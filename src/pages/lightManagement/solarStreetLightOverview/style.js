import styled from "styled-components";
import {Tag} from 'antd'
export const Ctag = styled(Tag)`
&&{
  position: absolute;
  left: ${props => props.left+'px'};
  top: ${props=> props.top+12+'px'};
  transform: translate(-50%, -50%);
  cursor: pointer;
}
`

export const Mainbox = styled.div`
 flex:1;
  display: grid;
 grid-template-columns: minmax(1150px,auto)  minmax(514px, auto) ;
 
  gap:16px;
  .leftlayout {
   
    display: grid;
    grid-template-rows:80px minmax(704px, auto);
    gap:16px;
    
    .leftup{
       display: grid;
       height: 80px;
       gap:16px;
       grid-template-columns: minmax(271px, auto) minmax(565px, auto) minmax(271px, auto);
      // background-color: #fff;
      .item {
        display: flex;
        flex-direction:column;
        align-items: center;
        justify-content: space-evenly;
        color:#666;
        background-color: #fff;
        .num {
          color:#1e1e1e;
        }
        .state {
          display: flex;
          column-gap: 64px;
          .statevalue {
           display:flex;
          align-items: center;
          .dot {
            height: 14px;
            width: 14px;
             border-radius: 50%;
             display: inline-block;
             margin-right: 5px;
          }
          .dot.on {
            background-color:#0af603;
          }
          .dot.off {
            background-color: #828282;
          }
        }
        }
      }
    }
    .leftdown  {
       display: flex;
       flex-direction: column;
       padding: 8px; 
        background-color: #fff;
        row-gap: 16px;
        .operate {
        display: flex;
        justify-content: flex-end;
        align-items: center;
       }
        .mapwrap {
          flex:1;
          display: flex;
          overflow: auto;
          position: relative;
          .lighticon {
            width: 34px;
            height: 34px;
          }
        }
        .cardwrap {
         // flex:1;
          display: grid;
          grid-template-columns: minmax(536px, 1fr) minmax(536px, 1fr);
          grid-auto-rows: 158px;
          gap:16px;
          height: 640px;
          overflow-y: auto;
        }
       .tablewrap {
        flex:1;
        position: relative;
          .inwrap {
              width: 100%;
              position: absolute;
          }
       }
    }
  }
  .rightlayout {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 213px 160px 160px minmax(219px, 1fr);
    row-gap: 16px;
    .pies {
      flex:1;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: 1fr;
      column-gap: 16px;
      .img {
          max-width: 100%;
        }
      .item { 
        background-color: rgba(242, 242, 242, 0.498039215686275); 
        border : 1px solid rgba(215, 215, 215, 1);
        font-size: 14px;
        color: #666666;
        display: flex;
        flex-direction:column;
        align-items: center;
        justify-content: space-around;
      
      }
    }
    .pies.center {
      align-items: center;
      .item {
        padding: 16px 0;
      }
    }
  }
  

`
export const TitP = styled.div`
  && {
    min-width: 426px;
    min-height: 158px;
    border: 1px solid #fff;
    border-radius: 4px;
    left: ${props => props.left+'px'};
    top: ${props=> props.top+32+'px'};
    position: absolute;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    .title {
      background-color: #0c3;
      color: #fff;
      height: 24px;
      padding: 2px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .contentbox {
      background-color: rgba(255,255,255,0.6);
      padding: 16px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      justify-content: space-between;
      flex:1;
      .content {
        display: flex;
        align-items: center;
        column-gap: 8px;
        .key{
          font-size: 12px; 
        }
        .value{
          font-size: 14px;
          
        }
      }
    }
  }
`
export const Ctitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const Mcontent = styled.div`
 &&{
  display: grid;
  grid-template-rows: 32px 344px;
  grid-template-columns: 1fr;
  row-gap: 16px; 
  .outwrap {
    flex:1;
    position: relative;
    .inwrap {
      position: absolute;
      width: 100%;
    }
  }
  .chartwrap {
     flex:1;
     display: grid;
     grid-template-columns: 284px 1fr;
     grid-template-rows: 1fr;
     column-gap: 16px;
     .pie, .bar {
        display: flex;
     }
  }
  .allofArea {
    display: flex;
    flex:1
  }
 }
`