import React, { useEffect } from "react";
import '../Login/login.css'
import { useSnackbar } from "notistack";
import { useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom";



export default function Register() {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm()
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        let isLoggedIn = localStorage.getItem('Login')
        if (isLoggedIn) navigate('/', { replace: true })
    })

    const OnSubmit = async (data) => {

        const name = data.username
        const password = data.password

        console.log("Inside Register");

        // Fetch api
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                mode: 'cors',
                'credentials': 'include',
                headers: {
                    'Accept': 'appication/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'username': name, 'password': password })
            })
            console.log("Request send")

            if (response.ok) {
                const data = await response.json()
                if (data.msg === "success") {
                    // Go to Login page
                    console.log("Success")
                    enqueueSnackbar("Registration Successfull", { autoHideDuration: 2000, variant: 'success' })
                    navigate("/", { replace: true })
                }
                else {
                    enqueueSnackbar(data.msg, {
                        variant: 'error',
                        sx: {
                            "& .SnackbarContent-root": {
                                width: 400,
                                fontSize: 18
                            }
                        }
                    })
                }
            }
            else {
                //Server side error
                console.log(response.status)
            }
        }
        catch (e) {
            console.log(e);
        }
    }



    return (
        <div className="container">
            <form onSubmit={handleSubmit(OnSubmit)}>
                <div className="field">
                    <label>Username :
                        <input name="uname" type="text"
                            {...register('username', {
                                required: { value: true, message: "This field is required" },
                                pattern: { value: /^[a-zA-Z]+[a-zA-Z0-9]*$/, message: "Username must be alphanumeric with no leading digit" },
                                minLength: { value: 4, message: "Username must atleast contain 4 characters" }
                            })}
                        />
                    </label>
                    {errors.username && <p>{errors.username?.message}</p>}
                </div>
                <div className="field">
                    <label>Password :
                        <input name="passwd" type="password"
                            {...register('password', {
                                required: { value: true, message: "This field is required" },
                                minLength: { value: 4, message: "Password must contain atleast 4 characters" },
                            })}
                        />
                    </label>
                    {(errors.password) && <p>{errors.password?.message}</p>}
                </div>

                <div className="field">
                    <label>Confirm Password :
                        <input name="cpasswd" type="password"
                            {...register('confpassword', {
                                required: { value: true, message: "This field is required" },
                                minLength: { value: 4, message: "Password must contain atleast 4 characters" },
                                validate: value => value === getValues("password") || "Confirm Password is not same"
                            })}
                        />
                    </label>
                    {(errors.confpassword) && <p>{errors.confpassword?.message}</p>}
                </div>
                <input type="submit" value="Register" />
            </form>

        </div >
    )

}
