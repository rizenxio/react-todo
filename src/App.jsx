import React, { useEffect, useState } from 'react'
import './App.css'
import {MdOutlineDelete} from "react-icons/md"
import { FaRegCheckCircle } from "react-icons/fa";
function App() {
  const [isCompleteScreen,setIsCompleteScreen] = useState(false)
  const [allTodo , setTodo] = useState([])
  const [newTitle,setNewTitle] = useState("")
  const [newDescription,setNewDescription] = useState("")
  const handleAddtodo =()=>{
    let newTodoItem = {
      title:newTitle,
      description:newDescription
    }
    let updateTodoArr = [...allTodo]
    updateTodoArr.push(newTodoItem)
    setTodo(updateTodoArr)
    localStorage.setItem('todolist',JSON.stringify(updateTodoArr))
  }
  useEffect(()=>{
let savedTodo = JSON.parse(localStorage.getItem('todolist'))
if(savedTodo){
  setTodo(savedTodo)
}
  },[])
  return (
    <div className='App'>
      <h1>My Todo</h1>
    <div className="todo-wrapper">
      <div className="todo-input">
        <div className="todo-input-item">
          <label>Title</label>
          <input type="text" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder="What's the task title ?"  />
        </div>
        <div className="todo-input-item">
          <label>Description</label>
          <input type="text" value={newDescription} onChange={(e)=>setNewDescription(e.target.value)} placeholder="What's the task description ?"  />
        </div>
        <div className="todo-input-item">
          <button type='button' onClick={handleAddtodo} className='primaryBtn'>Save</button>
        </div>
      </div>
      <div className="btn-area">
        <button type='button' className={`secondaryBtn ${isCompleteScreen===false && 'active'}`} onClick={()=>setIsCompleteScreen(false)}>Todo</button>
        <button type='button' className={`secondaryBtn ${isCompleteScreen===true && 'active'}`} onClick={()=>setIsCompleteScreen(true)}>Completed</button>
      </div>

      <div className="todo-list">

        {allTodo.map((item,index)=>{
          return(
            <div className="todo-list-item" key={index}>
          <div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          </div>
        <div>
        <MdOutlineDelete className='icon'/>
        <FaRegCheckCircle className='check-icon'/>
        </div>
        </div>
          )
        })}
      </div>
    </div>
    </div>
  )
}

export default App