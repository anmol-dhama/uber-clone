import React from 'react';
import { Link } from 'react-router-dom';

export default function Start() {

    return (
      <div className='bg-cover bg-center bg-[url(https://as1.ftcdn.net/v2/jpg/03/02/12/44/1000_F_302124414_7tQ7xHBCHYr7IaFeQk7EFcTYUhXiBwJ8.jpg)] h-screen pt-8 flex justify-between flex-col w-full bg-red-400'>
         <img className='w-16 ml-8' src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Uber_logo_2018.png/800px-Uber_logo_2018.png'/>
         <div className='bg-white pb-7 py-4 px-4'>
            <h2 className='text-3xl font-bold'>Get Started with Uber</h2>
            <Link to='/login' className='flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5'>Continue</Link>
         </div>
      </div>
    )
  }