import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@material-tailwind/react";

export default function Editworkstatus() {
    const { ordering_id } = useParams(); // เปลี่ยนจาก purchase_id เป็น ordering_id
    const [work_status, setWorkStatus] = useState('');
    const [team_number, setTeamNumber] = useState('');
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [type, setType] = useState('');
    const [detail, setDetail] = useState('');
    const [teams, setTeams] = useState([]);
    const navigate = useNavigate();
    const [employee_name, setemployee_name] = useState([]);

    useEffect(() => {
        Axios.get(`http://localhost:3001/Editworkstatus/${ordering_id}`) // แก้ URL เป็นใช้ ordering_id
            .then(res => {
                const data = res.data[0];
                setWorkStatus(data.work_status);
                setTeamNumber(data.team_number);
                setUsername(data.username);
                setAddress(data.address);
                setType(data.type);
                setDetail(data.detail);
                setemployee_name(data.employee_name.split(',').map(name => name.trim()));
            })
            .catch(err => console.log(err));
    
        // Fetch teams from database
        Axios.get('http://localhost:3001/teams')
            .then(res => {
                setTeams(res.data);
            })
            .catch(err => console.log(err));
    
    }, [ordering_id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        Axios.put(`http://localhost:3001/updateworkstatus/${ordering_id}`, { work_status, team_number, detail })
            .then(({ data }) => {
                if (data.updated) {
                    navigate(`/Editworkstatus/${ordering_id}`); // แก้ URL เป็นใช้ ordering_id
                } else {
                    alert('Not updated');
                }
            })
            .catch(error => console.error('Error updating work status:', error));
    };

    const notifyLine = async () => {
        const message = `\nงานที่: ${ordering_id}\nประเภทงาน: ${type}\nสถานะงาน: ${work_status}\nทีม: ${team_number}\nลูกค้า: ${username}\nที่อยู่: ${address}`;
        try {
            await Axios.post(
                'http://localhost:3001/notify',
                { message },
                {
                    headers: {
                        'Content-Type': 'application/json',
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
            <div className="flex justify-between items-center mb-3">
                <h3>ตรวจสอบการดำเนินงาน</h3>
                <Button onClick={() => navigate('/workstatus')} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">Back</Button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <div className="mb-3">
                        <label htmlFor="title-name" className="form-label">เลขใบสั่งซื้อ:</label>
                        <span>{ordering_id}</span> {/* เปลี่ยน purchase_id เป็น ordering_id */}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title-name" className="form-label">ประเภทงาน:</label>
                        <span>{type}</span>
                    </div>
                    <div>
                        <label htmlFor="title-name" className="form-label">สถานะงาน</label>
                        <select onChange={(event) => setWorkStatus(event.target.value)}>
                            <option disabled selected value="">เปลี่ยนสถานะ</option>
                            <option value="ดำเนินงาน">ดำเนินงาน</option>
                            <option value="สำเร็จ">สำเร็จ</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="title-name" className="form-label">ทีม</label>
                        <select onChange={(event) => setTeamNumber(event.target.value)}>
                            <option disabled selected value="">เลือกทีม</option>
                            {teams.map(team => (
                                <option key={team.team_id} value={team.team_number}>{team.team_number}</option>
                            ))}
                        </select>
                    </div>
                    <div>
    <label htmlFor="title-name" className="form-label">แสดงรายชื่อสมาชิกในทีม:</label>
    {employee_name.map((name, index) => (
        <span key={index}>{name} </span>
    ))}
</div>
                    <div className="mb-3">
                        <label htmlFor="title-name" className="form-label">Username:</label>
                        <span>{username}</span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="detail" className="form-label">หมายเหตุ:</label>
                        <input type="text" className="form-control" id="detail" name="detail" value={detail} onChange={(event) => setDetail(event.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title-name" className="form-label">ที่อยู่:</label>
                        <span>{address}</span>
                    </div>
                    <div>
                        <Button type="submit" color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">บันทึก</Button>
                        <Button onClick={notifyLine} color="green" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">แจ้งเตือน Line</Button>
                    </div>
                </div>
            </form>
        </div>
    );
}



