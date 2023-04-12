import React from "react";
import { useSnackbar } from "notistack";
import { useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom";

export default function Register() {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm()
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()

    const OnSubmit = async (data) => {
        const name = data.username
        const password = data.password

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

            const data = await response.json()
            if (response.ok) {
                if (response.status === 201) {
                    enqueueSnackbar(data.msg, { autoHideDuration: 2000, variant: 'success' })
                    navigate("/", { replace: true })
                }
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
        catch (e) {
            console.log(e);
        }
    }



    return (
        <>
            <div className="w-fit mx-auto text-4xl mt-16 text-sky-500 font-bold ">Sign Up</div>

            <div className="w-11/12 bg-sky-400 mx-auto my-20 h-fit rounded-xl shadow-xl lg:w-1/3">
                <form onSubmit={handleSubmit(OnSubmit)} className="mx-12 bg-blue pt-8 flex flex-col justify-between items-stretch">
                    <div className="mb-10">
                        <label className="text-lg text-stone-50">Username :
                            <input name="uname" type="text" className="block w-full h-8 text-lg text-stone-600 rounded-sm p-2"
                                {...register('username', {
                                    required: { value: true, message: "This field is required" },
                                    pattern: { value: /^[a-zA-Z]+[a-zA-Z0-9]*$/, message: "Username must be alphanumeric with no leading digit" },
                                    minLength: { value: 4, message: "Username must atleast contain 4 characters" }
                                })}
                            />
                        </label>
                        {errors.username && <p className="text-gray-800 font-black">{errors.username?.message}</p>}
                    </div>
                    <div className="mb-10">
                        <label className="text-lg text-stone-50">Password :
                            <input name="passwd" type="password" className="block w-full h-8 text-lg text-stone-600 rounded-sm p-2"
                                {...register('password', {
                                    required: { value: true, message: "This field is required" },
                                    minLength: { value: 4, message: "Password must contain atleast 4 characters" },
                                })}
                            />
                        </label>
                        {(errors.password) && <p className="text-gray-800 font-black">{errors.password?.message}</p>}
                    </div>

                    <div className="mb-10">
                        <label className="text-lg text-stone-50">Confirm Password :
                            <input name="cpasswd" type="password" className="block w-full h-8 text-lg text-stone-600 rounded-sm p-2"
                                {...register('confpassword', {
                                    required: { value: true, message: "This field is required" },
                                    minLength: { value: 4, message: "Password must contain atleast 4 characters" },
                                    validate: value => value === getValues("password") || "Confirm Password is not same"
                                })}
                            />
                        </label>
                        {(errors.confpassword) && <p className="text-gray-800 font-black">{errors.confpassword?.message}</p>}
                    </div>
                    <button type="submit" className="bg-white w-24 h-8 mb-6 font-medium rounded-md self-center hover:bg-sky-600 shadow-lg hover:text-white">Register</button>

                </form>

            </div >
        </>
    )

}
