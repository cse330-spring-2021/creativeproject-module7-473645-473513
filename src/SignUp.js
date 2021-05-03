import React, { useState } from "react";
import { auth, database, provider } from './Firebase.js';
import './loginfunctions.css'



function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setErrors] = useState("");


    const handleSubmit = e => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email, password).then(res => {
            console.log(res)
            // if (res.user) Auth.setLoggedIn(true);
          })
          .catch(e => {
            setErrors(e.message);
            alert(error);
          });

          console.log(e.target.email.value);
        //   e.target.email.value = "";
        //   e.target.password.value = "";
        setEmail("");
        setPassword("");
      };


    return (
        <div>
        <h3 className='signinup'>Sign Up:</h3>
        <form onSubmit={e => handleSubmit(e)}>
          <div className='formDiv'>
            <input
                className='signInput'
                value={email}
                type='email'
                name='email'
                onChange={e => setEmail(e.target.value)}
                placeholder='email'
            />     
            <input
                className='signInput'
                value={password}
                type='password'
                name='password'
                onChange={e => setPassword(e.target.value)}
                placeholder='password'
            /> 
            </div> <br/>    
            <input className='signButtons' type="submit" value="Submit" />
            {/* <span>{error}</span> */}

        </form>
        </div>

    )

}

// class SignUp extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             email: '',
//             password: ''
//         };

//         this.handleChangeEmail = this.handleChangeEmail.bind(this);
//         this.handleChangePass = this.handleChangePass.bind(this);
//         this.handleSubmit = this.handleSubmit.bind(this);
//     }

//     handleChangeEmail(event) {
//         this.setState({
//             email: event.target.email,
//         });
//     }
//     handleChangePass(event) {
//         this.setState({
//             password: event.target.password,
//         });
//     }

//     handleSubmit(event) {
//         event.preventDefault();
//         console.log('submitted!');
//     }

//     render() {
//         return (
//             <div>
//             <form onSubmit={this.firebaseSignUp}>
//                 <label>
//                     Email:
//                     <input
//                         type='text'
//                         email={this.state.email}
//                         onChange={this.handleChangeEmail}
//                     />     
//                 </label>
//                 <label>
//                     Password:
//                     <input
//                         type='text'
//                         password={this.state.password}
//                         onChange={this.handleChangePass}
//                     />     
//                 </label>
//                 <input type="submit" value="Submit" />

//             </form>
//             </div>

//         )
//     }
// }
export default SignUp;