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
  grid-template-rows: 73px minmax(721px, 1fr);
  row-gap: 16px;
  flex:1;
  .up {
    display: grid;
    grid-template-columns: repeat(7,minmax(203px, 1fr));
    grid-template-rows: 1fr;
    column-gap: 16px;
    .shownum {
        background-image: linear-gradient(90deg, rgba(19,85,253,0.15) , rgba(3,160,255,0.15) ); 
        border-radius: 8px;
        padding: 0 14px;
        display: flex;
        align-items: center;
        column-gap: 14px;
        .imgwrap {
            width: 42px;
            height: 42px;
            overflow: hidden;
            .img {
            max-width: 100%;
        }
        }
      
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
    grid-template-columns: minmax(478px, 1fr) 716px minmax(478px, 1fr);
    grid-template-rows: 1fr;
    column-gap: 16px;
  
    .middler{ 
        border-radius: 8px;
        overflow: auto;
        position: relative;
        .img {
            position: absolute;
        }

    }
    .left, .right {
        background-image: linear-gradient(90deg, rgba(19, 85, 253, 0.15) , rgba(3, 160, 255, 0.15) ), url(${imgurl.circle});         
        background-position: 0%  0%, left top;
        background-repeat: no-repeat, no-repeat;
        .titleUp { 
            height: 40px;
           
            display: flex;
            align-items: center;
            font-size: 17px;
            justify-content: flex-end;
            .manger {
                        display: flex;
                        align-items: center; 
                        column-gap: 4px;
                        .label{
                            color: #9ED8DC;
                            font-size: 11px;
                        }
                        .value{
                            color:#0AEEFF;
                            font-size: 14px;
                        }
                    }
        }
        .content {
            padding: 28px 24px 24px 24px;
            display: grid;
            grid-template-rows: 56px 28px minmax(226px, 1fr) 28px minmax(226px, 1fr);
            row-gap: 16px;        
            .infobox {
                display: flex;
                flex-direction: column;
            }
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
                            color: #9ED8DC;
                            font-size: 11px;
                        }
                        .value{
                            color:#0AEEFF;
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
    .right {
        background-image: linear-gradient(90deg, rgba(19, 85, 253, 0.15) , rgba(3, 160, 255, 0.15) );         
        background-position: 0%  0% ;
        background-repeat: no-repeat ;
      
        .content {
            grid-template-rows:  28px minmax(226px, 1fr) 28px minmax(226px, 1fr);
            row-gap: 16px;   
        }
    }
  }

`