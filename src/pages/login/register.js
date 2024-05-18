import React, { useState } from 'react'
import _apiUser from "../../api/user"; //import api ในการจัดการ user
import axios from 'axios';
import { event } from 'jquery';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
export default function Register() {
  const [uservalues, setUservalues] = useState({
    email: "",
    username: "",
    password: "",
    address: " ",
    name:"",
    phone_number:"",
  })
  const navigate = useNavigate();
  const handleInput = (event) => {
    setUservalues({ ...uservalues, [event.target.name]: [event.target.value] })

  }
  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post("http://localhost:3001/register", uservalues)
      .then(res => {
        if(res.data =="มีชื่อผู้ใช้นี้อยู่แล้ว"){
          alert("Email นี้มีผู้ใช้เเล้ว")
        }else{
          console.log("Register successfully!!");
          alert("สมัครสมาชิกสำเร็จ")
          navigate('/login')

        }
      })
      .catch(err => console.log(err));
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="bg-white p-10 w-96 rounded shadow-md">
        <h1 className="text-2xl font-semibold mb-4  text-center">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Username</label>
            <input type="text" id="username" name="username" onChange={handleInput} className="form-input mt-1 block w-full" required />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Name</label>
            <input type="text" id="name" name="name" onChange={handleInput} className="form-input mt-1 block w-full" required />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Phone Number</label>
            <input type="text" id="phone_number" name="phone_number" onChange={handleInput} className="form-input mt-1 block w-full" required />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input type="email" id="email" name="email" onChange={handleInput} className="form-input mt-1 block w-full" required />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input type="password" id="password" name="password" onChange={handleInput} className="form-input mt-1 block w-full" required />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Register</button>
          <div className="flex justify-end"> {/* เพิ่ม div นี้เพื่อชิดปุ่ม "Register?" ไปทางขวา */}
              <Link to="/login" className="bg-white text-blue px-2 py-0 rounded hover:bg-blue-600">already have account?</Link>
            </div>
        </form>
      </div>
    </div>
  )
}


