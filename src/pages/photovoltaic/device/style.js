import styled, { css } from "styled-components";
const borderBox = ({ borderRadius = "4px", bgcolor = "#fff" }) => css`
  border: 1px solid #d7d7d7;
  border-radius: ${borderRadius};
  background: ${bgcolor};
`;

export const getBackgroundColor = (theme) => {
  const color = theme?.bg || theme.cardHeadBg;
  if (color && color !== '#ffffff') {
    return color;
  }
  return 'rgba(229, 236, 245, 0.5)';
};
export const Container = styled.div`
  display: grid;
  // grid-template-rows: minmax(320px, 1fr) minmax(335px, 1fr);
  grid-template-rows: 305px 435px;
  gap: 16px;
`;
export const TopBox = styled.div`
  
  flex: 1;
  display: grid;
  color: #515151;
  grid-template-columns: 440px minmax(340px, 1fr) 570px 290px ;
  gap: 16px;
  justify-content: flex-end;
  .infoBox1{
  display:flex;
  .powerStation{
    width: 160px;
    height: 150px;
  }
.content{
  display: grid;
  align-items: center;
  .info{
    display: flex;
    align-items: baseline;
    span:nth-of-type(1){
    width: 6px;
    height: 6px;
    background: #1E50E6;
    display: inline-block;
    border-radius: 50%;
    margin-right: 10px;
    }
 span:nth-of-type(2){
    display: inline-block;
    width: 70px;
    color: #606266;
}
    span:nth-of-type(3){
    display: inline-block;
    width: 150px;
    
    }
}
  }
  }
  .powerNum{
    height: 60px;
    margin-top: 10px;
    border-radius: 4px;
    display:flex;
    justify-content: space-around;
    align-items: center;
    
    .numBox{
    display:flex;
    align-items: center;
    color:#606266;
    justify-content: space-around;
  .powerIcon{
    width: 36px;
    height: 36px;
    margin-right:10px;
  }
    .num2{
    display:flex;
    align-items: center;
    }
    .num{
    font-weight: 400;
    font-size: 13px;
    .status{
    width: 56px;
    height: 25px;
    line-height: 25px;
    border-radius: 2px;
    text-align: center;
    margin-right:10px;
    color: #FFFFFF;
    }
    .circle{
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin: 0px 5px;
      display: inline-block;
      }
      
      .online{
      background: #1EC373;
      }
      .offline{
      background: #717D96;
      }
    div:nth-of-type(1){
      font-size: 18px;
      color: #1E50E6;
      font-weight: 600;
    }
    }
    }
    
    background-color:${props => getBackgroundColor(props.theme)};
  }
 .infoBox2{
 display:flex;
 align-items: center;
 justify-content: space-around;
 .info{
    display: grid;
    gap: 16px;
    color:#606266;
    .box{
    display: flex;
    align-items: center;
    border-radius: 4px;
    height: 62px;
    width: 250px;
    padding-left:16px;
    background-color:${props => getBackgroundColor(props.theme)};
  .powerIcon{
    width: 36px;
    height: 36px;
  }
  }
    .num{
    margin-left:20px;
    font-weight: 400;
    font-size: 13px;
    div:nth-of-type(1){
      font-size: 18px;
      color: #1E50E6;
      font-weight: 600;
    }
    }
}
   
`

export const FotterBox = styled.div`
  flex: 1;
  display: grid;
  color: #515151;
  grid-template-columns: ${props => props.laptop ? "1fr 1fr" : "660px  1fr"} ;
  gap: 16px;
  justify-content: flex-end;
  .realTimeData{
   display:grid;
   gap: 16px;
  }
 .infoBox3{
      display:flex;
      align-items: center;
      justify-content: space-around;
      flex-wrap: wrap;
      .box{
      border-radius: 8px;
      width: 281px;
      height: 216px;
      margin-bottom:16px;
     background-color:${props => getBackgroundColor(props.theme)};
      .title{
      border-radius: 8px 8px 0px 0px;
      width: 281px;
      height: 36px;
      line-height: 36px;
      padding-left: 16px;
      color: #FFFFFF;
      }
      .online{
      background: #1EC373;
      }
      .offline{
      background: #717D96;
      }
      .con{ 
      padding: 16px;
      font-weight: 400;
      font-size: 13px;
      color: #303133;
      .top{
      display:flex;
      align-items: center;
      .info{
      margin-left:16px;
      display: grid;
      gap: 5px;
      .name{
      font-weight: 400;
      font-size: 13px;
      color: #606266;
      }
      .status{
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin: 0px 5px;
      display: inline-block;
      }
      
      .online{
      background: #1EC373;
      }
      .offline{
      background: #717D96;
      }
      }
      }
      .bottom{
      margin-top:16px;
      display:flex;
      align-items: center;
      justify-content: space-between;
       .name{
      color: #606266;
      }
      .num{
      font-weight: 500;
      font-size: 14px;
      color: #1E50E6;
      }
      }
      }
      }
    }
`

export const Header = styled.div`
width:100%;
height:32px;
display:flex;
flex-direction:row;
align-items:center;
justify-content:flex-end;
.historicalData{
color: #1E50E6;
}
`;
export const HistoricalModal = styled.div`
.searchBox{
display:flex;
align-items:center;
justify-content: space-between;
.timeBox{
display:flex;
align-items:center;
}
}
.echarts{
margin-top:16px;
height:360px;
}
.table{
margin-top:16px;
height:360px;
}
`