import React from "react";
import classNames from 'classnames';

function IsToday(date) {
    let today = new Date();
    if ((date.getUTCDate() === today.getUTCDate()) && (date.getUTCMonth() === today.getUTCMonth()) && (date.getUTCFullYear() === today.getUTCFullYear())) return true;
    return false;
}

export default function TaskCard(props) {

    const today = new Date()

    let stylingParent = 'bg-stone-200 text-black', stylingChild = 'bg-stone-300 text-black';
    if (IsToday(props.todo.deadline)) { stylingParent = 'bg-blue-500 text-white'; stylingChild = 'bg-blue-400 text-white' }
    else if (props.todo.deadline < today) { stylingParent = 'bg-red-500 text-white'; stylingChild = 'bg-red-400 text-white' }

    return (
        <div className={classNames("group p-1 m-2 shadow-xl rounded-xl", stylingParent)}>
            <div className="flex flex-row justify-around items-center font-sans text-md h-12 md:text-lg">
                <div className="SrNo">{props.index + 1}.</div>
                <div className="ml-2 DeadLine lg:ml-0">{props.todo.deadlineDate}</div>
                <div className="Title w-1/2 mx-1 md:4/5 lg:w-2/3">{props.todo.title}</div>
                <button className="rounded-md bg-white text-black h-8 text-base w-24 hover:bg-slate-200" type={"button"} onClick={() => props.OnComplete(props.todo._id)}>Completed</button>
            </div>
            <div className={classNames('hidden mx-14 mb-2 p-2 rounded-xl font-serif text-sm group-hover:block lg:mx-32', stylingChild)}>
                {(props.todo.description) ? props.todo.description : 'No Description'}
            </div>
        </div>
    )
}