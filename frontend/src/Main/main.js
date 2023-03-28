import React, { useEffect, useState } from "react";
import TaskCard from "./taskCard.";

export default function Main() {
    const [todos, setToDos] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:5000/api/', {
                    method: 'GET',
                    mode: 'cors',
                    'credentials': 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                })

                if (response.ok) {
                    const data = await response.json()
                    if (data.msg === 'success') {
                        // Display the data onto screen
                        console.log(data)
                        data.data.forEach(element => {
                            element.deadline = new Date(element.deadline)
                        });
                        setToDos(data.data)
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()

    }, [])

    //Post the ToDo 
    const formSubmit = async (event) => {
        event.preventDefault();
        // console.log(event.target)
        const form = new FormData(event.target);
        const data = Object.fromEntries(form.entries())


        if (data['Title'].length === 0) { console.log("Title can not be a empty"); return; }
        let date;

        if (data['Deadline'] === '') date = new Date()
        else date = new Date(data['Deadline'])
        // console.log(date)
        try {
            const response = await fetch('http://localhost:5000/api/', {
                method: 'POST',
                mode: 'cors',
                'credentials': 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ "title": data['Title'], "description": data['Description'], "date": date })

            })

            if (response.ok) {
                let data1 = await response.json()
                if (data1.msg === 'success') {
                    // Show that data on screen
                    let task = {
                        title: data['Title'],
                        description: data['Description'],
                        deadline: date,
                        _id: data1.id
                    }
                    setToDos(() => {
                        let arr = []
                        let once = true
                        for (let i = 0; i < todos.length; i++) {
                            if (once && (todos[i].deadline > task.deadline)) {
                                arr.push(task);
                                once = false;
                            }
                            arr.push(todos[i])
                        }
                        if (once) arr.push(task);
                        return arr
                    })

                }
            }
            else {

            }

        } catch (err) {
            console.log(err)
        }

        event.target.Title.value = ''
        event.target.Description.value = ''
        event.target.Deadline.value = ''

    }


    const LoggodOut = () => {

    }

    const OnComplete = async (todo_id) => {
        console.log(todo_id)
        try {
            const response = await fetch('http://localhost:5000/api/', {
                method: 'DELETE',
                mode: 'cors',
                'credentials': 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ todo: todo_id })
            })

            if (response.ok) {
                const data = await response.json()
                if (data.msg === 'success') {
                    // Successfully deleted from server
                    setToDos(() => {
                        let arr = []
                        for (let i = 0; i < todos.length; i++) {
                            if (todos[i]._id === todo_id);//Remove from the list
                            else arr.push(todos[i])
                        }
                        return arr
                    })
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const NoTask = <h1 className="text-center text-3xl text-stone-300 p-3 mt-12">No Tasks Scheduled</h1>


    return (
        <div className="flex flex-col w-11/12 mx-auto my-4 items-start md:flex-row">
            <div className="my-2 w-full h-80 mx-1 bg-blue-500 rounded-xl shadow-xl md:shadow-2xl md:w-1/2">
                <form onSubmit={formSubmit}>
                    <label className="block text-gray-200 text-center" htmlFor={"Title"}>Title</label>
                    <input className="block p-2 w-11/12 mx-5 h-8 mb-3 rounded-md" type={"text"} id={"Title"} placeholder={"Title"} name={"Title"}></input>

                    <label className="block text-gray-200 text-center" htmlFor={"Description"}>Description</label>
                    <textarea className="block p-2 mb-3 w-11/12 mx-5 rounded-md" type={"textarea"} id={"Description"} rows={6} maxLength={240} placeholder={"Add a little description of your task"} name={"Description"}></textarea>
                    <div className="flex justify-between items-center w-11/12 mx-5">
                        <div>
                            <label className="text-gray-200 ml-5" htmlFor={"Deadline"}>Deadline:</label>
                            <input className="mx-3 mb-3" type={"date"} id={"Deadline"} placeholder={"Date"} name={"Deadline"}></input>
                        </div>
                        <button className="inline-block bg-blue-800 rounded-xl text-white w-32 h-8 mr-5 mb-3 hover:bg-blue-400" type={"submit"}>Add</button>
                    </div>
                </form>
            </div>
            <div className="mx-1 w-full h-auto my-10 md:grow md:ml-10 lg:my-2">
                <div>
                    <label className="mx-5 text-sm md:text-base" htmlFor={"search"}>Search</label>
                    <input className="w-4/5 h-8 p-4 rounded-full text-sm md:text-base bg-stone-100" type={"search"} id={"SearchTitle"} placeholder={"Search Title"}></input>
                </div>
                <div className="flex flex-col bg-white">
                    <div className="flex flex-row items-center font-sans text-xs h-10 md:text-sm">
                        <div className="ml-1 md:ml-2 SrNo">Sr No.</div>
                        <div className="ml-2 md:ml-8 DeadLine">Deadline</div>
                        <div className="ml-auto md:ml-10 Title w-1/2 mx-1 md:4/5 lg:w-2/3">Title</div>

                    </div>
                    {(todos.length === 0) ? NoTask :
                        todos.map((todo, index) => {
                            todo.deadlineDate = todo.deadline.getUTCDate() + '-' + todo.deadline.getUTCMonth() + '-' + todo.deadline.getUTCFullYear()
                            return <TaskCard key={todo._id} todo={todo} index={index} OnComplete={OnComplete} />
                        })
                    }
                </div>
            </div>
            <button className="text-white bg-blue-800 rounded-3xl h-10 w-24 hover:bg-blue-500 lg:w-40" type="button" onClick={() => LoggodOut}>Logout</button>
        </div>
    )
}
