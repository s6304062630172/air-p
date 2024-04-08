import { useEffect, useState } from "react";
import { Button, Typography, Radio, Input } from "@material-tailwind/react";
// import Productdetail from "./product";
import DatePicker from 'react-datepicker';
import axios from "axios";
import { addDays } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
const Modal = ({
  productClick,
  returnCloseModal,
  statusModal,
  returnSubmitData,
}) => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  // const [endDate, setEndDate] = useState(null); // If you want to select a range, initialize endDate as null
  const [Datemorning, setDatemorning] = useState([])
  const [DateEverning, setDateEverning] = useState([])
  const [ExcludeDates,setExcludeDates]= useState([])
  const handleChange = (date) => {
    const isoDate = `${date.toISOString().split('T')[0]}`;
    setStartDate(isoDate);
    setFormData({ ...formData, needDate: isoDate });
  };
  const [formData, setFormData] = useState({
    quantity: 1,
    needDate: "",
    timeStart: "",
    timeStop: "",
    time: ""
  });
  const onSubmit = (e) => {
    if (productClick?.product_quantity) {
      e.preventDefault();
      return returnSubmitData(formData);

    } else {
      window.confirm("!!สินค้าหมด!!")
    }
  };
  const onChangeData = (event) => {
    // กำหนดค่าใหม่ให้กับ formTotal โดยใช้ Spread Operator เพื่อคัดลอกค่าเดิมใน formTotal แล้วเพิ่มหรืออัปเดตค่าใหม่
    setFormData({ ...formData, [event.target.name]: event.target.value }); //เมื่อเปลี่ยนค่า ให้ใส่ค่าใน formTotal name ด้วยใส่ค่า value ลงในตัวแปร name เเล้ว บันทึกค่าใหม่ลง FormTotal 
  };
  const onChangeSelectTime = (event) => {
    let selectedTime;
    if (event.target.value === "1") {
      selectedTime = { timeStart: "09:00", timeStop: "12:00" };
      setExcludeDates(Datemorning)
    } else if (event.target.value === "2") {
      everning();
      setExcludeDates(DateEverning)
      selectedTime = { timeStart: "13:00", timeStop: "17:00" };
    }

    setFormData({ ...formData, ...selectedTime, time: event.target.value }); /// ใส่ value time ใน formTotal เป็นค่าที่ได่รับมา จาก event
  };

  const onChangeQuantity = (status) => {
    if (status === "-") {
      setFormData({
        ...formData,
        quantity: formData?.quantity - 1,
      });
    } else {
      setFormData({
        ...formData,
        quantity: formData?.quantity + 1,
      });
    }
  };

  // const onChangeData = (event) => {
  //   setFormData({ ...formData, [event.target.name]: event.target.value });
  // };
  useEffect(() => {
    setFormData({
      ...productClick,
      quantity: 1,
      needDate: "",
      timeStart: "",
      timeStop: "",
    });
  }, [statusModal]);
  useEffect(() => {
    
    console.log("--->", productClick)
  }, [productClick])
  useEffect(()=>{
    morning();
    everning();
  })
  ////////////////////////////////////เช็ควันที่จองแล้ว///////////////////////////////////
  const morning = () => {
    axios.get('http://localhost:3001/morning')
      .then(res => {
        const datesWithoutTime = res.data.map(item => {
          const date = new Date(item.date_book.split('T')[0]); // สร้างวัตถุ Date จากวันที่
          date.setDate(date.getDate() + 1); // เพิ่ม 1 วันในวันที่
          return date.toISOString().split('T')[0]; // แปลงเป็น ISO date แล้วส่งคืน
        });
        setDatemorning(datesWithoutTime);
      })
      .catch(err => console.log(err));
}
const everning = () => {
  axios.get('http://localhost:3001/everning')
    .then(res => {
      const datesWithAdditionalDay = res.data.map(item => {
        const date = new Date(item.date_book.split('T')[0]); // สร้างวัตถุ Date จากวันที่
        date.setDate(date.getDate() + 1); // เพิ่ม 1 วันในวันที่
        return date.toISOString().split('T')[0]; // แปลงเป็น ISO date และส่งคืน
      });
      setDateEverning(datesWithAdditionalDay);
      
    })
    .catch(err => console.log(err));
}





  return (
    <dialog id="modal" className="">
      <div className="justify-center space-x-5 space-y-5 mb-5 px-5 py-10 top-0">
        <div className="flex flex-row">
          <form method="dialog">
            {/* <button
            className="btn btn-lg  absolute right-2 top-2 bg-red-500 p-2"
            onClick={returnCloseModal}
          > */}
            <button
              className="rounded-full bg-red-900 hover:bg-red-700 text-white font-bold py-2 px-4 absolute right-5 top-7"
              onClick={returnCloseModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">สั่งซื้อสินค้า</h3>
        </div>
        <div className="justify-center">
          <div className="relative justify-center bg-gray-100 rounded-lg overflow-hidden shadow-xl transform transition-all duration-300 h-full">
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-10 py-10 justify-center">
                <img
                  src={productClick?.product_img}
                  className="object-cover w-96 h-full rounded-lg shadow-xl border-1 border-gray-200"
                  alt={productClick?.product_name}
                />
                <div className="bg-gray-100 h-full rounded-lg overflow-hidden border-1 border-gray-200">
                  <Typography variant="h4" className="font-bold px-5">
                    {productClick?.product_name}
                  </Typography>
                  <Typography color="gray" className="px-5">
                    {productClick?.product_detail}
                  </Typography>

                  <div className="flex justify-center items-center px-5">
                    <div className="flex gap-10">
                      <Radio name="type" label="เลือก BTU" />
                      <Radio name="type" label="คำนวณ BTU" defaultChecked />
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 p-2">
                    <Button className="bg-white rounded font-bold text-black text-lg hover:bg-gray-200">
                      {productClick?.product_btu}
                    </Button>
                  </div>

                  <div className="flex justify-center gap-4 p-2">
                    <Button onClick={() => onChangeQuantity("-")}>-</Button>
                    <input
                      className="text-center w-16 sm:w-20 p-2 bg-white text-black text-sm rounded-lg bg-gray-100 border-1 border-gray-800"
                      value={formData.quantity}
                    />
                    <Button onClick={() => onChangeQuantity("+")}>+</Button>
                  </div>

                  <div className="flex justify-center gap-4 p-2">
                    <Typography variant="h4" className="font-bold">
                      ราคา
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {productClick?.product_price?.toLocaleString()}
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      บาท
                    </Typography>
                  </div>
                  <div className="flex flex-wrap justify-center space-x-5 space-y-1 mb-10 px-5">
                    <Typography
                      variant="h6"
                      className="justify-start font-bold px-2 p-2"
                    >
                      เลือกวัน/เวลาที่ต้องการ
                    </Typography>
                    {/* <input
                    required
                    onChange={(e) => onChangeData(e)}
                    type="date"
                    name="needDate"
                    min={(new Date()).toISOString().split('T')[0]}
                    value={formData?.needDate}
                    
                    className="bg-gray-400 rounded-lg px-2 w-fit p-2 text-center text-gray-900"
                  /> */}
                    <DatePicker
                      name="needDate"
                      selected={startDate}
                      onChange={handleChange}
                      excludeDates={ExcludeDates}
                      selectsDisabledDaysInRange
                      dateFormat={'dd/MM/yyyy'}
                      minDate={new Date()}
                      placeholderText="เลือกวันที่ต้องการ"

                    />
                    <div className="w-72">
                      <select
                        required
                        className="outline outline-1 rounded-lg bg-white w-full px-3 py-2"
                        name="time"
                        onChange={(e) => onChangeSelectTime(e)}
                        value={formData.time ? formData.time : ""}
                      > <option selected  >เลือกเวลาที่ต้องการ</option>
                        <option value="1" selected={formData.time === "1"}>เช้า:9.00-12.00</option>
                        <option value="2" selected={formData.time === "2"}>บ่าย:13.00-17.00</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 p-2">
                    <Button
                      type="submit"
                      variant="gradient"
                      color="green"
                      className="flex justify-center gap-3 text-white text-sm"
                    >
                      สั่งซื้อสินค้า
                      <svg
                        className="w-6 h-6 text-gray-100 dark:text-white "
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.3L19 7h-1M8 7h-.7M13 5v4m-2-2h4"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
