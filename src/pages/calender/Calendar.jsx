import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import timeGridPlugin from "@fullcalendar/timegrid"
import "./calendar.css";
import { Col, Row, Modal, Card } from 'antd';
import Axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'





function Calendar() {


  ///////////////ข้อมูล
  const [title, settitle] = useState("");
  const [detail, setdetail] = useState("");
  const [name, setname] = useState("");
  const [date_start, setdate_start] = useState("");
  const [date_end, setdate_end] = useState("");
  const [testtList, settestList] = useState([]);

  //////////////
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState({
    title: '',
    start: '',
    end: ''

  })



  const handleSelect = (info) => {
    console.log(info)
    showModal();


  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    navigate('/Calendar')
    setIsModalOpen(false);
    addtest();




  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };




  /////////////////// ดึงข้อมูล/////////////////
  const gettest = () => {
    Axios.get('http://localhost:3001/test').then((response) => {
      settestList(response.data);
    });

  }
  useEffect(() => {
    gettest();
  }, []);



  const addtest = () => {
    if (title == "" || detail == "" || name == "" || date_start == "" || date_end == "") {

    } else {
      Axios.post("http://localhost:3001/test/create", {
        title: title,
        detail: detail,
        name: name,
        date_start: date_start,
        date_end: date_end
      }).then(() => {

        settestList([
          ...testtList,
          {
            title: title,
            detail: detail,
            name: name,
            date_start: date_start,
            date_end: date_end
          },
        ]);
      });
    }
  };

  /////////////////////////////////////////////////

  const events = testtList.map((val) => ({
    id: val.work_id,
    title: val.title,
    start: val.date_start,
    end: val.date_end
  }));

  const renderEventContent = (eventInfo) => {
    return <b>{eventInfo.event.title}</b>;
    // return<b>{eventInfo.event.startStr}</b>;

  };

  return (
    <div className='Calendar'>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        selectable={true}
        select={handleSelect}
        events={events}
        eventContent={renderEventContent}
      />
      <Modal title="สร้างงาน" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div>
          <label>หัวข้องาน</label><br></br>
          <input onChange={(event) => { settitle(event.target.value) }} />
        </div>

        <div>
          <label>รายละเอียดงาน</label><br></br>
          <input onChange={(event) => { setdetail(event.target.value) }} />
        </div>
        <div>
          <label>ชื่อผู้แจ้งปัญหา</label><br></br>
          <input onChange={(event) => { setname(event.target.value) }} />
        </div>
        <div>
          <label>เวลาที่ต้องการ</label><br></br>
          <input type='datetime-local' onChange={(event) => {
            setdate_start(event.target.value);
            setdate_end(event.target.value);
          }} />
        </div>
      </Modal>
    </div>
  );
}
export default Calendar
