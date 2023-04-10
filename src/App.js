import React, {Suspense} from 'react'
import {BrowserRouter} from 'react-router-dom'
//import {HashRouter, Navigate} from 'react-router-dom'

import Loading from './pages/Loading';
import EL from './router'
import ErrorBoundary from './ErrorBoundary';
function App() {
  return   (
    <ErrorBoundary>
  <BrowserRouter>
    <Suspense fallback={<Loading/>}>  
         <EL/>
        
    </Suspense>  
    </BrowserRouter>
    </ErrorBoundary>
    ) 
   

  }

export default App
