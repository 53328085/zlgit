 import React from 'react'
 import styled, {ThemeProvider, useTheme, css} from 'styled-components'
 const Button = styled.button`
  background-color: ${props => props.theme.main};
  border: 2px solid ${props => props.theme.main};
  color:  ${props => props.theme.fc };
 `
Button.defaultProps={
  theme: {
    main: "#BF4F74",
    fc: "#fff"
  }
}
const theme ={
  main: "#237ae4"
}
const invertTheme =({main}) => {
  return {
    main,
    fc: "#999", //文字颜色
  }
};
const Rbutton =(props) => <button {...props} children={props.children.split('').reverse()}    /> 
const Hc = styled.h1`
 color: ${props => props.$strong ? '#666' : '#333'};
`
const Test = () => {
  const theme = useTheme();
  console.log(theme);
  return (<div>
    <Button>hooks主题</Button>
  </div>)
}

const Link = ({children, ...restprops}) => {
  return (
    <a {...restprops} >{children}</a>
  )
}
const Clink = styled(Link)`
  color: #666;
  &:hover {
    color: #333;
  }
  &~& {
    font-size: 16px;
  }
  &+& {
    font-size: 24px;
  }
  &.hello {
    font-size: 28px;
    font-weight: bold;
  }
  .well & {
    font-size: 32px;
    color: #ff7313;
  }
`
const Cspan = styled.span`
 ${Clink}:hover & {
   color: #23ea74;
   font-size: large;
 }

`
const Input = styled.input.attrs((props) => ({
  type:  "checkbox",
  $size: props.$size
}))`
  color: #BF4F74;
  font-size: 1em;
  border: 2px solid #BF4F74;
  border-radius: 3px;
  margin: ${props => props.$size};
  padding: ${props => props.$size};
`
const PasswordInput = styled(Input).attrs((props) => ({
  type: 'password'
}))``

const Label = styled.label`
  align-items: center;
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`

const LabelText = styled.span`
  ${(props) => {
    switch (props.$mode) {
      case "dark":
        return css`
          background-color: black;
          color: white;
          ${Input}:checked + && {
            color: blue;
          }
        `;
      default:
        return css`
          background-color: white;
          color: black;
          ${Input}:checked + && {
            color: red;
          }
        `;
    }
  }}
`;

 export default function Index() {
  const getsty = () => {
    
    let bgcolor = getComputedStyle(document.documentElement).getPropertyValue('--ant-primary-color');
    document.documentElement.style.setProperty('--main-bg-color','#2f57a4');
  }
   return (
     <div style={{padding: "32px"}}>
       <div><Button>默认的主题</Button></div>
       <ThemeProvider theme={theme}>
          <div>
             <Button>定义的主题</Button>
          </div>
          <ThemeProvider theme={invertTheme}>
              <Button theme={{fc: "#ff7313"}}>继承的主题</Button>
              <Button as="a" href="#">按钮的链接样式</Button>
              <Test></Test>
              <Hc $strong>强调的主题</Hc>
              <Button as={Rbutton}>大自然</Button>
          </ThemeProvider>
         
       </ThemeProvider>
       <Link href="#">新浪</Link>
       <Clink href="#">网易</Clink>
       <Clink href="#">中华网</Clink>
       <Link href="#">知网</Link>
       <Clink href="#">哔哩哔哩<Cspan>自学课堂</Cspan></Clink>
       <Clink className="hello">尚学堂</Clink>
       <div className='well'>
           <Clink href="#">carry</Clink>
       </div>
       <Label>
      <Input defaultChecked />
      <LabelText>Foo</LabelText>
    </Label>
    <Label>
      <Input />
      <LabelText $mode="dark">Foo</LabelText>
    </Label>
    <Label>
      <Input defaultChecked />
      <LabelText>Foo</LabelText>
    </Label>
    <Label>
      <Input defaultChecked />
      <LabelText $mode="dark">Foo</LabelText>
    </Label>
      <Input type="text" $size="2em" placeholder='动态或静态属性' /> 
      <PasswordInput placeholder="请输入密码" />
     </div>
   )
 }
 