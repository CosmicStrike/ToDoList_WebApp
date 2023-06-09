import React, { useContext } from "react";
import Login from './Pages/login'
import Register from './Pages/register'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Main from './Pages/main'
import { PageNotFound } from "./Components/404";
import './index.css'
import AuthContext from "./Contexts/AuthProvider";


export default function App() {
    const { authUser } = useContext(AuthContext)
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={authUser ? <Main /> : <Login />} />
                <Route path="/register" element={authUser ? <Main /> : <Register />} />
                <Route path="*" element={<PageNotFound msg="The requested URL was not found on this server." />} />
            </Routes>
        </BrowserRouter>
    )
}