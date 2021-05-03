import React, { useState } from 'react';
import { auth, database, provider } from './Firebase.js';
import './loginfunctions.css'

function SignOut() {
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const [error, setErrors] = useState("");

    function sendHome() {
        auth.signOut().then(() => {
            console.log('Signed Out')
        }).catch((error) => {
            setErrors(error.message);
            alert(error)
        });
    };

    return(
        <div>
            <button className='signOutBtn' onClick={sendHome}>Sign Out</button>
            {/* <span>{error}</span> */}
        </div>

    )

}
export default SignOut;