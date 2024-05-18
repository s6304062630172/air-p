import React from 'react'
import Axios from 'axios'
import { useState, useEffect } from 'react';
import "./checkstatus.css";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from "@material-tailwind/react";
export default function Checkstatus() {
    const [checkstatusList, setcheckstatusList] = useState([]);
    /////////pagination////////
    const [productsPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(checkstatusList.length / productsPerPage); i++) {
        pageNumbers.push(i);
    }
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = checkstatusList.slice(indexOfFirstProduct, indexOfLastProduct);
    //////////////////////////////////////////////////////
    const navigate = useNavigate();
    const getcheckstatus = () => {
        Axios.get('http://localhost:3001/get/checkstatus').then((response) => {
            setcheckstatusList(response.data);
        })
            .catch(error => {
                console.error('Error fetching work status data:', error);
            });

    }
    useEffect(() => {
        getcheckstatus();
    }, []);

    //อัพเดทสถานะของการฟิลเตอร์:
    const [filterStatus, setFilterStatus] = useState("all");
    const handleChangeFilterStatus = (status) => {
        setFilterStatus(status);
    };
    const handleNavigation = () => {
        navigate('/calendar');
    };



    ///////////page///////////////////
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // อัปเดต currentPage เพื่อเปลี่ยนหน้า
    };
    // ฟังก์ชันสำหรับการเปลี่ยนหน้าไปยังหน้าก่อนหน้า
    const handlePreviousPage = () => {
        if (currentPage > 1) { // ตรวจสอบว่าหน้าปัจจุบันไม่ใช่หน้าแรก
            handlePageChange(currentPage - 1); // เรียกใช้ handlePageChange เพื่อเปลี่ยนหน้าไปยังหน้าก่อนหน้า
        }
    };

    // ฟังก์ชันสำหรับการเปลี่ยนหน้าไปยังหน้าถัดไป
    const handleNextPage = () => {
        if (currentPage < pageNumbers.length) { // ตรวจสอบว่าหน้าปัจจุบันไม่ใช่หน้าสุดท้าย
            handlePageChange(currentPage + 1); // เรียกใช้ handlePageChange เพื่อเปลี่ยนหน้าไปยังหน้าถัดไป
        }
    };
    ///////////page///////////////////
    return (
        <div class="text-gray-900 bg-gray-200 w-full">
            <div class="p-4 flex">
                <h1 class="text-3xl">
                    ข้อมูลตารางงาน
                </h1>
            </div>
            <button className="border text-2xl border-white rounded px-3 py-1 ml-4">จัดการงาน</button>
            <button className="border text-2xl border-white rounded px-3 py-1 ml-4" onClick={handleNavigation}>ปฏิทิน</button>

            <div className="ml-4 button-container">
                <Button id="waiting_work" onClick={() => navigate('/Checkstatus/')} className="mr-2">รอตรวจสอบ</Button>
                <Button id="doing" color="dark" ripple="light" onClick={() => navigate('/Workstatus/')} className="mr-2" >ดำเนินงาน</Button>
                <Button id="work_finish" color="dark" ripple="light" onClick={() => navigate('/Workfinish/')} className="mr-2" >สำเร็จ</Button>
                <div>
                    <button onClick={() => handleChangeFilterStatus("all")}>ทั้งหมด</button>
                    <button id="waiting" onClick={() => handleChangeFilterStatus("รอตรวจสอบ")}>รอตรวจสอบ</button>
                    <button id="finish" onClick={() => handleChangeFilterStatus("ชำระสำเร็จ")}>ชำระสำเร็จ</button>
                    <button id="cancle" onClick={() => handleChangeFilterStatus("ชำระไม่สำเร็จ")}>ชำระไม่สำเร็จ</button>

                </div>
            </div>
            <div class="px-3 py-4 flex justify-center">
                <table class="w-full text-md bg-white shadow-md rounded mb-4">
                    <tbody>
                        <tr class="border-b">
                            <th class="text-left p-3 px-5">เลขใบสั่งซื้อ</th>
                            <th class="text-left p-3 px-5">ยูสเซอร์เนม</th>
                            <th class="text-left p-3 px-5">วันที่สั่ง</th>
                            <th class="text-left p-3 px-5">ราคารวม</th>
                            <th class="text-left p-3 px-5">ประเภทงาน</th>
                            <th class="text-left p-3 px-5">สถานะการชำระเงิน</th>
                            <th></th>
                        </tr>
                        {currentProducts.map((val, key) => {
                             let dateString = new Date(val.date);
                             dateString.setDate(dateString.getDate() + 1);
                             let newDateString = dateString.toISOString().split('T')[0];
                            if (filterStatus === "all" || val.payment_status === filterStatus) {
                                return (
                                    
                                    <tr class="border-b hover:bg-orange-100 bg-gray-100">
                                        <td class="p-3 px-5">{val.purchase_id}</td>
                                        <td class="p-3 px-5">{val.username}</td>
                                        <td class="p-3 px-5">{newDateString}</td>
                                        <td class="p-3 px-5">{val.payment_amount}</td>
                                        <td class="p-3 px-5">{val.pay_type}</td>
                                        <td class="p-3 px-5">{val.payment_status}</td>
                                        <td class="p-3 px-5 flex justify-end">
                                            <Link to={`/Editcheckstatus/${val.purchase_id}`} className="btn btn-dark">
                                                <svg class="h-6 w-6 text-slate-500" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" />
                                                    <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                                    <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                                    <line x1="16" y1="5" x2="19" y2="8" />
                                                </svg>
                                            </Link></td>
                                    </tr>

                                )
                            } else {
                                return null;
                            }
                        })}
                    </tbody>
                </table>
            </div>
            <nav aria-label="Pagination" className="inline-flex -space-x-px rounded-md shadow-sm bg-gray-800 text-gray-100">
                <button type="button" className="inline-flex items-center px-2 py-2 text-sm font-semibold border rounded-l-md border-gray-700" onClick={handlePreviousPage}>
                    <span className="sr-only">Previous</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-5 h-5">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                </button>
                {pageNumbers.map((pageNumber, index) => (
                    <button key={index} type="button" className={`inline-flex items-center px-4 py-2 text-sm font-semibold border border-gray-700 ${currentPage === pageNumber ? 'bg-violet-400 text-gray-900' : ''}`} onClick={() => handlePageChange(pageNumber)}>
                        {pageNumber}
                    </button>
                ))}
                <button type="button" className="inline-flex items-center px-2 py-2 text-sm font-semibold border rounded-r-md border-gray-700" onClick={handleNextPage}>
                    <span className="sr-only">Next</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-5 h-5">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                </button>
            </nav>

        </div>
    )
}