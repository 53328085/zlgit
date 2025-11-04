import styled from "styled-components"
import power from './imgs/power.png'
export const Mainbox =styled.div`
  && {

    flex: 1;
    display:grid;
    grid-template-columns: 287px 1fr;
    grid-template-rows: 1fr;
    gap:16px;
    .treecom {

    }
    .right {
       display: grid;
       grid-template-rows: 232px 1fr;
       gap:16px;
       .topwrap {
        overflow: auto;
       .top { 
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(229px, 1fr));
        gap: 9px;
       }
    }
    }
  }

`
export const Power= styled.div`
&& {
    min-width: 229px;
    height: 232px;
    background: #FFFFFF;
    border-radius: 8px;
    border: 1px solid #DDDFE6;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    .powerUp {
        flex:1;
        display: flex;
        flex-direction: column;
        padding: 8px;
        .title {
            height: 28px;
            background-image: url(${power});
            background-repeat: no-repeat;
            background-position: left;
            display: flex;
            align-items: center;
            padding-left: 31px;
            color:rgba(48, 49, 51, 1);
        }
        .contentwrap {
            flex:1;
            display: flex;
            align-items: center;
            justify-content: center;
        .content{
         
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content:center;
            .num {
                color:rgba(30, 80, 230, 1);
                font-size: 24px;
            }
            .sub {
                color:rgba(96, 98, 102, 1);
                font-size: 12px;
            }
        }
    }
         
    }
    .powerDown {
        height: 98px;
        background: linear-gradient(0deg, rgba(30, 80, 230, 0.15) 0%, rgba(3,160,255,0.03) 100%);
        transition: all 0.3s;
        border-radius: 0px 0px 8px 8px;
        padding:14px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: 20px;
        justify-content: space-between;
        align-content: space-between;
        .label {
           color:rgba(96, 98, 102, 1);
           text-align:left;
        }
        .value {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            color:rgba(48, 49, 51, 1); 
            font-weight: bold;
            column-gap: 8px;
        }
    }
    .active.powerDown  {
        background: linear-gradient(0deg , #1E50E6 0%, rgba(3,160,255,0.2) 100%);
    }
}
  
`
export const CustTitle=styled.div` 
&&{
    display: flex;
    align-items: center;
    justify-content:space-between;
}
`
export const ChartWrap = styled.div`
&&{
    flex:1;
    display:flex;
    gap: 16px;
    .pip {
        height: 100%;
        flex-basis: 354px;
        display:flex;
    }
    .bar {
        flex:1;
        display:flex;
    }
}
`