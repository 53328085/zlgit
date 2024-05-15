import styled from "styled-components";
export const Circle = (props) => { // 圆形感叹号
    const Cspan = styled.span`
      display: flex;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 38px;
      justify-content: center;
      align-items: center;
      color:#fff;
      background-color: ${props => props.theme.primaryColor};
      font-family: fangsong;
      font-weight: bold;
    `
    return <Cspan>&#33;</Cspan>
  }