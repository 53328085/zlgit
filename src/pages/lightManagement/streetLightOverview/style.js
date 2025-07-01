import styled, {css} from 'styled-components';
import bgimg from './imgs/bgimg.png'
import lights from "./imgs/lights.png"
import imgurl from './imgs'
export const custsty = css`
  margin: -16px;
  background-image: url(${bgimg});
  background-repeat: no-repeat;
  background-size: cover;
 `
export  const Mainwrap = styled.div`
  display: grid;
  grid-template-rows: 80px minmax(721px, 1fr);
  row-gap: 16px;
  flex:1;
  .up {
    display: grid;
    grid-template-columns: repeat(5,324px);
    grid-template-rows: 1fr;
    column-gap: 16px;
    .shownum {
        background-image: linear-gradient(90deg, rgba(19,85,253,0.15) , rgba(3,160,255,0.15) ); 
        border-radius: 8px;
        padding: 0 14px;
        display: flex;
        align-items: center;
        column-gap: 14px;
        .data {
            display: flex;
            flex-direction: column;
            .title{
          color:#fff;
        }
        .num {
         color:#0AEEFF;
         font-size: 24px;
        }
        }
     
    }
  }
  .down {
    display: grid;
    grid-template-columns: 1006px 1fr;
    grid-template-rows: 1fr;
    column-gap: 16px;
    .left{
        background-image: url(${lights});
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 8px;
    }
    .right{
        background-image: linear-gradient(90deg, rgba(19, 85, 253, 0.15) , rgba(3, 160, 255, 0.15) ), url(${imgurl.title});         
        background-position: 0%  0%, left top;
        background-repeat: no-repeat, no-repeat;
        .titleUp {
            background-image: url(${imgurl.circle});
            background-repeat: no-repeat;
            background-position: 10px;
            height: 40px;
            padding-left: 32px;
            display: flex;
            align-items: center;
            font-size: 17px;
            color: #fff;
            font-weight: bold;
            font-style: italic;
        }
        .content {
            padding: 28px 24px 24px 24px;
            display: grid;
            grid-template-rows: 56px 28px minmax(226px, 1fr) 28px minmax(226px, 1fr);
            row-gap: 16px;
            .info {
                display: flex;
                .item {
                    flex:1;
                    display: flex;
                    align-items: center;
                    column-gap: 16px;
                    .data {
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        .label{
                            color: rgba(158, 216, 220, 1);
                            font-size: 11px;
                        }
                        .value{
                            color:rgba(10, 238, 255, 1);
                            font-size: 18px;
                        }
                    }
                }
            }
            .chartTitle {
                background-image: linear-gradient( to right, rgba(0, 69, 88, 0.14) 0%,rgba(24, 114, 139, 0.19) 33%,rgba(81, 164, 244, 0.25) 66%, rgba(23, 134, 255, 0.20) 100%), url(${imgurl?.["arrow"]});
                background-position: 0% 0%, left;
                background-repeat: no-repeat, no-repeat;
                height: 28px;
                padding-left: 16px;
                font-size: 16px;
                font-weight: bold;
                font-style: italic;
                color:#fff;
            }
            .chartWrap{
                height: 226px;
                display: flex;
            }
        }
    }
  }

`