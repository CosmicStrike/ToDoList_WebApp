import React, { createContext, useState } from "react";
import { useSnackbar } from "notistack";

const AuthContext = createContext(false)

export const AuthProvider = ({ children }) => {

    const [authUser, setAuthUser] = useState(false)
    const { enqueueSnackbar } = useSnackbar()

    try {
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
            else {
                enqueueSnackbar("User Logged Out", { autoHideDuration: 2000, variant: 'info' })
            }
        })
    }
    catch (err) {// Catch is only called if networks is not available or domain does not exists
        console.log(err)
    }

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;

