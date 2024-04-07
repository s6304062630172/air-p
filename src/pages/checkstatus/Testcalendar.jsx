import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Testcalendar() {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  }

  const isWeekendDay = (date) => {
    return date.getDay() === 0 || date.getDay() === 6; // 0 is Sunday, 6 is Saturday
  }

  const filterWeekends = (date) => {
    return !isWeekendDay(date);
  }

  return (
    <div>
      <h6 className="text-xl font-bold px-2 py-2">เลือกวันที่</h6>
      <DatePicker 
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        filterDate={filterWeekends}
      />
    </div>
  );
}

export default Testcalendar;