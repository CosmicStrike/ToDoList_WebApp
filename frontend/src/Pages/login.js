import React, { useContext } from "react";
import { useForm } from 'react-hook-form'
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import AuthContext from "../Contexts/AuthProvider";

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { enqueueSnackbar } = useSnackbar()
    const { setAuthUser } = useContext(AuthContext)


    const OnSubmit = async (data) => {
        const name = data.username
        const password = data.password

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

            const data = await response.json()
            if (response.ok) {
                if (response.status === 200)
                    setAuthUser(true)
                enqueueSnackbar(data.msg, {
                    variant: 'success',
                    autoHideDuration: 1500
                })
            }
            else {
                enqueueSnackbar(data.msg, {
                    variant: 'error',
                    autoHideDuration: 1500
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <div className="w-fit mx-auto text-2xl mt-16 text-sky-500 font-bold ">Have a task, gotta complete in time!!</div>
            <div className="w-fit mx-auto text-4xl my-6  text-sky-600 font-bold ">Line It Up!</div>
            <div className="w-11/12 bg-sky-400 mx-auto my-18 h-fit rounded-xl shadow-xl lg:w-1/3">
                <form onSubmit={handleSubmit(OnSubmit)} className="mx-12 bg-blue pt-8 flex flex-col justify-between items-stretch">
                    <div className="mb-10">
                        <label className="text-lg text-stone-50">Username :
                            <input name="uname" type="text" className="block w-full h-8 text-lg text-stone-600 rounded-sm p-2"
                                {...register('username', {
                                    required: { value: true, message: "Username is required" }, pattern: { value: /^[a-zA-Z]+[a-zA-Z0-9]*$/, message: "Username must be alphanumeric with no leading digit" }, minLength: { value: 4, message: "Username must atleast contain 4 characters" }
                                })}
                            />
                        </label>
                        {errors.username && <p className="text-gray-800 font-black">{errors.username?.message}</p>}
                    </div>
                    <div className="mb-10">
                        <label className="text-lg text-stone-50">Password :
                            <input name="passwd" type="password" className="block w-full h-8 text-lg text-stone-600 rounded-sm p-2"
                                {...register('password', {
                                    required: { value: true, message: "Password is required" },
                                    minLength: { value: 4, message: "Password must contain atleast 4 characters" },
                                })}
                            />
                        </label>
                        {(errors.password) && <p className="text-gray-800 font-black">{errors.password?.message}</p>}
                    </div>
                    <button type="submit" className="bg-white w-24 h-8 font-medium rounded-md self-center hover:bg-sky-600 shadow-lg hover:text-white">Login</button>
                </form>
                <span className="inline-block mx-12 text-right pb-4 text-white underline hover:text-black font-bold"><Link to='/register'>Sign Up</Link></span>

            </div>
        </>
    )

}