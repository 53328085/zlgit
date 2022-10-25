import React, {useRef} from 'react'
import styled, {css, createGlobalStyle, ThemeProvider, useTheme, ThemeConsumer} from 'styled-components'
const GlobalStyle = createGlobalStyle`
  div {
    padding: ${p => p.padding || '2em'};
    color: #999;
    border: 1px dotted #dedede;
  }
`
export default function Fform() {
  const Link = styled.a`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  background: papayawhip;
  color: palevioletred;
`;

const Icon = styled.svg` // 引入其他组件 样式化组件的上下文中被支持
  flex: none;
  transition: fill 0.25s;
  width: 48px;
  height: 48px;
  ${Link}:hover & {
    fill: #ff7313;
  }
`;

const Label = styled.span`
  display: flex;
  align-items: center;
  line-height: 1.2;

  &::before {
    content: '◀';
    margin: 0 10px;
  }
`;
const Box = styled.div(
  {
    background: 'palevioletred',   
    width: '50px'
  }
)
const Sbox = styled(Box)`
 &[style] {
  color: #fff !important;
 }
`
const PropsBox = styled.div`
  background: ${props => props.$background};
  width: 150px;
  color:  ${props => props.theme.color};
  border: none;
  font-size: ${props => props.theme.fontSize};
  &[style] {
    height: 300px;
    color: #fff
  }
  `

PropsBox.defaultProps = {
  $background: "#666",
  
}
const Mycom = () => {
  const theme = useTheme()
  console.log('theme', theme)
}
  return (
    <div>
      <GlobalStyle/>
      <ThemeProvider theme={{color: "#333", fontSize: "16px"}}>
        <Mycom/>
        <Sbox>sbox</Sbox>
    <Link href="#">
    <Icon viewBox="0 0 20 20">
      <path d="M10 15h8c1 0 2-1 2-2V3c0-1-1-2-2-2H2C1 1 0 2 0 3v10c0 1 1 2 2 2h4v4l4-4zM5 7h2v2H5V7zm4 0h2v2H9V7zm4 0h2v2h-2V7z"/>
    </Icon>
    <Label>Hovering my parent changes my style!</Label>
  </Link>
   <Box>样式对象</Box>
   <PropsBox $background="#ff7313" as="button">可以传参</PropsBox>
   <PropsBox $background="#ff7313">
    <p>fff</p>
    通用的样式模式
    </PropsBox>
    <ThemeConsumer>
      {theme => <div>the theme {theme.color}</div>}
    </ThemeConsumer>
    </ThemeProvider>
    </div>
  )
}
