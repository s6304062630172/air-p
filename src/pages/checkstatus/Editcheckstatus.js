import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from "@material-tailwind/react";

export default function Editcheckstatus() {
    const { purchase_id } = useParams();
    const [payment_amount, setpayment_amount] = useState("");
    const [payment_status, setpayment_status] = useState("");
    const [work_status, setwork_status] = useState("รอตรวจสอบ");
    const [date, setdate] = useState("");
    const [email, setemail] = useState("");
    const [pay_type, setpay_type] = useState("");
    const [payment_img, setpayment_img] = useState("");
    const [useraddress, setUseraddress] = useState("");
    const [userPhone, setUserphone] = useState("");
    const [userName, setUsername] = useState("");
    const [orderingList, setOrderinglist] = useState([]);
    const onload = () => {
        ////////////ดึง purchase/////////////
        axios.get(`http://localhost:3001/editcheckstatus/${purchase_id}`)
            .then(res => {
                setpayment_amount(res.data[0].payment_amount)
                setpayment_status(res.data[0].payment_status)
                setdate(res.data[0].date)
                setemail(res.data[0].email)
                setpay_type(res.data[0].pay_type)
                setpayment_img(res.data[0].payment_img)
                setUseraddress(res.data[0].address)
                setUserphone(res.data[0].phone_number)
                setUsername(res.data[0].name);

            })
            .catch(err => console.log(err))

    }

    useEffect(() => {
        onload();


        ////////////ดึงออเดอร์///////////////
        axios.get(`http://localhost:3001/editcheckstatus_order/${purchase_id}`)
            .then(respone => {
                setOrderinglist(respone.data);
                console.log(orderingList);
            })
            .catch(err => console.log(err))
    }, [purchase_id]) // ทำการเพิ่ม purchase_id เข้าไปใน dependency array
    const navigate = useNavigate();

    const hanldeSubmit = (event) => {
        event.preventDefault();
        axios.put(`http://localhost:3001/updatecheckstatus/${purchase_id}`, { payment_status, work_status, payment_img })
            .then(res => {
                if (res.data.updated) {
                    onload();
                    alert("อัพเดทสำเร็จ")

                } else {
                    alert("Not updated")
                }
            })
    }

    //email
    const notifyEmail = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/editcheckstatus/${purchase_id}`);
            const products = response.data;
            const productsHtml = products.map(product => {
                return `
                    <tr>
                        <td>${product.product_name}</td>
                        <td>${product.quantity}</td>
                        <td>${product.price}</td>
                    </tr>
                `;
            }).join('');

            await axios.post(
                'http://localhost:3001/notifyEmail',
                { email, userName, purchase_id, payment_status, products, payment_amount }
            );
            console.log('Email notification sent successfully');
        } catch (error) {
            console.error('Error sending email notification:', error);
        }
    };
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
                    if (width > 1000) {
                        height *= 1000 / width;
                        width = 1000;
                    }
                } else {
                    if (height > 1000) {
                        width *= 1000 / height;
                        height = 1000;
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
                setpayment_img(resizedBase64);

            };
            img.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    }
    const formattedDate = new Date(date).toLocaleDateString('en-GB');
    return (
        <div className='h-screen w-screen bg-gray-100  overflow-auto p-8'>
            <div className="container mt-5">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold">ตรวจสอบการชำระเงิน</h3>
                    <Button onClick={() => navigate('/checkstatus')} color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">Back</Button>
                </div>
                <form onSubmit={hanldeSubmit}>
                    <div className="mb-6">
                        <div className="mb-4">
                            <div class="mb-4 border border-gray-300 rounded-lg p-4">
                                <div class="flex">
                                    <label for="purchase-id" class="block text-sm font-medium text-gray-700 mb-1">เลขใบสั่งซื้อ:</label>
                                    <span class="text-gray-900 ml-5">{purchase_id}</span>
                                </div>
                            </div>
                            <label htmlFor="payment-status" className="block text-sm font-medium text-gray-700 mb-1">สถานะการชำระเงิน</label>
                            <select onChange={(event) => { setpayment_status(event.target.value) }} className="form-select">
                                <option value="รอตรวจสอบ" selected={payment_status === 'รอตรวจสอบ'}>รอตรวจสอบ</option>
                                <option value="ชำระสำเร็จ" selected={payment_status === 'ชำระสำเร็จ'}>ชำระสำเร็จ</option>
                                <option value="ชำระไม่สำเร็จ" selected={payment_status === 'ชำระไม่สำเร็จ'}>ชำระไม่สำเร็จ</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="work-status" className="block text-sm font-medium text-gray-700 mb-1">สถานะงาน</label>
                            <select onChange={(event) => { setwork_status(event.target.value) }} className="form-select">
                                <option value="รอตรวจสอบ" selected={work_status === 'รอตรวจสอบ'}>รอตรวจสอบ</option>
                                <option value="ดำเนินงาน" selected={work_status === 'ดำเนินงาน'}>ดำเนินงาน</option>
                            </select>
                        </div>
                        <div class="mb-4 border border-gray-300 rounded-lg p-4">
                            <div class="flex">
                                <label for="payment-type" class="block text-sm font-medium text-gray-700 mb-1">ประเภทการชำระเงิน:</label>
                                <span class="text-gray-900 ml-5">{pay_type}</span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="payment-proof" className="block text-sm font-medium text-gray-700 mb-1">หลักฐานการชำระเงิน:</label>
                            <img
                                src={payment_img}
                                alt="ไม่มีหลักฐานการจ่ายเงินส่งมา หรือ ชำระแบบเงินสด"
                                className="w-48 h-48"
                            />
                            <input className='border rounded-md bg-white w-full px-12 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200' type="file" id="myFile" accept='img/*' name="filename" onChange={resizeAndConvertToBase64}></input>

                        </div>
                        <div className="flex ">
                            <Button type="submit" color="blue" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">บันทึก</Button>
                            <Button onClick={notifyEmail} color="red" ripple="light" rounded={true} size="sm" className="text-xs uppercase font-medium px-6 py-2.5">แจ้งเตือน Email</Button>
                        </div>
                        <br></br>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">ข้อมูลเพิ่มเติม</h2>
                        <div class="space-y-4">

                            <div class="mb-4 border border-gray-300 rounded-lg p-4">
                                <div class="flex">
                                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">อีเมล์:</label>
                                    <span class="text-gray-900 ml-5">{email}</span>
                                </div>
                            </div>
                            <div class="mb-4 border border-gray-300 rounded-lg p-4">
                                <div class="flex">
                                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">เบอร์ติดต่อ:</label>
                                    <span class="text-gray-900 ml-5">{userPhone}</span>
                                </div>
                            </div>
                            <div class="mb-4 border border-gray-300 rounded-lg p-4">
                                <div class="flex">
                                    <label for="payment-amount" class="block text-sm font-medium text-gray-700 mb-1">ยอดเงินที่ต้องชำระ:</label>
                                    <span class="text-gray-900 ml-5">{payment_amount}</span>
                                </div>
                            </div>
                            <div class="mb-4 border border-gray-300 rounded-lg p-4">
                                <div class="flex">
                                    <label for="payment-date" class="block text-sm font-medium text-gray-700 mb-1">วันที่ชำระเงิน:</label>
                                    <span class="text-gray-900 ml-5">{formattedDate}</span>
                                </div>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">ออเดอร์ทั้งหมด</h2>
                            {orderingList.map((val, index) => {
                                return (
                                    <div class="mb-4 border border-gray-300 rounded-lg p-4">
                                        <div class="flex">
                                            <label for="payment-date" class="block text-sm font-medium text-gray-700 mb-1">ออเดอร์ที่{index + 1}:</label>
                                            <span class="text-gray-900 ml-2">{val.ordering_id}</span> <span class="text-gray-900 ml-5">ชื่อสินค้า : {val.product_name}</span>  <span class="text-gray-900 ml-5">ราคา : {val.price}</span>
                                        </div>
                                    </div>

                                )
                            })}

                        </div>
                    </div>

                </form>
            </div>
        </div>

    )
}