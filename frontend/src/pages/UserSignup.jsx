import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import axios from 'axios';
import {UserDataContext} from "../contexts/UsserContext";

export default function UserSignup() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [userData, setUserData] = useState({});

    const navigate = useNavigate();

    const {user,setUser} = React.useContext(UserDataContext);

    const submitHandler = async (e)=>{
      e.preventDefault();
      const newUser = {
        email:email,
        password:password,
        fullName:{
            firstName:firstName,
            lastName:lastName
        }
       
      };

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/register`, newUser);

      if(response.status === 201){
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token',data.token);
        navigate('/home');
      }

      setEmail('');
      setPassword('');
      setFirstName('');
      setPassword('');
      setLastName('');
    }

    return (
        <div className="p-7 h-screen flex flex-col justify-between">
        <div>
            <form onSubmit={(e)=>submitHandler(e)}>
            
                <h3 className="text-base font-medium">Enter Your Name</h3>
                <div className="flex gap-4">
                <input
                    required
                    className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border w-full text-base placeholder:text-sm"
                    type="text"
                    value={firstName}
                    onChange={(e)=>{
                        setFirstName(e.target.value)
                    }}
                    placeholder="first name" />

                <input
                    required
                    className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border w-full text-base placeholder:text-sm"
                    type="text"
                    value={lastName}
                    onChange={(e)=>{
                        setLastName(e.target.value)
                    }}
                    placeholder="last name" />
                </div>
                <h3 className="text-base font-medium mt-4">What's your email</h3>
                <div className="flex gap-4">
                <input
                    required
                    className="bg-[#eeeeee] rounded px-4 py-2 border w-full text-base placeholder:text-sm"
                    type="email"
                    value={email}
                    onChange={(e)=>{
                        setEmail(e.target.value)
                    }}
                    placeholder="Enter Email" />
                </div>
                
                <h3 className="text-base font-medium mt-2">Enter password</h3>
                <input
                    required
                    className="bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
                    type="password"
                    value={password}
                    onChange={(e)=>{
                        setPassword(e.target.value)
                    }}
                    placeholder="password" />
                <button
                    className="bg-[#111] text-white font-semibold mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
                >Register</button>
                <p className="text-center">Already have a account? <Link to="/login" className="text-blue-600">Login here</Link></p>
            </form>
        </div>
        <div>
            <p className="text-[10px] leading-tight">
              By procedding you consent to get calls, whatsApp or SMS message, including by automated means, from Uber and its affiliates
              to the number provided
              </p>
        </div>
    </div>
    )
  }