import React from 'react';
import { auth } from './Firebase.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import Landing from './Landing.js';
import Home from './Home.js'
// if not working run ' npm install --save react-firebase-hooks '

require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);

function App() {
  const [user] = useAuthState(auth);
  console.log(user);

  //firebase's useAuthState hook gets the user's info

  //if user is signed in, sends to the home page
  //if not, sends to the sign in page
  return (
    <div className="app">
      <section>
        {user ? <Home user={user} /> : <Landing />}
      </section>
    </div>
  );
}
export default App;