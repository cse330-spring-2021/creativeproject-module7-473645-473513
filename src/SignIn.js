import React, { useState } from 'react';
import { auth, database, provider } from './Firebase.js';
import './loginfunctions.css'

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setErrors] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;
            console.log(user);
        })
          .catch(e => {
            setErrors(e.message);
            alert(error)
        });

        setEmail("");
        setPassword("");
      };

    return(
        <div>
        <h3 className='signinup'>Sign In:</h3>
        <form onSubmit={e => handleSubmit(e)}>
            <div className='formDiv'>
            <input
                className='signInput'
                value={email}
                type='email'
                name={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='email'
            />
            <input
                className='signInput'
                value={password}
                type='password'
                name={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='password'
            />
            </div><br/>     
            <input className='signButtons' type="submit" value="Submit" />
            {/* <span>{error}</span> */}

        </form>
        </div>
    )

}
export default SignIn;