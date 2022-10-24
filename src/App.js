import React, {Suspense, lazy} from 'react'
import {BrowserRouter, Navigate} from 'react-router-dom'
//import {HashRouter, Navigate} from 'react-router-dom'

import Loading from './pages/Loading';
import EL, {LoginRouter} from './router'

function App() {

  return   (<BrowserRouter>
     <Suspense fallback={<Loading/>}>
         <EL/>
        
     </Suspense>    
    </BrowserRouter>) 
   

  }

export default App
