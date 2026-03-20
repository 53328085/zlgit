import styled, { css } from "styled-components";
import {Select} from 'antd'
import {colors} from "./data"
import imgulr from "./icon";

const bgsty = css`
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;
const normal = css`
  display: flex;
  align-items: center;
`;
const title = css`
  color: #fff;
  font-family: headfont;
`;
export const Cselect =styled(Select)`
&&{
  .ant-select-selector {
  width:420px;
 background: linear-gradient( 170deg, rgba(11,23,51,0.4) 0%, rgba(13,28,37,0.5) 100%);
border-radius: 4px;
border: 1px solid;
border-image: linear-gradient(270deg, rgba(30, 80, 230, 1), rgba(20, 220, 200, 1)) 1 1;
backdrop-filter: blur(8px);
 .ant-select-selection-item {
  color: #fff;
 }
  }
}
`
export const Pagelayout = styled.div`
  flex: 1;
  background-image: url(${imgulr["pgbg"]});
  ${bgsty}
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  padding: 0 16px 16px 16px;
  .hearder {
    height: 65px;
    display: flex;
    flex-direction: column;
    background-image: url(${imgulr["hdbg"]});
    ${bgsty}
    .h {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      line-height: 1;
      transform: translateY(10px);
      ${title}// height: 44px;;
    }
    .opt {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 32px;
      .btns {
        display: flex;
        column-gap: 16px;
        .btn {
          height: 40px;
          width: 92px;
          background-image: url(${imgulr["btndf"]});
          color: #fff;
          padding-bottom: 9px;
          ${normal}
          justify-content: center;
          column-gap: 8px;
          &:hover {
            cursor: pointer;
          }
          .img {
            width: 16px;
            overflow: hidden;
            img {
              max-width: 100%;
            }
          }
        }

        .btn.act {
          background-image: url(${imgulr["btnatv"]});
        }
      }
      .date {
        ${normal}
        justify-content: space-between;
        column-gap: 16px;
        color: #fff;
        .time {
        }
        .full {
          ${normal}
          column-gap: 8px;
          &:hover {
            cursor: pointer;
          }
          .fullimg {
            width: 20px;
            img {
              max-width: 100%;
            }
          }
        }
      }
    }
  }
  .content {
    flex: 1;
    display: flex;
    // grid-template-columns: minmax(528px, auto) minmax(800px, auto) minmax(528px, auto);
    // grid-template-rows: 1fr;
    gap: 16px;
    .left {
      display: flex;
      flex-basis: 420px;
      flex-direction: column;
      row-gap: 16px;
    }
    .center {
      display: flex;
      flex-basis: 800px;
      flex-direction: column;
      row-gap: 16px;
      .centerup {
        flex:316px
      }
    }
    .right {
      display: flex;
      flex-basis: 528px;
      flex-direction: column;
      row-gap: 16px;
    }
  }
`;

export const Layoutcom = styled.div`
  flex-basis: ${(props) => props.flex};
  display: flex;
  flex-direction: column;
  background: linear-gradient( 270deg, rgba(2,40,85,0.4) 0%, rgba(13,41,50,0.5) 100%);
  border-radius: 8px;
  color: #fff;
  .chartwrap{
    flex:1;
    display: flex;
    justify-content: center;
    padding: ${props=>props.pd || "20px"};
    .mgr{
        margin-right: 2px;
    }
    .mgr8{
        margin-right: 8px;
    }
  }
`;
export const Leftup = styled.div`
   flex: 1;
   display: grid;
   grid-template-rows: 150px 1fr;
   row-gap: 8px;
 
   .items{ 
     display: grid;
     grid-template-columns: repeat(3, 1fr);
     height: 150px;
     .item {
        ${normal};
           flex-direction: column;
            justify-content: space-between;
          .title {
            color: rgba(255, 255, 255, 0.7);
            text-align: center;
          }
          .value {
            color: #fff;
            font-size: 20px;
            text-align: center;
            line-height: 1.2;
          }  
          .icon {
            width: 70px;
            height: 70px;
            overflow: hidden;
            .img {
              max-width: 100%;
            }
          }
       
    
    }
   }
`;

export const Leftdown = styled.div`
   flex: 1;
   display: grid;
   grid-template-rows: 20px 1fr;
   row-gap: 8px;
   .downtitle{
      ${normal};
      justify-content: space-between;
      .circle{
         ${normal}
         flex-direction: row;
      }
   }
   .slider-container{
    width: 478px;
   }
   .ant-carousel .slick-slide {
   .probox{
     display: grid;
     grid-template-rows: repeat(5, 1fr);
     row-gap: 16px;
     .proitem{
        display: flex;
        flex-direction: column;        
        .rank {
            ${normal}
            justify-content: space-between;
            column-gap: 12px;
            .top {
                font-weight: 600;                
                color: #F88C28;
                font-size: 14px;
            }
            .top.other {
            color: #FFFFFF;
            opacity: 0.5;
            }
            .keyval {
                flex: 1;
                ${normal}
                justify-content: space-between;
                color: #FFFFFF;
            }
        }
        .ant-progress{
            line-height: 1;
        }
     }
   } 
}
.ant-carousel .slick-dots-bottom {
    bottom:-12px;

}
`;

export const Centerdown = styled.div`
   flex: 1;
   display: grid;
   grid-template-rows: 38px 1fr;
   row-gap: 10px;
   color: #FFFFFF;
   .centertitle{
      display: grid;
      grid-template-rows: 14px 18px;
      row-gap: 6px;
      .percentage{
        justify-self: flex-end;
        font-size: 12px;
        color: #FFFFFF;
      }
      .info{
        justify-content: space-between;
        display: flex;
        align-items: center;
        .centertotal{
          .month{
            color: ${colors[0]};
            padding-left: 4px;
          }
        }
        .percentline{
          width: 236px;
          height: 14px;
          background: linear-gradient( 180deg, rgba(0, 197, 255, 0.3) 0%, rgba(0, 121, 237, 0.3) 100%);
           display: flex;
        }
      }
   }
   .contentwrap{
    display: flex;
     flex-direction: column;
    row-gap: 8px;
    .cols{
      opacity: 0.5;
      color: #FFFFFF;
      display: grid;
      grid-template-columns: 80px 1fr 1fr 100px;
      grid-template-rows: 32px;
    }
/*     .rows{
      display: grid;
      grid-template-columns: subgrid;
      grid-area: 2/1/3/-1 ;
      grid-auto-rows: 32px;
      height: 188px;
      .row {
        display: grid;
        grid-template-columns: subgrid;
        grid-column: 1/-1;
        color: #FFFFFF;
        .ant-badge-status-text {
          color:#fff;
        }
        &:even{
          background-color:  rgba(13, 129, 180, 0.5)
        }

      }
    } */
   }
   .slider-container{
    width: 760px;
   
    .ant-carousel .slick-list .slick-slide>div>div.row{
      display: grid !important;
        grid-template-columns: 80px 1fr 1fr 100px;
        grid-template-rows: 32px;
        color: #FFFFFF;
        .ant-badge-status-text {
          color:#fff;
        } 
    }
    .ant-carousel .slick-list .slick-slide:even>div>div.row{ 
          background-color:  rgba(13, 129, 180, 0.5) 

    }
}
 
`;
export const Rightupcenter = styled.div`
   flex: 1;
   display: flex;
  
   .slider-container{
    width:488px;
    // height: calc(100% - 32px - 42px);
    
      .ant-carousel{ 
      .slick-slider{ 
        .slick-list{
          .slick-track {
            .slick-slide{
              >div{
                .chartbox{
                  height:234px; 
                }
               
              }
             
            }
           
          }
          
        }
      }
     }  
      
   }

.ant-carousel .slick-dots-bottom {
    bottom:-12px

}
`;

export const Rightdown = styled.div`
&&{
   flex: 1;
   display: grid;
   grid-template-rows: 45px 1fr;
   row-gap: 10px;
   color: #FFFFFF;
   .ant-statistic-title{
    color: #FFFFFF;
    margin-bottom: 0;
    line-height: 18px;
   }
   .ant-statistic-content {
    color:#0AEEFF;
    font-size: 18px;
    line-height: 26px;
   }
}
   `

export const Titlesty = styled.div`
  ${normal}
  height: 42px;
  justify-content: space-between;
  background-image: url(${imgulr["titbg"]});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: left center;
  padding-right: 20px;
  .chartTitle {
    ${title}
    font-size: 17px;
    padding-left: 16px;
  }
  .subtitle {
    color: rgba(255, 255, 255, 1);
    font-size: 13px;
    opacity: 0.5;
  }
`;
export const Circle = styled.div`
     width: 12px;
    height: 12px;
    background: linear-gradient( 179deg, #00C5FF 0%, #0079ED 100%);
    border-radius: 50%;
`;