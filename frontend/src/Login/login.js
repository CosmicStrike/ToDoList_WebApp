import React, { useContext } from "react";
import './login.css'
import { useForm } from 'react-hook-form'
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import AuthContext from "../Contexts/AuthProvider";


export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { enqueueSnackbar } = useSnackbar()
    const { authUser, setAuthUser } = useContext(AuthContext)


    const OnSubmit = async (data) => {
        console.log(data)

        //Validate Username
        const name = data.username
        const password = data.password

        console.log("FETCH PROCESSING")
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'PUT',
                mode: 'cors',
                'credentials': 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ "username": name, "password": password })
            })

            console.log("Request send")

            if (response.ok) {
                const data = await response.json()
                if (response.status === 200)
                    setAuthUser(true)
                else {
                    enqueueSnackbar(data.msg, {
                        variant: 'error',
                        autoHideDuration: 1500
                    })
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="container" style={{ height: '13rem' }}>
            <form onSubmit={handleSubmit(OnSubmit)}>
                <div className="field">
                    <label>Username :
                        <input name="uname" type="text"
                            {...register('username', {
                                required: { value: true, message: "Username is required" }, pattern: { value: /^[a-zA-Z]+[a-zA-Z0-9]*$/, message: "Username must be alphanumeric with no leading digit" }, minLength: { value: 4, message: "Username must atleast contain 4 characters" }
                            })}
                        />
                    </label>
                    {errors.username && <p>{errors.username?.message}</p>}
                </div>
                <div className="field">
                    <label>Password :
                        <input name="passwd" type="password"
                            {...register('password', {
                                required: { value: true, message: "Password is required" },
                                minLength: { value: 4, message: "Password must contain atleast 4 characters" },
                            })}
                        />
                    </label>
                    {(errors.password) && <p>{errors.password?.message}</p>}
                </div>
                <input type="submit" value="Login" />
            </form>
            <Link to='/register'>Register</Link>
        </div>
    )

}