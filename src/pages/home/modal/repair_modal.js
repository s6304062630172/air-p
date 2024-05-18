import { useEffect, useState } from "react";
import { Button, Typography, Radio, Input } from "@material-tailwind/react";
import axios from "axios";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import payment from "../../../img/d9dd63e9-7a02-4895-9aad-516e0619a167.jpg"
const Repair_modal = ({
    Repair_statusModal,
    returnCloserepairModal
}) => {
    const email = localStorage.getItem("email");
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [Datemorning, setDatemorning] = useState([])
    const [DateEverning, setDateEverning] = useState([])
    const [ExcludeDates, setExcludeDates] = useState([])
    const handleChange = (date) => {
        const isoDate = `${date.toISOString().split('T')[0]}`;
        setStartDate(isoDate);
        setFormData({ ...formData, needDate: isoDate });
    };
    const [formData, setFormData] = useState({
        needDate: "",
        timeStart: "",
        timeStop: "",
        time: "",
        name: "",
        phone: "",
        address: "",
        type: "",
        detail: "",
        email: email,
        payment_img: "",
        payment_type: "banking",
        banking: "",
    });
    const onSubmit = (e) => {
        console.log(formData);
        axios.post('http://localhost:3001/repair', formData)
            .then(res => {
                console.log(res)
                alert("จองคิวช่างเรียบร้อย รอยืนยัน")
            })
            .catch(err => console.log(err));
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
    const onChangeData = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

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
    useEffect(() => {
        morning();
        everning();
        
    }, [Repair_statusModal]);

    function resizeAndConvertToBase64(event, maxWidth, maxHeight) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                // กำหนดความกว้างและความสูงใหม่ของภาพตาม maxWidth และ maxHeight
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // แปลงภาพใหม่ที่ลดขนาดแล้วเป็น Base64
                const resizedBase64 = canvas.toDataURL('image/jpeg', 0.5); // เปลี่ยน 'image/jpeg' เป็น 'image/png' หากต้องการภาพ PNG

                console.log(resizedBase64);

                // นำข้อมูล Base64 ไปใช้ต่อได้ตามที่ต้องการ
                setFormData({ ...formData, [event.target.name]: resizedBase64 });

            };
            img.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    }
    return (
        <dialog id="repair_modal" className="">
            <div className="justify-center space-x-5 space-y-5 mb-5 px-5 py-10 top-0">
                <form method="dialog">
                    <button
                        className="rounded-full bg-red-900 hover:bg-red-700 text-white font-bold py-2 px-4 absolute right-5 top-7"
                        onClick={returnCloserepairModal}
                    >
                        ✕
                    </button>
                </form>
                <form method="dialog" onSubmit={onSubmit}>
                    <div className="flex flex-col space-y-4">
                        <label className="text-lg font-semibold ">บริการซ่อม</label>

                    </div>
                    <br></br>
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="name" className="text-lg font-semibold">ชื่อ - นามสกุล:</label>
                        <input
                            required
                            onChange={e => onChangeData(e)}
                            type="text"
                            id="name"
                            name="name"
                            className="border rounded-md px-3 py-2"
                            placeholder="Enter your name"
                        />
                    </div>
                    <br></br>
                    <div className="flex flex-col space-y-4">
                        <label className="text-lg font-semibold">เบอร์โทร:</label>
                        <input
                            required
                            onChange={e => onChangeData(e)}
                            id="phone"
                            name="phone"
                            className="border rounded-md px-3 py-2"
                            placeholder="Enter your phone number"
                        />
                    </div>
                    <br></br>
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="address" className="text-lg font-semibold">ที่อยู่:</label>
                        <input
                            required
                            onChange={e => onChangeData(e)}
                            type="text"
                            name="address"
                            className="border rounded-md px-3 py-2"
                            placeholder="Enter your address"
                        />
                    </div>
                    <br></br>
                    <div class="flex flex-col space-y-4">
                        <label for="type" class="text-lg font-semibold">ปัญหาที่เกิดขึ้น:</label>
                        <select
                            required
                            name="type"
                            class="border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                            value={formData.type}
                            onChange={(e) => onChangeData(e)}

                        >
                            <option value="">ประเภท</option>
                            <option value="น้ำแอร์หยด">น้ำแอร์หยด</option>
                            <option value="แอร์ไม่เย็น">แอร์ไม่เย็น</option>
                            <option value="เปิดไม่ติด">เปิดไม่ติด</option>
                            <option value="อื่นๆ">อื่นๆ..</option>
                        </select>
                    </div>
                    <br></br>
                    <br></br>
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="message" className="text-lg font-semibold">รายละเอียดเพิ่มเติม:</label>
                        <textarea required onChange={e => onChangeData(e)} name="detail" rows="4" cols="50" className="border rounded-md px-3 py-2 resize-none"></textarea>
                    </div>
                    <br></br>
                    <div class="flex flex-col space-y-4">
                        <label for="type" class="text-lg font-semibold">เลือกเวลาที่ต้องการ</label>
                        <select name="time" class="border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                            value={formData.time ? formData.time : ""}
                            onChange={(e) => onChangeSelectTime(e)}
                            required>
                            <option selected  >เลือกเวลาที่ต้องการ</option>
                            <option value="1" selected={formData.time === "1"}>เช้า:9.00-12.00</option>
                            <option value="2" selected={formData.time === "2"}>บ่าย:13.00-17.00</option>
                        </select>
                    </div>
                    <br></br>
                    <div className="flex flex-col space-y-4">
                        <label required htmlFor="message" className="text-lg font-semibold">เลือกวันที่ต้องการ</label>
                        <DatePicker
                            name="needDate"
                            selected={startDate}
                            onChange={handleChange}
                            excludeDates={ExcludeDates}
                            selectsDisabledDaysInRange
                            dateFormat={'dd/MM/yyyy'}
                            minDate={new Date()}
                            placeholderText="เลือกวันที่ต้องการ"
                            className=" border rounded-md bg-white w-full px-12 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"

                        />
                    </div>
                    <br></br>
                    <div className="flex gap-10 mb-20 ">
                        <Radio
                            onChange={(e) => onChangeData(e)}
                            //value={formTotal.pay_type}
                            value="banking"
                            name="payment_type" pay_type="red"
                            label="Mobile Banking QR Code"
                            ripple={true}
                            defaultChecked
                            checked={formData.payment_type === "banking"}
                            className={formData.payment_type === "banking" ? "ring ring-blue-500" : ""}
                        />
                        <Radio
                            onChange={(e) => onChangeData(e)}
                            name="payment_type" pay_type="red"
                            label="เงินสด"
                            value="cash"
                            ripple={false}
                            checked={formData.payment_type === "cash"}
                            className={formData.payment_type === "cash" ? "ring ring-blue-500" : ""}
                        />
                    </div>
                    {formData.payment_type === "banking" && (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">โอนเงินได้ทาง QR CODE และส่งหลักฐานการชำระเงิน</h2>
                            <img required src={payment} alt="Payment" className="mx-auto w-64 mb-4" />
                            <input type="file" className="mb-2" name="payment_img" accept="image/*" onChange={(event) => resizeAndConvertToBase64(event, 500, 400)} />

                            <input required type="text" name="banking" placeholder="ชื่อธนาคาร" onChange={(e) => onChangeData(e)} className="mb-4 px-4 py-2 border rounded-md" />
                        </div>

                    )}
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </dialog>


    )

}
export default Repair_modal;