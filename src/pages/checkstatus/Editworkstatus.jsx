import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@material-tailwind/react";
export default function Editworkstatus() {
    const { purchase_id } = useParams();
    const [work_status, setWorkStatus] = useState('');
    const [team_number, setTeamNumber] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        Axios.get(`http://localhost:3001/Editworkstatus/${purchase_id}`)
            .then(res => {
                setWorkStatus(res.data[0].work_status);
                setTeamNumber(res.data[0].team_number);
            })
            .catch(err => console.log(err));
    }, [purchase_id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        Axios.put(`http://localhost:3001/updateworkstatus/${purchase_id}`, { work_status, team_number })
            .then(({ data }) => {
                if (data.updated) {
                   // notifyLine(); // แจ้งเตือน LINE หลังจากบันทึกสถานะสำเร็จ
                    navigate('/workstatus');
                } else {
                    alert('Not updated');
                }
            })
            .catch(error => console.error('Error updating work status:', error));
    };

    const notifyLine = async () => {
        const message = `สถานะงาน: ${work_status}\nทีม: ${team_number}\nเลขใบสั่งซื้อ: ${purchase_id}`;
        try {
            await Axios.post(
                'http://localhost:3001/notify', // แก้ URL เป็น '/notify' เพื่อเรียกใช้ไฟล์ Notify.js
                { message },
                {
                    headers: {
                        'Content-Type': 'application/json', // แก้ Content-Type เป็น application/json
                        'Authorization': `Bearer qTTR3oIOBQVR2BLrbjGoiyEE2IjJO5o0wY8fXKq3Wqm`
                    }
                }
            );
            console.log('Notification sent successfully');
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h3>ตรวจสอบการดำเนินงาน</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <div>
                        <label htmlFor="title-name" className="form-label">สถานะงาน</label>
                        <select onChange={(event) => setWorkStatus(event.target.value)}>
                            <option selected value="">เปลี่ยนสถานะ</option>
                            <option value="ดำเนินงาน">ดำเนินงาน</option>
                            <option value="สำเร็จ">สำเร็จ</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="title-name" className="form-label">ทีม</label>
                        <select onChange={(event) => setTeamNumber(event.target.value)}>
                            <option selected value="">เลือกทีม</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title-name" className="form-label">เลขใบสั่งซื้อ:</label>
                        <span>{purchase_id}</span>
                    </div>
                    <div>
        
                    <Button onClick={notifyLine} color="green" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">
                    แจ้งเตือน Line
                    </Button>
                </div>
                </div>
                <Button type="submit" color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">บันทึก</Button>
            </form>
        </div>
    );
}