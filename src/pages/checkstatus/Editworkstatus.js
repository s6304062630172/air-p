import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@material-tailwind/react";
import { set } from 'date-fns';

export default function Editworkstatus() {
    const { ordering_id } = useParams(); // เปลี่ยนจาก purchase_id เป็น ordering_id
    const [work_status, setWorkStatus] = useState("");
    const [date_book, setDate_book] = useState("");
    const [detail, setDetail] = useState('');
    const navigate = useNavigate();
    const [dataList, setDatalist] = useState([]);
    const [additionalInput, setAdditionalInput] = useState(false);
    const [additionalInput2, setAdditionalInput2] = useState(false);
    const [timeStart,setTimestart]=useState("");
    const [timeStop,setTimestop]=useState("");

    const LoadData = () => {
        Axios.get(`http://localhost:3001/Editworkstatus/${ordering_id}`) // แก้ URL เป็นใช้ ordering_id
            .then(res => {
                setWorkStatus(res.data[0].work_status);
                setDatalist(res.data);
                setDetail(res.data[0].detail);
                const date = res.data[0].date_book
                let dateString = new Date(date);
                dateString.setDate(dateString.getDate() + 1);
                let newDateString = dateString.toISOString().split('T')[0];
                setDate_book(newDateString);
                setTimestart(res.data[0].timestart_book);
                setTimestop(res.data[0].timestop_book)
             
            })
            .catch(err => console.log(err));

    }
    useEffect(() => {
        LoadData();
    }, [ordering_id]);
    const handleSubmit = (event) => {
        event.preventDefault();
        Axios.put(`http://localhost:3001/updateworkstatus/${ordering_id}`, { work_status, detail ,date_book,timeStart,timeStop})
            .then(({ data }) => {
                if (data.updated) {
                    navigate(`/Editworkstatus/${ordering_id}`); // แก้ URL เป็นใช้ ordering_id
                    alert("อัพเดทข้อมูลเรียบร้อย")
                    LoadData();
                } else {
                    alert('Not updated');
                }
            })
            .catch(error => console.error('Error updating work status:', error));
    };
    const handleAddInput = () => {
        
        setAdditionalInput(true);
    };
    const handleAddInput2 = () => {
        
        setAdditionalInput2(true);
    };

    const handleChange = (event) => {
        let dateString = new Date(event.target.value);
        dateString.setDate(dateString.getDate() + 0);
        let newDateString = dateString.toISOString().split('T')[0];
        setDate_book(newDateString);
     
    };
    const notifyLine = async () => {
        dataList.map((item, index) => {
            let dateString = new Date(item.date_book);
            dateString.setDate(dateString.getDate() + 1);
            let newDateString = dateString.toISOString().split('T')[0];
            const message = `\nงานที่: ${ordering_id}\nวันที่: ${newDateString}\nช่วงเวลา: ${item.timestart_book + "-" + item.timestop_book}\nประเภทงาน: ${item.type}\nสถานะงาน: ${item.work_status}\nทีม: ${item.team_number}\nลูกค้า: ${item.name}\nที่อยู่: ${item.address}\nเบอร์ลูกค้า:${item.phone_number}\nสินค้า:${item.product_name}`;
            try {
                Axios.post(
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
        })

    };
    const onChangeSelectTime = (event) => {
        let selectedTime;
        if (event.target.value === "1") {
          selectedTime = { timeStart: "09:00", timeStop: "12:00" };
            setTimestart("90:00")
            setTimestop("12:00")
        } else if (event.target.value === "2") {
          selectedTime = { timeStart: "13:00", timeStop: "17:00" };
          setTimestart("13:00");
          setTimestop("17:00");
        }
      };

    return (
        <div className='h-screen w-screen bg-gray-100  overflow-auto p-8'>
            <div className="flex justify-between items-center mb-3">
                <h3>ตรวจสอบการดำเนินงาน</h3>
                <Button onClick={() => navigate('/workstatus')} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">Back</Button>
            </div>
            {dataList.map((item, index) => {
                let dateString = new Date(item.date_book);
                dateString.setDate(dateString.getDate() + 1);
                let newDateString = dateString.toISOString().split('T')[0];
                return (
                    <form >

                        <div className="mb-3">
                            <div className="mb-3">
                                <label htmlFor="title-name" className="form-label">เลขใบออเดอร์:</label>
                                <input disabled type="text" className="form-control" id="ordering_id" name="ordering_id" value={ordering_id} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="title-name" className="form-label">ประเภทงาน:</label>
                                <input disabled type="text" className="form-control" id="type" name="type" value={item.type} />

                            </div>
                            <div className="mb-3">
                                <label htmlFor="title-name" className="form-label">สินค้า:</label>
                                <input disabled type="text" className="form-control" id="type" name="type" value={item.product_name} />

                            </div>
                            <div>
                                <label htmlFor="title-name" className="form-label">สถานะงาน</label>
                                <select onChange={(event) => setWorkStatus(event.target.value)} defaultValue={item.work_status}>
                                    <option value="ดำเนินงาน" selected={item.work_status === 'ดำเนินงาน'}>ดำเนินงาน</option>
                                    <option value="สำเร็จ" selected={item.work_status === 'สำเร็จ'}>สำเร็จ</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="title-name" className="form-label">ทีม</label>
                                <input disabled type="text" className="form-control" placeholder={item.team_number} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="title-name" className="form-label">วันที่จอง:</label>
                                <input disabled type="text" className="form-control" id="type" name="type" defaultValue={newDateString} />
                                <Button onClick={handleAddInput}>เปลี่ยนวันนัดหมาย</Button>
                                {additionalInput && (
                                    <div className="mb-3">
                                        <label htmlFor="additional-date" className="form-label">วันที่จองเพิ่มเติม:</label>
                                        <input type="date" className="form-control" id="additional-date" name="additional-date" onChange={handleChange} />
                                    </div>
                                )}

                            </div>
                            <div className="mb-3">
                                <label htmlFor="title-name" className="form-label">ช่วงเวลาที่จอง:</label>
                                <input disabled type="text" className="form-control" id="type" name="type" defaultValue={item.timestart_book + "-" + item.timestop_book} />
                            </div>
                            <Button onClick={handleAddInput2}>เปลี่ยนเวลานัดหมาย</Button>
                                {additionalInput2 && (
                                       <select
                                       required
                                       className="outline outline-1 rounded-lg bg-white w-full px-3 py-2"
                                       name="time"
                                       onChange={(e) => onChangeSelectTime(e)}
                                     >
                                       <option selected>เลือกเวลาที่ต้องการ</option>
                                       <option value="1" >เช้า: 9.00-12.00</option>
                                       <option value="2" >บ่าย: 13.00-17.00</option>
                                     </select>
                                )}

                            <div className="mb-3">
                                <label htmlFor="title-name" className="form-label">Username:</label>


                                <input disabled type="text" className="form-control" id="detail" name="detail" defaultValue={item.username} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="title-name" className="form-label">Name:</label>
                                <input disabled type="text" className="form-control" id="detail" name="detail" defaultValue={item.name} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="title-name" className="form-label">Phone number:</label>
                                <input disabled type="text" className="form-control" id="detail" name="detail" defaultValue={item.phone_number} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="detail" className="form-label">หมายเหตุ: (แก้ไขได้)</label>
                                <input type="text" className="form-control" id="detail" name="detail" defaultValue={detail} onChange={(event) => setDetail(event.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="detail" className="form-label">หมายเหตุ จากลูกค้า:</label>
                                <input disabled type="text" className="form-control" id="detail" name="detail" value={item.detail_user} onChange={(event) => setDetail(event.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="title-name" className="form-label">ที่อยู่:</label>
                                <input disabled type="text" className="form-control" id="address" name="address" value={item.address} onChange={(event) => setDetail(event.target.value)} />

                            </div>
                            <div>
                                <Button type="submit" color="blue" ripple="light" onClick={handleSubmit} rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">บันทึก</Button>
                                <Button onClick={notifyLine} color="green" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">แจ้งเตือน Line</Button>
                            </div>
                        </div>
                    </form>

                )
            })}


        </div>
    );
}