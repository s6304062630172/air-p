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
    const handleNavigation = () => {
        navigate('/calendar');
    };
    return (
        <div class="text-gray-900 bg-gray-200 w-full">
            <div class="p-4 flex">
                <h1 class="text-3xl">
                    ข้อมูลตารางงาน
                </h1>
            </div>
            <button className="border text-2xl border-white rounded px-3 py-1 ml-4">จัดการงาน</button>
            <button className="border text-2xl border-white rounded px-3 py-1 ml-4" onClick={handleNavigation}>ปฏิทิน</button>
            <div className="ml-4 button-container"> 
                <Button color="dark" ripple="light" onClick={() => navigate('/Checkstatus/')} className="mr-2">รอตรวจสอบ</Button>
                <Button color="dark" ripple="light" onClick={() => navigate('/Workstatus/')} className="mr-2" >ดำเนินงาน</Button>
                <Button color="dark" ripple="light" onClick={() => navigate('/Workfinish/')} className="mr-2" >สำเร็จ</Button>
            </div>
            <div class="px-3 py-4 flex justify-center">
                <table class="w-full text-md bg-white shadow-md rounded mb-4">
                    <tbody>
                        <tr class="border-b">
                            <th class="text-left p-3 px-5">เลขใบสั่งซื้อ</th>
                            <th class="text-left p-3 px-5">ยูสเซอร์เนม</th>
                            <th class="text-left p-3 px-5">ประเภทงาน</th>
                            <th class="text-left p-3 px-5">สถานะงาน</th>
                            <th class="text-left p-3 px-5">เลขออเดอร์</th>
                            <th class="text-left p-3 px-5">ทีม</th>
                            <th></th>
                        </tr>
                        {finishstatusList.map((item, index) => (
                            <tr class="border-b hover:bg-orange-100 bg-gray-100"  key={index}>
                                <td class="p-3 px-5">{item.purchase_id}</td>
                                <td class="p-3 px-5">{item.username}</td>
                                <td class="p-3 px-5">{item.type}</td>
                                <td class="p-3 px-5">{item.work_status}</td>
                                <td class="p-3 px-5">{item.ordering_id}</td>
                                <td class="p-3 px-5">{item.team_number}</td>
                                <Link to={`/Viewfinish/${item.ordering_id}`} className="btn btn-dark">
                                    <svg class="h-8 w-8 text-black-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="12" cy="12" r="2" />  <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />
                                        <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" /></svg>
                                </Link>
                            </tr>
                        ))}
                    </tbody>


                </table>


            </div>



        </div>




    )
}