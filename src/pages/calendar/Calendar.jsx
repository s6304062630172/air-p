import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import timeGridPlugin from "@fullcalendar/timegrid"
import axios from 'axios';

function Calendar() {
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
        axios.get('http://localhost:3001/ordering')
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
                showModal(); 
            })
            .catch(err => console.log(err));
    }
    const events = dataList.map((val) => {
        // สร้างวัตถุ Date สำหรับวันที่
        let dateString = new Date(val.date_book); // สตริงของวันที่เปลี่ยนเป็นวัตถุ Date
        dateString.setDate(dateString.getDate() + 1); // เปลี่ยนวันโดยการเพิ่มหนึ่งวัน
        let newDateString = dateString.toISOString().split('T')[0]; // แปลงวัตถุ Date เป็นสตริงใหม่
        const startDate = newDateString+" "+val.timestart_book;
        const endDate = newDateString+" "+val.timestop_book;
        return {
            id: val.ordering_id,
            title: val.type,
            start: startDate,
            end: endDate,
            allDay: true // แก้ไขตรงนี้เป็น allDay: true
        };
    });
    useEffect(() => {
        getdata();
    }, []);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div style={{ width: '1000px', height: '100vh' }}>
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
                />
            </div>
            <Modal show={visible} onHide={handleCancle}>
                {dataclick.map((item, index) => (
                    <React.Fragment key={index}>
                        <Modal.Header closeButton>
                            <Modal.Title>{item.username}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {item.address}
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

export default Calendar
