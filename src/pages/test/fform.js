import React, {useRef} from 'react'
import styled, {css, createGlobalStyle, ThemeProvider} from 'styled-components'
export default function Fform() {
  const Button = styled.button`
  color: ${props => props.theme.fg};
  border: 2px solid ${props => props.theme.fg};
  background: ${props => props.theme.bg};
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;
`;
  Button.defaultProps = {
    theme: {
      main: "palevioletred"
    }
  }
  const theme = {
    fg: "mediumseagreen",
    bg: 'palevioletred'
  }
  const invertTheme = ({fg, bg}) => ({
     bg: fg,
     fg: bg
  })
  const ref = useRef()
  const ref2 = useRef()
  const getref = () => {
     console.log(ref2.current)
  }
  const Pc = ({className, children}) => {
    return <p className={`p1 ${className}`}>{children}</p>
  }
  return (
    <div>
     <p ref={ref2}>dddfg</p>
      <Pc className='p2'>p1, p2样式</Pc>
      <ThemeProvider theme={theme}>
         <Button onClick={getref} ref={ref}>themed</Button>
          <ThemeProvider theme={invertTheme}>
             <Button>invert themed</Button>
             <Button theme={{bg: "#ff7313", fg:"#666"}}>theme prop</Button>
          </ThemeProvider>
      </ThemeProvider>
    </div>
  )
}
