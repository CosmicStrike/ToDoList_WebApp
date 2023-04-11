import React, { createContext, useState } from "react";

const AuthContext = createContext(false)




export const AuthProvider = ({ children }) => {

    const [authUser, setAuthUser] = useState(false)
    try {
        console.log("H")
        const fetchPromise = fetch('http://localhost:5000/api/refresh', {
            mode: 'cors',
            method: 'PUT',
            'credentials': 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })

        fetchPromise.then(response => {
            if (response.status === 200)
                setAuthUser(true)
            return response.json()
        }).then(data => {
            console.log("Message from server : ", data.msg, "  ", new Date().getTime())
        })
    }
    catch (err) {
        console.log(err)
    }

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;

