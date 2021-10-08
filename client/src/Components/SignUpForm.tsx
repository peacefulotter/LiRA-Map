import React from 'react';
import { FC, useState, useEffect } from "react";
import '../css/signUpForm.css';
import { NavLink } from "react-router-dom";

interface State {
    username : string,
    email : string,
    password : string,
  }

function SignUp (){
    
    const [ state, setState ] = useState<State>({
        username : "",
        email : "",
        password :"",
    });
    
    const handleChange = (event : any) => {
        event.preventDefault();
        const { name, value } = event.target;
        setState(prevState => ({
            ...prevState,
            [name]: value,
        }))
        console.log(state) ;
    }
    
    const redirect = () => {
        let fetchCredential = {
            method:'POST',
            body: JSON.stringify(state),
            headers: new Headers()
        }
        
        fetch("/login", fetchCredential)
            .then((res) => res.json())
            .then((data) => {
                // if ( data.status === "ok")
                //     history.push("/rides");
            })
    }

    
        return(
            <div className='signup-wrapper'>
                <h2>Sign Up</h2>
                <div>
                    <div className='signup-input-container'>
                        <label htmlFor="username">Username</label>
                        <input type='text' name='username' onChange={handleChange} />
                    </div>
                    <div className='signup-input-container'>
                        <label htmlFor="email">Email</label>
                        <input type='email' name='email' onChange={handleChange} />
                        
                    </div>
                    <div className='signup-input-container'>
                        <label htmlFor="password">Password</label>
                        <input type='password' name='password' onChange={handleChange}/>
                        
                    </div>
                    <div className='btn signup-btn' onClick={redirect}>Register Me</div>
                </div>
            </div>
        )

             
   
    }


export default SignUp