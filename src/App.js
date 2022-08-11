import React, {Suspense, lazy} from 'react'
import {
  BrowserRouter, 
  useRoutes,
  
} from 'react-router-dom'
import Loading from './pages/Loading';
import EL from './router'
function App() {
 

  return (
    <BrowserRouter>
     <Suspense fallback={<Loading/>}>
        <EL></EL>
     </Suspense>    
    </BrowserRouter>
  )
}

export default App
