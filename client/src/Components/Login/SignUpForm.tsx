import React from 'react';
import { FC, useState, useEffect } from "react";
import '../css/signUpForm.css';
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";

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
    
    

    let handleChange = (event : any) => {
        event.preventDefault();
        const { name, value } = event.target;
        setState(prevState => ({
            ...prevState,
            [name]: value,
        }))
        console.log(state) ;
    }
    
    
    let history = useHistory();
      
    

    function Redirect():void{
        const formData = new FormData()
        formData.append('username', state.username)
        formData.append('email', state.email)
        formData.append('password', state.password)
        let fetchCredential = {
            method:'POST',
            body: formData,
            headers: new Headers()
        }
        
            fetch("/login", fetchCredential)
            .then((res) => res.json())
            .then((res) => console.log(res))
            history.push("/rides")
         
    }

    
        return(
            <div className='wrapper'>
                <div className='form-wrapper'>
                    <h2>Sign Up</h2>
                    <div>
                        <div className='username'>
                            <label htmlFor="username">Username</label>
                            <input type='text' name='username' onChange={handleChange} />
                           
                        </div>
                        <div className='email'>
                            <label htmlFor="email">Email</label>
                            <input type='email' name='email' onChange={handleChange} />
                            
                        </div>
                        <div className='password'>
                            <label htmlFor="password">Password</label>
                            <input type='password' name='password' onChange={handleChange}/>
                            
                        </div>
                        <div className='submit'>
                            <button onClick={Redirect}>Register Me</button>
                           
                        </div>
                    </div>
                </div>
            </div>
        )

             
   
    }


export default SignUp