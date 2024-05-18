import React from 'react'

const UserRoute = ({children}) => {
    const token = localStorage.getItem('token')
  return token 
  ? children
  : window.location='/login'
}
export default UserRoute
////////ใช้ตรวจสอบว่ามี tokenไหม//////////