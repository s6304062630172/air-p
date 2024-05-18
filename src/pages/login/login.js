import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import img from "./air.jpg"

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3001/login', values)
      .then(res => {
        if (res.data.message === "Success") {
          console.log(res.data)
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('email', values.email)
          window.location = '/validation'
        } else {
          console.log(res.data)
          alert("Email OR Password incorrect");
        }
      })
      .catch(err => console.log(err));
  }
  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  }
  useEffect(() => {
    localStorage.removeItem('userinfo');

  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="bg-white p-10 w-96 rounded shadow-md space-y-4"> {/* เพิ่มคลาส space-y-4 เพื่อให้มีระยะห่างระหว่าง element */}
        <h1 className="text-2xl font-semibold mb-4 text-center text-blue-500">ห้างหุ้นส่วนจำกัด <br></br>แสงทองแอร์เซอร์วิส</h1>
        <h2 className="text-lg font-semibold mb-4 text-center">Login</h2> {/* ปรับขนาดและข้อความ */}
        <form onSubmit={handleSubmit} className="space-y-4"> {/* เพิ่มคลาส space-y-4 เพื่อให้มีระยะห่างระหว่าง element ใน form */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Email</label>
            <input type="text" id="username" name="email" onChange={handleInput} className="form-input mt-1 block w-full" required />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input type="password" id="password" name="password" onChange={handleInput} className="form-input mt-1 block w-full" required />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">Login</button> {/* ปรับขนาดเพื่อเต็มพื้นที่ */}
        </form>
        <div className="flex justify-end"> {/* เพิ่ม div นี้เพื่อชิดปุ่ม "Register?" ไปทางขวา */}
          <Link to="/register" className="bg-white text-blue px-2 py-0 rounded hover:bg-blue-600">Register?</Link>
        </div>
      </div>
      <img src={img} style={{width:"470px",height:"470px"}}></img>
      
    </div>


  )
}

export default Login
