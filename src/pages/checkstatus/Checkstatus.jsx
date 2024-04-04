import React from 'react'
import Axios from 'axios'
import { useState, useEffect } from 'react';
import "./checkstatus.css";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 
import { Button } from "@material-tailwind/react";
export default function Checkstatus() {

    const [checkstatusList, setcheckstatusList] = useState([]);
    const navigate = useNavigate(); 
    const getcheckstatus = () => {
        Axios.get('http://localhost:3001/get/checkstatus').then((response) => {
            setcheckstatusList(response.data);
        });

    }
    useEffect(() => {
        getcheckstatus();
    }, []);
    
    //อัพเดทสถานะของการฟิลเตอร์:
    const [filterStatus, setFilterStatus] = useState("all");

    const handleChangeFilterStatus = (status) => {
        setFilterStatus(status);
    };
    return (
        <div >
            <h3>รายการงาน</h3>

            <Button color="dark" ripple="light" onClick={() => navigate('/Checkstatus/')} className="mr-2">รอตรวจสอบ</Button>
            <Button color="dark" ripple="light" onClick={() => navigate('/Workstatus/')} className="mr-2" >ดำเนินงาน</Button>
            <Button color="dark" ripple="light" onClick={() => navigate('/Workfinish/')} className="mr-2" >สำเร็จ</Button>

            <div className="button-container">
    <button onClick={() => handleChangeFilterStatus("all")}>ทั้งหมด</button>
    <button onClick={() => handleChangeFilterStatus("รอตรวจสอบ")}>รอตรวจสอบ</button>
    <button onClick={() => handleChangeFilterStatus("ชำระสำเร็จ")}>ชำระสำเร็จ</button>
    <button onClick={() => handleChangeFilterStatus("ชำระไม่สำเร็จ")}>ชำระไม่สำเร็จ</button>
            </div>
                    <table class="table table-striped">
                <thead>
                    <tr>
                        <th>เลขใบสั่งซื้อ</th>
                        <th>email</th>
                        <th>total</th>
                        <th>type</th>
                        <th>สถานะการชำระเงิน</th>
                        <th>สถานะงาน</th>
                    </tr>
                </thead>
                <tbody>
                    {checkstatusList.map((val, key) => { 
                         if (filterStatus === "all" || val.payment_status === filterStatus ) {
                        return (
                            <tr>
                                <td>{val.purchase_id}</td>
                                <td>{val.email}</td>
                                <td>{val.payment_amount}</td>
                                <td>{val.pay_type}</td>
                                <td>{val.payment_status}</td>
                                <td>{val.work_status}</td>

                               

                                <Link to={`/Editcheckstatus/${val.purchase_id}`} className="btn btn-dark">
    <svg class="h-6 w-6 text-slate-500" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
      <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
      <line x1="16" y1="5" x2="19" y2="8" />
    </svg>
  </Link>
                                </tr>
        )
    } else {
        return null;
    }
})}
                </tbody>
            </table>
            </div>
    )
}