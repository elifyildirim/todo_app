import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import './styles.css';
const Register = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleOnChange = (event, key) => {
    if (key === 'email') {
      setEmail(event.currentTarget.value);
    } else if (key === 'password') {
      setPassword(event.currentTarget.value);
    }
  }
  const handleOnSubmit = (event) => {
    console.log('SUBMIT');
        // Reset our error every time the form is submitted
    setError(null);
    setLoading(true);
    fetch(
      'http://localhost:5000/api/auth/register',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
    }).then((response) => {
        console.log('SUCCESS');
        console.log(response);
        const json = response.json();
        if (response.ok) {
          return json;
        }
        
        return json.then((data) => Promise.reject(data));
        // return response.json();
      })
      .then((json) => {
        console.log('JSON');
        console.log(json);
        setLoading(false);
        localStorage.setItem('token', json.token);
        props.history.push('/todos');
      })
    //   .then((response) => {
    //   console.log('SUCCESS');
    //   console.log(response);
    //   })
    .catch((error) => {
      setLoading(false);
      console.log('ERROR');
      console.log(error);

      setError(error.error);
      setLoading(false);
    });
    event.preventDefault(); // to prevent the form from submitting
  }
return (
    <div className="App">
      <h1>Register</h1>
      <form onSubmit={handleOnSubmit}>
        <input disabled={loading} type="email" onChange={(event) => handleOnChange(event, 'email')} required="required" value={email} placeholder="Email address" />
        <input disabled={loading} type="password" onChange={(event) => handleOnChange(event, 'password')} required="required" value={password} placeholder="Password" />
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
         
        <button disabled={loading} type="submit">Submit</button>
      </form>
    </div>
  );
};
export default withRouter(Register);