import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import axios from 'axios';
import { CaptainDataContext } from "../contexts/CaptainContext";

export default function CaptainSignup() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [userData, setUserData] = useState({});
    const [status,setStatus] = useState('');
    const [color,setColor] = useState('');
    const [plate,setPlate] = useState('');
    const [capacity,setCapacity] = useState('');0
    const [vehicleType,setVehicleType] = useState('');
    const [lat,setLat] = useState(null);
    const [long,setLOng] = useState(null);

    const navigate = useNavigate();

    const [user,setUser] = React.useContext(CaptainDataContext);

    const submitHandler = async (e)=>{
      e.preventDefault();
      const newCaptain = {
        email:email,
        password:password,
        fullName:{
            firstName:firstName,
            lastName:lastName
        },
        status: status,
        vehicle:{
            color: color,
            plate: plate,
            capacity: capacity,
            vehicleType: vehicleType
        },
        location:{
            lat: lat,
            long: long
        }

       
      }
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captains/register`, newCaptain);

      if(response.status === 201){
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token',data.token);
        navigate('/captain-home');
      }
    
      setEmail('');
      setPassword('');
      setFirstName('');
      setPassword('');
      setLastName('');
      setStatus('');
      setColor('');
      setPlate('');
      setCapacity('');
      setVehicleType('');
      setLat(null);
      setLOng(null);

    }

    return (
        <div className="p-7 h-screen flex flex-col justify-between">
            <div>
                <form onSubmit={submitHandler}>
                    <h3 className="text-base font-medium">Enter Your Name</h3>
                    <div className="flex gap-4">
                        <input
                            required
                            className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First Name"
                        />
                        <input
                            required
                            className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last Name"
                        />
                    </div>

                    <h3 className="text-base font-medium mt-4">What's your email</h3>
                    <input
                        required
                        className="bg-[#eeeeee] rounded px-4 py-2 border w-full text-base placeholder:text-sm"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Email"
                    />

                    <h3 className="text-base font-medium mt-2">Enter Password</h3>
                    <input
                        required
                        className="bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />

                    <h3 className="text-base font-medium">Vehicle Information</h3>
                    <div className="flex gap-4 mb-4">
                    <input
                        required
                        className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm"                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="Color"
                    />
                    <input
                        required
                        className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm"                        type="text"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value)}
                        placeholder="Plate"
                    />
                    <input
                        required
                        className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm"                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        placeholder="Capacity"
                    />
                    <input
                        required
                        className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm"                        type="text"
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        placeholder="Type"
                    />
                    </div>

                    <button className="bg-[#111] text-white font-semibold mb-5 rounded px-4 py-2 border w-full text-lg">
                        Register
                    </button>
                    <p className="text-center">
                        Already have an account? <Link to="/captain-login" className="text-blue-600">Login here</Link>
                    </p>
                </form>
            </div>
            <div>
                <p className="text-[10px] leading-tight">
                    By proceeding, you consent to get calls, WhatsApp, or SMS messages, including by automated means, from Uber and its affiliates to the number provided.
                </p>
            </div>
        </div>
    );

  }