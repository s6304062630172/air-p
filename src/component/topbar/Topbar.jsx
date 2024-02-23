import React from 'react'
import "./Topbar.css"
 
export default function topbar() {
  return (
    <div className='topbar'>
        <div className='topbarWrapper'>
            <div className='topLeft'>
                <span className='logo'>ST AIR</span>
            </div>
            <div className='topRight'>
                <div className='icon'>
                     Login
                </div>
                <img src="https://i.pinimg.com/originals/3a/d2/1d/3ad21dde7be973da77050497e3e448d0.jpg" alt="" className='topAvatar'></img>

                
            </div>
        </div>

    </div>
  )
}