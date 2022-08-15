import React, {Suspense, lazy} from 'react'
import {BrowserRouter, useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {selectUser} from '@redux/user'
import Loading from './pages/Loading';
import EL from './router'

function App() {
 const {token} = useSelector(selectUser)
  return (
 
    <BrowserRouter>
     <Suspense fallback={<Loading/>}>
      <EL/>
     </Suspense>    
    </BrowserRouter>
   
  )
}

export default App
