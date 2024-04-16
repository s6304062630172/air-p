import React, { useState,useEffect  } from 'react';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@material-tailwind/react";

export default function Changebook() {
    const { ordering_id } = useParams(); // Get the ordering_id from the URL
    const navigate = useNavigate();
    const [newDate, setNewDate] = useState('');
    const [newStartTime, setNewStartTime] = useState('');
    const [newStopTime, setNewStopTime] = useState('');
    const [formData, setFormData] = useState({});
    const [email, setemail] = useState("");
    const handleSubmit = (event) => {
        event.preventDefault();
        Axios.put(`http://localhost:3001/changebook/${ordering_id}`, { date_book: newDate, timestart_book: newStartTime, timestop_book: newStopTime })
            .then(res => {
                if (res.data.updated) {
                    navigate(`/Changebook/${ordering_id}`);
                } else {
                    alert("Not updated");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred. Please try again.");
            });
    }

    useEffect(() => {
        Axios.get(`http://localhost:3001/Editworkstatus/${ordering_id}`) // แก้ URL เป็นใช้ ordering_id
            .then(res => {
                const data = res.data[0];
                setNewDate(data.date_book);
                setNewStartTime(data.timestart_book);
                setNewStopTime(data.timestop_book);
            })
            .catch(err => console.log(err));
    }, []);

    const onChangeSelectTime = (event) => {
        let selectedTime;
        if (event.target.value === "1") {
            selectedTime = { timeStart: "09:00", timeStop: "12:00" };
        } else if (event.target.value === "2") {
            selectedTime = { timeStart: "13:00", timeStop: "17:00" };
        }
        setNewStartTime(selectedTime.timeStart);
        setNewStopTime(selectedTime.timeStop);
        setFormData({ ...formData, ...selectedTime, time: event.target.value });
    };
      //email
      const notifyEmail = async () => {
        const message = `วันที่นัดหมาย: ${new Date(newDate).toLocaleDateString('en-GB')}\nเวลา: ${newStartTime.substring(0, 5)} - ${newStopTime.substring(0, 5)}`;
        try {
            await Axios.post(
                'http://localhost:3001/notifyEmail',
                { email, message },
           
            );
            console.log('Email notification sent successfully');
        } catch (error) {
            console.error('Error sending email notification:', error);
        }
    };
    useEffect(()=>{
        Axios.get(`http://localhost:3001/emailchange/${ordering_id}`)
        .then(res => {
            setemail(res.data[0].email)
     
        })
        .catch(err => console.log(err))
    
    }, [ordering_id]) // ทำการเพิ่ม purchase_id เข้าไปใน dependency array
    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <h3>เปลี่ยนวันนัดหมาย</h3>
                <Button onClick={() => navigate('/workstatus')} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">Back</Button>
            </div>
            <div>
                
                <p>วันนัดหมายเดิม :{new Date(newDate).toLocaleDateString('en-GB')}</p>
                <p>เวลานัดหมายเดิม :{newStartTime.substring(0, 5)} - {newStopTime.substring(0, 5)}</p>
                <p>email :{email}</p>
             
            </div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="newDate" className="form-label">เลือกวันนัดหมายใหม่</label>
                <input type="date" id="newDate" name="newDate" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                <div className="w-72">
                    <select
                        required
                        className="outline outline-1 rounded-lg bg-white w-full px-3 py-2"
                        name="time"
                        onChange={(e) => onChangeSelectTime(e)}
                        value={formData.time ? formData.time : ""}
                    >
                        <option value="0">เลือกเวลานัดหมายใหม่</option>
                        <option value="1" selected={formData.time === "1"}>เช้า: 9.00-12.00</option>
                        <option value="2" selected={formData.time === "2"}>บ่าย: 13.00-17.00</option>
                    </select>
                </div>
                <Button type="submit" color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">บันทึก</Button>
                <Button onClick={notifyEmail} color="red" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">
                    แจ้งเตือน Email
                    </Button>
            </form>
        </div>
    );
}
