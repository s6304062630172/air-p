import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@material-tailwind/react";

export default function Viewfinish() {

    const { ordering_id } = useParams(); // เปลี่ยน purchase_id เป็น ordering_id
    const [work_status, setWorkStatus] = useState('');
    const [team_number, setTeamNumber] = useState('');
    const [username, setUsername] = useState('');
    const [type, setType] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        Axios.get(`http://localhost:3001/Viewfinish/${ordering_id}`)
            .then(res => {
                const data = res.data[0];
                setWorkStatus(data.work_status);
                setTeamNumber(data.team_number);
                setUsername(data.username);
                setType(data.type);
            })
            .catch(err => console.log(err));
    }, [ordering_id]);

    return (
        <div className="container mt-5">
            <div className="flex justify-between items-center mb-3">
                <h3>รายละเอียดงาน</h3>
                <Button onClick={() => navigate('/workfinish')} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">Back</Button>
            </div>
            <form>
                <div className="mb-3">
                    <div className="mb-3">
                        <label htmlFor="title-name" className="form-label">เลขใบสั่งซื้อ:</label>
                        <span>{ordering_id}</span> {/* เปลี่ยน purchase_id เป็น ordering_id */}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title-name" className="form-label">ประเภทงาน:</label>
                        <span>{type}</span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title-name" className="form-label">สถานะงาน:</label>
                        <span>{work_status}</span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title-name" className="form-label">ทีม:</label>
                        <span>{team_number}</span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title-name" className="form-label">Username:</label>
                        <span>{username}</span>
                    </div>
                </div>
            </form>
        </div>
    );
}
