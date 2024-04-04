import React from 'react'
import Axios from 'axios'
import { useState, useEffect } from 'react';
import "./checkstatus.css";
import { useNavigate } from 'react-router-dom'; 
import { Button } from "@material-tailwind/react";

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
                        <th>สถานะงาน</th>
                    </tr>
                </thead>
                <tbody>
                {finishstatusList.map((item, index) => (
                    <tr key={index}>
                        <td>{item.purchase_id}</td>
                        <td>{item.work_status}</td>
                    </tr>
                ))}
            </tbody>
            </table>
</div>
    )
}