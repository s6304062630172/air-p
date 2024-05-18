import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import timeGridPlugin from "@fullcalendar/timegrid"
import axios from 'axios';


export default function Calendar() {
    const navigate = useNavigate();
    const [visible, setvisible] = useState(false)
    const [dataList, setDatalist] = useState([])
    const [dataclick, setDataclick] = useState([])
    const [id, setID] = useState("")
    const showModal = () => {
        setvisible(true);
    };
    const handleOk = () => {
        setvisible(false)
    }
    const handleCancle = () => {

        setvisible(false)
    }
    const getdata = () => {
        axios.get('http://localhost:3001/ordering_calendar')
            .then(res => {
                setDatalist(res.data);

            })
            .catch(err => console.log(err));
    }

    const handleClick = (info) => {
        const id = info.event._def.publicId;
        setID(id);
        axios.get(`http://localhost:3001/userCalendar/${id}`)
            .then(res => {
                setDataclick(res.data); //ได้ข้อมูล user
                console.log(res.data)
                showModal();
            })
            .catch(err => console.log(err));
    }
    const events = dataList.map((val) => {
        // สร้างวัตถุ Date สำหรับวันที่
        let dateString = new Date(val.date_book); // สตริงของวันที่เปลี่ยนเป็นวัตถุ Date
        dateString.setDate(dateString.getDate() + 1); // เปลี่ยนวันโดยการเพิ่มหนึ่งวัน
        let newDateString = dateString.toISOString().split('T')[0]; // แปลงวัตถุ Date เป็นสตริงใหม่
        const startDate = newDateString + " " + val.timestart_book;
        const endDate = newDateString + " " + val.timestop_book;
        return {
            id: val.ordering_id,
            title: val.type,
            start: startDate,
            end: endDate,
        };
    });
    useEffect(() => {
        const email = localStorage.getItem("email");
        if (email != "admin@gmail.com") {
            window.location = '/'
        } else {
        }
        getdata();
    }, []);
    const handleNavigation = () => {
        navigate('/checkstatus');
    };

    return (
        <div class="text-gray-900 bg-gray-200 w-full justify-center">
            <div class="p-4 flex">
                <h1 class="text-3xl">
                    ข้อมูลตารางงาน
                </h1>
            </div>
            <button className="border text-2xl border-white rounded px-3 py-1 ml-4" onClick={handleNavigation}>จัดการงาน</button>
            <button className="border text-2xl border-white rounded px-3 py-1 ml-4">ปฏิทิน</button>
            <div style={{ height: '50vh', width: '50vw', } } >
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    selectable={true}
                    events={events}
                    eventClick={handleClick}
                    eventTimeFormat={{
                        hour: 'numeric',
                        minute: '2-digit',
                        omitZeroMinute: false,
                        hour12: true
                    }}
                />
            </div>
            <Modal show={visible} onHide={handleCancle}>
                {dataclick.map((item, index) => (
                    <React.Fragment key={index}>
                        <Modal.Header closeButton>
                            <Modal.Title>ข้อมูลเพิ่มเติมของงาน</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <div>
                                    <p className="font-bold mt-8">{`ประเภทงาน: ${item.type}`}</p>
                                    <p className="font-bold mt-8">{`ช่วงเวลา: ${item.timestart_book} - ${item.timestop_book} `}</p>
                                    <p className="font-bold mt-8">{`ชื่อ: ${item.name}`}</p>
                                    <p className="font-bold mt-8">{`ที่อยู่: ${item.address}`}</p>
                                    <p className="font-bold mt-8">{`เบอร์โทร: ${item.phone_number}`}</p>
                                    <p className="font-bold mt-8">{`อีเมลล์: ${item.email}`}</p>
                                </div>

                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={handleCancle}>
                                Close
                            </button>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleCancle}>
                                OK
                            </button>
                        </Modal.Footer>
                    </React.Fragment>
                ))}
            </Modal>


        </div>



    )
}


