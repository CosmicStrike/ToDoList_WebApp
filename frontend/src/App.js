import React, { useState, useEffect, useLayoutEffect } from "react";
import Login from './Login/login'
import Register from './Register/register'
import { Routes, Route } from 'react-router-dom'
import Main from './Main/main'
import { PageNotFound } from "./Components/404";
import './index.css'
export default function App() {

    const isLoggedIn = localStorage.getItem('Login')

    return (
        <>
            <Routes>
                <Route path="/" element={isLoggedIn ? <Main /> : <Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<PageNotFound msg="The requested URL was not found on this server." />} />
            </Routes>

        </>
    )
}