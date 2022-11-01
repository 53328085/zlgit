import React, {Suspense} from 'react'
import {BrowserRouter} from 'react-router-dom'
//import {HashRouter, Navigate} from 'react-router-dom'

import Loading from './pages/Loading';
import EL from './router'

function App() {
  return   (<BrowserRouter>
     <Suspense fallback={<Loading/>}>
         <EL/>
        
     </Suspense>    
    </BrowserRouter>) 
   

  }

export default App
