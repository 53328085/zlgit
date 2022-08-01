import React  from "react";
import {BrowserRouter, Route,  Routes} from 'react-router-dom'
import Login from '../Login'
import Todo from '../components/App'
import '../App.scss'
export default function App() { //函数名必须以大写字母开头
    return(
        <BrowserRouter>
           <Routes>
               <Route path="/" element={<Login/>} />
               <Route path="/app" element={<Todo/>} />
           </Routes>
        </BrowserRouter>
    )
}