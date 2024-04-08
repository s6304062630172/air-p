import React from 'react'
import { Link } from 'react-router-dom';
import './Sidebar_css.css'; // Import ไฟล์ CSS
import { Inventory2Sharp,TimelineSharp,FaceSharp,CalendarMonthSharp,ReceiptSharp } from '@mui/icons-material';

function Sidebar() {
  return (
    <div style={{ background: 'rgb(139, 188, 245)', width: '15vw', height: '100vh' }}>
      <h1 style={{textAlign:'center',margin:'30px', fontWeight:'bold', fontSize:'30px'}}> ST AIR Service</h1>
      <ul style={{margin:'20px',marginTop:'60px'}}> 
       
        <li class="space-y-2 font-medium" id='item' style={{marginBottom:'50px',fontWeight:'bold'}}> <TimelineSharp/>  DASHBOARD</li>
        <li class="space-y-2 font-medium" id='item' style={{marginBottom:'50px',fontWeight:'bold'}}>  <Inventory2Sharp /> <Link to="/product">PRODUCT</Link>  </li>
        <li class="space-y-2 font-medium" id='item' style={{marginBottom:'50px',fontWeight:'bold'}}> <FaceSharp  /> Employee </li>
        <li class="space-y-2 font-medium" id='item' style={{marginBottom:'50px',fontWeight:'bold'}}> <CalendarMonthSharp /> <Link to="/calendar">Shedule </Link>  </li>
        <li class="space-y-2 font-medium" id='item' style={{marginBottom:'50px',fontWeight:'bold'}}><ReceiptSharp/> Quatation</li>
        

      </ul>

      
    </div>
  )
}

export default Sidebar
