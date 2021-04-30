import React, { useState } from 'react';
import { auth, database, provider } from './Firebase.js';

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
        });

        setEmail("");
        setPassword("");
      };

    return(
        <div>
        <h3>Sign In:</h3>
        <form onSubmit={e => handleSubmit(e)}>
            <input
                value={email}
                type='email'
                name={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='email'
            />     
            <input
                value={password}
                type='password'
                name={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='password'
            />     
            <input type="submit" value="Submit" />
            <span>{error}</span>

        </form>
        </div>
    )

}
export default SignIn;