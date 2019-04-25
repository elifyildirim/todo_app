import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import './styles.css';
const Todos = (props) => {
//   const [todos, setTodos] = useState([{
//     id: '1234',
//     text: 'Hello',
//     done: false
//   }]);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('New Todo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!localStorage.token) {
        props.history.push('/login');
      } else {
        getTodos();
      }
    console.log('COMPONENT LOADED');
    getTodos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    props.history.push('/login');
  }

  const getTodos = () => {
    setLoading(true);
    setError(null); 
    fetch(
      'http://localhost:5000/api/todos',
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.token
        }
      }
    )
    .then((response) => {
      const json = response.json();
      if (response.ok) {
        return json;
      }
      return json.then((data) => Promise.reject(data));
    })
    .then((json) => {
      console.log('SUCCESS');
      console.log(json);
      setTodos(json.todos);
      setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
      setError(error.error);
    });
  }

  const createTodo = (data) => {
    setLoading(true);
    setError(null);
    fetch(
      'http://localhost:5000/api/todos',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.token
        },
        body: JSON.stringify(data)
      }
    )
    .then((response) => {
      const json = response.json();
      if (response.ok) {
        return json;
      }
      return json.then((data) => Promise.reject(data));
    })
    .then(() => {
      setNewTodo(''); // reset input field
      getTodos(); // retrieve latest todos
    })
    .catch((error) => {
      setLoading(false);
      setError(error.error);
    });
  }

  const updateTodo = (id, data) => {
    setLoading(true);
    setError(null);
    fetch(
      `http://localhost:5000/api/todos/${id}`,
      {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.token
        },
        body: JSON.stringify(data)
      }
    )
    .then((response) => {
      const json = response.json();
      if (response.ok) {
        return json;
      }
      return json.then((data) => Promise.reject(data));
    })
    .then(() => {
      getTodos();
    })
    .catch((error) => {
      setLoading(false);
      setError(error.error);
    });
  }

  const deleteTodo = (id) => {
    setLoading(true);
    setError(null);
    fetch(
      `http://localhost:5000/api/todos/${id}`,
      {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.token
        }
      }
    )
    .then((response) => {
      const json = response.json();
      if (response.ok) {
        return json;
      }
  return json.then((data) => Promise.reject(data));
    })
    .then(() => {
      getTodos();
    })
    .catch((error) => {
      setLoading(false);
      setError(error.error);
    });
  }

  const handleOnChange = (event) => {
    setNewTodo(event.currentTarget.value);
  }
  const handleOnKeyPress = (event) => {
    // createTodo({
    //     text: event.currentTarget.value,
    //     done: false
    //   });
    if (event.key === 'Enter') {
        createTodo({
            text: event.currentTarget.value,
            done: false
          });
    //   const newTodos = todos;
    //   newTodos.push({
    //     id: Math.floor(Math.random() * (10000-1000+1) + 1000),
    //     text: event.currentTarget.value,
    //     done: false,
    //   });
      
    //   setTodos(newTodos);
    //   setNewTodo('');
    }
  }
  const handleDeleteTodo = (index) => {
    deleteTodo(todos[index].id);
    // const newTodos = [ ...todos.slice(0, index), ...todos.slice(index + 1) ];
    // setTodos(newTodos);
  }
  const handleUpdateTodo = (index) => {
    const newTodos = [ ...todos ];
    const data = {
        text: newTodos[index].text, 
        done: !newTodos[index].done
      };
    updateTodo(newTodos[index].id, data);
    // newTodos[index].done = !newTodos[index].done;
    // setTodos(newTodos);
  }
  return (
    <div className="App">
      <h1>Todos</h1>
      <button type="button" onClick={handleLogout}>Logout</button>
      <input disabled={loading} type="text" value={newTodo} placeholder="Enter todo here" onChange={handleOnChange} onKeyPress={handleOnKeyPress}/>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {todos && todos.length === 0 && <li>No Todos Yet...</li>}
        {todos && todos.length > 0 && (todos).map((val, key) => 
          <li key={val.id}>
            {val.text} - {val.done ? (<span onClick={() => handleUpdateTodo(key)} role="img" aria-label="">✅</span>) : (<span onClick={() => handleUpdateTodo(key)} role="img" aria-label="">⏹️</span>)}
            <button onClick={() => handleDeleteTodo(key)}><span role="img" aria-label="">❌</span></button>
          </li>)}
      </ul>
    </div>
  )
};
export default withRouter(Todos);