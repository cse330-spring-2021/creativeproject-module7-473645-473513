import React, { Component } from "react";
import SignIn from './SignIn.js';
import SignUp from './SignUp.js';

export default function Landing() {
    return(
        <div>
            <SignUp />
            <p>or</p>
            <SignIn />
        </div>
    )
}