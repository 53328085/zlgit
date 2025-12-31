import styled, { css } from "styled-components";
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
export const Pagelayout = styled.div`
  flex: 1;
  background-image: url(${imgulr["pgbg"]});
  ${bgsty}
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  padding: 0 16px 16px 16px;
  .hearder {
    height: 84px;
    display: flex;
    flex-direction: column;
    background-image: url(${imgulr["hdbg"]});
    ${bgsty}
    .h {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      ${title}// height: 44px;;
    }
    .opt {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
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
      flex: 528px;
      flex-direction: column;
      row-gap: 16px;
    }
    .center {
      display: flex;
      flex: 800px;
      flex-direction: column;
      row-gap: 16px;
      .centerup {
        flex:316px
      }
    }
    .right {
      display: flex;
      flex: 528px;
    }
  }
`;

export const Layoutcom = styled.div`
  flex:  ${(props) => props.flex};
  display: flex;
  flex-direction: column;
  background: linear-gradient( 270deg, rgba(2,40,85,0.77) 0%, rgba(13,41,50,0.81) 100%);
  border-radius: 8px;
  color: #fff;
  .chartwrap{
    flex:1;
    display: flex;
    justify-content: center;
    padding: 20px;
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
   grid-template-rows: 336px 36px 1fr;
   row-gap: 20px;
   height: 100%;
   .total {
     color: #fff;
     ${normal}
     justify-content: center;
     .totalcontent{
        ${normal}
        justify-content: center;
        .num{
        font-size: 28px;
        font-family: headfont;
     }
     }
    
   }
   .items{
     align-self: flex-end;
     display: grid;
     grid-template-columns: 1fr  1fr;
     gap: 14px 20px;
     .item {
        display: grid;
        grid-template-columns: subgrid;
        .value{
            ${normal};
            justify-content: space-between;
            .ant-badge-status-text{
            font-size: 14px;
            color: #fff;

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
         column-gap: 8px;
      }
   }
   .slider-container{
    width: 582px;
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
export const Titlesty = styled.div`
  ${normal}
  height: 42px;
  justify-content: space-between;
  background-image: url(${imgulr["titbg"]}),url(${imgulr["ticon"]});
  background-size: contain, auto;
  background-repeat: no-repeat;
  background-position: left center, 12px center;
  padding-right: 20px;
  .chartTitle {
    ${title}
    font-size: 17px;
    padding-left: 42px;
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