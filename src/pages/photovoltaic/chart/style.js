import styled, { css } from 'styled-components';
import bgimg from './imgs/bgimg.png'
import imgurl from './imgs'
export const custsty = css`
  margin: -16px;
  background-image: url(${bgimg});
  background-repeat: no-repeat;
  background-size: cover;
 `
export const Mainwrap = styled.div`
  display: grid;
  row-gap: 16px;
  flex:1;
  max-height: 815px;
  .contentBox {
    display: grid;
    grid-template-columns: minmax(468px, 1fr) 716px minmax(468px, 1fr);
    grid-template-rows: 1fr;
    column-gap: 16px;
  
    .middler{ 
        border-radius: 8px;
        /* 创建堆叠上下文 */
        position: relative;
        z-index: 1;

    }
    .left{
            display: grid;
            row-gap: 16px;    
            grid-template-rows: 250px 1fr;
        .left1 {
              background-image: linear-gradient(90deg, rgba(19, 85, 253, 0.15) , rgba(3, 160, 255, 0.15) ), url(${imgurl.equipmentOverview});         
              background-position: 0%  0%, left top;
              background-repeat: no-repeat, no-repeat;
              padding: 90px 24px 24px 24px;
            .info {
                display: flex;
                align-items: center;
                justify-content: space-between;
                  
                .infoBox {
                    display: grid;
                    row-gap: 16px;
                }
                .item {
                    display: flex;
                    align-items: center;
                    margin-left:5px;
                    .data {
                        display: flex;
                        align-items: start;
                        flex-direction: column;
                        margin-left:5px;
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
        }
            
            .left2 {
            background-image: linear-gradient(90deg, rgba(19, 85, 253, 0.15) , rgba(3, 160, 255, 0.15) ), url(${imgurl.batteryStatistics});         
            background-position: 0%  0%, left top;
            background-repeat: no-repeat, no-repeat;    
            padding: 90px 24px 24px 24px;
            .topInfo{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .item {
            display: flex;
            img{
            width: 30px;
            height: 30px;
            }
            .data {
            display: flex;
            align-items: start;
            flex-direction: column;
            .label{
            color: #FFFFFF;
            font-size: 11px;
            }
            .value{
            color:#0AEEFF;
            font-size: 18px;
                        }
                    }
                }
            }
            }
            
            .chartWrap{
                height: 326px;
                display: flex;
                margin-top:54px;
            }
    }
        

    .right {
            display: grid;
            row-gap: 16px;    
            grid-template-rows: 115px 115px 115px minmax(206px, 1fr);
            .rightAll{ 
            background-position: 0%  0%, left top;
            background-repeat: no-repeat, no-repeat;    
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 55px 24px 0px 24px;
             .item {
            display: flex;
            img{
            width: 50px;
            height: 50px;
            }
            .data {
            display: flex;
            align-items: start;
            flex-direction: column;
            margin-left:5px;
            .label{
            color: #FFFFFF;
            font-size: 11px;
            }
            .value{
            color:#0AEEFF;
            font-size: 18px;
                        }
                    }
                }
            }
            .right1 {
            background-image: linear-gradient(90deg, rgba(19, 85, 253, 0.15) , rgba(3, 160, 255, 0.15) ), url(${imgurl.weatherInformation});         
           }
             .right2 {
            background-image: linear-gradient(90deg, rgba(19, 85, 253, 0.15) , rgba(3, 160, 255, 0.15) ), url(${imgurl.alertMessage});         
           .alarmBox{
            display: flex;
            align-items: start;
            justify-content: space-between;
            width: 235px;
             .item {
            display: flex;
            img{
            width: 50px;
            height: 50px;
            }
            .data {
            display: flex;
            align-items: start;
            flex-direction: column;
            margin-left:5px;
            .level{
            display: flex;
            align-items: center;
            
            .circle{
            width: 8px;
            height: 8px;
            margin-right:5px;
            border-radius: 50%;
            display: block;
            }
            .circle1{
            border: 1px solid #FF6021;
            }
            .circle2{
            border: 1px solid #FAC747;
            }
            .circle3{
            border: 1px solid #BD62DA;
            }
            .label{
            color: #FFFFFF;
            font-size: 11px;
            }
            }
            .value1{
            color:#FF6021;
            font-size: 18px;
            font-weight: 600;
            }
            .value2{
            color:#FAC747;
            font-size: 18px;
            font-weight: 600;
            }
            .value3{
            color:#BD62DA;
            font-size: 18px;
            font-weight: 600;
            }
           }
        }
    }
}  
            .right3 {
            background-image: linear-gradient(90deg, rgba(19, 85, 253, 0.15) , rgba(3, 160, 255, 0.15) ), url(${imgurl.carbonEmissions});         
            
}  
            .right4 {
            padding: 55px 24px 0px 24px;
            
            background-position: 0%  0%, left top;
            background-repeat: no-repeat, no-repeat;    
            background-image: linear-gradient(90deg, rgba(19, 85, 253, 0.15) , rgba(3, 160, 255, 0.15) ), url(${imgurl.incomeConversion});         
            .topInfo{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .item {
            display: flex;
            img{
            width: 30px;
            height: 30px;
            }
            .data {
            display: flex;
            align-items: start;
            flex-direction: column;
            .label{
            color: #FFFFFF;
            font-size: 11px;
            }
            .value{
            color:#0AEEFF;
            font-size: 18px;
                        }
                    }
                }
            }
            }
            
            .chartWrap{
                height: 300px;
                display: flex;
                margin-top:16px;
            }
}
      
        .content {
            grid-template-rows:  28px minmax(226px, 1fr) 28px minmax(226px, 1fr);
            row-gap: 16px;   
        }
    }
  }

`

export const TitP = styled.div`
  && {
    min-width: 190px;
    min-height: 115px;
    color:#2AFAFF;
    border-radius: 4px;
    left: ${props => props.left + 'px'};
    top: ${props => props.top + 32 + 'px'};
    position: absolute;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    row-gap: 6px;
    padding: 6px 12px 12px 12px;
    font-size: 12px;
    border: 1px solid rgba(139, 197, 241, 1);
    background-image: linear-gradient(90deg, rgba(37, 64, 125, 0.70),rgba(8, 44, 65, 0.70));
    .title {
      padding-left: 18px ;
      display: flex;
      align-items: center;
      font-size: 14px; 
      color: #2AFAFF;
      justify-content: space-between;
      background-image: url(${imgurl["tiny"]});
      background-position: left;
      background-repeat: no-repeat;
    } 
    .contentbox { 
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex:1;
      .content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .key{
          color:#fff;
        }
        .value{
          font-weight: bold;
        }
      
    }
    }
  }
`
