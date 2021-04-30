import React, { useState } from 'react';
import { auth, database, provider } from './Firebase.js';

function SignOut() {
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const [error, setErrors] = useState("");

    function sendHome() {
        auth.signOut().then(() => {
            console.log('Signed Out')
        }).catch((error) => {
            setErrors(error.message);
        });
    };

    return(
        <div>
            <button onClick={sendHome}>Sign Out</button>
            <span>{error}</span>
        </div>

    )

}
export default SignOut;