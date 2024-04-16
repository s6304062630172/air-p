import React from 'react'
import Axios from 'axios'
import { useState, useEffect } from 'react';
import "./checkstatus.css";
import { useNavigate } from 'react-router-dom'; 
import { Button } from "@material-tailwind/react";
import { Link } from 'react-router-dom';

export default function Workfinish() {
    const [finishstatusList, setfinishstatusList] = useState([]);
    const navigate = useNavigate(); 
       useEffect(() => {
        // ส่งคำร้องขอไปยัง API เพื่อดึงข้อมูลสถานะงาน
        Axios.get('http://localhost:3001/get/finishstatus').then(response => {
               
        setfinishstatusList(response.data);
            })
            .catch(error => {
                console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสถานะงาน:', error);
            });
    }, []);
    return (
        <div >
        <h3>สำเร็จ</h3>
        <Button color="dark" ripple="light" onClick={() => navigate('/Checkstatus/')} className="mr-2">รอตรวจสอบ</Button>
            <Button color="dark" ripple="light" onClick={() => navigate('/Workstatus/')} className="mr-2" >ดำเนินงาน</Button>
            <Button color="dark" ripple="light" onClick={() => navigate('/Workfinish/')} className="mr-2" >สำเร็จ</Button>

            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>เลขใบสั่งซื้อ</th>
                        <th>username</th>
                        <th>ประเภทงาน</th>
                        <th>สถานะงาน</th>
                        <th>ordering_id</th>
                        <th>ทีม</th>
                    </tr>
                </thead>
                <tbody>
                {finishstatusList.map((item, index) => (
                    <tr key={index}>
                            <td>{item.purchase_id}</td>
                            <td>{item.username}</td>
                            <td>{item.type}</td>
                            <td>{item.work_status}</td>
                            <td>{item.ordering_id}</td>
                            <td>{item.team_number}</td>
                            <Link to={`/Viewfinish/${item.ordering_id}`} className="btn btn-dark">
                            <svg class="h-8 w-8 text-black-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> 
                             <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="12" r="2" />  <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" /> 
                              <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" /></svg>
                            </Link>
                    </tr>
                ))}
            </tbody>
            </table>
</div>
    )
}