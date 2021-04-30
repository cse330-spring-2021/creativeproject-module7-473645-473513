import React from 'react';
import { auth, database, provider } from './Firebase.js';

function SignIn() {

    function firebaseSignIn() {
        console.log('firebase!')
    }

    return(
        <div>
            <button type='button' onClick={firebaseSignIn} >Sign In!</button>
        </div>
    )

}
export default SignIn;