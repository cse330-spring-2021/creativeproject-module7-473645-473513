import React, { Component } from "react";
import SignIn from './SignIn.js';
import SignUp from './SignUp.js';
import './loginfunctions.css'

export default function Landing() {
    return(
        <div id='landingDiv'>
            <div className='forms'><SignUp /></div>
            
            <br />
            <div className='forms'><SignIn /></div>
            <div className='bottom'>
                <p className='made'>Made with Spotify Web API</p>
            </div>
            
        </div>
    )
}