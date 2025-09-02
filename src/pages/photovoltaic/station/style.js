import styled, { css } from "styled-components";
const borderBox = ({ borderRadius = "4px", bgcolor = "#fff" }) => css`
  border: 1px solid #d7d7d7;
  border-radius: ${borderRadius};
  background: ${bgcolor};
`;

export const getBackgroundColor = (theme) => {
  const color = theme?.primaryderived;
  if (color && color !== '#ffffff') {
    return color;
  }
  return 'rgba(229, 236, 245, 0.5)';
};
console.log(getBackgroundColor)
export const Container = styled.div`
  display: grid;
  // grid-template-rows: minmax(320px, 1fr) minmax(335px, 1fr);
  grid-template-rows: 315px 425px;
  gap: 16px;
`;
export const TopBox = styled.div`
  
  flex: 1;
  display: grid;
  color: #515151;
  grid-template-columns: ${props => props.laptop ? "1fr 1fr " : "440px 1fr 570px 1fr"} ;
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
    margin-top: 16px;
    border-radius: 4px;
    display:flex;
    justify-content: space-around;
    align-items: center;
    
    .numBox{
    display:flex;
    align-items: center;
    color:#606266;
  .powerIcon{
    width: 36px;
    height: 36px;
  }
    .num{
    margin-left:10px;
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
    height: 65px;
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
`
export const Header = styled.div`
  display: flex;
  background-color: #fff;
  height: 48px;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #dedede;
  padding-right: 18px;
  overflow: hidden;
  border-radius: 4px;
  padding-left: 16px;
`;
export const Detail = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 229px) 1fr;
  grid-template-rows: 201px;
  grid-gap: 16px;
  margin: 16px 0;

  .card {
    ${borderBox}
    padding: 18px 16px;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #515151;

    .small {
      font-size: 10px;
    }
    .rise {
      color: #f00;
    }
    .down {
      color: #06cc45;
    }
  }
  .chart {
    ${borderBox}
    display: flex;
    flex-direction: column;
    padding: 20px 16px;
    width: 100%;
    overflow: hidden;
    min-width: 0;
    .head {
      height: 25px;
      width: 100%;
    }
    .chart-box {
      flex: 1;
      overflow: hidden;
      height: 100%;
      max-width: 100%;
    }
  }
`;
export const FooterChart = styled.div`
  ${borderBox};
  padding: 16px;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 583px;
  max-height: 583px;

  .ant-radio-button-wrapper {
    margin-left: auto;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    border-radius: 2px;

    &:first-child {
      border-radius: 0;
    }

    &:last-child {
      border-radius: 0;
    }

    &::before {
      display: none;
    }
  }
  .chartdom {
    flex: 1;
    overflow: hidden;
    position: relative;
  }
`;
