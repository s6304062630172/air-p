import React from 'react'
import Axios from 'axios'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@material-tailwind/react";
import "./checkstatus.css";
import { useNavigate } from 'react-router-dom'; 

export default function Workstatus() {

    const [workStatusList, setWorkStatusList] = useState([]);
    const navigate = useNavigate(); 
    useEffect(() => {
        Axios.get('http://localhost:3001/get/workstatus')
            .then(response => {
                setWorkStatusList(response.data);
            })
            .catch(error => {
                console.error('Error fetching work status data:', error);
            });
    }, []);
    return (
        <div>
            
            <h3>รายการงาน</h3>
            <Button color="dark" ripple="light" onClick={() => navigate('/Checkstatus/')} className="mr-2">รอตรวจสอบ</Button>
            <Button color="dark" ripple="light" onClick={() => navigate('/Workstatus/')} className="mr-2" >ดำเนินงาน</Button>
            <Button color="dark" ripple="light" onClick={() => navigate('/Workfinish/')} className="mr-2" >สำเร็จ</Button>
            <table className="table table-striped">
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
                    {workStatusList.map((item, index) => (
                        <tr key={index}>
                            <td>{item.purchase_id}</td>
                            <td>{item.username}</td>
                            <td>{item.type}</td>
                            <td>{item.work_status}</td>
                            <td>{item.ordering_id}</td>
                            <td>{item.team_number}</td>
                                      
  <Link to={`/Editworkstatus/${item.ordering_id}`} className="btn btn-dark">
    <svg class="h-6 w-6 text-slate-500" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
      <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
      <line x1="16" y1="5" x2="19" y2="8" />
    </svg>
  </Link>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}