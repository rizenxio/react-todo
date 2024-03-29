import React, { useEffect, useState } from "react";
import "./App.css";
import { FaRegCheckCircle } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodo, setTodo] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completed, setCompletedtodo] = useState([]);
  const [date, setDate] = useState([]);
  
  const Fetch = () => {
      fetch("http://192.168.10.204:8000/api/task")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setTodo(data.data.data);
        });
  };



  const handleAddtodo = () => {
    fetch("http://192.168.10.204:8000/api/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Id: 0, // You can set this to 0 or any appropriate value depending on your logic
        title: newTitle,
        description: newDescription,
        status: "Your status", // Provide the appropriate status value
        priority: 1,
        due_date: date
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTodo([...allTodo, data]);
        localStorage.setItem("todolist", JSON.stringify([...allTodo, data]));
        Fetch();
      })
      .catch((error) => {
        console.error("Error adding task: ", error);
      });
    // let newTodoItem = {
    //   title:newTitle,
    //   description:newDescription
    // }
    // let updateTodoArr = [...allTodo]
    // updateTodoArr.push(newTodoItem)
    // setTodo(updateTodoArr)
    // localStorage.setItem('todolist',JSON.stringify(updateTodoArr))
  };
  const handleDeleteTodo = (id) => {
    fetch(`http://192.168.10.204:8000/api/task/${id}`, {
      method: "DELETE",
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      const updateTodo = allTodo.filter((todo) => todo.id !== id)
      setTodo(updateTodo)
      localStorage.setItem('todolist',JSON.stringify(updateTodo))
    })
    .catch((error)=>{
      console.error("eror deleting task: ",error);
    })
    // let reducedTodo = [...allTodo];
    // reducedTodo.splice(index, 1);
    // localStorage.setItem("todolist", JSON.stringify(reducedTodo));
    // setTodo(reducedTodo);
  };
  const handleCompleted = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn =
      dd + "/" + mm + "/" + yyyy + " at " + h + ":" + m + ":" + s;

    let filteredItem = {
      ...allTodo[index],
      completedOn: completedOn,
    };

    let updatedCompletedArr = [...completed];
    updatedCompletedArr.push(filteredItem);
    setCompletedtodo(updatedCompletedArr);
    handleDeleteTodo(index);
    localStorage.setItem("completedTodo", JSON.stringify(updatedCompletedArr));
  };

  const handleDeleteCompletedTodo = (index) => {
    let reducedTodo = [...completed];
    reducedTodo.splice(index, 1);

    localStorage.setItem("completedTodo", JSON.stringify(reducedTodo));
    setCompletedtodo(reducedTodo);
  };
  useEffect(() => {
    Fetch();
    // let savedTodo = JSON.parse(localStorage.getItem("todolist"));
    // let savedCompletedTodo = JSON.parse(localStorage.getItem("completedTodo"));
    // if (savedTodo) {
    //   setTodo(savedTodo);
    // }
    // if (savedCompletedTodo) {
    //   setCompletedtodo(savedCompletedTodo);
    // }
  }, []);
  return (
    <div className="App">
      <h1>My Todo</h1>
      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the task title ?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What's the task description ?"
            />
          </div>
          <div className="todo-input-item">
            <label>Due Date</label>
            <input
              type="date"
              onChange={(e) => setDate(e.target.value)}
              placeholder="What's the task description ?"
            />
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddtodo}
              className="primaryBtn"
            >
              Save
            </button>
          </div>
        </div>
        <div className="btn-area">
          <button
            type="button"
            className={`secondaryBtn ${isCompleteScreen === false && "active"}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            type="button"
            className={`secondaryBtn ${isCompleteScreen === true && "active"}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>

        <div className="todo-list">
          {isCompleteScreen === false &&
            allTodo.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div>
                    <AiOutlineDelete
                      type="button"
                      className="icon"
                      onClick={() => handleDeleteTodo(item.id)}
                      title="Delete?"
                    />
                    <FaRegCheckCircle
                      type="button"
                      className="check-icon"
                      onClick={() => handleCompleted(index)}
                      title="check?"
                    />
                  </div>
                </div>
              );
            })}
          {isCompleteScreen === true &&
            completed.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p>
                      <small></small>completed on :{item.completedOn}
                    </p>
                  </div>
                  <div>
                    <AiOutlineDelete
                      type="button"
                      className="icon"
                      onClick={() => handleDeleteCompletedTodo(index)}
                      title="Delete?"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
